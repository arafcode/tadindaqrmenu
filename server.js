require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');
const https = require('https');
const multer = require('multer');

// ==================== FILE UPLOAD ====================
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Sadece resim dosyaları yüklenebilir (jpg, png, gif, webp, svg)'));
  }
});

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

if (!JWT_SECRET) {
  console.error('❌ JWT_SECRET environment variable gerekli! .env dosyasını kontrol edin.');
  process.exit(1);
}

// ==================== MIDDLEWARE ====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// JWT doğrulama middleware
async function auth(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Giriş yapmanız gerekiyor' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Pasif kullanıcıları engelle
    const currentUser = await db.findUserByEmail(decoded.email);
    if (currentUser && currentUser.is_active === 0) {
      res.clearCookie('token');
      return res.status(403).json({ error: 'Hesabınız askıya alınmıştır. Destek ile iletişime geçin.' });
    }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Oturum süresi dolmuş, tekrar giriş yapın' });
  }
}

// Restoran sahipliği kontrol middleware
async function ownsRestaurant(req, res, next) {
  const restaurantId = req.params.restaurantId || req.body.restaurant_id;
  if (!restaurantId) return res.status(400).json({ error: 'Restoran ID gerekli' });

  const restaurant = await db.getRestaurantById(restaurantId);
  if (!restaurant) return res.status(404).json({ error: 'Restoran bulunamadı' });
  if (restaurant.user_id !== req.user.id) return res.status(403).json({ error: 'Bu restorana erişim yetkiniz yok' });

  req.restaurant = restaurant;
  next();
}

// Süper admin kontrol middleware
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
  console.warn('⚠️  SUPER_ADMIN_EMAIL ve SUPER_ADMIN_PASSWORD .env dosyasında ayarlanmalı!');
}

function superAdminAuth(req, res, next) {
  const token = req.cookies.super_token || req.headers['x-super-token'];
  if (!token) return res.status(401).json({ error: 'Süper admin girişi gerekli' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.is_super_admin) return res.status(403).json({ error: 'Yetkiniz yok' });
    req.superAdmin = decoded;
    next();
  } catch { return res.status(401).json({ error: 'Oturum süresi dolmuş' }); }
}

// ==================== AUTH ROUTES ====================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, business_name, phone } = req.body;

    if (!email || !password || !business_name) {
      return res.status(400).json({ error: 'Email, şifre ve işletme adı zorunludur' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır' });
    }

    const existing = await db.findUserByEmail(email);
    if (existing) return res.status(400).json({ error: 'Bu email zaten kayıtlı' });

    const user = await db.createUser(email, password, business_name, phone);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user, token });
  } catch (e) {
    console.error('Register error:', e);
    res.status(500).json({ error: 'Kayıt sırasında hata oluştu' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email ve şifre gerekli' });

    const user = await db.findUserByEmail(email);
    if (!user) return res.status(400).json({ error: 'Email veya şifre hatalı' });

    // Pasif kullanıcıların girişini engelle
    if (user.is_active === 0) return res.status(403).json({ error: 'Hesabınız askıya alınmıştır. Destek ile iletişime geçin.' });

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Email veya şifre hatalı' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, user: { id: user.id, email: user.email, business_name: user.business_name }, token });
  } catch (e) {
    console.error('Login error:', e);
    res.status(500).json({ error: 'Giriş sırasında hata oluştu' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
});

app.get('/api/auth/me', auth, async (req, res) => {
  const user = await db.findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json({ user });
});

// ==================== RESTORAN ROUTES ====================

app.get('/api/restaurants', auth, async (req, res) => {
  const restaurants = await db.getRestaurantsByUser(req.user.id);
  res.json({ restaurants });
});

app.post('/api/restaurants', auth, async (req, res) => {
  try {
    const existing = await db.getRestaurantsByUser(req.user.id);
    const user = await db.findUserById(req.user.id);
    const maxRestaurants = user.plan === 'pro' ? 10 : 1;

    if (existing.length >= maxRestaurants) {
      return res.status(400).json({ error: `${user.plan === 'free' ? 'Ücretsiz planda' : 'Mevcut planınızda'} maksimum ${maxRestaurants} restoran oluşturabilirsiniz. Pro plana geçin!` });
    }

    const restaurant = await db.createRestaurant(req.user.id, req.body);
    res.json({ success: true, restaurant });
  } catch (e) {
    console.error('Create restaurant error:', e);
    res.status(500).json({ error: 'Restoran oluşturulurken hata oluştu' });
  }
});

app.get('/api/restaurants/:restaurantId', auth, ownsRestaurant, (req, res) => {
  res.json({ restaurant: req.restaurant });
});

app.put('/api/restaurants/:restaurantId', auth, ownsRestaurant, async (req, res) => {
  try {
    await db.updateRestaurant(req.params.restaurantId, req.body);
    const updated = await db.getRestaurantById(req.params.restaurantId);
    res.json({ success: true, restaurant: updated });
  } catch (e) {
    res.status(500).json({ error: 'Güncelleme sırasında hata oluştu' });
  }
});

// Restoran logo/avatar yükleme
app.post('/api/restaurants/:restaurantId/upload-logo', auth, ownsRestaurant, (req, res) => {
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Dosya boyutu en fazla 5MB olabilir' });
      }
      return res.status(400).json({ error: err.message || 'Yükleme hatası' });
    }
    if (!req.file) return res.status(400).json({ error: 'Dosya seçilmedi' });

    try {
      // Eski logoyu sil
      const oldRest = await db.getRestaurantById(req.params.restaurantId);
      if (oldRest && oldRest.logo_url) {
        const oldPath = path.join(__dirname, 'public', oldRest.logo_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const logoUrl = `/uploads/${req.file.filename}`;
      await db.updateRestaurant(req.params.restaurantId, { logo_url: logoUrl });
      const updated = await db.getRestaurantById(req.params.restaurantId);
      res.json({ success: true, logo_url: logoUrl, restaurant: updated });
    } catch (e) {
      console.error('Logo upload error:', e);
      res.status(500).json({ error: 'Logo yüklenirken hata oluştu' });
    }
  });
});

// Restoran logosunu kaldır
app.delete('/api/restaurants/:restaurantId/logo', auth, ownsRestaurant, async (req, res) => {
  try {
    const restaurant = await db.getRestaurantById(req.params.restaurantId);
    if (restaurant && restaurant.logo_url) {
      const oldPath = path.join(__dirname, 'public', restaurant.logo_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await db.updateRestaurant(req.params.restaurantId, { logo_url: '' });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Logo silinirken hata oluştu' });
  }
});

app.delete('/api/restaurants/:restaurantId', auth, ownsRestaurant, async (req, res) => {
  await db.deleteRestaurant(req.params.restaurantId);
  res.json({ success: true });
});

// QR Kod oluşturma
app.get('/api/restaurants/:restaurantId/qr', auth, ownsRestaurant, async (req, res) => {
  try {
    const menuUrl = `${BASE_URL}/m/${req.restaurant.slug}`;
    const qrDataUrl = await QRCode.toDataURL(menuUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: req.restaurant.primary_color || '#000000',
        light: '#ffffff'
      }
    });
    res.json({ qr: qrDataUrl, url: menuUrl });
  } catch (e) {
    res.status(500).json({ error: 'QR kod oluşturulamadı' });
  }
});

// Analitik
app.get('/api/restaurants/:restaurantId/analytics', auth, ownsRestaurant, async (req, res) => {
  const summary = await db.getAnalyticsSummary(req.params.restaurantId);
  const details = await db.getAnalytics(req.params.restaurantId, 30);
  res.json({ summary, details });
});

// ==================== KATEGORİ ROUTES ====================

app.get('/api/restaurants/:restaurantId/categories', auth, ownsRestaurant, async (req, res) => {
  const categories = await db.getCategoriesByRestaurant(req.params.restaurantId);
  res.json({ categories });
});

app.post('/api/restaurants/:restaurantId/categories', auth, ownsRestaurant, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Kategori adı gerekli' });
    const category = await db.createCategory(req.params.restaurantId, name, description);
    res.json({ success: true, category });
  } catch (e) {
    res.status(500).json({ error: 'Kategori oluşturulurken hata oluştu' });
  }
});

app.put('/api/categories/:id', auth, async (req, res) => {
  try {
    await db.updateCategory(req.params.id, req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Güncelleme sırasında hata oluştu' });
  }
});

app.delete('/api/categories/:id', auth, async (req, res) => {
  try {
    await db.deleteCategory(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Silme sırasında hata oluştu' });
  }
});

// ==================== MENÜ ÖĞESİ ROUTES ====================

app.get('/api/restaurants/:restaurantId/items', auth, ownsRestaurant, async (req, res) => {
  const items = await db.getMenuItemsByRestaurant(req.params.restaurantId);
  res.json({ items });
});

app.post('/api/restaurants/:restaurantId/items', auth, ownsRestaurant, async (req, res) => {
  try {
    const { category_id, name, price } = req.body;
    if (!category_id || !name || price === undefined) {
      return res.status(400).json({ error: 'Kategori, isim ve fiyat zorunludur' });
    }
    const item = await db.createMenuItem(category_id, req.params.restaurantId, req.body);
    res.json({ success: true, item });
  } catch (e) {
    console.error('Create item error:', e);
    res.status(500).json({ error: 'Ürün oluşturulurken hata oluştu' });
  }
});

app.put('/api/items/:id', auth, async (req, res) => {
  try {
    await db.updateMenuItem(req.params.id, req.body);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Güncelleme sırasında hata oluştu' });
  }
});

app.delete('/api/items/:id', auth, async (req, res) => {
  try {
    await db.deleteMenuItem(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Silme sırasında hata oluştu' });
  }
});

// ==================== HERKESE AÇIK MENÜ ROUTES ====================

app.get('/m/:slug', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

// Demo QR kod görseli
app.get('/api/public/demo-qr', async (req, res) => {
  try {
    const menuUrl = `${BASE_URL}/m/demo`;
    const qrBuffer = await QRCode.toBuffer(menuUrl, {
      width: 256,
      margin: 1,
      color: { dark: '#1f2937', light: '#f3f4f6' }
    });
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(qrBuffer);
  } catch (e) {
    res.status(500).json({ error: 'QR oluşturulamadı' });
  }
});

// Demo menü API (herkese açık, sabit veri)
app.get('/api/public/menu/demo', (req, res) => {
  const lang = req.query.lang || 'tr';

  if (lang === 'en') {
    return res.json({
      restaurant: {
        name: 'Flavor Stop',
        description: 'Traditional flavors prepared with the freshest ingredients',
        address: 'Bagdat Avenue No:42, Kadikoy/Istanbul',
        phone: '0216 555 1234',
        primary_color: '#e63946',
        secondary_color: '#1d3557',
        bg_color: '#f1faee',
        currency: '₺',
        logo_url: '',
        cover_url: ''
      },
      menu: [
        { id: 'cat1', name: '🍖 Main Courses', description: 'Carefully prepared main dishes', items: [
          { id: 'i1', name: 'Grilled Meatballs', description: 'Handmade beef meatballs with rice and grilled vegetables', price: 185, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' },
          { id: 'i2', name: 'Chicken Skewers', description: 'Marinated chicken breast with special spices', price: 165, image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400' },
          { id: 'i3', name: 'Lamb Chops', description: 'Oven-roasted lamb chops with mashed potatoes', price: 295, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
          { id: 'i4', name: 'Mixed Grill', description: 'Meatball, chicken, lamb and Adana kebab platter', price: 345, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }
        ]},
        { id: 'cat2', name: '🥗 Salads', description: 'Fresh and healthy salads', items: [
          { id: 'i5', name: 'Caesar Salad', description: 'Romaine, parmesan, croutons and caesar dressing', price: 95, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
          { id: 'i6', name: 'Shepherd Salad', description: 'Tomato, cucumber, pepper, onion and olive oil', price: 65, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
          { id: 'i7', name: 'Mediterranean Salad', description: 'Arugula, pomegranate, walnut, goat cheese', price: 110, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' }
        ]},
        { id: 'cat3', name: '🍕 Pizzas', description: 'Stone-oven baked Italian pizzas', items: [
          { id: 'i8', name: 'Margherita', description: 'Tomato sauce, mozzarella, basil', price: 135, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
          { id: 'i9', name: 'Mixed Pizza', description: 'Pepperoni, sausage, mushroom, pepper, olive, corn', price: 165, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
          { id: 'i10', name: 'Pepperoni', description: 'Loaded pepperoni and mozzarella cheese', price: 155, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' }
        ]},
        { id: 'cat4', name: '🍰 Desserts', description: 'Homemade desserts', items: [
          { id: 'i11', name: 'Kunefe', description: 'Traditional kunefe with pistachios', price: 95, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1576020799589-36c7110597bc?w=400' },
          { id: 'i12', name: 'Rice Pudding', description: 'Oven-baked Turkish rice pudding', price: 65, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
          { id: 'i13', name: 'Cheesecake', description: 'New York style with raspberry sauce', price: 85, image_url: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400' }
        ]},
        { id: 'cat5', name: '🥤 Beverages', description: 'Cold and hot beverages', items: [
          { id: 'i14', name: 'Turkish Tea', description: 'Traditional brewed tea', price: 20, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400' },
          { id: 'i15', name: 'Turkish Coffee', description: 'Traditional Turkish coffee', price: 45, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400' },
          { id: 'i16', name: 'Lemonade', description: 'Freshly squeezed homemade lemonade', price: 45, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
          { id: 'i17', name: 'Ayran', description: 'Homemade yogurt drink', price: 25, image_url: 'https://images.unsplash.com/photo-1584685889193-7445de10f38c?w=400' }
        ]}
      ]
    });
  }

  res.json({
    restaurant: {
      name: 'Lezzet Durağı',
      description: 'En taze malzemeler ile hazırlanan geleneksel lezzetler',
      address: 'Bağdat Caddesi No:42, Kadıköy/İstanbul',
      phone: '0216 555 1234',
      primary_color: '#e63946',
      secondary_color: '#1d3557',
      bg_color: '#f1faee',
      currency: '₺',
      logo_url: '',
      cover_url: ''
    },
    menu: [
      { id: 'cat1', name: '🍖 Ana Yemekler', description: 'Özenle hazırlanan ana yemeklerimiz', items: [
        { id: 'i1', name: 'Izgara Köfte', description: 'El yapımı dana köfte, pilav ve közlenmiş sebze ile', price: 185, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' },
        { id: 'i2', name: 'Tavuk Şiş', description: 'Marine edilmiş tavuk göğsü, özel baharatlar ile', price: 165, image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400' },
        { id: 'i3', name: 'Kuzu Pirzola', description: 'Fırında pişmiş kuzu pirzola, patates püresi ile', price: 295, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' },
        { id: 'i4', name: 'Karışık Izgara', description: 'Köfte, tavuk, kuzu ve Adana kebabı tabağı', price: 345, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' }
      ]},
      { id: 'cat2', name: '🥗 Salatalar', description: 'Taze ve sağlıklı salatalar', items: [
        { id: 'i5', name: 'Sezar Salata', description: 'Marul, parmesan, kruton ve sezar sos', price: 95, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
        { id: 'i6', name: 'Çoban Salata', description: 'Domates, salatalık, biber, soğan ve zeytinyağı', price: 65, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' },
        { id: 'i7', name: 'Akdeniz Salata', description: 'Roka, nar, ceviz, keçi peyniri', price: 110, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' }
      ]},
      { id: 'cat3', name: '🍕 Pizzalar', description: 'Taş fırında pişen İtalyan pizzaları', items: [
        { id: 'i8', name: 'Margherita', description: 'Domates sos, mozzarella, fesleğen', price: 135, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' },
        { id: 'i9', name: 'Karışık Pizza', description: 'Sucuk, sosis, mantar, biber, zeytin, mısır', price: 165, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
        { id: 'i10', name: 'Pepperoni', description: 'Bol pepperoni ve mozzarella peynir', price: 155, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' }
      ]},
      { id: 'cat4', name: '🍰 Tatlılar', description: 'El yapımı tatlılarımız', items: [
        { id: 'i11', name: 'Künefe', description: 'Antep fıstığı ile geleneksel künefe', price: 95, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1576020799589-36c7110597bc?w=400' },
        { id: 'i12', name: 'Sütlaç', description: 'Fırında pişmiş Türk sütlacı', price: 65, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
        { id: 'i13', name: 'Cheesecake', description: 'New York usulü frambuaz soslu', price: 85, image_url: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400' }
      ]},
      { id: 'cat5', name: '🥤 İçecekler', description: 'Soğuk ve sıcak içecekler', items: [
        { id: 'i14', name: 'Türk Çayı', description: 'Geleneksel demlik çay', price: 20, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400' },
        { id: 'i15', name: 'Türk Kahvesi', description: 'Geleneksel Türk kahvesi', price: 45, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400' },
        { id: 'i16', name: 'Limonata', description: 'Taze sıkılmış ev yapımı limonata', price: 45, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' },
        { id: 'i17', name: 'Ayran', description: 'Ev yapımı yoğurttan ayran', price: 25, image_url: 'https://images.unsplash.com/photo-1584685889193-7445de10f38c?w=400' }
      ]}
    ]
  });
});

// Menü API (herkese açık)
app.get('/api/public/menu/:slug', async (req, res) => {
  try {
    const restaurant = await db.getRestaurantBySlug(req.params.slug);
    if (!restaurant) return res.status(404).json({ error: 'Menü bulunamadı' });

    // Görüntülenme sayısını artır
    await db.incrementViewCount(restaurant.id);
    await db.logAnalytics(restaurant.id, 'view', null, req.ip, req.get('user-agent'));

    const fullMenu = await db.getFullMenu(restaurant.id);
    res.json(fullMenu);
  } catch (e) {
    console.error('Public menu error:', e);
    res.status(500).json({ error: 'Menü yüklenirken hata oluştu' });
  }
});

// ==================== DEMO VERİ ====================

app.post('/api/demo/setup', auth, async (req, res) => {
  try {
    const restaurant = await db.createRestaurant(req.user.id, {
      name: 'Lezzet Durağı',
      description: 'En taze malzemeler ile hazırlanan geleneksel lezzetler',
      address: 'Bağdat Caddesi No:42, Kadıköy/İstanbul',
      phone: '0216 555 1234',
      primary_color: '#e63946',
      secondary_color: '#1d3557',
      bg_color: '#f1faee',
      currency: '₺'
    });

    // Kategoriler
    const cat1 = await db.createCategory(restaurant.id, '🍖 Ana Yemekler', 'Özenle hazırlanan ana yemeklerimiz');
    const cat2 = await db.createCategory(restaurant.id, '🥗 Salatalar', 'Taze ve sağlıklı salatalar');
    const cat3 = await db.createCategory(restaurant.id, '🍕 Pizzalar', 'Taş fırında pişen İtalyan pizzaları');
    const cat4 = await db.createCategory(restaurant.id, '🍰 Tatlılar', 'El yapımı tatlılarımız');
    const cat5 = await db.createCategory(restaurant.id, '🥤 İçecekler', 'Soğuk ve sıcak içecekler');

    // Ana Yemekler
    await db.createMenuItem(cat1.id, restaurant.id, { name: 'Izgara Köfte', description: 'El yapımı dana köfte, pilav ve közlenmiş sebze ile', price: 185, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400' });
    await db.createMenuItem(cat1.id, restaurant.id, { name: 'Tavuk Şiş', description: 'Marine edilmiş tavuk göğsü, özel baharatlar ile', price: 165, image_url: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400' });
    await db.createMenuItem(cat1.id, restaurant.id, { name: 'Kuzu Pirzola', description: 'Fırında pişmiş kuzu pirzola, patates püresi ile', price: 295, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' });
    await db.createMenuItem(cat1.id, restaurant.id, { name: 'Karışık Izgara', description: 'Köfte, tavuk, kuzu ve Adana kebabı tabağı', price: 345, image_url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' });

    // Salatalar
    await db.createMenuItem(cat2.id, restaurant.id, { name: 'Sezar Salata', description: 'Marul, parmesan, kruton ve sezar sos', price: 95, image_url: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' });
    await db.createMenuItem(cat2.id, restaurant.id, { name: 'Çoban Salata', description: 'Domates, salatalık, biber, soğan ve zeytinyağı', price: 65, image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400' });
    await db.createMenuItem(cat2.id, restaurant.id, { name: 'Akdeniz Salata', description: 'Roka, nar, ceviz, keçi peyniri', price: 110, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' });

    // Pizzalar
    await db.createMenuItem(cat3.id, restaurant.id, { name: 'Margherita', description: 'Domates sos, mozzarella, fesleğen', price: 135, image_url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400' });
    await db.createMenuItem(cat3.id, restaurant.id, { name: 'Karışık Pizza', description: 'Sucuk, sosis, mantar, biber, zeytin, mısır', price: 165, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' });
    await db.createMenuItem(cat3.id, restaurant.id, { name: 'Pepperoni', description: 'Bol pepperoni ve mozzarella peynir', price: 155, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' });

    // Tatlılar
    await db.createMenuItem(cat4.id, restaurant.id, { name: 'Künefe', description: 'Antep fıstığı ile geleneksel künefe', price: 95, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1576020799589-36c7110597bc?w=400' });
    await db.createMenuItem(cat4.id, restaurant.id, { name: 'Sütlaç', description: 'Fırında pişmiş Türk sütlacı', price: 65, image_url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' });
    await db.createMenuItem(cat4.id, restaurant.id, { name: 'Cheesecake', description: 'New York usulü frambuaz soslu', price: 85, image_url: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400' });

    // İçecekler
    await db.createMenuItem(cat5.id, restaurant.id, { name: 'Türk Çayı', description: 'Geleneksel demlik çay', price: 20, image_url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400' });
    await db.createMenuItem(cat5.id, restaurant.id, { name: 'Türk Kahvesi', description: 'Geleneksel Türk kahvesi', price: 45, image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400' });
    await db.createMenuItem(cat5.id, restaurant.id, { name: 'Limonata', description: 'Taze sıkılmış ev yapımı limonata', price: 45, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400' });
    await db.createMenuItem(cat5.id, restaurant.id, { name: 'Ayran', description: 'Ev yapımı yoğurttan ayran', price: 25, image_url: 'https://images.unsplash.com/photo-1584685889193-7445de10f38c?w=400' });

    res.json({ success: true, restaurant, message: 'Demo restoran ve menü oluşturuldu!' });
  } catch (e) {
    console.error('Demo setup error:', e);
    res.status(500).json({ error: 'Demo kurulumu sırasında hata oluştu' });
  }
});

// ==================== SÜPER ADMİN ROUTES ====================

app.post('/api/super-admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD) {
    const token = jwt.sign({ is_super_admin: true, email }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('super_token', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Geçersiz süper admin bilgileri' });
});

app.post('/api/super-admin/logout', (req, res) => {
  res.clearCookie('super_token');
  res.json({ success: true });
});

app.get('/api/super-admin/stats', superAdminAuth, async (req, res) => {
  res.json(await db.getSystemStats());
});

app.get('/api/super-admin/users', superAdminAuth, async (req, res) => {
  res.json({ users: await db.getAllUsers() });
});

app.get('/api/super-admin/restaurants', superAdminAuth, async (req, res) => {
  res.json({ restaurants: await db.getAllRestaurants() });
});

app.patch('/api/super-admin/users/:userId/toggle', superAdminAuth, async (req, res) => {
  const active = req.body.is_active === true || req.body.is_active === 'true' || req.body.is_active === 1;
  const ok = await db.toggleUserActive(req.params.userId, active);
  if (!ok) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json({ success: true });
});

app.patch('/api/super-admin/users/:userId/plan', superAdminAuth, async (req, res) => {
  const { plan } = req.body;
  if (!['free', 'starter', 'pro', 'enterprise'].includes(plan)) return res.status(400).json({ error: 'Geçersiz plan' });
  const ok = await db.updateUserPlan(req.params.userId, plan);
  if (!ok) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json({ success: true });
});

app.delete('/api/super-admin/users/:userId', superAdminAuth, async (req, res) => {
  const ok = await db.deleteUser(req.params.userId);
  if (!ok) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
  res.json({ success: true });
});

app.patch('/api/super-admin/restaurants/:restaurantId/toggle', superAdminAuth, async (req, res) => {
  const active = req.body.is_active === true || req.body.is_active === 'true' || req.body.is_active === 1;
  await db.updateRestaurant(req.params.restaurantId, { is_active: active ? 1 : 0 });
  res.json({ success: true });
});

app.delete('/api/super-admin/restaurants/:restaurantId', superAdminAuth, async (req, res) => {
  await db.deleteRestaurant(req.params.restaurantId);
  res.json({ success: true });
});

// ==================== ÇEVİRİ API ====================

function googleTranslate(text, from, to) {
  return new Promise((resolve) => {
    if (!text || !text.trim()) return resolve(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (resp) => {
      let data = '';
      resp.on('data', c => data += c);
      resp.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0].map(p => p[0]).join(''));
        } catch { resolve(text); }
      });
    }).on('error', () => resolve(text));
  });
}

app.post('/api/translate', async (req, res) => {
  try {
    const { texts, from = 'tr', to = 'en' } = req.body;
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: 'texts array required' });
    }
    if (texts.length > 100) {
      return res.status(400).json({ error: 'Max 100 texts per request' });
    }
    const separator = '\n||||\n';
    const combined = texts.join(separator);
    const translated = await googleTranslate(combined, from, to);
    const parts = translated.split(/\n?\|{3,4}\|?\n?/);
    const results = texts.map((t, i) => (parts[i] || '').trim() || t);
    res.json({ translations: results });
  } catch (e) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

// ==================== SUNUCU BAŞLAT ====================

async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`\n🚀 Tadında Menu çalışıyor!`);
      console.log(`📍 http://localhost:${PORT}`);
      console.log(`📍 Admin Panel: http://localhost:${PORT}/admin.html`);
      console.log(`📍 Süper Admin: http://localhost:${PORT}/super-admin.html`);
      console.log(`\n💡 İlk adım: Kayıt olun ve ilk restoranınızı oluşturun!\n`);
    });
  } catch (e) {
    console.error('❌ Sunucu başlatılamadı:', e.message);
    console.error('\n💡 MySQL çalışıyor mu kontrol edin:');
    console.error('   - XAMPP Control Panel → MySQL → Start');
    console.error('   - Veya: .env dosyasında DB_HOST, DB_USER, DB_PASSWORD ayarlayın\n');
    process.exit(1);
  }
}

startServer();
