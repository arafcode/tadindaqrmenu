/**
 * JSON → MySQL Veri Göçü
 * 
 * Mevcut data/database.json dosyasındaki verileri MySQL'e aktarır.
 * Kullanım: node migrate.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

const JSON_DB_FILE = path.join(__dirname, 'data', 'database.json');

async function migrate() {
  console.log('🔄 MySQL veritabanına göç başlıyor...\n');

  // 1. MySQL bağlantısı ve tabloları oluştur
  await db.init();

  // 2. JSON dosyasını oku
  if (!fs.existsSync(JSON_DB_FILE)) {
    console.log('⚠️  data/database.json bulunamadı. Göç edilecek veri yok.');
    console.log('✅ Boş MySQL veritabanı hazır.\n');
    process.exit(0);
  }

  const jsonData = JSON.parse(fs.readFileSync(JSON_DB_FILE, 'utf-8'));
  
  const users = jsonData.users || [];
  const restaurants = jsonData.restaurants || [];
  const categories = jsonData.categories || [];
  const menuItems = jsonData.menu_items || [];
  const analytics = jsonData.analytics || [];

  console.log(`📊 JSON verileri:`);
  console.log(`   Kullanıcılar: ${users.length}`);
  console.log(`   Restoranlar:  ${restaurants.length}`);
  console.log(`   Kategoriler:  ${categories.length}`);
  console.log(`   Menü Öğeleri: ${menuItems.length}`);
  console.log(`   Analitik:     ${analytics.length}\n`);

  if (users.length === 0) {
    console.log('✅ Göç edilecek veri yok. MySQL veritabanı hazır.\n');
    process.exit(0);
  }

  // Hata olmadan devam edelim — pool'a doğrudan erişelim
  const mysql = require('mysql2/promise');
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tadinda_menu',
    port: parseInt(process.env.DB_PORT || '3306'),
    waitForConnections: true,
    connectionLimit: 5,
    charset: 'utf8mb4'
  });

  // 3. Kullanıcıları aktar
  console.log('👤 Kullanıcılar aktarılıyor...');
  for (const u of users) {
    try {
      await pool.query(
        `INSERT IGNORE INTO users (id, email, password, business_name, phone, plan, is_active, plan_expires_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.id, u.email, u.password, u.business_name || '', u.phone || null,
         u.plan || 'free', u.is_active !== undefined ? u.is_active : 1,
         u.plan_expires_at || null,
         u.created_at ? new Date(u.created_at) : new Date(),
         u.updated_at ? new Date(u.updated_at) : new Date()]
      );
    } catch (e) {
      console.error(`   ⚠️  Kullanıcı atlanamadı (${u.email}): ${e.message}`);
    }
  }
  console.log(`   ✅ ${users.length} kullanıcı aktarıldı`);

  // 4. Restoranları aktar
  console.log('🏪 Restoranlar aktarılıyor...');
  for (const r of restaurants) {
    try {
      await pool.query(
        `INSERT IGNORE INTO restaurants (id, user_id, name, description, address, phone, logo_url, cover_url, primary_color, secondary_color, bg_color, currency, is_active, slug, view_count, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.id, r.user_id, r.name, r.description || '', r.address || '', r.phone || '',
         r.logo_url || '', r.cover_url || '', r.primary_color || '#e63946',
         r.secondary_color || '#1d3557', r.bg_color || '#f1faee', r.currency || '₺',
         r.is_active !== undefined ? r.is_active : 1, r.slug, r.view_count || 0,
         r.created_at ? new Date(r.created_at) : new Date()]
      );
    } catch (e) {
      console.error(`   ⚠️  Restoran atlanamadı (${r.name}): ${e.message}`);
    }
  }
  console.log(`   ✅ ${restaurants.length} restoran aktarıldı`);

  // 5. Kategorileri aktar
  console.log('📁 Kategoriler aktarılıyor...');
  for (const c of categories) {
    try {
      await pool.query(
        `INSERT IGNORE INTO categories (id, restaurant_id, name, description, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [c.id, c.restaurant_id, c.name, c.description || '', c.sort_order || 0,
         c.is_active !== undefined ? c.is_active : 1]
      );
    } catch (e) {
      console.error(`   ⚠️  Kategori atlanamadı (${c.name}): ${e.message}`);
    }
  }
  console.log(`   ✅ ${categories.length} kategori aktarıldı`);

  // 6. Menü öğelerini aktar
  console.log('🍽️  Menü öğeleri aktarılıyor...');
  for (const item of menuItems) {
    try {
      await pool.query(
        `INSERT IGNORE INTO menu_items (id, category_id, restaurant_id, name, description, price, image_url, is_available, is_popular, sort_order, allergens, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.id, item.category_id, item.restaurant_id, item.name, item.description || '',
         parseFloat(item.price) || 0, item.image_url || '',
         item.is_available !== undefined ? item.is_available : 1,
         item.is_popular || 0, item.sort_order || 0, item.allergens || '',
         item.created_at ? new Date(item.created_at) : new Date()]
      );
    } catch (e) {
      console.error(`   ⚠️  Menü öğesi atlanamadı (${item.name}): ${e.message}`);
    }
  }
  console.log(`   ✅ ${menuItems.length} menü öğesi aktarıldı`);

  // 7. Analitikleri aktar
  if (analytics.length > 0) {
    console.log('📈 Analitikler aktarılıyor...');
    // Batch insert for performance
    const batchSize = 100;
    for (let i = 0; i < analytics.length; i += batchSize) {
      const batch = analytics.slice(i, i + batchSize);
      const values = batch.map(a => [
        a.restaurant_id, a.event_type, a.event_data || '',
        a.ip_address || '', a.user_agent || '',
        a.created_at ? new Date(a.created_at) : new Date()
      ]);
      try {
        await pool.query(
          `INSERT INTO analytics (restaurant_id, event_type, event_data, ip_address, user_agent, created_at)
           VALUES ${values.map(() => '(?, ?, ?, ?, ?, ?)').join(', ')}`,
          values.flat()
        );
      } catch (e) {
        console.error(`   ⚠️  Analitik batch hatası: ${e.message}`);
      }
    }
    console.log(`   ✅ ${analytics.length} analitik kaydı aktarıldı`);
  }

  // 8. Doğrulama
  console.log('\n📋 Doğrulama...');
  const [[userCount]] = await pool.query('SELECT COUNT(*) as c FROM users');
  const [[restCount]] = await pool.query('SELECT COUNT(*) as c FROM restaurants');
  const [[catCount]] = await pool.query('SELECT COUNT(*) as c FROM categories');
  const [[itemCount]] = await pool.query('SELECT COUNT(*) as c FROM menu_items');
  const [[analyticsCount]] = await pool.query('SELECT COUNT(*) as c FROM analytics');

  console.log(`   MySQL'deki veriler:`);
  console.log(`   Kullanıcılar: ${userCount.c}`);
  console.log(`   Restoranlar:  ${restCount.c}`);
  console.log(`   Kategoriler:  ${catCount.c}`);
  console.log(`   Menü Öğeleri: ${itemCount.c}`);
  console.log(`   Analitik:     ${analyticsCount.c}`);

  console.log('\n✅ Göç tamamlandı! Artık sunucuyu başlatabilirsiniz: node server.js\n');

  await pool.end();
  process.exit(0);
}

migrate().catch(e => {
  console.error('❌ Göç hatası:', e);
  process.exit(1);
});
