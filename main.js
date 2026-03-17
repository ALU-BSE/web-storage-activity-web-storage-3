// ─── TASK 4 HELPER: CSRF token generator ────────────────────────────────────
function generateCSRF() {
  return Math.random().toString(36).substr(2);
}

// Inject CSRF tokens into both forms on load
document.getElementById('csrf-login').value    = generateCSRF();
document.getElementById('csrf-security').value = generateCSRF();


// ─── TASK 1: Authentication with Cookies ────────────────────────────────────
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // Note: HttpOnly can only be set server-side; Secure works on HTTPS
  document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure; SameSite=Strict`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').find(r => r.startsWith(name + '='))?.split('=')[1];
}

const loginForm      = document.getElementById('login-form');
const loggedInView   = document.getElementById('logged-in-view');
const welcomeMsg     = document.getElementById('welcome-msg');
const logoutBtn      = document.getElementById('logout-btn');

function updateAuthUI() {
  const token = getCookie('authToken');
  if (token) {
    loginForm.classList.add('hidden');
    loggedInView.classList.remove('hidden');
    const saved = JSON.parse(localStorage.getItem('settings') || '{}');
    welcomeMsg.textContent = `Welcome back, ${saved.username || 'User'}! 👋`;
  } else {
    loginForm.classList.remove('hidden');
    loggedInView.classList.add('hidden');
  }
}

loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  setCookie('authToken', 'user123', 7);
  // Persist username in settings object (Task 2 challenge)
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
  settings.username = username;
  localStorage.setItem('settings', JSON.stringify(settings));
  updateAuthUI();
});

logoutBtn.addEventListener('click', function () {
  deleteCookie('authToken');
  updateAuthUI();
});

updateAuthUI();


// ─── TASK 2: Theme + Settings with Local Storage (JSON challenge) ────────────
const themeToggle   = document.getElementById('theme-toggle');
const fontRange     = document.getElementById('font-size-range');
const fontLabel     = document.getElementById('font-size-label');
const saveSettings  = document.getElementById('save-settings');
const settingsStatus = document.getElementById('settings-status');

function applySettings(settings) {
  // Apply theme
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(settings.theme || 'light');
  themeToggle.textContent = settings.theme === 'dark' ? '☀️ Toggle Theme' : '🌙 Toggle Theme';

  // Apply font size
  const size = settings.fontSize || 16;
  document.body.style.fontSize = size + 'px';
  fontRange.value   = size;
  fontLabel.textContent = size;
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    applySettings(settings);
  } catch (e) {
    localStorage.removeItem('settings'); // corrupted data — reset
  }
}

loadSettings();

themeToggle.addEventListener('click', function () {
  const current  = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
  settings.theme = newTheme;
  localStorage.setItem('settings', JSON.stringify(settings));
  applySettings(settings);
});

fontRange.addEventListener('input', function () {
  fontLabel.textContent = this.value;
  document.body.style.fontSize = this.value + 'px';
});

saveSettings.addEventListener('click', function () {
  try {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    settings.fontSize = parseInt(fontRange.value);
    localStorage.setItem('settings', JSON.stringify(settings));
    settingsStatus.textContent = '✅ Settings saved!';
    settingsStatus.classList.remove('error');
  } catch (e) {
    // Handle storage quota exceeded
    settingsStatus.textContent = '❌ Storage full — could not save.';
    settingsStatus.classList.add('error');
  }
  setTimeout(() => { settingsStatus.textContent = ''; }, 2500);
});


// ─── TASK 3: Shopping Cart with Session Storage ──────────────────────────────
function getCart() {
  return JSON.parse(sessionStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart      = getCart();
  const cartList  = document.getElementById('cart-list');
  const cartEmpty = document.getElementById('cart-empty');

  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartEmpty.classList.remove('hidden');
    return;
  }

  cartEmpty.classList.add('hidden');
  cart.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.product} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <button class="btn-danger" style="padding:.3rem .7rem;font-size:.8rem;" data-index="${index}">✕</button>
    `;
    li.querySelector('button').addEventListener('click', function () {
      const c = getCart();
      c.splice(index, 1);
      saveCart(c);
      renderCart();
    });
    cartList.appendChild(li);
  });
}

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', function () {
    const product = this.dataset.product;
    const price   = parseFloat(this.dataset.price);
    const cart    = getCart();
    const existing = cart.find(i => i.product === product);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, price, quantity: 1 });
    }
    saveCart(cart);
    renderCart();
  });
});

document.getElementById('clear-cart').addEventListener('click', function () {
  sessionStorage.removeItem('cart');
  renderCart();
});

renderCart();


// ─── TASK 4: Security — XSS Sanitization + CSRF ─────────────────────────────
const securityForm     = document.getElementById('security-form');
const sanitizedOutput  = document.getElementById('sanitized-output');

securityForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const rawInput    = document.getElementById('user-input').value;
  const csrfToken   = document.getElementById('csrf-security').value;

  // Sanitize: encode dangerous characters to prevent XSS
  const sanitized = encodeURIComponent(rawInput);

  sanitizedOutput.classList.remove('hidden');
  sanitizedOutput.innerHTML = `
    <strong>Raw input:</strong> ${escapeHTML(rawInput)}<br/>
    <strong>Sanitized (encoded):</strong> ${sanitized}<br/>
    <strong>CSRF Token:</strong> ${csrfToken}
  `;

  // Rotate CSRF token after each submission
  document.getElementById('csrf-security').value = generateCSRF();
});

// Escape HTML to safely display raw input without executing it
function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}
