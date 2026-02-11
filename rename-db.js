// One-time script: Copy qrmenu_pro database to tadinda_menu
require('dotenv').config();
const mysql = require('mysql2/promise');

async function renameDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  const oldDb = 'qrmenu_pro';
  const newDb = 'tadinda_menu';

  try {
    // Check if old database exists
    const [dbs] = await conn.query(`SHOW DATABASES LIKE '${oldDb}'`);
    if (dbs.length === 0) {
      console.log(`❌ '${oldDb}' veritabanı bulunamadı. Yeni veritabanı server başlatıldığında otomatik oluşturulacak.`);
      await conn.end();
      return;
    }

    // Check if new database already exists
    const [newDbs] = await conn.query(`SHOW DATABASES LIKE '${newDb}'`);
    if (newDbs.length > 0) {
      console.log(`⚠️ '${newDb}' zaten mevcut. Mevcut veri korunacak.`);
      await conn.end();
      return;
    }

    // Create new database
    await conn.query(`CREATE DATABASE \`${newDb}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ '${newDb}' veritabanı oluşturuldu`);

    // Get all tables from old database
    const [tables] = await conn.query(`SHOW TABLES FROM \`${oldDb}\``);
    const tableNames = tables.map(t => Object.values(t)[0]);

    if (tableNames.length === 0) {
      console.log('📭 Eski veritabanında tablo yok.');
      await conn.end();
      return;
    }

    // Copy structure and data for each table
    // First create all tables without FK, then add data, then we're good since db.js creates tables on start
    for (const table of tableNames) {
      // Get CREATE TABLE statement
      const [createResult] = await conn.query(`SHOW CREATE TABLE \`${oldDb}\`.\`${table}\``);
      let createSql = createResult[0]['Create Table'];
      
      // Remove FK constraints for initial creation (to avoid ordering issues)
      // We'll let db.js handle the proper schema
      
      // Copy table structure
      await conn.query(`CREATE TABLE \`${newDb}\`.\`${table}\` LIKE \`${oldDb}\`.\`${table}\``);
      console.log(`  📋 Tablo kopyalandı: ${table}`);
      
      // Copy data
      await conn.query(`INSERT INTO \`${newDb}\`.\`${table}\` SELECT * FROM \`${oldDb}\`.\`${table}\``);
      const [count] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${newDb}\`.\`${table}\``);
      console.log(`  📦 ${count[0].cnt} kayıt aktarıldı`);
    }

    console.log(`\n🎉 Veritabanı başarıyla '${oldDb}' → '${newDb}' olarak kopyalandı!`);
    console.log(`💡 Eski veritabanı ('${oldDb}') hala duruyor, isterseniz phpMyAdmin'den silebilirsiniz.`);
    
  } catch (err) {
    console.error('❌ Hata:', err.message);
  }

  await conn.end();
}

renameDatabase();
