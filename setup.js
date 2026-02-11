/**
 * Formattan Sonra Kurulum Scripti
 * Kullanım: npm run setup
 * 
 * Bu script formattan sonra projeyi sıfırdan kurar:
 * 1. .env dosyasını oluşturur (.env.example'dan)
 * 2. Veritabanını geri yükler (backups/ klasöründen)
 * 3. Projeyi başlatmaya hazır hale getirir
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   🍽️  Tadında Menu - Kurulum Sihirbazı   ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');

  // 1. .env dosyası kontrolü/oluşturma
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');

  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      console.log('📝 .env dosyası bulunamadı, .env.example\'dan oluşturuluyor...');
      fs.copyFileSync(envExamplePath, envPath);
      console.log('   ✅ .env dosyası oluşturuldu');
      console.log('   ⚠️  Lütfen .env dosyasındaki değerleri kontrol edin (özellikle DB şifresi ve JWT_SECRET)\n');
    } else {
      console.log('❌ .env.example dosyası bulunamadı!');
      console.log('   Lütfen .env dosyasını manuel olarak oluşturun.\n');
    }
  } else {
    console.log('✅ .env dosyası zaten mevcut\n');
  }

  // 2. MySQL kontrolü
  console.log('🔍 MySQL kontrolü yapılıyor...');
  try {
    execSync('mysql --version', { stdio: 'pipe' });
    console.log('   ✅ MySQL client bulundu\n');
  } catch {
    console.log('   ❌ MySQL client bulunamadı!');
    console.log('   MySQL Server\'ı kurun: https://dev.mysql.com/downloads/installer/');
    console.log('   Kurulumdan sonra bu scripti tekrar çalıştırın.\n');
    rl.close();
    return;
  }

  // 3. Veritabanı geri yükleme
  const backupDir = path.join(__dirname, 'backups');
  const latestBackup = path.join(backupDir, 'tadinda_menu_latest.sql');

  if (fs.existsSync(latestBackup)) {
    const answer = await ask('🗄️  Veritabanı yedeği bulundu. Geri yüklensin mi? (E/h): ');
    if (answer.toLowerCase() !== 'h') {
      console.log('\n🔄 Veritabanı geri yükleniyor...');
      try {
        execSync('node restore-db.js', { stdio: 'inherit', cwd: __dirname });
      } catch {
        console.log('   ⚠️  Geri yükleme sırasında hata oluştu. .env dosyasındaki DB bilgilerini kontrol edin.');
      }
    }
  } else if (fs.existsSync(backupDir)) {
    const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.sql'));
    if (files.length > 0) {
      console.log('📁 Mevcut yedekler:');
      files.forEach(f => console.log(`   - ${f}`));
      console.log(`\n   Geri yüklemek için: npm run restore -- backups/${files[files.length - 1]}\n`);
    } else {
      console.log('ℹ️  Veritabanı yedeği bulunamadı. Sunucu ilk çalışmada tabloları otomatik oluşturacak.\n');
    }
  } else {
    console.log('ℹ️  Veritabanı yedeği bulunamadı. Sunucu ilk çalışmada tabloları otomatik oluşturacak.\n');
  }

  // 4. uploads klasörü kontrolü
  const uploadsDir = path.join(__dirname, 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 uploads klasörü oluşturuldu\n');
  }

  // 5. Özet
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  ✅ Kurulum tamamlandı!');
  console.log('');
  console.log('  Sonraki adımlar:');
  console.log('  1. .env dosyasını kontrol edin');
  console.log('  2. MySQL Server\'ın çalıştığından emin olun');
  console.log('  3. npm start  (sunucuyu başlat)');
  console.log('═══════════════════════════════════════════');
  console.log('');

  rl.close();
}

main().catch(err => {
  console.error('Kurulum hatası:', err);
  rl.close();
  process.exit(1);
});
