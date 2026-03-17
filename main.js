// Task 1: User Authentication with Cookies
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; Secure`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const authSection = document.getElementById('auth-section');

function updateAuthUI() {
  if (getCookie('authToken')) {
    loginForm.classList.add('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    loginForm.classList.remove('hidden');
    logoutBtn.classList.add('hidden');
  }
}

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  // Set a dummy authToken cookie for 7 days
  setCookie('authToken', 'user123', 7);
  updateAuthUI();
});

logoutBtn.addEventListener('click', function() {
  deleteCookie('authToken');
  updateAuthUI();
});

updateAuthUI();

// Task 2: Theme Preferences with Local Storage
const themeToggle = document.getElementById('theme-toggle');
function applyTheme(theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
}

function loadTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);
}

loadTheme();

themeToggle.addEventListener('click', function() {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
});
