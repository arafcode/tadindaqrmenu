# 🚀 Tadında Menu - Dijital Menü Sistemi

Restoran ve kafeler için **QR kod tabanlı dijital menü sistemi**. Müşterileriniz QR kodu tarayarak menünüze anında ulaşsın — kolay kurulum, çoklu dil desteği ve tamamen özelleştirilebilir.

Görseller:
<img width="1892" height="906" alt="Screenshot_1" src="https://github.com/user-attachments/assets/ace0ff6a-9f75-42ec-85b5-10f850f64c81" />
<img width="473" height="864" alt="Screenshot_2" src="https://github.com/user-attachments/assets/bbc5bb8e-e2e1-43ce-acf3-e425270d99f4" />
<img width="559" height="869" alt="Screenshot_3" src="https://github.com/user-attachments/assets/d8f73af6-76eb-409b-8d57-c684bd44367d" />



## ⚡ Hızlı Başlangıç

### Docker ile Kurulum (Önerilen)

```bash
# 1. .env dosyasını oluştur ve kendi değerlerini gir
cp .env.example .env
# .env dosyasını açıp DB_PASSWORD, JWT_SECRET ve SUPER_ADMIN bilgilerini değiştir!

# 2. MySQL veritabanını Docker ile başlat
docker compose up -d

# 3. Bağımlılıkları kur
npm install

# 4. Veritabanı tablolarını oluştur
npm run setup

# 5. Sunucuyu başlat
npm start

# 6. Tarayıcıda aç
# Ana sayfa: http://localhost:3000
# Admin Panel: http://localhost:3000/admin.html
```

### Docker olmadan Kurulum

```bash
# 1. MySQL 9 kurulu olmalı
# 2. .env dosyasını oluştur ve bağlantı bilgilerini ayarla
cp .env.example .env

# 3. Bağımlılıkları kur
npm install

# 4. Veritabanı tablolarını oluştur
npm run setup

# 5. Sunucuyu başlat
npm start
```

## 📁 Proje Yapısı

```
tadindamenu/
├── server.js              # Express sunucusu + tüm API route'ları
├── db.js                  # MySQL veritabanı bağlantısı
├── setup.js               # Veritabanı tablo oluşturma
├── migrate.js             # JSON → MySQL migrasyon scripti
├── docker-compose.yml     # MySQL Docker container tanımı
├── backup-db.js           # Veritabanı yedekleme
├── restore-db.js          # Veritabanı geri yükleme
├── package.json           # Bağımlılıklar
├── .env                   # Ortam değişkenleri
├── backups/               # SQL yedek dosyaları
└── public/
    ├── index.html         # Landing page (satış sayfası)
    ├── admin.html         # Yönetim paneli
    ├── menu.html          # Müşterinin gördüğü menü sayfası
    ├── super-admin.html   # Süper admin paneli
    └── js/
        ├── admin.js       # Admin panel JavaScript
        ├── super-admin.js # Süper admin JavaScript
        └── i18n.js        # Çoklu dil desteği
```

## 🎯 Özellikler

- ✅ **MySQL veritabanı** (Docker ile kolay kurulum)
- ✅ Kullanıcı kayıt/giriş sistemi (JWT)
- ✅ Restoran oluşturma ve yönetme
- ✅ Kategori ve menü öğesi ekleme/düzenleme/silme
- ✅ QR kod otomatik oluşturma
- ✅ Müşteri tarafı mobil-uyumlu menü sayfası
- ✅ Görüntülenme analitikleri
- ✅ Demo veri oluşturma
- ✅ Özelleştirilebilir renkler
- ✅ Popüler ürün işaretleme
- ✅ Ürün stok durumu kontrolü
- ✅ Responsive tasarım (mobil + masaüstü)
- ✅ Çoklu dil desteği (TR/EN/DE/AR)
- ✅ Süper admin paneli
- ✅ Veritabanı yedekleme/geri yükleme
- ✅ Resim yükleme desteği

---

## 🛠️ Kullanılan Teknolojiler

| Teknoloji | Kullanım Alanı |
|-----------|---------------|
| **Node.js + Express** | Backend sunucu ve REST API |
| **MySQL 9** | Veritabanı yönetimi |
| **Docker** | Veritabanı containerization |
| **JWT** | Kimlik doğrulama ve yetkilendirme |
| **HTML/CSS/JS** | Frontend arayüzler |
| **QR Code API** | Otomatik QR kod oluşturma |
| **Multer** | Resim yükleme işlemleri |
| **bcrypt** | Şifre hashleme |

---

## 📡 API Endpoints

### Kimlik Doğrulama
| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| POST | `/api/register` | Yeni kullanıcı kaydı |
| POST | `/api/login` | Kullanıcı girişi |

### Restoran Yönetimi
| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/restaurants` | Kullanıcının restoranlarını listele |
| POST | `/api/restaurants` | Yeni restoran oluştur |
| PUT | `/api/restaurants/:id` | Restoran bilgilerini güncelle |
| DELETE | `/api/restaurants/:id` | Restoranı sil |

### Kategori Yönetimi
| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/restaurants/:id/categories` | Kategorileri listele |
| POST | `/api/categories` | Yeni kategori ekle |
| PUT | `/api/categories/:id` | Kategori güncelle |
| DELETE | `/api/categories/:id` | Kategori sil |

### Menü Öğeleri
| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/categories/:id/items` | Kategorideki ürünleri listele |
| POST | `/api/items` | Yeni ürün ekle |
| PUT | `/api/items/:id` | Ürün güncelle |
| DELETE | `/api/items/:id` | Ürün sil |

### Herkese Açık (Public)
| Metot | Endpoint | Açıklama |
|-------|----------|----------|
| GET | `/api/menu/:slug` | Restoran menüsünü görüntüle |
| POST | `/api/menu/:slug/view` | Görüntülenme sayacını artır |

---

## 🌍 Çoklu Dil Desteği

Sistem şu anda **4 dil** desteklemektedir:

| Dil | Kod | Durum |
|-----|-----|-------|
| 🇹🇷 Türkçe | `tr` | ✅ Tamamlandı |
| 🇬🇧 İngilizce | `en` | ✅ Tamamlandı |
| 🇩🇪 Almanca | `de` | ✅ Tamamlandı |
| 🇸🇦 Arapça | `ar` | ✅ Tamamlandı (RTL destekli) |

Dil dosyaları `public/js/i18n.js` içinde yönetilmektedir. Yeni dil eklemek için bu dosyaya ilgili çeviri anahtarlarını eklemeniz yeterlidir.

---

## 🔐 Kullanıcı Rolleri

| Rol | Yetkiler |
|-----|----------|
| **Kullanıcı** | Kendi restoranlarını ve menülerini yönetir |
| **Süper Admin** | Tüm kullanıcıları ve restoranları yönetir, sistem ayarları |

---

## 🚀 Deploy (Yayına Alma)

### Seçenek A: Railway.app
1. [railway.app](https://railway.app) adresine git
2. GitHub ile giriş yap → "New Project" → "Deploy from GitHub Repo"
3. Projeyi bağla ve environment variables ekle
4. MySQL eklentisini projeye ekle

### Seçenek B: Render.com
1. [render.com](https://render.com) adresine git
2. "New Web Service" → GitHub reposunu bağla
3. Build Command: `npm install` / Start Command: `npm start`

### Seçenek C: VPS ile Kurulum
1. Hetzner, DigitalOcean veya benzeri bir sağlayıcıdan sunucu al
2. Domain bağla ve SSL sertifikası kur (Let's Encrypt)
3. PM2 ile uygulamayı ayakta tut
4. Nginx ile reverse proxy ayarla

### Environment Variables (.env)
```
# .env.example dosyasını kopyalayıp kendinize göre düzenleyin
cp .env.example .env
```

> ⚠️ **Önemli:** `.env` dosyasını asla GitHub'a push etmeyin! `JWT_SECRET` ve şifreleri güçlü değerlerle değiştirin.

### PM2 ile Production
```bash
npm install -g pm2
pm2 start server.js --name tadinda-menu
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 💾 Veritabanı Yedekleme & Geri Yükleme

```bash
# Yedekleme
npm run backup

# Geri yükleme
npm run restore
```

Yedek dosyaları `backups/` klasörüne kaydedilir.

---

## 🗺️ Yol Haritası (Roadmap)

### Kısa Vadeli
- [ ] Email doğrulama sistemi
- [ ] Şifre sıfırlama
- [ ] Ödeme sistemi entegrasyonu (iyzico/Stripe)

### Orta Vadeli
- [ ] WhatsApp sipariş butonu
- [ ] Google Maps entegrasyonu
- [ ] Müşteri yorum sistemi
- [ ] Push bildirimler

### Uzun Vadeli
- [ ] Online sipariş + ödeme
- [ ] Masa rezervasyonu
- [ ] Stok yönetimi
- [ ] Çoklu şube yönetimi
- [ ] Mobil uygulama (React Native)

---

## 🤝 Katkıda Bulunma

1. Bu repoyu **fork** edin
2. Yeni bir **branch** oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi **commit** edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi **push** edin (`git push origin feature/yeni-ozellik`)
5. Bir **Pull Request** açın

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) ile lisanslanmıştır.

---

## 📬 İletişim

Sorularınız veya önerileriniz için **Issues** bölümünü kullanabilirsiniz.

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!
