// ==================== SÜPER ADMİN JS ====================

let superToken = localStorage.getItem('super_token') || null;
let allUsers = [];
let allRestaurants = [];
let confirmCallback = null;

// ==================== API ====================

async function superApi(url, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (superToken) headers['x-super-token'] = superToken;
  const res = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (res.status === 401) {
    superToken = null;
    localStorage.removeItem('super_token');
    showLoginScreen();
    throw new Error('Unauthorized');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Hata');
  return data;
}

// ==================== LOGIN / LOGOUT ====================

async function handleSuperLogin(e) {
  e.preventDefault();
  const email = document.getElementById('superEmail').value;
  const password = document.getElementById('superPassword').value;
  const errorEl = document.getElementById('loginError');

  try {
    const data = await fetch('/api/super-admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(r => r.json());

    if (data.token) {
      superToken = data.token;
      localStorage.setItem('super_token', data.token);
      document.getElementById('adminEmail').textContent = email;
      showDashboard();
    } else {
      errorEl.textContent = data.error || 'Giriş başarısız';
      errorEl.classList.remove('hidden');
    }
  } catch (err) {
    errorEl.textContent = 'Bağlantı hatası';
    errorEl.classList.remove('hidden');
  }
}

async function handleSuperLogout() {
  try { await superApi('/api/super-admin/logout', { method: 'POST' }); } catch {}
  superToken = null;
  localStorage.removeItem('super_token');
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').classList.remove('hidden');
  document.getElementById('adminDashboard').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminDashboard').classList.remove('hidden');
  loadOverview();
  loadUsers();
  loadRestaurants();
  showTab('overview');
}

// ==================== TABS ====================

function showTab(tab) {
  document.querySelectorAll('[id^="tab-"]').forEach(el => el.classList.add('hidden'));
  document.getElementById(`tab-${tab}`).classList.remove('hidden');
  
  document.querySelectorAll('.tab-btn').forEach(btn => {
    const isActive = btn.dataset.tab === tab;
    btn.classList.toggle('border-red-600', isActive);
    btn.classList.toggle('text-red-600', isActive);
    btn.classList.toggle('border-transparent', !isActive);
    btn.classList.toggle('text-gray-500', !isActive);
  });
}

// ==================== OVERVIEW ====================

async function loadOverview() {
  try {
    const stats = await superApi('/api/super-admin/stats');
    document.getElementById('statUsers').textContent = stats.totalUsers;
    document.getElementById('statRestaurants').textContent = stats.totalRestaurants;
    document.getElementById('statItems').textContent = stats.totalItems;
    document.getElementById('statViews').textContent = stats.totalViews.toLocaleString();
    document.getElementById('statViewsToday').textContent = stats.viewsToday;
    document.getElementById('statUsersWeek').textContent = stats.usersThisWeek;
    document.getElementById('statUsersMonth').textContent = stats.usersThisMonth;
  } catch (e) {
    console.error('Stats error:', e);
  }
}

// ==================== USERS ====================

async function loadUsers() {
  try {
    const data = await superApi('/api/super-admin/users');
    allUsers = data.users;
    renderUsers(allUsers);
  } catch (e) { console.error('Users error:', e); }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTableBody');
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="px-4 py-8 text-center text-gray-400">Henüz müşteri yok</td></tr>';
    return;
  }
  tbody.innerHTML = users.map(u => {
    const date = new Date(u.created_at).toLocaleDateString('tr-TR');
    const isActive = u.is_active !== 0;
    const planColors = { free: 'bg-gray-100 text-gray-600', starter: 'bg-blue-100 text-blue-700', pro: 'bg-purple-100 text-purple-700', enterprise: 'bg-yellow-100 text-yellow-700' };
    const planLabel = { free: 'Ücretsiz', starter: 'Başlangıç', pro: 'Pro', enterprise: 'Kurumsal' };
    return `
      <tr class="hover:bg-gray-50 transition ${!isActive ? 'opacity-50' : ''}" data-search="${(u.business_name + ' ' + u.email).toLowerCase()}">
        <td class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              ${u.business_name?.charAt(0) || '?'}
            </div>
            <div>
              <div class="font-medium">${u.business_name || '-'}</div>
              ${u.phone ? `<div class="text-xs text-gray-400">${u.phone}</div>` : ''}
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-gray-600">${u.email}</td>
        <td class="px-4 py-3 text-center font-medium">${u.restaurant_count}</td>
        <td class="px-4 py-3 text-center">${u.total_items}</td>
        <td class="px-4 py-3 text-center">${u.total_views.toLocaleString()}</td>
        <td class="px-4 py-3 text-center">
          <select onchange="changePlan('${u.id}', this.value)" class="text-xs font-medium px-2 py-1 rounded-lg border border-gray-200 outline-none cursor-pointer">
            ${['free', 'starter', 'pro', 'enterprise'].map(p => `<option value="${p}" ${u.plan === p ? 'selected' : ''}>${planLabel[p]}</option>`).join('')}
          </select>
        </td>
        <td class="px-4 py-3 text-center">
          <button onclick="toggleUser('${u.id}', ${isActive ? 'false' : 'true'})" 
            class="text-xs font-medium px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'} transition">
            ${isActive ? '✅ Aktif' : '🚫 Pasif'}
          </button>
        </td>
        <td class="px-4 py-3 text-gray-400 text-xs">${date}</td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center gap-1">
            <button onclick="confirmAction('Bu müşteriyi silmek istediğinize emin misiniz? Tüm restoranları ve verileri silinecek.', () => deleteUser('${u.id}'))" 
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Sil">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterUsers() {
  const q = document.getElementById('userSearch').value.toLowerCase().trim();
  const filtered = q ? allUsers.filter(u => (u.business_name + ' ' + u.email).toLowerCase().includes(q)) : allUsers;
  renderUsers(filtered);
}

async function toggleUser(userId, activate) {
  try {
    await superApi(`/api/super-admin/users/${userId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: activate })
    });
    loadUsers();
    loadOverview();
  } catch (e) { alert(e.message); }
}

async function changePlan(userId, plan) {
  try {
    await superApi(`/api/super-admin/users/${userId}/plan`, {
      method: 'PATCH',
      body: JSON.stringify({ plan })
    });
  } catch (e) { alert(e.message); loadUsers(); }
}

async function deleteUser(userId) {
  try {
    await superApi(`/api/super-admin/users/${userId}`, { method: 'DELETE' });
    loadUsers();
    loadRestaurants();
    loadOverview();
  } catch (e) { alert(e.message); }
}

// ==================== RESTAURANTS ====================

async function loadRestaurants() {
  try {
    const data = await superApi('/api/super-admin/restaurants');
    allRestaurants = data.restaurants;
    renderRestaurants(allRestaurants);
  } catch (e) { console.error('Restaurants error:', e); }
}

function renderRestaurants(restaurants) {
  const tbody = document.getElementById('restaurantsTableBody');
  if (restaurants.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-gray-400">Henüz restoran yok</td></tr>';
    return;
  }
  tbody.innerHTML = restaurants.map(r => {
    const date = new Date(r.created_at).toLocaleDateString('tr-TR');
    const isActive = r.is_active === 1;
    return `
      <tr class="hover:bg-gray-50 transition ${!isActive ? 'opacity-50' : ''}" data-search="${(r.name + ' ' + r.owner_email + ' ' + r.slug).toLowerCase()}">
        <td class="px-4 py-3">
          <div>
            <div class="font-medium">${r.name}</div>
            <a href="/m/${r.slug}" target="_blank" class="text-xs text-purple-500 hover:underline">/m/${r.slug}</a>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="text-gray-600 text-xs">${r.owner_email}</div>
          <div class="text-gray-400 text-xs">${r.owner_business}</div>
        </td>
        <td class="px-4 py-3 text-center font-medium">${r.category_count}</td>
        <td class="px-4 py-3 text-center">${r.item_count}</td>
        <td class="px-4 py-3 text-center">${(r.view_count || 0).toLocaleString()}</td>
        <td class="px-4 py-3 text-center">
          <button onclick="toggleRestaurant('${r.id}', ${isActive ? 'false' : 'true'})" 
            class="text-xs font-medium px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700' : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'} transition">
            ${isActive ? '✅ Aktif' : '🚫 Pasif'}
          </button>
        </td>
        <td class="px-4 py-3 text-gray-400 text-xs">${date}</td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center gap-1">
            <a href="/m/${r.slug}" target="_blank" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Menüyü Gör">
              👁️
            </a>
            <button onclick="confirmAction('Bu restoranı silmek istediğinize emin misiniz?', () => deleteRestaurant('${r.id}'))" 
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Sil">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterRestaurants() {
  const q = document.getElementById('restSearch').value.toLowerCase().trim();
  const filtered = q ? allRestaurants.filter(r => (r.name + ' ' + r.owner_email + ' ' + r.slug).toLowerCase().includes(q)) : allRestaurants;
  renderRestaurants(filtered);
}

async function toggleRestaurant(restaurantId, activate) {
  try {
    await superApi(`/api/super-admin/restaurants/${restaurantId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: activate })
    });
    loadRestaurants();
  } catch (e) { alert(e.message); }
}

async function deleteRestaurant(restaurantId) {
  try {
    await superApi(`/api/super-admin/restaurants/${restaurantId}`, { method: 'DELETE' });
    loadRestaurants();
    loadUsers();
    loadOverview();
  } catch (e) { alert(e.message); }
}

// ==================== CONFIRM DIALOG ====================

function confirmAction(text, callback) {
  confirmCallback = callback;
  document.getElementById('confirmText').textContent = text;
  document.getElementById('confirmDialog').classList.remove('hidden');
}

function closeConfirm() {
  document.getElementById('confirmDialog').classList.add('hidden');
  confirmCallback = null;
}

function executeConfirm() {
  if (confirmCallback) confirmCallback();
  closeConfirm();
}

// ==================== INIT ====================

(async function init() {
  if (superToken) {
    try {
      await superApi('/api/super-admin/stats');
      showDashboard();
    } catch {
      showLoginScreen();
    }
  } else {
    showLoginScreen();
  }
})();
