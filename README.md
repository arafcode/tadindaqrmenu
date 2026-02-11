# 🚀 Tadında Menu - Dijital Menü Sistemi

Restoran ve kafeler için **QR kod tabanlı dijital menü sistemi**. SaaS modeli ile aylık tekrarlayan gelir elde edin.

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

# 💰 PARA KAZANMA REHBERİ

## 🎯 İş Modeli: SaaS (Hizmet Olarak Yazılım)

### Fiyatlandırma Stratejisi

| Plan | Aylık Fiyat | Özellikler |
|------|-------------|------------|
| **Ücretsiz** | ₺0 | 1 restoran, 30 ürün, temel özellikler |
| **Pro** | ₺149/ay | 5 restoran, sınırsız ürün, analitik, özel renkler |
| **Kurumsal** | ₺399/ay | Sınırsız restoran, API, özel domain, 7/24 destek |

### Gelir Projeksiyonu

| Müşteri Sayısı | Aylık Gelir | Yıllık Gelir |
|-----------------|-------------|--------------|
| 10 Pro müşteri | ₺1.490 | ₺17.880 |
| 30 Pro müşteri | ₺4.470 | ₺53.640 |
| 50 Pro + 5 Kurumsal | ₺9.445 | ₺113.340 |
| 100 Pro + 10 Kurumsal | ₺18.890 | ₺226.680 |

---

## 📋 ADIM ADIM PARA KAZANMA PLANI

### ADIM 1: Projeyi Yayına Al (0₺ Maliyet!)

#### Seçenek A: Railway.app (ÖNERİLEN)
1. https://railway.app adresine git
2. GitHub hesabınla giriş yap
3. "New Project" → "Deploy from GitHub Repo"
4. Bu projeyi GitHub'a yükle ve Railway'e bağla
5. Environment variables ekle (PORT, JWT_SECRET, BASE_URL)
6. **Ücretsiz plan: 500 saat/ay** (yeterli!)

#### Seçenek B: Render.com
1. https://render.com adresine git
2. "New Web Service" → GitHub repo'nu bağla
3. Build Command: `npm install`
4. Start Command: `npm start`
5. **Ücretsiz plan mevcut!**

#### Seçenek C: VPS (Daha Profesyonel)
1. Hetzner/DigitalOcean'dan $5/ay VPS al
2. Domain al (tadindamenu.com gibi) - ~100₺/yıl
3. Nginx + Let's Encrypt SSL kur
4. PM2 ile uygulamayı ayakta tut

### ADIM 2: Domain Al
- **Önerilen:** tadindamenu.com, dijitalmenu.com.tr gibi
- Namecheap veya GoDaddy'den al (~100-200₺/yıl)

### ADIM 3: Ödeme Sistemi Entegre Et
- **iyzico** (Türkiye için en kolay): https://www.iyzico.com
- **Stripe** (uluslararası): https://stripe.com
- Aylık abonelik modeli kur

---

## 🏃 MÜŞTERİ BULMA STRATEJİLERİ

### 1. 🚶 Kapı Kapı Satış (EN ETKİLİ!)
**Hedef:** Çevrenizdeki restoran ve kafeler

**Yapmanız gereken:**
1. Tabletten/telefondan demo menüyü gösterin
2. "Ücretsiz deneme" teklif edin
3. 5 dakikada restoranın menüsünü sisteme girin
4. QR kodu yazdırıp masalara koyun
5. 1 hafta ücretsiz kullandırın
6. Sonra aylık abonelik teklif edin

**Konuşma senaryosu:**
> "Merhaba, ben [adınız]. Restoranınız için dijital menü sistemi sunuyorum. 
> Müşterileriniz QR kodu tarayıp menünüzü telefondan görebilir. 
> Basılı menü maliyetinden kurtulursunuz, fiyat değişikliklerini anında yaparsınız.
> İlk ay tamamen ücretsiz deneyin, beğenmezseniz hiçbir ücret ödemezsiniz."

### 2. 📱 Sosyal Medya Pazarlaması
- Instagram'da restoran sahiplerine DM atın
- "Dijital menü" konusunda bilgilendirici içerikler paylaşın
- Öncesi/sonrası görselleri oluşturun
- Reels/TikTok'ta demo videoları çekin

### 3. 🌐 Google My Business
- "dijital menü" aramasında çıkmak için SEO yapın
- Google Ads ile "restoran menü" arayanları hedefleyin

### 4. 🤝 İş Ortaklıkları
- Restoran malzemeleri satan firmalarla anlaşın
- Muhasebecilerden referans alın
- Restoran dernekleri ile iletişime geçin

### 5. 📍 Yerel Pazarlama
- Restoran bölgelerinde broşür dağıtın
- Ramazan/tatil sezonlarında özel kampanyalar yapın
- Yeni açılan restoranlara ilk gün gidin

---

## 💡 GELİR ARTIRMA TAKTİKLERİ

### Ek Gelir Kaynakları

1. **Kurulum Ücreti:** Menü fotoğrafı çekme + sisteme girme: ₺500-1000
2. **QR Kod Baskısı:** Masalar için akrilik QR standı satışı: ₺50-100/adet
3. **Menü Tasarımı:** Özel renk/logo tasarımı: ₺300-500
4. **Yıllık Plan İndirimi:** Yıllık ödeme yapana %30 indirim (peşin para)
5. **White Label:** Diğer girişimcilere alt lisans satışı

### Müşteri Tutma Stratejileri
- İlk ay ücretsiz
- QR kod görüntülenme raporları her hafta email ile gönderin
- Sezon menüleri için hatırlatma yapın
- Sadakat programı: 1 yıl kullanana 1 ay hediye

---

## 🛠️ PROJEYİ GELİŞTİRME FİKİRLERİ

### Kısa Vadeli (1-2 Hafta)
- [ ] Ödeme sistemi entegrasyonu (iyzico/Stripe)
- [ ] Email doğrulama
- [ ] Şifre sıfırlama
- [ ] Resim yükleme (multer eklenerek)

### Orta Vadeli (1-2 Ay)
- [ ] Çoklu dil desteği (İngilizce, Arapça, Almanca)
- [ ] WhatsApp sipariş butonu
- [ ] Google Maps entegrasyonu
- [ ] Müşteri yorum sistemi
- [ ] Push bildirim

### Uzun Vadeli (3-6 Ay)
- [ ] Online sipariş + ödeme
- [ ] Masa rezervasyonu
- [ ] Stok yönetimi
- [ ] Çoklu şube yönetimi
- [ ] Mobil uygulama (React Native)
- [ ] AI ile menü optimizasyonu

---

## 🔧 Teknik Deployment Notları

### Environment Variables (.env)
```
# .env.example dosyasını kopyalayıp kendinize göre düzenleyin
cp .env.example .env
```

> ⚠️ **Önemli:** `.env` dosyasını asla GitHub'a push etmeyin! JWT_SECRET ve şifreleri güçlü değerlerle değiştirin.

### PM2 ile Production
```bash
npm install -g pm2
pm2 start server.js --name qr-menu
pm2 save
pm2 startup
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name tadindamenu.com;

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

## 📊 Maliyet Analizi

| Kalem | Aylık Maliyet |
|-------|---------------|
| Hosting (Railway/Render) | ₺0 (ücretsiz plan) |
| Domain | ~₺10/ay |
| SSL | ₺0 (Let's Encrypt) |
| **TOPLAM** | **~₺10/ay** |

**Kâr marjı: %95+** (1 Pro müşteri bile maliyeti karşılar!)

---

## 🎉 SONUÇ

Bu proje ile:
1. **Sıfır sermaye** ile başlayabilirsiniz
2. **Tekrarlayan gelir** elde edersiniz (her ay para gelir)
3. **Ölçeklenebilir**: 1 müşteriye harcadığınız efor ile 1000 müşteriye hizmet verebilirsiniz
4. Her restoran/kafe potansiyel müşterinizdir
5. Pandemi sonrası dijital menü artık standart hale geldi

**İlk hedefiniz:** 10 müşteri bulmak → Aylık ₺1.490 gelir 🎯

Başarılar! 🚀
