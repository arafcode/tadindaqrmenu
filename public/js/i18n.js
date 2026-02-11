// ==================== i18n - Çoklu Dil Desteği ====================

const supportedLanguages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

function getLangInfo(code) {
  return supportedLanguages.find(l => l.code === code) || supportedLanguages[0];
}

const translations = {
  tr: {
    // Navbar
    'nav.features': 'Özellikler',
    'nav.pricing': 'Fiyatlar',
    'nav.faq': 'SSS',
    'nav.login': 'Giriş Yap',
    'nav.start_free': 'Ücretsiz Başla',

    // Hero
    'hero.badge': '🚀 Türkiye\'nin #1 Dijital Menü Platformu',
    'hero.title_1': 'Restoranınıza',
    'hero.title_2': 'Dijital Menü',
    'hero.title_3': 'Kazandırın',
    'hero.subtitle': 'QR kod ile müşterileriniz telefonlarından menünüzü görsün. Basılı menü maliyetinden kurtulun, menünüzü anında güncelleyin.',
    'hero.cta_free': 'Ücretsiz Deneyin →',
    'hero.cta_demo': 'Demo Menüyü Gör',
    'hero.social_proof': 'restoran kullanıyor',
    'hero.qr_text': 'QR Kodu Tara → Demo Menü',
    'hero.open': 'Açık',

    // Stats
    'stats.restaurants': 'Aktif Restoran',
    'stats.views': 'Menü Görüntülenme',
    'stats.savings': 'Maliyet Tasarrufu',
    'stats.setup': 'Kurulum Süresi',

    // Features
    'features.title': 'Neden',
    'features.subtitle': 'Restoranınızı dijital dünyaya taşıyın, müşteri memnuniyetini artırın',
    'features.qr_title': 'QR Kod ile Anında Erişim',
    'features.qr_desc': 'Müşterileriniz telefonlarıyla QR kodu tarayarak saniyeler içinde menünüze ulaşır.',
    'features.update_title': 'Anlık Güncelleme',
    'features.update_desc': 'Fiyat değişikliği veya yeni ürün ekleme? Anında güncelleyin, menü basım maliyeti yok.',
    'features.analytics_title': 'Detaylı Analitik',
    'features.analytics_desc': 'Menünüz kaç kez görüntülendi? Hangi saatlerde pik yapıyor? Tüm verileri görün.',
    'features.design_title': 'Özelleştirilebilir Tasarım',
    'features.design_desc': 'Markanıza uygun renkler, logo ve kapak fotoğrafı ile profesyonel menü tasarlayın.',
    'features.speed_title': 'Süper Hızlı',
    'features.speed_desc': 'Menünüz milisaniyeler içinde yüklenir. Müşterileriniz beklemez.',
    'features.responsive_title': 'Her Cihazda Çalışır',
    'features.responsive_desc': 'iPhone, Android, tablet... Tüm cihazlarda mükemmel görünüm.',

    // How it works
    'how.title': 'Nasıl Çalışır?',
    'how.subtitle': '3 kolay adımda dijital menünüz hazır',
    'how.step1_title': 'Kayıt Olun',
    'how.step1_desc': 'Ücretsiz hesap oluşturun ve restoran bilgilerinizi girin.',
    'how.step2_title': 'Menüyü Ekleyin',
    'how.step2_desc': 'Kategorileri ve ürünleri fotoğraflarıyla birlikte ekleyin.',
    'how.step3_title': 'QR Kodu Paylaşın',
    'how.step3_desc': 'QR kodu masalara koyun, müşteriler tarayıp menüyü görsün!',

    // Pricing
    'pricing.title_1': 'Basit ve Şeffaf',
    'pricing.title_2': 'Fiyatlandırma',
    'pricing.subtitle': 'Her bütçeye uygun plan',
    'pricing.starter': 'BAŞLANGIÇ',
    'pricing.free': 'Ücretsiz',
    'pricing.forever': 'Sonsuza kadar',
    'pricing.free_f1': '1 Restoran',
    'pricing.free_f2': '30 Menü Öğesi',
    'pricing.free_f3': 'QR Kod',
    'pricing.free_f4': 'Mobil Uyumlu Menü',
    'pricing.free_f5': 'Analitik Rapor',
    'pricing.free_f6': 'Özel Renkler',
    'pricing.start_free': 'Ücretsiz Başla',
    'pricing.most_popular': 'EN POPÜLER',
    'pricing.pro_yearly': 'Yıllık ödemede ₺99/ay',
    'pricing.pro_f1': 'Restoran',
    'pricing.pro_f2': 'Menü Öğesi',
    'pricing.unlimited': 'Sınırsız',
    'pricing.pro_f3': 'QR Kod',
    'pricing.pro_f4': 'Detaylı Analitik',
    'pricing.pro_f5': 'Özel Renkler & Logo',
    'pricing.pro_f6': 'Öncelikli Destek',
    'pricing.go_pro': 'Pro\'ya Geç →',
    'pricing.enterprise': 'KURUMSAL',
    'pricing.enterprise_sub': 'Restoran zincirleri için',
    'pricing.ent_f1': 'Restoran',
    'pricing.ent_f2': 'Menü Öğesi',
    'pricing.ent_f3': 'Tüm Pro Özellikler',
    'pricing.ent_f4': 'API Erişimi',
    'pricing.ent_f5': 'Özel Alan Adı',
    'pricing.ent_f6': '7/24 Destek',
    'pricing.contact': 'İletişime Geç',

    // FAQ
    'faq.title': 'Sıkça Sorulan Sorular',
    'faq.q1': 'Kurulumu ne kadar sürer?',
    'faq.a1': 'Kayıt olduktan sonra 5 dakika içinde ilk dijital menünüz hazır! Kolay arayüzümüz sayesinde teknik bilgi gerektirmez.',
    'faq.q2': 'Müşterilerimin uygulama indirmesi gerekiyor mu?',
    'faq.a2': 'Hayır! Müşterileriniz QR kodu taradığında menü doğrudan tarayıcıda açılır. Herhangi bir uygulama indirmeye gerek yoktur.',
    'faq.q3': 'Menümü ne sıklıkla güncelleyebilirim?',
    'faq.a3': 'Sınırsız! İstediğiniz zaman fiyat değiştirebilir, yeni ürün ekleyebilir veya mevcut ürünleri düzenleyebilirsiniz. Değişiklikler anında yansır.',
    'faq.q4': 'QR kodu değişir mi?',
    'faq.a4': 'Hayır! QR kodunuz sabit kalır. Menünüzde değişiklik yaptığınızda QR kodu aynı kalır, sadece içerik güncellenir.',
    'faq.q5': 'İnternet yoksa menü açılır mı?',
    'faq.a5': 'Menüyü görüntülemek için internet bağlantısı gereklidir. Ancak restoranınızın WiFi\'si olduğu sürece sorun yaşanmaz.',

    // CTA
    'cta.title_1': 'Dijital Menüye Geçmek İçin',
    'cta.title_2': 'Doğru Zaman!',
    'cta.subtitle': 'Hemen ücretsiz hesap oluşturun, 5 dakikada ilk menünüz hazır olsun.',
    'cta.button': 'Ücretsiz Hesap Oluştur →',

    // Footer
    'footer.tagline': 'Restoranlar için modern dijital menü çözümü.',
    'footer.product': 'Ürün',
    'footer.features': 'Özellikler',
    'footer.pricing_link': 'Fiyatlandırma',
    'footer.faq_link': 'SSS',
    'footer.company': 'Şirket',
    'footer.about': 'Hakkımızda',
    'footer.contact_link': 'İletişim',
    'footer.blog': 'Blog',
    'footer.contact': 'İletişim',
    'footer.copyright': '© 2026 Tadında Menu. Tüm hakları saklıdır.',

    // Menu page
    'menu.loading': 'Menü yükleniyor...',
    'menu.not_found_title': 'Menü Bulunamadı',
    'menu.not_found_desc': 'Bu menü mevcut değil veya kaldırılmış olabilir.',
    'menu.search': 'Menüde ara...',
    'menu.popular': '⭐ Popüler',
    'menu.no_desc': 'Açıklama mevcut değil.',
    'menu.allergens': 'Alerjenler',
    'menu.footer': 'Tadında Menu ile oluşturuldu ✨',

    // Admin - Auth
    'auth.login_title': 'Giriş Yap',
    'auth.email': 'Email',
    'auth.email_placeholder': 'ornek@email.com',
    'auth.password': 'Şifre',
    'auth.password_placeholder': '••••••••',
    'auth.login_btn': 'Giriş Yap',
    'auth.no_account': 'Hesabınız yok mu?',
    'auth.register_link': 'Kayıt Ol',
    'auth.register_title': 'Hesap Oluştur',
    'auth.business_name': 'İşletme Adı',
    'auth.business_placeholder': 'Restoranınızın adı',
    'auth.phone': 'Telefon',
    'auth.phone_placeholder': '0555 123 4567',
    'auth.password_hint': 'Şifre (min 6 karakter)',
    'auth.register_btn': 'Ücretsiz Kayıt Ol',
    'auth.has_account': 'Zaten hesabınız var mı?',
    'auth.login_link': 'Giriş Yap',

    // Admin - Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.restaurants': 'Restoranlarım',
    'sidebar.menu_editor': 'Menü Düzenle',
    'sidebar.qr_code': 'QR Kod',
    'sidebar.analytics': 'Analitik',
    'sidebar.logout': 'Çıkış Yap',
    'sidebar.free_plan': 'Ücretsiz Plan',
    'sidebar.pro_plan': 'Pro Plan',
    'sidebar.mobile_logout': 'Çıkış',

    // Admin - Dashboard
    'dash.title': 'Dashboard',
    'dash.total_restaurants': 'Toplam Restoran',
    'dash.views_today': 'Bugünkü Görüntülenme',
    'dash.views_month': 'Bu Ay Görüntülenme',
    'dash.views_total': 'Toplam Görüntülenme',
    'dash.no_restaurant_title': 'Henüz restoran eklememişsiniz',
    'dash.no_restaurant_desc': 'İlk restoranınızı ekleyerek dijital menü oluşturmaya başlayın!',
    'dash.add_restaurant': '➕ Restoran Ekle',
    'dash.create_demo': '🎮 Demo Oluştur',

    // Admin - Restaurants
    'rest.title': 'Restoranlarım',
    'rest.new': '➕ Yeni Restoran',
    'rest.no_restaurants': 'Henüz restoran yok',
    'rest.no_restaurants_desc': 'İlk restoranınızı ekleyerek başlayın',
    'rest.add': '➕ Restoran Ekle',
    'rest.no_desc': 'Açıklama eklenmemiş',
    'rest.active': 'Aktif',
    'rest.inactive': 'Pasif',
    'rest.views': 'görüntülenme',
    'rest.menu_btn': '📋 Menü',
    'rest.qr_btn': '📱 QR Kod',
    'rest.delete_confirm': 'Bu restoranı ve tüm menüsünü silmek istediğinize emin misiniz?',

    // Admin - Menu Editor
    'editor.title': 'Menü Düzenleyici',
    'editor.add_category': '📁 Kategori Ekle',
    'editor.add_item': '➕ Ürün Ekle',
    'editor.empty_title': 'Menü boş',
    'editor.empty_desc': 'Önce kategoriler ekleyin, sonra ürünleri girin.',
    'editor.first_category': '📁 İlk Kategoriyi Ekle',
    'editor.no_items': 'Bu kategoride henüz ürün yok',
    'editor.popular': '⭐ Popüler',
    'editor.sold_out': 'Tükendi',
    'editor.delete_category_confirm': 'Bu kategori ve içindeki tüm ürünler silinecek. Emin misiniz?',
    'editor.delete_item_confirm': 'Bu ürünü silmek istediğinize emin misiniz?',
    'editor.select_restaurant': 'Önce bir restoran seçin',
    'editor.add_category_first': 'Önce bir kategori ekleyin',

    // Admin - Modals
    'modal.add_restaurant': 'Yeni Restoran Ekle',
    'modal.restaurant_name': 'Restoran Adı *',
    'modal.restaurant_name_ph': 'Lezzet Durağı',
    'modal.description': 'Açıklama',
    'modal.description_ph': 'Kısa bir açıklama...',
    'modal.address': 'Adres',
    'modal.address_ph': 'Tam adres',
    'modal.phone': 'Telefon',
    'modal.phone_ph': '0555 123 4567',
    'modal.primary_color': 'Ana Renk',
    'modal.secondary_color': 'İkincil Renk',
    'modal.bg_color': 'Arkaplan',
    'modal.create_restaurant': 'Restoran Oluştur',
    'modal.add_category_title': 'Kategori Ekle',
    'modal.category_name': 'Kategori Adı *',
    'modal.category_name_ph': '🍖 Ana Yemekler',
    'modal.category_desc_ph': 'Kategorinin kısa açıklaması',
    'modal.add_category_btn': 'Kategori Ekle',
    'modal.add_item_title': 'Menü Öğesi Ekle',
    'modal.category_select': 'Kategori *',
    'modal.category_select_ph': 'Kategori seçin',
    'modal.item_name': 'Ürün Adı *',
    'modal.item_name_ph': 'Izgara Köfte',
    'modal.item_desc_ph': 'Ürünün kısa açıklaması',
    'modal.price': 'Fiyat (₺) *',
    'modal.price_ph': '185',
    'modal.image_url': 'Görsel URL',
    'modal.popular_item': '⭐ Popüler Ürün',
    'modal.available': '✅ Mevcut',
    'modal.add_item_btn': 'Ürün Ekle',

    // Admin - QR Code
    'qr.title': 'QR Kod',
    'qr.no_restaurant': 'Restoran seçilmedi',
    'qr.download': '⬇️ QR Kodu İndir',
    'qr.instructions': 'Bu QR kodu yazdırıp masalarınıza koyun.<br>Müşterileriniz tarayarak menünüzü görecek!',

    // Admin - Analytics
    'analytics.title': 'Analitik',
    'analytics.today': 'Bugün',
    'analytics.this_week': 'Bu Hafta',
    'analytics.this_month': 'Bu Ay',
    'analytics.total': 'Toplam',
    'analytics.views': 'görüntülenme',
    'analytics.last_30': 'Son 30 Gün',
    'analytics.no_data': 'Henüz veri yok',

    // Toast messages
    'toast.login_success': 'Giriş başarılı!',
    'toast.register_success': 'Kayıt başarılı! Hoş geldiniz!',
    'toast.restaurant_created': 'Restoran başarıyla oluşturuldu!',
    'toast.restaurant_deleted': 'Restoran silindi',
    'toast.category_added': 'Kategori eklendi!',
    'toast.item_added': 'Ürün eklendi!',
    'toast.category_deleted': 'Kategori silindi',
    'toast.item_deleted': 'Ürün silindi',
    'toast.demo_creating': 'Demo oluşturuluyor...',
  },

  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    'nav.login': 'Sign In',
    'nav.start_free': 'Start Free',

    // Hero
    'hero.badge': '🚀 #1 Digital Menu Platform',
    'hero.title_1': 'Give Your Restaurant',
    'hero.title_2': 'a Digital Menu',
    'hero.title_3': 'Experience',
    'hero.subtitle': 'Let your customers view your menu from their phones via QR code. Cut printed menu costs and update your menu instantly.',
    'hero.cta_free': 'Try For Free →',
    'hero.cta_demo': 'View Demo Menu',
    'hero.social_proof': 'restaurants using',
    'hero.qr_text': 'Scan QR Code → Demo Menu',
    'hero.open': 'Open',

    // Stats
    'stats.restaurants': 'Active Restaurants',
    'stats.views': 'Menu Views',
    'stats.savings': 'Cost Savings',
    'stats.setup': 'Setup Time',

    // Features
    'features.title': 'Why',
    'features.subtitle': 'Take your restaurant digital and boost customer satisfaction',
    'features.qr_title': 'Instant QR Code Access',
    'features.qr_desc': 'Your customers can access your menu in seconds by scanning the QR code with their phones.',
    'features.update_title': 'Real-Time Updates',
    'features.update_desc': 'Price change or new item? Update instantly with zero printing costs.',
    'features.analytics_title': 'Detailed Analytics',
    'features.analytics_desc': 'How many times was your menu viewed? What are the peak hours? See all the data.',
    'features.design_title': 'Customizable Design',
    'features.design_desc': 'Design a professional menu with colors, logo, and cover photos that match your brand.',
    'features.speed_title': 'Super Fast',
    'features.speed_desc': 'Your menu loads in milliseconds. No waiting for your customers.',
    'features.responsive_title': 'Works on All Devices',
    'features.responsive_desc': 'iPhone, Android, tablet... Perfect display on all devices.',

    // How it works
    'how.title': 'How It Works?',
    'how.subtitle': 'Your digital menu ready in 3 easy steps',
    'how.step1_title': 'Sign Up',
    'how.step1_desc': 'Create a free account and enter your restaurant information.',
    'how.step2_title': 'Add Your Menu',
    'how.step2_desc': 'Add categories and items with their photos.',
    'how.step3_title': 'Share QR Code',
    'how.step3_desc': 'Place QR codes on tables, customers scan and see the menu!',

    // Pricing
    'pricing.title_1': 'Simple & Transparent',
    'pricing.title_2': 'Pricing',
    'pricing.subtitle': 'A plan for every budget',
    'pricing.starter': 'STARTER',
    'pricing.free': 'Free',
    'pricing.forever': 'Forever',
    'pricing.free_f1': '1 Restaurant',
    'pricing.free_f2': '30 Menu Items',
    'pricing.free_f3': 'QR Code',
    'pricing.free_f4': 'Mobile-Friendly Menu',
    'pricing.free_f5': 'Analytics Report',
    'pricing.free_f6': 'Custom Colors',
    'pricing.start_free': 'Start Free',
    'pricing.most_popular': 'MOST POPULAR',
    'pricing.pro_yearly': '₺99/mo billed annually',
    'pricing.pro_f1': 'Restaurants',
    'pricing.pro_f2': 'Menu Items',
    'pricing.unlimited': 'Unlimited',
    'pricing.pro_f3': 'QR Code',
    'pricing.pro_f4': 'Detailed Analytics',
    'pricing.pro_f5': 'Custom Colors & Logo',
    'pricing.pro_f6': 'Priority Support',
    'pricing.go_pro': 'Go Pro →',
    'pricing.enterprise': 'ENTERPRISE',
    'pricing.enterprise_sub': 'For restaurant chains',
    'pricing.ent_f1': 'Restaurants',
    'pricing.ent_f2': 'Menu Items',
    'pricing.ent_f3': 'All Pro Features',
    'pricing.ent_f4': 'API Access',
    'pricing.ent_f5': 'Custom Domain',
    'pricing.ent_f6': '24/7 Support',
    'pricing.contact': 'Contact Us',

    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.q1': 'How long does setup take?',
    'faq.a1': 'Your first digital menu is ready within 5 minutes after signing up! Our easy interface requires no technical knowledge.',
    'faq.q2': 'Do my customers need to download an app?',
    'faq.a2': 'No! When your customers scan the QR code, the menu opens directly in the browser. No app download needed.',
    'faq.q3': 'How often can I update my menu?',
    'faq.a3': 'Unlimited! You can change prices, add new items, or edit existing ones anytime. Changes are reflected instantly.',
    'faq.q4': 'Does the QR code change?',
    'faq.a4': 'No! Your QR code stays the same. When you make changes to your menu, the QR code remains unchanged, only the content updates.',
    'faq.q5': 'Does the menu work without internet?',
    'faq.a5': 'An internet connection is required to view the menu. However, as long as your restaurant has WiFi, there should be no issues.',

    // CTA
    'cta.title_1': 'The Right Time to Go',
    'cta.title_2': 'Digital!',
    'cta.subtitle': 'Create a free account now, your first menu ready in 5 minutes.',
    'cta.button': 'Create Free Account →',

    // Footer
    'footer.tagline': 'Modern digital menu solution for restaurants.',
    'footer.product': 'Product',
    'footer.features': 'Features',
    'footer.pricing_link': 'Pricing',
    'footer.faq_link': 'FAQ',
    'footer.company': 'Company',
    'footer.about': 'About Us',
    'footer.contact_link': 'Contact',
    'footer.blog': 'Blog',
    'footer.contact': 'Contact',
    'footer.copyright': '© 2026 Tadında Menu. All rights reserved.',

    // Menu page
    'menu.loading': 'Loading menu...',
    'menu.not_found_title': 'Menu Not Found',
    'menu.not_found_desc': 'This menu does not exist or has been removed.',
    'menu.search': 'Search menu...',
    'menu.popular': '⭐ Popular',
    'menu.no_desc': 'No description available.',
    'menu.allergens': 'Allergens',
    'menu.footer': 'Created with Tadında Menu ✨',

    // Admin - Auth
    'auth.login_title': 'Sign In',
    'auth.email': 'Email',
    'auth.email_placeholder': 'example@email.com',
    'auth.password': 'Password',
    'auth.password_placeholder': '••••••••',
    'auth.login_btn': 'Sign In',
    'auth.no_account': 'Don\'t have an account?',
    'auth.register_link': 'Sign Up',
    'auth.register_title': 'Create Account',
    'auth.business_name': 'Business Name',
    'auth.business_placeholder': 'Your restaurant\'s name',
    'auth.phone': 'Phone',
    'auth.phone_placeholder': '+1 555 123 4567',
    'auth.password_hint': 'Password (min 6 characters)',
    'auth.register_btn': 'Sign Up Free',
    'auth.has_account': 'Already have an account?',
    'auth.login_link': 'Sign In',

    // Admin - Sidebar
    'sidebar.dashboard': 'Dashboard',
    'sidebar.restaurants': 'My Restaurants',
    'sidebar.menu_editor': 'Edit Menu',
    'sidebar.qr_code': 'QR Code',
    'sidebar.analytics': 'Analytics',
    'sidebar.logout': 'Sign Out',
    'sidebar.free_plan': 'Free Plan',
    'sidebar.pro_plan': 'Pro Plan',
    'sidebar.mobile_logout': 'Sign Out',

    // Admin - Dashboard
    'dash.title': 'Dashboard',
    'dash.total_restaurants': 'Total Restaurants',
    'dash.views_today': 'Views Today',
    'dash.views_month': 'Views This Month',
    'dash.views_total': 'Total Views',
    'dash.no_restaurant_title': 'No restaurants yet',
    'dash.no_restaurant_desc': 'Start by adding your first restaurant to create a digital menu!',
    'dash.add_restaurant': '➕ Add Restaurant',
    'dash.create_demo': '🎮 Create Demo',

    // Admin - Restaurants
    'rest.title': 'My Restaurants',
    'rest.new': '➕ New Restaurant',
    'rest.no_restaurants': 'No restaurants yet',
    'rest.no_restaurants_desc': 'Get started by adding your first restaurant',
    'rest.add': '➕ Add Restaurant',
    'rest.no_desc': 'No description added',
    'rest.active': 'Active',
    'rest.inactive': 'Inactive',
    'rest.views': 'views',
    'rest.menu_btn': '📋 Menu',
    'rest.qr_btn': '📱 QR Code',
    'rest.delete_confirm': 'Are you sure you want to delete this restaurant and all its menu?',

    // Admin - Menu Editor
    'editor.title': 'Menu Editor',
    'editor.add_category': '📁 Add Category',
    'editor.add_item': '➕ Add Item',
    'editor.empty_title': 'Menu is empty',
    'editor.empty_desc': 'Add categories first, then add items.',
    'editor.first_category': '📁 Add First Category',
    'editor.no_items': 'No items in this category yet',
    'editor.popular': '⭐ Popular',
    'editor.sold_out': 'Sold Out',
    'editor.delete_category_confirm': 'This category and all items in it will be deleted. Are you sure?',
    'editor.delete_item_confirm': 'Are you sure you want to delete this item?',
    'editor.select_restaurant': 'Please select a restaurant first',
    'editor.add_category_first': 'Please add a category first',

    // Admin - Modals
    'modal.add_restaurant': 'Add New Restaurant',
    'modal.restaurant_name': 'Restaurant Name *',
    'modal.restaurant_name_ph': 'Flavor Stop',
    'modal.description': 'Description',
    'modal.description_ph': 'A short description...',
    'modal.address': 'Address',
    'modal.address_ph': 'Full address',
    'modal.phone': 'Phone',
    'modal.phone_ph': '+1 555 123 4567',
    'modal.primary_color': 'Primary Color',
    'modal.secondary_color': 'Secondary Color',
    'modal.bg_color': 'Background',
    'modal.create_restaurant': 'Create Restaurant',
    'modal.add_category_title': 'Add Category',
    'modal.category_name': 'Category Name *',
    'modal.category_name_ph': '🍖 Main Dishes',
    'modal.category_desc_ph': 'Short category description',
    'modal.add_category_btn': 'Add Category',
    'modal.add_item_title': 'Add Menu Item',
    'modal.category_select': 'Category *',
    'modal.category_select_ph': 'Select category',
    'modal.item_name': 'Item Name *',
    'modal.item_name_ph': 'Grilled Meatballs',
    'modal.item_desc_ph': 'Short item description',
    'modal.price': 'Price (₺) *',
    'modal.price_ph': '185',
    'modal.image_url': 'Image URL',
    'modal.popular_item': '⭐ Popular Item',
    'modal.available': '✅ Available',
    'modal.add_item_btn': 'Add Item',

    // Admin - QR Code
    'qr.title': 'QR Code',
    'qr.no_restaurant': 'No restaurant selected',
    'qr.download': '⬇️ Download QR Code',
    'qr.instructions': 'Print this QR code and place it on your tables.<br>Your customers will scan it to see your menu!',

    // Admin - Analytics
    'analytics.title': 'Analytics',
    'analytics.today': 'Today',
    'analytics.this_week': 'This Week',
    'analytics.this_month': 'This Month',
    'analytics.total': 'Total',
    'analytics.views': 'views',
    'analytics.last_30': 'Last 30 Days',
    'analytics.no_data': 'No data yet',

    // Toast messages
    'toast.login_success': 'Login successful!',
    'toast.register_success': 'Registration successful! Welcome!',
    'toast.restaurant_created': 'Restaurant created successfully!',
    'toast.restaurant_deleted': 'Restaurant deleted',
    'toast.category_added': 'Category added!',
    'toast.item_added': 'Item added!',
    'toast.category_deleted': 'Category deleted',
    'toast.item_deleted': 'Item deleted',
    'toast.demo_creating': 'Creating demo...',
  }
};

// ==================== i18n Engine ====================

function detectBrowserLang() {
  const nav = navigator.language || navigator.userLanguage || 'tr';
  const short = nav.split('-')[0].toLowerCase();
  if (supportedLanguages.find(l => l.code === short)) return short;
  return 'tr';
}

let currentLang = localStorage.getItem('qrmenu_lang') || detectBrowserLang();

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations['tr'][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('qrmenu_lang', lang);
  document.documentElement.lang = lang;
  applyTranslations();
  // Dispatch event so pages can react
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

function toggleLanguage() {
  // Legacy: just cycle TR→EN→TR for simple buttons
  setLanguage(currentLang === 'tr' ? 'en' : 'tr');
}

function openLanguagePicker(anchorEl) {
  // Remove existing picker
  const existing = document.getElementById('langPickerDropdown');
  if (existing) { existing.remove(); return; }

  const picker = document.createElement('div');
  picker.id = 'langPickerDropdown';
  picker.className = 'fixed z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 w-52 max-h-80 overflow-y-auto';
  picker.style.cssText = 'animation: fadeInUp 0.15s ease;';

  picker.innerHTML = supportedLanguages.map(l => `
    <button onclick="setLanguage('${l.code}'); document.getElementById('langPickerDropdown')?.remove();"
      class="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-purple-50 transition ${l.code === currentLang ? 'bg-purple-50 font-bold text-purple-700' : 'text-gray-700'}">
      <span class="text-lg">${l.flag}</span>
      <span>${l.name}</span>
      ${l.code === currentLang ? '<span class="ml-auto text-purple-600">✓</span>' : ''}
    </button>
  `).join('');

  document.body.appendChild(picker);

  // Position near the anchor
  if (anchorEl) {
    const rect = anchorEl.getBoundingClientRect();
    const ph = picker.offsetHeight;
    const pw = picker.offsetWidth;
    let top = rect.bottom + 4;
    let left = rect.right - pw;
    if (top + ph > window.innerHeight) top = rect.top - ph - 4;
    if (left < 8) left = 8;
    picker.style.top = top + 'px';
    picker.style.left = left + 'px';
  } else {
    picker.style.top = '60px';
    picker.style.right = '16px';
  }

  // Close on outside click
  setTimeout(() => {
    const handler = (e) => {
      if (!picker.contains(e.target) && e.target !== anchorEl && !anchorEl?.contains(e.target)) {
        picker.remove();
        document.removeEventListener('click', handler);
      }
    };
    document.addEventListener('click', handler);
  }, 10);
}

function getCurrentLang() {
  return currentLang;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = val;
    } else {
      el.innerHTML = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  // Update lang toggle buttons
  document.querySelectorAll('.lang-toggle-label').forEach(el => {
    const info = getLangInfo(currentLang);
    el.textContent = info.flag + ' ' + info.code.toUpperCase();
  });
}

// Auto-apply on load
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.lang = currentLang;
  applyTranslations();
});

// ==================== Food/Menu Translation System ====================

const foodPhrases = {
  // --- Category Names ---
  'ana yemekler': 'Main Courses', 'ana yemek': 'Main Course',
  'başlangıçlar': 'Starters', 'başlangıç': 'Starter',
  'salatalar': 'Salads', 'salata': 'Salad',
  'çorbalar': 'Soups', 'çorba': 'Soup',
  'tatlılar': 'Desserts', 'tatlı': 'Dessert',
  'içecekler': 'Beverages', 'içecek': 'Beverage',
  'soğuk içecekler': 'Cold Beverages', 'sıcak içecekler': 'Hot Beverages',
  'alkolsüz içecekler': 'Non-Alcoholic Beverages', 'alkollü içecekler': 'Alcoholic Beverages',
  'pizzalar': 'Pizzas', 'pizza': 'Pizza',
  'burgerler': 'Burgers', 'burger': 'Burger',
  'makarnalar': 'Pastas', 'makarna': 'Pasta',
  'sandviçler': 'Sandwiches', 'sandviç': 'Sandwich',
  'kahvaltı': 'Breakfast', 'kahvaltılar': 'Breakfast',
  'aperatifler': 'Appetizers', 'ara sıcaklar': 'Hot Appetizers',
  'deniz ürünleri': 'Seafood', 'et yemekleri': 'Meat Dishes',
  'tavuk yemekleri': 'Chicken Dishes', 'sebze yemekleri': 'Vegetable Dishes',
  'vejetaryen': 'Vegetarian', 'vegan': 'Vegan',
  'yan lezzetler': 'Side Dishes', 'yan ürünler': 'Side Dishes', 'garnitürler': 'Side Dishes',
  'soslar': 'Sauces', 'kampanyalar': 'Specials', 'kampanya': 'Special Offers',
  'günün menüsü': 'Daily Menu', 'özel menü': 'Special Menu',
  'çocuk menüsü': 'Kids Menu', 'fırın': 'Oven Dishes', 'fırın ürünleri': 'Bakery',
  'ızgaralar': 'Grills', 'kebaplar': 'Kebabs', 'pideler': 'Turkish Pides',
  'lahmacunlar': 'Lahmacuns', 'hamur işleri': 'Pastries',
  'zeytinyağlılar': 'Olive Oil Dishes', 'mezeler': 'Mezes', 'meze': 'Meze',
  'atıştırmalıklar': 'Snacks', 'dondurmalar': 'Ice Cream',
  'kahveler': 'Coffees', 'çaylar': 'Teas',
  'taze sıkılmış': 'Fresh Squeezed', 'özel lezzetler': 'House Specials',

  // --- Common Dishes ---
  'izgara köfte': 'Grilled Meatballs', 'köfte': 'Meatballs', 'kasap köfte': 'Butcher Meatballs',
  'inegöl köfte': 'Inegol Meatballs', 'akçaabat köfte': 'Akcaabat Meatballs',
  'izmir köfte': 'Izmir Meatballs', 'kadınbudu köfte': 'Kadinbudu Meatballs',
  'tavuk şiş': 'Chicken Skewers', 'kuzu şiş': 'Lamb Skewers', 'şiş kebap': 'Shish Kebab',
  'adana kebabı': 'Adana Kebab', 'adana kebap': 'Adana Kebab',
  'urfa kebabı': 'Urfa Kebab', 'urfa kebap': 'Urfa Kebab',
  'iskender': 'Iskender Kebab', 'iskender kebap': 'Iskender Kebab',
  'döner': 'Doner Kebab', 'döner kebap': 'Doner Kebab',
  'tavuk döner': 'Chicken Doner', 'et döner': 'Meat Doner',
  'lahmacun': 'Lahmacun', 'kuşbaşılı pide': 'Diced Meat Pide',
  'kaşarlı pide': 'Cheese Pide', 'kıymalı pide': 'Minced Meat Pide',
  'karışık pide': 'Mixed Pide', 'sucuklu pide': 'Sausage Pide',
  'kuzu pirzola': 'Lamb Chops', 'kuzu kaburga': 'Lamb Ribs', 'kuzu tandır': 'Slow-Roasted Lamb',
  'karışık ızgara': 'Mixed Grill', 'beyti sarma': 'Beyti Wrap', 'ali nazik': 'Ali Nazik',
  'çoban salata': 'Shepherd Salad', 'çoban salatası': 'Shepherd Salad',
  'sezar salata': 'Caesar Salad', 'sezar salatası': 'Caesar Salad',
  'mevsim salata': 'Seasonal Salad', 'mevsim salatası': 'Seasonal Salad',
  'akdeniz salata': 'Mediterranean Salad', 'akdeniz salatası': 'Mediterranean Salad',
  'ton balıklı salata': 'Tuna Salad', 'tavuk salatası': 'Chicken Salad',
  'mercimek çorbası': 'Lentil Soup', 'domates çorbası': 'Tomato Soup',
  'ezogelin çorbası': 'Ezogelin Soup', 'yayla çorbası': 'Yogurt Soup',
  'tavuk çorbası': 'Chicken Soup', 'günün çorbası': 'Soup of the Day',
  'işkembe çorbası': 'Tripe Soup', 'tarhana çorbası': 'Tarhana Soup',
  'düğün çorbası': 'Wedding Soup', 'kremalı mantar çorbası': 'Cream of Mushroom Soup',
  'künefe': 'Kunefe', 'sütlaç': 'Rice Pudding', 'baklava': 'Baklava',
  'kazandibi': 'Caramelized Milk Pudding', 'aşure': 'Noah\'s Pudding',
  'kemalpaşa': 'Kemalpasa Dessert', 'revani': 'Revani Cake',
  'kadayıf': 'Kadayif', 'tel kadayıf': 'Shredded Kadayif',
  'tulumba': 'Tulumba', 'profiterol': 'Profiterole',
  'cheesecake': 'Cheesecake', 'tiramisu': 'Tiramisu', 'brownie': 'Brownie',
  'waffle': 'Waffle', 'sufle': 'Chocolate Souffle', 'çikolatalı sufle': 'Chocolate Souffle',
  'dondurma': 'Ice Cream', 'trileçe': 'Tres Leches Cake',
  'san sebastian': 'San Sebastian Cheesecake', 'magnolia': 'Magnolia Pudding',
  'fırında sütlaç': 'Oven-Baked Rice Pudding',
  'türk çayı': 'Turkish Tea', 'çay': 'Tea', 'türk kahvesi': 'Turkish Coffee',
  'kahve': 'Coffee', 'americano': 'Americano', 'latte': 'Latte',
  'cappuccino': 'Cappuccino', 'espresso': 'Espresso', 'mocha': 'Mocha',
  'filtre kahve': 'Filter Coffee', 'sıcak çikolata': 'Hot Chocolate',
  'limonata': 'Lemonade', 'ayran': 'Ayran', 'şalgam': 'Turnip Juice',
  'kola': 'Cola', 'su': 'Water', 'soda': 'Soda', 'gazoz': 'Soda Pop',
  'meyve suyu': 'Fruit Juice', 'portakal suyu': 'Orange Juice',
  'taze sıkılmış portakal suyu': 'Fresh Squeezed Orange Juice',
  'elma suyu': 'Apple Juice', 'vişne suyu': 'Sour Cherry Juice',
  'nar suyu': 'Pomegranate Juice', 'smoothie': 'Smoothie', 'milkshake': 'Milkshake',
  'bira': 'Beer', 'şarap': 'Wine', 'kırmızı şarap': 'Red Wine',
  'beyaz şarap': 'White Wine', 'rakı': 'Raki', 'kokteyl': 'Cocktail',
  'margherita': 'Margherita', 'karışık pizza': 'Mixed Pizza',
  'pepperoni': 'Pepperoni', 'sucuklu pizza': 'Turkish Sausage Pizza',
  'mantarlı pizza': 'Mushroom Pizza', 'vejeteryan pizza': 'Vegetarian Pizza',
  'hamburger': 'Hamburger', 'cheeseburger': 'Cheeseburger',
  'tavuk burger': 'Chicken Burger', 'klasik burger': 'Classic Burger',
  'özel burger': 'Special Burger', 'double burger': 'Double Burger',
  'patates kızartması': 'French Fries', 'soğan halkası': 'Onion Rings',
  'tost': 'Grilled Sandwich', 'karışık tost': 'Mixed Toast', 'kaşarlı tost': 'Cheese Toast',
  'menemen': 'Menemen', 'sahanda yumurta': 'Fried Eggs',
  'omlet': 'Omelet', 'kuymak': 'Kuymak', 'gözleme': 'Gozleme',
  'sigara böreği': 'Cigarette Borek', 'su böreği': 'Water Borek',
  'peynirli börek': 'Cheese Borek', 'kıymalı börek': 'Meat Borek',
  'börek': 'Borek', 'pogaça': 'Pogaca', 'simit': 'Turkish Bagel',
  'humus': 'Hummus', 'babaganuş': 'Baba Ghanoush',
  'haydari': 'Haydari', 'acılı ezme': 'Spicy Paste', 'atom': 'Spicy Dip',
  'patlıcan salatası': 'Eggplant Salad', 'havuç tarator': 'Carrot Tarator',
  'sarma': 'Stuffed Grape Leaves', 'yaprak sarma': 'Stuffed Grape Leaves',
  'dolma': 'Stuffed Vegetables', 'biber dolma': 'Stuffed Peppers',
  'karnıyarık': 'Stuffed Eggplant', 'imam bayıldı': 'Imam Bayildi',
  'pilav': 'Rice Pilaf', 'bulgur pilavı': 'Bulgur Pilaf', 'pirinç pilavı': 'Rice Pilaf',
  'makarna': 'Pasta', 'tavuklu makarna': 'Chicken Pasta', 'bolonez makarna': 'Bolognese Pasta',
  'mantı': 'Turkish Ravioli', 'etli ekmek': 'Meat Flatbread',
  'tantuni': 'Tantuni', 'çiğ köfte': 'Raw Kofte', 'dürüm': 'Wrap',
  'tavuk dürüm': 'Chicken Wrap', 'et dürüm': 'Meat Wrap', 'adana dürüm': 'Adana Wrap',
  'midye dolma': 'Stuffed Mussels', 'midye tava': 'Fried Mussels',
  'kalamari': 'Calamari', 'kalamar': 'Calamari', 'kalamar tava': 'Fried Calamari',
  'levrek': 'Sea Bass', 'çipura': 'Sea Bream', 'somon': 'Salmon',
  'hamsi': 'Anchovies', 'hamsi tava': 'Fried Anchovies', 'balık': 'Fish',
  'balık tava': 'Fried Fish', 'izgara balık': 'Grilled Fish',
  'piliç': 'Chicken', 'tavuk kanat': 'Chicken Wings', 'tavuk but': 'Chicken Thigh',
  'tavuk göğsü': 'Chicken Breast', 'biftek': 'Beef Steak', 'bonfile': 'Tenderloin',
  'antrikot': 'Ribeye', 't-bone': 'T-Bone Steak',
  'kuru fasulye': 'White Bean Stew', 'nohut': 'Chickpea Stew',
  'güveç': 'Stew', 'kuzu güveç': 'Lamb Stew', 'tavuk güveç': 'Chicken Stew',
  'taze fasulye': 'Green Bean Stew', 'bezelye': 'Pea Stew',
  'türlü': 'Mixed Vegetable Stew', 'musakka': 'Moussaka',
  'cordon bleu': 'Cordon Bleu', 'schnitzel': 'Schnitzel',
  'çıtır tavuk': 'Crispy Chicken', 'nugget': 'Nuggets',
  'özenle hazırlanan ana yemeklerimiz': 'Carefully prepared main dishes',
  'en taze malzemeler ile hazırlanan geleneksel lezzetler': 'Traditional flavors prepared with the freshest ingredients',
  'taze ve sağlıklı salatalar': 'Fresh and healthy salads',
  'taş fırında pişen italyan pizzaları': 'Stone-oven baked Italian pizzas',
  'el yapımı tatlılarımız': 'Our homemade desserts',
  'soğuk ve sıcak içecekler': 'Cold and hot beverages',

  // --- Full item descriptions (demo + common) ---
  'el yapımı dana köfte, pilav ve közlenmiş sebze ile': 'Handmade beef meatballs, served with rice and chargrilled vegetables',
  'marine edilmiş tavuk göğsü, özel baharatlar ile': 'Marinated chicken breast with special spices',
  'fırında pişmiş kuzu pirzola, patates püresi ile': 'Oven-baked lamb chops served with mashed potato',
  'köfte, tavuk, kuzu ve adana kebabı tabağı': 'Meatball, chicken, lamb and Adana kebab platter',
  'marul, parmesan, kruton ve sezar sos': 'Lettuce, parmesan, crouton and Caesar dressing',
  'domates, salatalık, biber, soğan ve zeytinyağı': 'Tomato, cucumber, pepper, onion and olive oil',
  'roka, nar, ceviz, keçi peyniri': 'Arugula, pomegranate, walnut, goat cheese',
  'domates sos, mozzarella, fesleğen': 'Tomato sauce, mozzarella, basil',
  'sucuk, sosis, mantar, biber, zeytin, mısır': 'Turkish sausage, sausage, mushroom, pepper, olive, corn',
  'bol pepperoni ve mozzarella peynir': 'Generous pepperoni and mozzarella cheese',
  'antep fıstığı ile geleneksel künefe': 'Traditional kunefe with pistachio',
  'fırında pişmiş türk sütlacı': 'Oven-baked Turkish rice pudding',
  'new york usulü frambuaz soslu': 'New York style with raspberry sauce',
  'geleneksel demlik çay': 'Traditional brewed tea',
  'geleneksel türk kahvesi': 'Traditional Turkish coffee',
  'taze sıkılmış ev yapımı limonata': 'Freshly squeezed homemade lemonade',
  'ev yapımı yoğurttan ayran': 'Homemade yogurt drink',

  // --- More common description patterns ---
  'özel soslu': 'with special sauce', 'özel sos ile': 'with special sauce',
  'patates püresi': 'mashed potato', 'patates püresi ile': 'with mashed potato',
  'közlenmiş sebze': 'chargrilled vegetables', 'közlenmiş sebze ile': 'with chargrilled vegetables',
  'el yapımı dana köfte': 'handmade beef meatballs',
  'marine edilmiş': 'marinated', 'özel baharatlar ile': 'with special spices',
  'özel baharatlar': 'special spices', 'ev yapımı': 'homemade', 'el yapımı': 'handmade',
  'taze sıkılmış': 'freshly squeezed', 'taş fırında': 'stone-oven baked',
  'odun fırında': 'wood-fired', 'mangalda': 'charcoal-grilled',
  'tereyağında': 'in butter', 'zeytinyağlı': 'with olive oil',
  'sos ile': 'with sauce', 'pilav ile': 'with rice', 'ekmek ile': 'with bread',
  'salata ile': 'with salad', 'patates ile': 'with potato',
  'peynir ile': 'with cheese', 'yoğurt ile': 'with yogurt',
  'çikolata soslu': 'with chocolate sauce', 'karamel soslu': 'with caramel sauce',
  'bal ve kaymak ile': 'with honey and cream', 'dondurma ile': 'with ice cream',
  'antep fıstığı': 'pistachio', 'antep fıstıklı': 'with pistachio',
  'cevizli': 'with walnut', 'fındıklı': 'with hazelnut', 'bademli': 'with almond',
  'kremalı': 'creamy', 'sade': 'plain', 'acılı': 'spicy', 'tatlı': 'sweet',
  'usulü': 'style', 'soslu': 'with sauce', 'püresi': 'puree',
  'tabağı': 'platter', 'servis': 'served', 'porsiyon': 'portion',
};

// Word-level translations for building descriptions
const foodWords = {
  // Cooking methods
  'ızgara': 'grilled', 'fırında': 'oven-baked', 'haşlama': 'boiled', 'kızartma': 'fried',
  'közlenmiş': 'chargrilled', 'marine': 'marinated', 'buğulama': 'steamed',
  'pişmiş': 'cooked', 'pişirilmiş': 'cooked', 'kavrulmuş': 'roasted',
  'taze': 'fresh', 'sıkılmış': 'squeezed', 'doğranmış': 'chopped',
  'rendelenmiş': 'grated', 'dilimlenmiş': 'sliced', 'kızartılmış': 'fried',
  'haşlanmış': 'boiled', 'buharda': 'steamed', 'çıtır': 'crispy',
  // Proteins
  'tavuk': 'chicken', 'dana': 'beef', 'kuzu': 'lamb', 'et': 'meat',
  'balık': 'fish', 'karides': 'shrimp', 'somon': 'salmon', 'ton': 'tuna',
  'hindi': 'turkey', 'ördek': 'duck', 'biftek': 'steak', 'sucuk': 'Turkish sausage',
  'pastırma': 'pastrami', 'sosis': 'sausage', 'jambon': 'ham', 'yumurta': 'egg',
  // Dairy
  'peynir': 'cheese', 'peynirli': 'with cheese', 'kaşar': 'kashkaval cheese',
  'kaşarlı': 'with cheese', 'mozzarella': 'mozzarella', 'parmesan': 'parmesan',
  'beyaz peynir': 'white cheese', 'keçi peyniri': 'goat cheese',
  'yoğurt': 'yogurt', 'süt': 'milk', 'krema': 'cream', 'tereyağı': 'butter',
  // Vegetables & Fruits
  'domates': 'tomato', 'salatalık': 'cucumber', 'biber': 'pepper',
  'soğan': 'onion', 'sarımsak': 'garlic', 'patates': 'potato',
  'patlıcan': 'eggplant', 'kabak': 'zucchini', 'havuç': 'carrot',
  'mantar': 'mushroom', 'mısır': 'corn', 'zeytin': 'olive',
  'marul': 'lettuce', 'roka': 'arugula', 'ıspanak': 'spinach',
  'nar': 'pomegranate', 'ceviz': 'walnut', 'fıstık': 'pistachio',
  'fındık': 'hazelnut', 'badem': 'almond', 'limon': 'lemon',
  'portakal': 'orange', 'elma': 'apple', 'çilek': 'strawberry',
  'frambuaz': 'raspberry', 'vişne': 'sour cherry', 'kayısı': 'apricot',
  // Grains & Bread
  'pilav': 'rice', 'bulgur': 'bulgur', 'ekmek': 'bread', 'pide': 'pide',
  'lavaş': 'lavash', 'kruton': 'crouton', 'börek': 'borek',
  // Condiments & Spices
  'sos': 'sauce', 'zeytinyağı': 'olive oil', 'baharat': 'spice',
  'baharatlar': 'spices', 'acı': 'hot/spicy', 'tatlı': 'sweet',
  'tuzlu': 'salty', 'ekşi': 'sour', 'fesleğen': 'basil',
  'nane': 'mint', 'maydanoz': 'parsley', 'dereotu': 'dill',
  'kekik': 'thyme', 'kimyon': 'cumin', 'sumak': 'sumac',
  'acılı': 'spicy', 'sade': 'plain', 'karışık': 'mixed',
  // Descriptors
  'özel': 'special', 'geleneksel': 'traditional', 'ev': 'homemade',
  'ev yapımı': 'homemade', 'el yapımı': 'handmade', 'taze': 'fresh',
  'günlük': 'daily', 'mevsim': 'seasonal', 'organik': 'organic',
  'yerli': 'local', 'ithal': 'imported',
  // Connectors
  'ile': 'with', 've': 'and', 'veya': 'or', 'üzerine': 'topped with',
  'yanında': 'served with', 'içinde': 'in', 'üzerinde': 'on top',
  'altında': 'underneath', 'arasında': 'between',
  // Common description words
  'porsiyon': 'portion', 'kişilik': 'person', 'tabağı': 'plate', 'tabak': 'plate',
  'bol': 'generous', 'az': 'light', 'orta': 'medium', 'büyük': 'large', 'küçük': 'small',
  'antep': 'Antep', 'fıstığı': 'pistachio',
  'püresi': 'puree', 'usulü': 'style', 'soslu': 'with sauce',
  'edilmiş': '', 'pişmiş': 'cooked', 'yapımı': 'made',
  'sebze': 'vegetable', 'sebzeler': 'vegetables', 'malzemeler': 'ingredients',
  'hazırlanan': 'prepared', 'hazırlanmış': 'prepared',
  'lezzetler': 'flavors', 'lezzet': 'flavor',
  'sağlıklı': 'healthy', 'özenle': 'carefully',
  'geleneksel': 'traditional', 'italyan': 'Italian', 'türk': 'Turkish',
  'demlik': 'brewed',
  'yoğurttan': 'from yogurt',
};

function translateFoodText(text) {
  if (!text || typeof text !== 'string') return text;

  // Separate leading emojis
  const emojiRegex = /^([\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\s]+)/u;
  const emojiMatch = text.match(emojiRegex);
  const emoji = emojiMatch ? emojiMatch[1] : '';
  const cleanText = emoji ? text.slice(emoji.length).trim() : text.trim();

  if (!cleanText) return text;

  // 1. Try full phrase match
  const lcFull = cleanText.toLowerCase();
  if (foodPhrases[lcFull]) {
    return emoji + foodPhrases[lcFull];
  }

  // 2. Try multi-word phrase matching (longest match first)
  let result = cleanText;
  let lcResult = result.toLowerCase();
  const phraseKeys = Object.keys(foodPhrases).sort((a, b) => b.length - a.length);
  for (const phrase of phraseKeys) {
    const idx = lcResult.indexOf(phrase);
    if (idx !== -1) {
      const before = result.slice(0, idx);
      const after = result.slice(idx + phrase.length);
      result = before + foodPhrases[phrase] + after;
      lcResult = result.toLowerCase();
    }
  }

  // If phrase matching changed the text, do a final word-by-word pass on remaining Turkish words
  if (result.toLowerCase() !== cleanText.toLowerCase()) {
    const words = result.split(/(\s+|,\s*)/);
    const translated = words.map(word => {
      const stripped = word.replace(/[,.\s]/g, '');
      if (!stripped) return word;
      const lcWord = stripped.toLowerCase();
      // Skip words that are already English (basic check: only translate if found in dictionaries)
      if (foodWords[lcWord]) return word.replace(stripped, foodWords[lcWord]);
      return word;
    });
    const out = translated.join('').replace(/\s{2,}/g, ' ').trim();
    return emoji + out.charAt(0).toUpperCase() + out.slice(1);
  }

  // 3. Word-by-word fallback (nothing matched by phrase)
  const words = cleanText.split(/(\s+|,\s*)/);
  const translated = words.map(word => {
    const stripped = word.replace(/[,.\s]/g, '');
    if (!stripped) return word;
    const lcWord = stripped.toLowerCase();
    if (foodPhrases[lcWord]) return word.replace(stripped, foodPhrases[lcWord]);
    if (foodWords[lcWord]) return word.replace(stripped, foodWords[lcWord]);
    return word;
  });

  const out = translated.join('');
  return emoji + (out.charAt(0).toUpperCase() + out.slice(1));
}

function translateMenuData(data) {
  if (!data) return data;
  const clone = JSON.parse(JSON.stringify(data));

  // Translate restaurant description (not name - that's a brand)
  if (clone.restaurant && clone.restaurant.description) {
    clone.restaurant.description = translateFoodText(clone.restaurant.description);
  }

  // Translate menu categories and items
  if (clone.menu) {
    clone.menu.forEach(cat => {
      if (cat.name) cat.name = translateFoodText(cat.name);
      if (cat.description) cat.description = translateFoodText(cat.description);
      if (cat.items) {
        cat.items.forEach(item => {
          if (item.name) item.name = translateFoodText(item.name);
          if (item.description) item.description = translateFoodText(item.description);
        });
      }
    });
  }

  return clone;
}

// ==================== LIVE TRANSLATION (Google Translate API) ====================

// Per-language cache: { 'en': { 'text': 'translation' }, 'de': { ... } }
let _trCacheAll = JSON.parse(localStorage.getItem('qrmenu_tr_cache_v2') || '{}');

function _getLangCache(lang) {
  if (!_trCacheAll[lang]) _trCacheAll[lang] = {};
  return _trCacheAll[lang];
}

function _saveCache() {
  try { localStorage.setItem('qrmenu_tr_cache_v2', JSON.stringify(_trCacheAll)); } catch {}
}

async function translateTextsViaAPI(texts, targetLang) {
  if (!texts || texts.length === 0) return [];
  const lang = targetLang || getCurrentLang();
  if (lang === 'tr') return texts; // No translation needed for source language
  const cache = _getLangCache(lang);

  // Separate cached vs uncached
  const uncachedIdx = [];
  const uncachedTexts = [];
  texts.forEach((t, i) => {
    if (!cache[t] && t && t.trim()) {
      uncachedIdx.push(i);
      uncachedTexts.push(t);
    }
  });
  if (uncachedTexts.length > 0) {
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: uncachedTexts, from: 'tr', to: lang })
      });
      const data = await res.json();
      if (data.translations) {
        uncachedTexts.forEach((t, i) => {
          cache[t] = data.translations[i];
        });
        _saveCache();
      }
    } catch (e) {
      console.warn('Live translation failed:', e);
    }
  }
  return texts.map(t => cache[t] || t);
}

async function translateMenuDataLive(data, targetLang) {
  if (!data) return data;
  const lang = targetLang || getCurrentLang();
  if (lang === 'tr') return data;
  const clone = JSON.parse(JSON.stringify(data));

  // Collect all texts
  const entries = []; // { text, apply: fn }
  if (clone.restaurant && clone.restaurant.description) {
    entries.push({ text: clone.restaurant.description, apply: v => clone.restaurant.description = v });
  }
  if (clone.menu) {
    clone.menu.forEach(cat => {
      // Separate emoji from category name
      const emojiRegex = /^([\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\s]+)/u;
      const eMatch = (cat.name || '').match(emojiRegex);
      const emoji = eMatch ? eMatch[1] : '';
      const cleanName = emoji ? cat.name.slice(emoji.length).trim() : (cat.name || '');
      if (cleanName) {
        entries.push({ text: cleanName, apply: v => cat.name = emoji + v });
      }
      if (cat.description) {
        entries.push({ text: cat.description, apply: v => cat.description = v });
      }
      if (cat.items) {
        cat.items.forEach(item => {
          if (item.name) entries.push({ text: item.name, apply: v => item.name = v });
          if (item.description) entries.push({ text: item.description, apply: v => item.description = v });
        });
      }
    });
  }

  if (entries.length === 0) return clone;

  const texts = entries.map(e => e.text);
  const translated = await translateTextsViaAPI(texts, lang);
  translated.forEach((v, i) => entries[i].apply(v));

  return clone;
}