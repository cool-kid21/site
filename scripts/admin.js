// Handle edit user
function handleEditUser(e) {
    const userId = e.target.dataset.id;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.id === userId);
    
    if (!user) return;
    
    // In a real app, you would show a modal or form to edit the user
    const newRole = confirm(`Make ${user.name} ${user.isAdmin ? 'a regular user' : 'an admin'}?`);
    
    if (newRole !== null) {
        user.isAdmin = !user.isAdmin;
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
    }
}

// Handle delete user
function handleDeleteUser(e) {
    const userId = e.target.dataset.id;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Prevent deleting self
    if (currentUser && currentUser.id === userId) {
        alert('You cannot delete your own account while logged in');
        return;
    }
    
    if (confirm('Are you sure you want to delete this user?')) {
        const updatedUsers = users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        loadUsers();
    }
}

// Tab navigation for admin dashboard
function setupAdminTabs() {
    const tabs = document.querySelectorAll('.admin-sidebar a');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active tab
            tabs.forEach(t => t.parentElement.classList.remove('active'));
            tab.parentElement.classList.add('active');
            
            // Show corresponding section
            const target = tab.getAttribute('href').substring(1);
            document.querySelectorAll('.admin-content > div').forEach(section => {
                section.style.display = 'none';
            });
            
            if (target === 'resources') {
                document.querySelector('.resource-management').style.display = 'block';
            } else if (target === 'users') {
                document.getElementById('userManagementSection').style.display = 'block';
                loadUsers();
            } else if (target === 'settings') {
                // Would show settings section in a real app
                document.getElementById('userManagementSection').style.display = 'block';
            }
        });
    });
}

// Initialize admin dashboard
function initAdminDashboard() {
    loadResources();
    setupAdminTabs();
    
    // Show resources by default
    document.querySelector('.resource-management').style.display = 'block';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminDashboard);
