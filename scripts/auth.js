// Authentication System
const ADMIN_CODE = "STUDYADMIN2023"; // Change this to your preferred code

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');

// Login Handler
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = user.isAdmin ? 'admin.html' : 'dashboard.html';
    } else {
        document.getElementById('loginError').textContent = 'Invalid credentials';
    }
}

// Registration Handler
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const isAdmin = document.getElementById('isAdmin')?.checked || false;
    const adminCode = document.getElementById('adminCode')?.value || '';
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (isAdmin && adminCode !== ADMIN_CODE) {
        showError('Invalid admin code');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.email === email)) {
        showError('Email already registered');
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        isAdmin,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    window.location.href = isAdmin ? 'admin.html' : 'dashboard.html';
}

// Helper Functions
function showError(message) {
    const errorEl = document.getElementById('registerError') || document.getElementById('loginError');
    if (errorEl) errorEl.textContent = message;
}

// Initialize
if (loginForm) loginForm.addEventListener('submit', handleLogin);
if (registerForm) registerForm.addEventListener('submit', handleRegister);
if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Check auth state on page load
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authPages = ['login.html', 'register.html'];
    const protectedPages = ['dashboard.html', 'admin.html'];
    
    if (!currentUser && protectedPages.some(page => window.location.pathname.includes(page))) {
        window.location.href = 'login.html';
    }
    
    if (currentUser && authPages.some(page => window.location.pathname.includes(page))) {
        window.location.href = currentUser.isAdmin ? 'admin.html' : 'dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);
