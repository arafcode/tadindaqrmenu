/**
 * MySQL Veritabanı Geri Yükleme Scripti
 * Kullanım: node restore-db.js [dosya_adı]
 * 
 * Parametre verilmezse backups/ klasöründeki "latest" dosyayı kullanır.
 * Örnek: node restore-db.js backups/tadinda_menu_2026-02-11T14-30-00.sql
 */

require('dotenv').config();
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '3306';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'tadinda_menu';

// mysql client yolunu bul (PATH'te yoksa bilinen konumları dene)
function findMysqlClient() {
  try {
    execSync('mysql --version', { stdio: 'pipe' });
    return 'mysql';
  } catch {}

  const knownPaths = [
    'C:\\xampp\\mysql\\bin\\mysql.exe',
    'C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysql.exe',
    'C:\\laragon\\bin\\mysql\\mysql-8.0.30-winx64\\bin\\mysql.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysql.exe',
    'C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysql.exe',
  ];

  for (const p of knownPaths) {
    if (fs.existsSync(p)) return `"${p}"`;
  }

  return null;
}

const mysqlCmd = findMysqlClient();
if (!mysqlCmd) {
  console.error('❌ mysql client bulunamadı! MySQL Server veya XAMPP kurulu olduğundan emin olun.');
  process.exit(1);
}

// Hangi dosyadan geri yüklenecek?
let sqlFile = process.argv[2];

if (!sqlFile) {
  // Parametre yoksa latest dosyayı kullan
  sqlFile = path.join(__dirname, 'backups', `${DB_NAME}_latest.sql`);
}

// Göreceli yol ise mutlak yap
if (!path.isAbsolute(sqlFile)) {
  sqlFile = path.join(__dirname, sqlFile);
}

if (!fs.existsSync(sqlFile)) {
  console.error(`\n❌ SQL dosyası bulunamadı: ${sqlFile}`);
  console.error('   Önce "node backup-db.js" ile yedek alın veya backups/ klasörünü kontrol edin.');
  process.exit(1);
}

const stats = fs.statSync(sqlFile);
const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

console.log(`\n🔄 Veritabanı geri yükleniyor...`);
console.log(`   📄 Dosya: ${path.basename(sqlFile)}`);
console.log(`   📊 Boyut: ${sizeMB} MB`);
console.log(`   🗄️  Hedef: ${DB_NAME}@${DB_HOST}:${DB_PORT}\n`);

// mysql komutu oluştur
let cmd = `${mysqlCmd} --host=${DB_HOST} --port=${DB_PORT} --user=${DB_USER}`;
if (DB_PASSWORD) {
  cmd += ` --password=${DB_PASSWORD}`;
}
cmd += ` --default-character-set=utf8mb4`;
cmd += ` < "${sqlFile}"`;

try {
  execSync(cmd, { stdio: 'inherit', shell: true });
  
  console.log(`\n✅ Geri yükleme başarılı!`);
  console.log(`   Veritabanı "${DB_NAME}" başarıyla yüklendi.`);
  console.log(`\n💡 Artık "npm start" ile sunucuyu başlatabilirsiniz.`);
} catch (error) {
  console.error('\n❌ Geri yükleme başarısız!');
  console.error('   mysql client kurulu ve PATH\'te olduğundan emin olun.');
  console.error('   MySQL Server\'ın çalıştığından emin olun.');
  console.error(`\n   Hata: ${error.message}`);
  process.exit(1);
}
