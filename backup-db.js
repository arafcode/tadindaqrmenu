/**
 * MySQL Veritabanı Yedekleme Scripti
 * Kullanım: node backup-db.js
 * 
 * Bu script veritabanını SQL dosyası olarak backups/ klasörüne yedekler.
 * GitHub'a push etmeden önce çalıştırın.
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

const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// mysqldump yolunu bul (PATH'te yoksa bilinen konumları dene)
function findMysqldump() {
  // Önce PATH'te var mı kontrol et
  try {
    execSync('mysqldump --version', { stdio: 'pipe' });
    return 'mysqldump';
  } catch {}

  // Bilinen Windows konumları
  const knownPaths = [
    'C:\\xampp\\mysql\\bin\\mysqldump.exe',
    'C:\\wamp64\\bin\\mysql\\mysql8.0.31\\bin\\mysqldump.exe',
    'C:\\laragon\\bin\\mysql\\mysql-8.0.30-winx64\\bin\\mysqldump.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
    'C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe',
    'C:\\Program Files (x86)\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe',
  ];

  for (const p of knownPaths) {
    if (fs.existsSync(p)) return `"${p}"`;
  }

  return null;
}

const mysqldumpCmd = findMysqldump();
if (!mysqldumpCmd) {
  console.error('❌ mysqldump bulunamadı! MySQL Server veya XAMPP kurulu olduğundan emin olun.');
  process.exit(1);
}

// Tarih etiketli dosya adı
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
const filename = `${DB_NAME}_${timestamp}.sql`;
const filepath = path.join(backupDir, filename);

// Ayrıca her zaman "latest" olarak da kaydet (GitHub'da kolay erişim için)
const latestPath = path.join(backupDir, `${DB_NAME}_latest.sql`);

// mysqldump komutu oluştur
let cmd = `${mysqldumpCmd} --host=${DB_HOST} --port=${DB_PORT} --user=${DB_USER}`;
if (DB_PASSWORD) {
  cmd += ` --password=${DB_PASSWORD}`;
}
cmd += ` --databases ${DB_NAME}`;
cmd += ` --add-drop-database --add-drop-table`;
cmd += ` --routines --triggers --events`;
cmd += ` --default-character-set=utf8mb4`;
cmd += ` --result-file="${filepath}"`;

console.log(`\n📦 Veritabanı yedekleniyor: ${DB_NAME}`);
console.log(`📁 Hedef: ${filepath}\n`);

try {
  execSync(cmd, { stdio: 'inherit' });
  
  // latest kopyasını oluştur
  fs.copyFileSync(filepath, latestPath);
  
  const stats = fs.statSync(filepath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  
  console.log(`\n✅ Yedekleme başarılı!`);
  console.log(`   📄 Dosya: ${filename}`);
  console.log(`   📄 Latest: ${DB_NAME}_latest.sql`);
  console.log(`   📊 Boyut: ${sizeMB} MB`);
  console.log(`\n💡 Şimdi git add, commit ve push yapabilirsiniz.`);
} catch (error) {
  console.error('\n❌ Yedekleme başarısız!');
  console.error('   mysqldump kurulu ve PATH\'te olduğundan emin olun.');
  console.error('   MySQL Server\'ın çalıştığından emin olun.');
  console.error(`\n   Hata: ${error.message}`);
  process.exit(1);
}
