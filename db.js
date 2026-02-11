const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// ==================== MYSQL DATABASE ====================

let pool;

async function init() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'tadinda_menu';
  const port = parseInt(process.env.DB_PORT || '3306');

  // Önce veritabanını oluştur
  const conn = await mysql.createConnection({ host, user, password, port });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.end();

  // Connection pool oluştur
  pool = mysql.createPool({
    host, user, password, port,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
  });

  // Tabloları oluştur
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      business_name VARCHAR(255),
      phone VARCHAR(50),
      plan ENUM('free','starter','pro','enterprise') DEFAULT 'free',
      is_active TINYINT(1) DEFAULT 1,
      plan_expires_at DATETIME NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_is_active (is_active)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id VARCHAR(36) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      address TEXT,
      phone VARCHAR(50),
      logo_url TEXT,
      cover_url TEXT,
      primary_color VARCHAR(20) DEFAULT '#e63946',
      secondary_color VARCHAR(20) DEFAULT '#1d3557',
      bg_color VARCHAR(20) DEFAULT '#f1faee',
      currency VARCHAR(10) DEFAULT '₺',
      is_active TINYINT(1) DEFAULT 1,
      slug VARCHAR(255) UNIQUE NOT NULL,
      view_count INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_user_id (user_id),
      INDEX idx_slug (slug),
      INDEX idx_is_active (is_active),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(36) PRIMARY KEY,
      restaurant_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      sort_order INT DEFAULT 0,
      is_active TINYINT(1) DEFAULT 1,
      INDEX idx_restaurant_id (restaurant_id),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id VARCHAR(36) PRIMARY KEY,
      category_id VARCHAR(36) NOT NULL,
      restaurant_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      image_url TEXT,
      is_available TINYINT(1) DEFAULT 1,
      is_popular TINYINT(1) DEFAULT 0,
      sort_order INT DEFAULT 0,
      allergens TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_category_id (category_id),
      INDEX idx_restaurant_id (restaurant_id),
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS analytics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      restaurant_id VARCHAR(36) NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      event_data TEXT,
      ip_address VARCHAR(100),
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_restaurant_event (restaurant_id, event_type),
      INDEX idx_created_at (created_at),
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  console.log('✅ MySQL veritabanı ve tablolar hazır');
  return pool;
}

// ==================== YARDIMCI ====================

function q(sql, params = []) { return pool.query(sql, params); }
function qOne(sql, params = []) { return pool.query(sql, params).then(([rows]) => rows[0] || null); }
function qAll(sql, params = []) { return pool.query(sql, params).then(([rows]) => rows); }

// ==================== KULLANICI FONKSİYONLARI ====================

async function createUser(email, password, businessName, phone) {
  const id = uuidv4();
  const hashedPassword = bcrypt.hashSync(password, 10);
  await q(
    `INSERT INTO users (id, email, password, business_name, phone, plan, is_active) VALUES (?, ?, ?, ?, ?, 'free', 1)`,
    [id, email, hashedPassword, businessName, phone || null]
  );
  return { id, email, business_name: businessName };
}

async function findUserByEmail(email) {
  return qOne('SELECT * FROM users WHERE email = ?', [email]);
}

async function findUserById(id) {
  const user = await qOne('SELECT * FROM users WHERE id = ?', [id]);
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

async function updateUser(id, data) {
  const allowed = ['email', 'business_name', 'phone', 'plan', 'is_active', 'plan_expires_at'];
  const sets = []; const vals = [];
  for (const [key, value] of Object.entries(data)) {
    if (allowed.includes(key)) { sets.push(`\`${key}\` = ?`); vals.push(value); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  await q(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, vals);
}

// ==================== RESTORAN FONKSİYONLARI ====================

async function createRestaurant(userId, data) {
  const id = uuidv4();
  let slug = data.name.toLowerCase()
    .replace(/[çÇ]/g, 'c').replace(/[ğĞ]/g, 'g').replace(/[ıİ]/g, 'i')
    .replace(/[öÖ]/g, 'o').replace(/[şŞ]/g, 's').replace(/[üÜ]/g, 'u')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const existing = await qOne('SELECT id FROM restaurants WHERE slug = ?', [slug]);
  if (existing) slug = slug + '-' + Date.now().toString(36);

  await q(
    `INSERT INTO restaurants (id, user_id, name, description, address, phone, logo_url, cover_url, primary_color, secondary_color, bg_color, currency, is_active, slug, view_count)
     VALUES (?, ?, ?, ?, ?, ?, '', '', ?, ?, ?, ?, 1, ?, 0)`,
    [id, userId, data.name, data.description || '', data.address || '', data.phone || '',
     data.primary_color || '#e63946', data.secondary_color || '#1d3557', data.bg_color || '#f1faee',
     data.currency || '₺', slug]
  );
  return { id, slug };
}

async function getRestaurantsByUser(userId) {
  return qAll('SELECT * FROM restaurants WHERE user_id = ? ORDER BY created_at DESC', [userId]);
}

async function getRestaurantById(id) {
  return qOne('SELECT * FROM restaurants WHERE id = ?', [id]);
}

async function getRestaurantBySlug(slug) {
  const restaurant = await qOne('SELECT * FROM restaurants WHERE slug = ? AND is_active = 1', [slug]);
  if (!restaurant) return null;
  // Sahibi pasifse menüyü gösterme
  const owner = await qOne('SELECT is_active FROM users WHERE id = ?', [restaurant.user_id]);
  if (owner && owner.is_active === 0) return null;
  return restaurant;
}

async function updateRestaurant(id, data) {
  const allowed = ['name', 'description', 'address', 'phone', 'logo_url', 'cover_url', 'primary_color', 'secondary_color', 'bg_color', 'currency', 'is_active'];
  const sets = []; const vals = [];
  for (const [key, value] of Object.entries(data)) {
    if (allowed.includes(key)) { sets.push(`\`${key}\` = ?`); vals.push(value); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  await q(`UPDATE restaurants SET ${sets.join(', ')} WHERE id = ?`, vals);
}

async function deleteRestaurant(id) {
  await q('DELETE FROM restaurants WHERE id = ?', [id]);
}

async function incrementViewCount(restaurantId) {
  await q('UPDATE restaurants SET view_count = view_count + 1 WHERE id = ?', [restaurantId]);
}

// ==================== KATEGORİ FONKSİYONLARI ====================

async function createCategory(restaurantId, name, description) {
  const id = uuidv4();
  const maxRow = await qOne('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM categories WHERE restaurant_id = ?', [restaurantId]);
  const sortOrder = (maxRow?.max_order || 0) + 1;
  await q(
    'INSERT INTO categories (id, restaurant_id, name, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, 1)',
    [id, restaurantId, name, description || '', sortOrder]
  );
  return { id };
}

async function getCategoriesByRestaurant(restaurantId) {
  return qAll('SELECT * FROM categories WHERE restaurant_id = ? ORDER BY sort_order ASC', [restaurantId]);
}

async function updateCategory(id, data) {
  const allowed = ['name', 'description', 'sort_order', 'is_active'];
  const sets = []; const vals = [];
  for (const [key, value] of Object.entries(data)) {
    if (allowed.includes(key)) { sets.push(`\`${key}\` = ?`); vals.push(value); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  await q(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`, vals);
}

async function deleteCategory(id) {
  await q('DELETE FROM categories WHERE id = ?', [id]);
}

// ==================== MENÜ ÖĞESİ FONKSİYONLARI ====================

async function createMenuItem(categoryId, restaurantId, data) {
  const id = uuidv4();
  const maxRow = await qOne('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM menu_items WHERE category_id = ?', [categoryId]);
  const sortOrder = (maxRow?.max_order || 0) + 1;
  await q(
    `INSERT INTO menu_items (id, category_id, restaurant_id, name, description, price, image_url, is_available, is_popular, sort_order, allergens)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, categoryId, restaurantId, data.name, data.description || '', parseFloat(data.price),
     data.image_url || '', data.is_available !== undefined ? data.is_available : 1,
     data.is_popular || 0, sortOrder, data.allergens || '']
  );
  return { id };
}

async function getMenuItemsByRestaurant(restaurantId) {
  return qAll(`
    SELECT mi.*, c.name as category_name, c.sort_order as cat_sort_order
    FROM menu_items mi
    LEFT JOIN categories c ON mi.category_id = c.id
    WHERE mi.restaurant_id = ?
    ORDER BY c.sort_order ASC, mi.sort_order ASC
  `, [restaurantId]);
}

async function getMenuItemsByCategory(categoryId) {
  return qAll('SELECT * FROM menu_items WHERE category_id = ? ORDER BY sort_order ASC', [categoryId]);
}

async function updateMenuItem(id, data) {
  const allowed = ['name', 'description', 'price', 'image_url', 'is_available', 'is_popular', 'sort_order', 'allergens', 'category_id'];
  const sets = []; const vals = [];
  for (const [key, value] of Object.entries(data)) {
    if (allowed.includes(key)) { sets.push(`\`${key}\` = ?`); vals.push(key === 'price' ? parseFloat(value) : value); }
  }
  if (sets.length === 0) return;
  vals.push(id);
  await q(`UPDATE menu_items SET ${sets.join(', ')} WHERE id = ?`, vals);
}

async function deleteMenuItem(id) {
  await q('DELETE FROM menu_items WHERE id = ?', [id]);
}

// ==================== ANALİTİK FONKSİYONLARI ====================

async function logAnalytics(restaurantId, eventType, eventData, ip, userAgent) {
  await q(
    'INSERT INTO analytics (restaurant_id, event_type, event_data, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
    [restaurantId, eventType, eventData || '', ip || '', userAgent || '']
  );
}

async function getAnalytics(restaurantId, days = 30) {
  return qAll(`
    SELECT event_type, DATE(created_at) as date, COUNT(*) as count
    FROM analytics
    WHERE restaurant_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
    GROUP BY event_type, DATE(created_at)
    ORDER BY date DESC
  `, [restaurantId, days]);
}

async function getAnalyticsSummary(restaurantId) {
  const row = await qOne(`
    SELECT
      COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END), 0) as today,
      COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END), 0) as thisWeek,
      COALESCE(SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END), 0) as thisMonth,
      COUNT(*) as total
    FROM analytics
    WHERE restaurant_id = ? AND event_type = 'view'
  `, [restaurantId]);
  return row || { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
}

// ==================== SÜPER ADMİN FONKSİYONLARI ====================

async function getAllUsers() {
  return qAll(`
    SELECT u.id, u.email, u.business_name, u.phone, u.plan, u.is_active, u.plan_expires_at,
           u.created_at, u.updated_at,
           COUNT(DISTINCT r.id) as restaurant_count,
           COALESCE(SUM(r.view_count), 0) as total_views,
           (SELECT COUNT(*) FROM menu_items mi
            INNER JOIN restaurants r2 ON mi.restaurant_id = r2.id
            WHERE r2.user_id = u.id) as total_items
    FROM users u
    LEFT JOIN restaurants r ON r.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `);
}

async function getAllRestaurants() {
  return qAll(`
    SELECT r.*, u.email as owner_email, u.business_name as owner_business,
           (SELECT COUNT(*) FROM categories c WHERE c.restaurant_id = r.id) as category_count,
           (SELECT COUNT(*) FROM menu_items mi WHERE mi.restaurant_id = r.id) as item_count
    FROM restaurants r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `);
}

async function toggleUserActive(userId, isActive) {
  const val = isActive ? 1 : 0;
  const [result] = await q('UPDATE users SET is_active = ? WHERE id = ?', [val, userId]);
  if (result.affectedRows === 0) return false;
  await q('UPDATE restaurants SET is_active = ? WHERE user_id = ?', [val, userId]);
  return true;
}

async function deleteUser(userId) {
  const [result] = await q('DELETE FROM users WHERE id = ?', [userId]);
  return result.affectedRows > 0;
}

async function getSystemStats() {
  const stats = await qOne(`
    SELECT
      (SELECT COUNT(*) FROM users) as totalUsers,
      (SELECT COUNT(*) FROM restaurants) as totalRestaurants,
      (SELECT COUNT(*) FROM menu_items) as totalItems,
      (SELECT COUNT(*) FROM categories) as totalCategories,
      (SELECT COUNT(*) FROM analytics WHERE event_type = 'view') as totalViews,
      (SELECT COUNT(*) FROM analytics WHERE event_type = 'view' AND DATE(created_at) = CURDATE()) as viewsToday,
      (SELECT COUNT(*) FROM analytics WHERE event_type = 'view' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as viewsThisWeek,
      (SELECT COUNT(*) FROM analytics WHERE event_type = 'view' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as viewsThisMonth,
      (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)) as usersThisWeek,
      (SELECT COUNT(*) FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as usersThisMonth
  `);
  return stats;
}

async function updateUserPlan(userId, plan) {
  const [result] = await q('UPDATE users SET plan = ? WHERE id = ?', [plan, userId]);
  return result.affectedRows > 0;
}

// ==================== TAM MENÜ VERİSİ ====================

async function getFullMenu(restaurantId) {
  const restaurant = await getRestaurantById(restaurantId);
  if (!restaurant) return null;
  const categories = await qAll('SELECT * FROM categories WHERE restaurant_id = ? AND is_active = 1 ORDER BY sort_order ASC', [restaurantId]);
  const items = await qAll('SELECT * FROM menu_items WHERE restaurant_id = ? AND is_available = 1 ORDER BY sort_order ASC', [restaurantId]);

  const menu = categories.map(cat => ({
    ...cat,
    items: items.filter(item => item.category_id === cat.id)
  }));

  return { restaurant, menu };
}

// ==================== EXPORT ====================

module.exports = {
  init,
  createUser, findUserByEmail, findUserById, updateUser,
  createRestaurant, getRestaurantsByUser, getRestaurantById, getRestaurantBySlug,
  updateRestaurant, deleteRestaurant, incrementViewCount,
  createCategory, getCategoriesByRestaurant, updateCategory, deleteCategory,
  createMenuItem, getMenuItemsByRestaurant, getMenuItemsByCategory, updateMenuItem, deleteMenuItem,
  logAnalytics, getAnalytics, getAnalyticsSummary,
  getFullMenu,
  getAllUsers, getAllRestaurants, toggleUserActive, deleteUser, getSystemStats, updateUserPlan
};
