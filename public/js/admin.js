// ==================== STATE ====================
let currentUser = null;
let restaurants = [];
let currentRestaurant = null;
let categories = [];
let menuItems = [];

// ==================== RENK PALETLERİ ====================
const COLOR_PALETTES = [
  {
    id: 'fresh-minimal',
    name: '✨ Minimal & Temiz',
    subtitle: 'Modern Restoran & Bistro',
    description: 'Beyaz arka plan, glassmorphism kartları ön plana çıkarır. Evrensel ve sofistike.',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    bg: '#F8FAFC',
    accent: '#A78BFA'
  },
  {
    id: 'warm-earth',
    name: '🍂 Sıcak Toprak',
    subtitle: 'Fine Dining & Gurme Mutfak',
    description: 'Doğal toprak tonları güven ve sıcaklık hissi yaratır.',
    primary: '#B45309',
    secondary: '#78350F',
    bg: '#FFFBEB',
    accent: '#D97706'
  },
  {
    id: 'midnight-gold',
    name: '🌙 Gece & Altın',
    subtitle: 'Steakhouse & Premium Mekanlar',
    description: 'Karanlık arka plan prestij, altın aksanlar lüks hissi verir.',
    primary: '#F59E0B',
    secondary: '#D97706',
    bg: '#0F172A',
    accent: '#FBBF24'
  },
  {
    id: 'ocean-breeze',
    name: '🌊 Okyanus Esintisi',
    subtitle: 'Balık & Deniz Ürünleri',
    description: 'Mavi tonları tazelik ve temizlik algısı yaratır.',
    primary: '#0284C7',
    secondary: '#0369A1',
    bg: '#F0F9FF',
    accent: '#38BDF8'
  },
  {
    id: 'rose-blush',
    name: '🌸 Gül & Pudra',
    subtitle: 'Pastane & Kafe',
    description: 'Yumuşak pembe tonları zarafet ve şıklık yansıtır.',
    primary: '#E11D48',
    secondary: '#BE123C',
    bg: '#FFF1F2',
    accent: '#FB7185'
  },
  {
    id: 'forest-zen',
    name: '🌿 Orman & Zen',
    subtitle: 'Vegan & Organik Restoran',
    description: 'Yeşil tonları sağlık ve doğallık algısı yaratır.',
    primary: '#059669',
    secondary: '#047857',
    bg: '#ECFDF5',
    accent: '#34D399'
  },
  {
    id: 'espresso',
    name: '☕ Espresso',
    subtitle: 'Kafe & Kahveci',
    description: 'Zengin kahve tonları sıcaklık ve konfor verir.',
    primary: '#92400E',
    secondary: '#78350F',
    bg: '#FEF3C7',
    accent: '#B45309'
  },
  {
    id: 'crimson-noir',
    name: '🍷 Şarap & Noir',
    subtitle: 'İtalyan & Akdeniz Mutfağı',
    description: 'Koyu kırmızı tutku, siyah zemin üstünde sofistike duruş.',
    primary: '#DC2626',
    secondary: '#991B1B',
    bg: '#1C1917',
    accent: '#EF4444'
  },
  {
    id: 'sakura',
    name: '🍣 Sakura',
    subtitle: 'Asya & Uzak Doğu Mutfağı',
    description: 'Minimal Japon estetiği, yumuşak ama dikkat çekici.',
    primary: '#DC2626',
    secondary: '#991B1B',
    bg: '#FDF2F8',
    accent: '#F43F5E'
  },
  {
    id: 'neon-night',
    name: '🔮 Neon Gece',
    subtitle: 'Bar & Gece Mekanları',
    description: 'Koyu arka plan üstünde neon renkler, enerjik ve cesur.',
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    bg: '#030712',
    accent: '#A78BFA'
  }
];

let selectedPaletteId = null;
// ==================== HELPERS ====================
async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error');
  return data;
}

function toast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const div = document.createElement('div');
  div.className = `toast px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`;
  div.textContent = message;
  container.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  // Reset logo preview & palette when closing restaurant modal
  if (id === 'addRestaurantModal') {
    const preview = document.getElementById('restLogoPreview');
    if (preview) preview.innerHTML = '🍽️';
    const input = document.getElementById('restLogoInput');
    if (input) input.value = '';
    const tooltip = document.getElementById('paletteTooltip');
    if (tooltip) tooltip.remove();
    selectedPaletteId = null;
  }
  if (id === 'editRestaurantModal') {
    editingRestaurantId = null;
    editLogoChanged = false;
    editLogoRemoved = false;
    const tooltip = document.getElementById('editPaletteTooltip');
    if (tooltip) tooltip.remove();
  }
}

function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}

// Logo preview for restaurant creation
function previewRestLogo(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const preview = document.getElementById('restLogoPreview');
      preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('-translate-x-full');
}

// ==================== AUTH ====================
async function checkAuth() {
  try {
    const data = await api('/api/auth/me');
    currentUser = data.user;
    showDashboard();
  } catch (e) {
    showAuthScreen();
  }
}

function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('dashboardScreen').classList.add('hidden');
  if (window.location.hash === '#register') showRegister();
}

function showDashboard() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('dashboardScreen').classList.remove('hidden');
  
  // Update user info
  document.getElementById('userName').textContent = currentUser.business_name;
  document.getElementById('userPlan').textContent = currentUser.plan === 'pro' ? t('sidebar.pro_plan') : t('sidebar.free_plan');
  document.getElementById('userAvatar').textContent = currentUser.business_name.charAt(0).toUpperCase();
  
  loadRestaurants();
}

function showLogin() {
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
}

function showRegister() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}

async function handleLogin(e) {
  e.preventDefault();
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
      })
    });
    currentUser = data.user;
    toast(t('toast.login_success'));
    showDashboard();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: document.getElementById('regEmail').value,
        password: document.getElementById('regPassword').value,
        business_name: document.getElementById('regBusiness').value,
        phone: document.getElementById('regPhone').value
      })
    });
    currentUser = data.user;
    toast(t('toast.register_success'));
    showDashboard();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function handleLogout() {
  await api('/api/auth/logout', { method: 'POST' });
  currentUser = null;
  showAuthScreen();
}

// ==================== RESTAURANTS ====================
async function loadRestaurants() {
  try {
    const data = await api('/api/restaurants');
    restaurants = data.restaurants;
    renderRestaurantList();
    updateDashboardStats();
    
    if (restaurants.length > 0 && !currentRestaurant) {
      selectRestaurant(restaurants[0]);
    }
  } catch (e) {
    toast(e.message, 'error');
  }
}

function renderRestaurantList() {
  const container = document.getElementById('restaurantList');
  if (restaurants.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 bg-white rounded-2xl p-12 text-center border border-gray-100">
        <div class="text-5xl mb-4">🏪</div>
        <h3 class="text-lg font-bold mb-2">${t('rest.no_restaurants')}</h3>
        <p class="text-gray-500 mb-4">${t('rest.no_restaurants_desc')}</p>
        <button onclick="showAddRestaurantModal()" class="gradient-bg text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition">
          ${t('rest.add')}
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = restaurants.map(r => `
    <div class="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition cursor-pointer ${currentRestaurant?.id === r.id ? 'ring-2 ring-purple-500' : ''}" onclick="selectRestaurant(${JSON.stringify(r).replace(/"/g, '&quot;')})">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl overflow-hidden flex-shrink-0 border border-gray-200 relative group">
            ${r.logo_url ? `<img src="${r.logo_url}" class="w-full h-full object-cover" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div style="display:none" class="w-full h-full items-center justify-center text-2xl">🍽️</div>` : '🍽️'}
            <button onclick="event.stopPropagation(); triggerLogoUpload('${r.id}')" class="absolute inset-0 bg-black/40 text-white text-xs font-medium flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-xl" title="Logo Değiştir">📷</button>
          </div>
          <div>
            <h3 class="font-bold text-lg">${r.name}</h3>
            <p class="text-gray-500 text-sm">${r.description || t('rest.no_desc')}</p>
          </div>
        </div>
        <span class="px-2 py-0.5 text-xs rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
          ${r.is_active ? t('rest.active') : t('rest.inactive')}
        </span>
      </div>
      <div class="flex items-center justify-between text-sm text-gray-500">
        <span>👁️ ${r.view_count} ${t('rest.views')}</span>
        <span>📍 ${r.address || '-'}</span>
      </div>
      <div class="mt-4 flex gap-2">
        <button onclick="event.stopPropagation(); selectRestaurant(${JSON.stringify(r).replace(/"/g, '&quot;')}); showSection('menu-editor')" class="flex-1 text-center py-2 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition">
          ${t('rest.menu_btn')}
        </button>
        <button onclick="event.stopPropagation(); selectRestaurant(${JSON.stringify(r).replace(/"/g, '&quot;')}); showSection('qr-code')" class="flex-1 text-center py-2 bg-blue-50 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition">
          ${t('rest.qr_btn')}
        </button>
        <button onclick="event.stopPropagation(); showEditRestaurantModal('${r.id}')" class="py-2 px-3 bg-gray-50 text-gray-600 rounded-xl text-sm hover:bg-gray-100 transition" title="Ayarlar">
          ⚙️
        </button>
        <button onclick="event.stopPropagation(); deleteRestaurant('${r.id}')" class="py-2 px-3 bg-red-50 text-red-500 rounded-xl text-sm hover:bg-red-100 transition">
          🗑️
        </button>
      </div>
    </div>
  `).join('');

  // Hidden file input for logo upload on existing cards
  if (!document.getElementById('cardLogoInput')) {
    const input = document.createElement('input');
    input.type = 'file';
    input.id = 'cardLogoInput';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.addEventListener('change', handleCardLogoUpload);
    document.body.appendChild(input);
  }
}

function selectRestaurant(restaurant) {
  currentRestaurant = restaurant;
  renderRestaurantList();
  loadMenu();
  loadQR();
  loadAnalytics();
}

function showAddRestaurantModal() {
  showModal('addRestaurantModal');
  renderColorPalettes();
}

function renderColorPalettes() {
  const container = document.getElementById('colorPalettes');
  if (!container) return;
  
  selectedPaletteId = null;
  container.innerHTML = COLOR_PALETTES.map(p => `
    <div id="palette-${p.id}" class="palette-card flex items-center gap-3 p-3 rounded-xl border-2 border-gray-100 cursor-pointer hover:border-purple-300 hover:shadow-sm transition group" onclick="selectPalette('${p.id}')">
      <div class="flex gap-1 flex-shrink-0">
        <div class="w-8 h-8 rounded-lg shadow-inner" style="background:${p.primary}" title="Ana Renk"></div>
        <div class="w-8 h-8 rounded-lg shadow-inner" style="background:${p.secondary}" title="İkincil Renk"></div>
        <div class="w-8 h-8 rounded-lg shadow-inner border border-gray-200" style="background:${p.bg}" title="Arkaplan"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm">${p.name}</div>
        <div class="text-xs text-gray-400">${p.subtitle}</div>
      </div>
      <div class="flex-shrink-0 w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-purple-400 transition flex items-center justify-center palette-check">
      </div>
    </div>
  `).join('');
}

function selectPalette(paletteId) {
  const palette = COLOR_PALETTES.find(p => p.id === paletteId);
  if (!palette) return;

  selectedPaletteId = paletteId;

  // Apply colors to the color inputs
  document.getElementById('restPrimary').value = palette.primary;
  document.getElementById('restSecondary').value = palette.secondary;
  document.getElementById('restBg').value = palette.bg;

  // Update visual selection
  document.querySelectorAll('.palette-card').forEach(card => {
    const isSelected = card.id === `palette-${paletteId}`;
    card.classList.toggle('border-purple-500', isSelected);
    card.classList.toggle('bg-purple-50', isSelected);
    card.classList.toggle('border-gray-100', !isSelected);
    card.classList.toggle('bg-white', !isSelected);
    const check = card.querySelector('.palette-check');
    check.innerHTML = isSelected ? '<div class="w-3 h-3 rounded-full bg-purple-500"></div>' : '';
    check.classList.toggle('border-purple-500', isSelected);
    check.classList.toggle('border-gray-300', !isSelected);
  });

  // Show tooltip with psychology info
  const existing = document.getElementById('paletteTooltip');
  if (existing) existing.remove();
  
  const tooltip = document.createElement('div');
  tooltip.id = 'paletteTooltip';
  tooltip.className = 'mt-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-700 flex items-start gap-2 animate-fadeIn';
  tooltip.innerHTML = `<span class="text-base">💡</span><div><strong>${palette.name}</strong><br>${palette.description}</div>`;
  document.getElementById('colorPalettes').after(tooltip);
}

async function handleAddRestaurant(e) {
  e.preventDefault();
  try {
    const data = await api('/api/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('restName').value,
        description: document.getElementById('restDesc').value,
        address: document.getElementById('restAddress').value,
        phone: document.getElementById('restPhone').value,
        primary_color: document.getElementById('restPrimary').value,
        secondary_color: document.getElementById('restSecondary').value,
        bg_color: document.getElementById('restBg').value
      })
    });

    // Upload logo if selected
    const logoInput = document.getElementById('restLogoInput');
    if (logoInput && logoInput.files && logoInput.files[0] && data.restaurant) {
      const formData = new FormData();
      formData.append('logo', logoInput.files[0]);
      await fetch(`/api/restaurants/${data.restaurant.id}/upload-logo`, {
        method: 'POST',
        body: formData
      });
    }

    closeModal('addRestaurantModal');
    toast(t('toast.restaurant_created'));
    loadRestaurants();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deleteRestaurant(id) {
  if (!confirm(t('rest.delete_confirm'))) return;
  try {
    await api(`/api/restaurants/${id}`, { method: 'DELETE' });
    if (currentRestaurant?.id === id) currentRestaurant = null;
    toast(t('toast.restaurant_deleted'));
    loadRestaurants();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ==================== LOGO UPLOAD ====================
let logoUploadRestaurantId = null;

function triggerLogoUpload(restaurantId) {
  logoUploadRestaurantId = restaurantId;
  const input = document.getElementById('cardLogoInput');
  if (input) {
    input.value = '';
    input.click();
  }
}

async function handleCardLogoUpload(e) {
  if (!logoUploadRestaurantId || !e.target.files || !e.target.files[0]) return;
  
  const formData = new FormData();
  formData.append('logo', e.target.files[0]);

  try {
    const res = await fetch(`/api/restaurants/${logoUploadRestaurantId}/upload-logo`, {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Hata');
    
    toast('Logo yüklendi!');
    loadRestaurants();
  } catch (err) {
    toast(err.message, 'error');
  }
  
  logoUploadRestaurantId = null;
}

// ==================== EDIT RESTAURANT ====================
let editingRestaurantId = null;
let editLogoChanged = false;
let editLogoRemoved = false;

function showEditRestaurantModal(restaurantId) {
  const r = restaurants.find(r => r.id === restaurantId);
  if (!r) return;

  editingRestaurantId = restaurantId;
  editLogoChanged = false;
  editLogoRemoved = false;

  // Fill form fields
  document.getElementById('editRestName').value = r.name || '';
  document.getElementById('editRestDesc').value = r.description || '';
  document.getElementById('editRestAddress').value = r.address || '';
  document.getElementById('editRestPhone').value = r.phone || '';
  document.getElementById('editRestCurrency').value = r.currency || '₺';
  document.getElementById('editRestPrimary').value = r.primary_color || '#e63946';
  document.getElementById('editRestSecondary').value = r.secondary_color || '#1d3557';
  document.getElementById('editRestBg').value = r.bg_color || '#f1faee';

  // Logo preview
  const preview = document.getElementById('editLogoPreview');
  const removeBtn = document.getElementById('editLogoRemoveBtn');
  if (r.logo_url) {
    preview.innerHTML = `<img src="${r.logo_url}" class="w-full h-full object-cover">`;
    removeBtn.classList.remove('hidden');
  } else {
    preview.innerHTML = '🍽️';
    removeBtn.classList.add('hidden');
  }

  // Reset file input
  document.getElementById('editLogoInput').value = '';

  showModal('editRestaurantModal');
  renderEditColorPalettes();
  updateEditColorPreview();

  // Listen for color changes to update preview
  ['editRestPrimary', 'editRestSecondary', 'editRestBg'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateEditColorPreview);
  });
}

function renderEditColorPalettes() {
  const container = document.getElementById('editColorPalettes');
  if (!container) return;

  const currentPrimary = document.getElementById('editRestPrimary').value;
  const currentSecondary = document.getElementById('editRestSecondary').value;
  const currentBg = document.getElementById('editRestBg').value;

  // Detect if current colors match a palette
  const matchedPalette = COLOR_PALETTES.find(p =>
    p.primary.toLowerCase() === currentPrimary.toLowerCase() &&
    p.secondary.toLowerCase() === currentSecondary.toLowerCase() &&
    p.bg.toLowerCase() === currentBg.toLowerCase()
  );

  container.innerHTML = COLOR_PALETTES.map(p => {
    const isSelected = matchedPalette && matchedPalette.id === p.id;
    return `
    <div id="edit-palette-${p.id}" class="edit-palette-card flex items-center gap-3 p-3 rounded-xl border-2 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-100'} cursor-pointer hover:border-purple-300 hover:shadow-sm transition group" onclick="selectEditPalette('${p.id}')">
      <div class="flex gap-1 flex-shrink-0">
        <div class="w-8 h-8 rounded-lg shadow-inner" style="background:${p.primary}" title="Ana Renk"></div>
        <div class="w-8 h-8 rounded-lg shadow-inner" style="background:${p.secondary}" title="İkincil Renk"></div>
        <div class="w-8 h-8 rounded-lg shadow-inner border border-gray-200" style="background:${p.bg}" title="Arkaplan"></div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="font-semibold text-sm">${p.name}</div>
        <div class="text-xs text-gray-400">${p.subtitle}</div>
      </div>
      <div class="flex-shrink-0 w-5 h-5 rounded-full border-2 ${isSelected ? 'border-purple-500' : 'border-gray-300'} group-hover:border-purple-400 transition flex items-center justify-center edit-palette-check">
        ${isSelected ? '<div class="w-3 h-3 rounded-full bg-purple-500"></div>' : ''}
      </div>
    </div>
  `;}).join('');
}

function selectEditPalette(paletteId) {
  const palette = COLOR_PALETTES.find(p => p.id === paletteId);
  if (!palette) return;

  document.getElementById('editRestPrimary').value = palette.primary;
  document.getElementById('editRestSecondary').value = palette.secondary;
  document.getElementById('editRestBg').value = palette.bg;

  // Update visual
  document.querySelectorAll('.edit-palette-card').forEach(card => {
    const isSelected = card.id === `edit-palette-${paletteId}`;
    card.classList.toggle('border-purple-500', isSelected);
    card.classList.toggle('bg-purple-50', isSelected);
    card.classList.toggle('border-gray-100', !isSelected);
    const check = card.querySelector('.edit-palette-check');
    check.innerHTML = isSelected ? '<div class="w-3 h-3 rounded-full bg-purple-500"></div>' : '';
    check.classList.toggle('border-purple-500', isSelected);
    check.classList.toggle('border-gray-300', !isSelected);
  });

  // Tooltip
  const existing = document.getElementById('editPaletteTooltip');
  if (existing) existing.remove();
  const tooltip = document.createElement('div');
  tooltip.id = 'editPaletteTooltip';
  tooltip.className = 'mt-2 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-700 flex items-start gap-2';
  tooltip.innerHTML = `<span class="text-base">💡</span><div><strong>${palette.name}</strong><br>${palette.description}</div>`;
  document.getElementById('editColorPalettes').after(tooltip);

  updateEditColorPreview();
}

function updateEditColorPreview() {
  const primary = document.getElementById('editRestPrimary').value;
  const secondary = document.getElementById('editRestSecondary').value;
  const bg = document.getElementById('editRestBg').value;
  const name = document.getElementById('editRestName').value || 'Restoran Adı';
  const currency = document.getElementById('editRestCurrency').value || '₺';

  // Dark detection (same as menu.html)
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substr(0,2), 16);
  const g = parseInt(hex.substr(2,2), 16);
  const b = parseInt(hex.substr(4,2), 16);
  const isDark = (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;

  const textColor = isDark ? '#FFFFFF' : '#1f2937';
  const textMuted = isDark ? '#d1d5db' : '#6b7280';
  const cardBg = isDark ? 'rgba(255,255,255,0.1)' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.15)' : '#e5e7eb';

  const previewEl = document.getElementById('editColorPreview');
  previewEl.style.backgroundColor = bg;
  previewEl.style.borderColor = cardBorder;

  document.getElementById('editPreviewName').style.color = textColor;
  document.getElementById('editPreviewName').textContent = name;
  document.getElementById('editPreviewDesc').style.color = textMuted;

  const cardEl = document.getElementById('editPreviewCard');
  cardEl.style.backgroundColor = cardBg;
  cardEl.style.border = `1px solid ${cardBorder}`;
  cardEl.querySelector('.text-sm.font-medium').style.color = textColor;
  cardEl.querySelector('.text-xs').style.color = textMuted;

  document.getElementById('editPreviewPrice').style.color = primary;
  document.getElementById('editPreviewPrice').textContent = `${currency}120`;
}

function previewEditLogo(input) {
  if (input.files && input.files[0]) {
    editLogoChanged = true;
    editLogoRemoved = false;
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('editLogoPreview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
      document.getElementById('editLogoRemoveBtn').classList.remove('hidden');
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function removeEditLogo() {
  editLogoRemoved = true;
  editLogoChanged = false;
  document.getElementById('editLogoPreview').innerHTML = '🍽️';
  document.getElementById('editLogoInput').value = '';
  document.getElementById('editLogoRemoveBtn').classList.add('hidden');
}

async function handleEditRestaurant(e) {
  e.preventDefault();
  if (!editingRestaurantId) return;

  try {
    // Update restaurant info
    await api(`/api/restaurants/${editingRestaurantId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: document.getElementById('editRestName').value,
        description: document.getElementById('editRestDesc').value,
        address: document.getElementById('editRestAddress').value,
        phone: document.getElementById('editRestPhone').value,
        currency: document.getElementById('editRestCurrency').value,
        primary_color: document.getElementById('editRestPrimary').value,
        secondary_color: document.getElementById('editRestSecondary').value,
        bg_color: document.getElementById('editRestBg').value
      })
    });

    // Handle logo changes
    if (editLogoChanged) {
      const logoInput = document.getElementById('editLogoInput');
      if (logoInput.files && logoInput.files[0]) {
        const formData = new FormData();
        formData.append('logo', logoInput.files[0]);
        await fetch(`/api/restaurants/${editingRestaurantId}/upload-logo`, {
          method: 'POST',
          body: formData
        });
      }
    } else if (editLogoRemoved) {
      await fetch(`/api/restaurants/${editingRestaurantId}/logo`, { method: 'DELETE' });
    }

    closeModal('editRestaurantModal');
    toast('Restoran güncellendi!');

    // Refresh data
    const updated = restaurants.find(r => r.id === editingRestaurantId);
    if (updated && currentRestaurant?.id === editingRestaurantId) {
      currentRestaurant = null; // force re-select
    }
    await loadRestaurants();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ==================== MENU EDITOR ====================
async function loadMenu() {
  if (!currentRestaurant) return;
  
  document.getElementById('menuRestaurantName').textContent = currentRestaurant.name;
  
  try {
    const [catData, itemData] = await Promise.all([
      api(`/api/restaurants/${currentRestaurant.id}/categories`),
      api(`/api/restaurants/${currentRestaurant.id}/items`)
    ]);
    categories = catData.categories;
    menuItems = itemData.items;
    renderMenu();
    updateCategorySelect();
  } catch (e) {
    toast(e.message, 'error');
  }
}

function renderMenu() {
  const container = document.getElementById('menuContent');
  
  if (categories.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <div class="text-5xl mb-4">📋</div>
        <h3 class="text-lg font-bold mb-2">${t('editor.empty_title')}</h3>
        <p class="text-gray-500 mb-4">${t('editor.empty_desc')}</p>
        <button onclick="showAddCategoryModal()" class="gradient-bg text-white px-6 py-2.5 rounded-xl font-medium hover:opacity-90 transition">
          ${t('editor.first_category')}
        </button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = categories.map(cat => {
    const items = menuItems.filter(i => i.category_id === cat.id);
    return `
      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 class="font-bold text-lg">${cat.name}</h3>
            ${cat.description ? `<p class="text-gray-500 text-sm">${cat.description}</p>` : ''}
          </div>
          <div class="flex gap-2">
            <button onclick="deleteCategory('${cat.id}')" class="text-red-400 hover:text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded-lg transition">🗑️ Sil</button>
          </div>
        </div>
        <div class="divide-y divide-gray-50">
          ${items.length === 0 ? `
            <div class="px-6 py-8 text-center text-gray-400">
              ${t('editor.no_items')}
            </div>
          ` : items.map(item => `
            <div class="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition">
              ${item.image_url ? `<img src="${item.image_url}" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" onerror="this.style.display='none'">` : `<div class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>`}
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium">${item.name}</span>
                  ${item.is_popular ? `<span class="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">${t('editor.popular')}</span>` : ''}
                  ${!item.is_available ? `<span class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">${t('editor.sold_out')}</span>` : ''}
                </div>
                <p class="text-gray-500 text-sm truncate">${item.description || ''}</p>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <span class="font-bold text-lg">${currentRestaurant.currency}${Number(item.price).toFixed(0)}</span>
                <button onclick="toggleItemAvailability('${item.id}', ${item.is_available ? 0 : 1})" class="text-sm px-2 py-1 rounded-lg ${item.is_available ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'} transition">
                  ${item.is_available ? '✅' : '❌'}
                </button>
                <button onclick="deleteItem('${item.id}')" class="text-red-400 hover:text-red-600 text-sm px-2 py-1 hover:bg-red-50 rounded-lg transition">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function updateCategorySelect() {
  const select = document.getElementById('itemCategory');
  select.innerHTML = `<option value="">${t('modal.category_select_ph')}</option>` +
    categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function showAddCategoryModal() {
  if (!currentRestaurant) { toast(t('editor.select_restaurant'), 'error'); return; }
  showModal('addCategoryModal');
}

function showAddItemModal() {
  if (!currentRestaurant) { toast(t('editor.select_restaurant'), 'error'); return; }
  if (categories.length === 0) { toast(t('editor.add_category_first'), 'error'); return; }
  showModal('addItemModal');
}

async function handleAddCategory(e) {
  e.preventDefault();
  try {
    await api(`/api/restaurants/${currentRestaurant.id}/categories`, {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('catName').value,
        description: document.getElementById('catDesc').value
      })
    });
    closeModal('addCategoryModal');
    document.getElementById('catName').value = '';
    document.getElementById('catDesc').value = '';
    toast(t('toast.category_added'));
    loadMenu();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function handleAddItem(e) {
  e.preventDefault();
  try {
    await api(`/api/restaurants/${currentRestaurant.id}/items`, {
      method: 'POST',
      body: JSON.stringify({
        category_id: document.getElementById('itemCategory').value,
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDesc').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        image_url: document.getElementById('itemImage').value,
        is_popular: document.getElementById('itemPopular').checked ? 1 : 0,
        is_available: document.getElementById('itemAvailable').checked ? 1 : 0
      })
    });
    closeModal('addItemModal');
    document.getElementById('itemName').value = '';
    document.getElementById('itemDesc').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemImage').value = '';
    document.getElementById('itemPopular').checked = false;
    document.getElementById('itemAvailable').checked = true;
    toast(t('toast.item_added'));
    loadMenu();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deleteCategory(id) {
  if (!confirm(t('editor.delete_category_confirm'))) return;
  try {
    await api(`/api/categories/${id}`, { method: 'DELETE' });
    toast(t('toast.category_deleted'));
    loadMenu();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function deleteItem(id) {
  if (!confirm(t('editor.delete_item_confirm'))) return;
  try {
    await api(`/api/items/${id}`, { method: 'DELETE' });
    toast(t('toast.item_deleted'));
    loadMenu();
  } catch (e) {
    toast(e.message, 'error');
  }
}

async function toggleItemAvailability(id, newState) {
  try {
    await api(`/api/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ is_available: newState })
    });
    loadMenu();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ==================== QR CODE ====================
async function loadQR() {
  if (!currentRestaurant) return;
  
  try {
    const data = await api(`/api/restaurants/${currentRestaurant.id}/qr`);
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = `
      <h3 class="font-bold text-lg mb-4">${currentRestaurant.name}</h3>
      <img src="${data.qr}" alt="QR Code" class="w-64 h-64 mx-auto" id="qrImage">
    `;
    document.getElementById('qrMenuLink').innerHTML = `
      <a href="${data.url}" target="_blank" class="text-purple-600 hover:underline text-sm">${data.url}</a>
    `;
    document.getElementById('downloadQrBtn').classList.remove('hidden');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function downloadQR() {
  const img = document.getElementById('qrImage');
  if (!img) return;
  const link = document.createElement('a');
  link.download = `qr-menu-${currentRestaurant.slug}.png`;
  link.href = img.src;
  link.click();
}

// ==================== ANALYTICS ====================
async function loadAnalytics() {
  if (!currentRestaurant) return;
  
  try {
    const data = await api(`/api/restaurants/${currentRestaurant.id}/analytics`);
    document.getElementById('analyticsToday').textContent = data.summary.today;
    document.getElementById('analyticsWeek').textContent = data.summary.thisWeek;
    document.getElementById('analyticsMonth').textContent = data.summary.thisMonth;
    document.getElementById('analyticsTotal').textContent = data.summary.total;
    
    // Simple chart - fill all 30 days
    const chartContainer = document.getElementById('analyticsChart');
    const viewsByDay = {};
    data.details.filter(d => d.event_type === 'view').forEach(d => {
      viewsByDay[d.date] = (viewsByDay[d.date] || 0) + d.count;
    });
    
    // Generate last 30 days (including days with 0 views)
    const allDates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      allDates.push(d.toISOString().split('T')[0]);
    }
    
    const allViews = allDates.map(d => viewsByDay[d] || 0);
    const maxViews = Math.max(...allViews, 1);
    const hasData = allViews.some(v => v > 0);
    
    if (!hasData) {
      chartContainer.innerHTML = `<div class="flex-1 text-center text-gray-400 self-center">${t('analytics.no_data')}</div>`;
    } else {
      chartContainer.innerHTML = allDates.map((date, idx) => {
        const views = allViews[idx];
        const heightPct = Math.max((views / maxViews) * 100, 2);
        const showLabel = idx % 5 === 0 || idx === allDates.length - 1;
        const day = date.slice(8);
        const month = date.slice(5, 7);
        return `
          <div class="flex-1 min-w-0 flex flex-col items-center justify-end gap-0.5 group cursor-pointer" title="${date}: ${views} ${t('analytics.views')}">
            <span class="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition">${views}</span>
            <div class="w-full max-w-[14px] mx-auto rounded-t-sm transition-all ${views > 0 ? 'gradient-bg' : 'bg-gray-100'}" style="height: ${heightPct}%"></div>
            ${showLabel ? `<span class="text-[9px] text-gray-400 leading-none mt-0.5">${day}/${month}</span>` : '<span class="text-[9px] leading-none mt-0.5">&nbsp;</span>'}
          </div>
        `;
      }).join('');
    }
  } catch (e) {
    console.error('Analytics error:', e);
  }
}

// ==================== DASHBOARD STATS ====================
function updateDashboardStats() {
  document.getElementById('statRestaurants').textContent = restaurants.length;
  document.getElementById('noRestaurantMsg').style.display = restaurants.length === 0 ? 'block' : 'none';
  
  if (restaurants.length > 0) {
    const totalViews = restaurants.reduce((sum, r) => sum + r.view_count, 0);
    document.getElementById('statViewsTotal').textContent = totalViews;
  }
}

// ==================== NAVIGATION ====================
function showSection(section) {
  document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
  document.getElementById(`section-${section}`).classList.remove('hidden');
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('bg-purple-50', 'text-purple-700');
    if (btn.dataset.section === section) {
      btn.classList.add('bg-purple-50', 'text-purple-700');
    }
  });
  
  // Close mobile sidebar
  document.getElementById('sidebar').classList.add('-translate-x-full');
  
  // Load data
  if (section === 'menu-editor') loadMenu();
  if (section === 'qr-code') loadQR();
  if (section === 'analytics') loadAnalytics();
}

// ==================== DEMO ====================
async function setupDemo() {
  try {
    toast(t('toast.demo_creating'));
    const data = await api('/api/demo/setup', { method: 'POST' });
    toast(data.message);
    loadRestaurants();
  } catch (e) {
    toast(e.message, 'error');
  }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  showSection('dashboard');
});

// Re-render dynamic content on language change
window.addEventListener('languageChanged', () => {
  if (currentUser) {
    document.getElementById('userPlan').textContent = currentUser.plan === 'pro' ? t('sidebar.pro_plan') : t('sidebar.free_plan');
  }
  renderRestaurantList();
  if (currentRestaurant) {
    renderMenu();
    updateCategorySelect();
  }
  updateDashboardStats();
});
