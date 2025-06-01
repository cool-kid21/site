// Authentication System using localStorage

// DOM Elements
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const logoutBtn = document.getElementById('logoutBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const userName = document.getElementById('userName');
const userInitials = document.getElementById('userInitials');
const isAdminCheckbox = document.getElementById('isAdmin');
const adminCodeInput = document.getElementById('adminCode');

// Check if elements exist before adding event listeners
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
    if (isAdminCheckbox) {
        isAdminCheckbox.addEventListener('change', toggleAdminCode);
    }
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
}

// Toggle admin code input
function toggleAdminCode() {
    if (isAdminCheckbox.checked) {
        adminCodeInput.style.display = 'block';
        adminCodeInput.required = true;
    } else {
        adminCodeInput.style.display = 'none';
        adminCodeInput.required = false;
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Set current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on role
        if (user.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } else {
        document.getElementById('loginError').textContent = 'Invalid email or password';
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const isAdmin = isAdminCheckbox ? isAdminCheckbox.checked : false;
    const adminCode = adminCodeInput ? adminCodeInput.value : '';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        document.getElementById('registerError').textContent = 'Passwords do not match';
        return;
    }
    
    // Validate admin code if registering as admin
    if (isAdmin && adminCode !== 'ADMIN123') { // Simple admin code for demo
        document.getElementById('registerError').textContent = 'Invalid admin code';
        return;
    }
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        document.getElementById('registerError').textContent = 'Email already registered';
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Note: In a real app, never store plain text passwords
        isAdmin,
        createdAt: new Date().toISOString()
    };
    
    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Set as current user and redirect
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    if (newUser.isAdmin) {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'dashboard.html';
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check authentication on page load
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Redirect to login if not authenticated
    if (!currentUser && (window.location.pathname.includes('dashboard.html') || 
                         window.location.pathname.includes('admin.html'))) {
        window.location.href = 'login.html';
    }
    
    // Redirect to dashboard if already authenticated
    if (currentUser && (window.location.pathname.includes('login.html') || 
                        window.location.pathname.includes('register.html'))) {
        if (currentUser.isAdmin) {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
    
    // Display user info if on dashboard or admin page
    if (currentUser && (userName || userInitials)) {
        if (userName) userName.textContent = currentUser.name;
        if (userInitials) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('');
            userInitials.textContent = initials;
        }
    }
}

// Initialize auth check
document.addEventListener('DOMContentLoaded', checkAuth);
