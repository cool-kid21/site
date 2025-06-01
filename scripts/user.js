// User Dashboard Functionality

// DOM Elements
const resourcesList = document.getElementById('resourcesList');
const resourceViewer = document.getElementById('resourceViewer');

// Load resources for user
function loadUserResources() {
    if (!resourcesList) return;
    
    const resources = JSON.parse(localStorage.getItem('resources')) || [];
    
    resourcesList.innerHTML = '';
    
    if (resources.length === 0) {
        resourcesList.innerHTML = '<li class="empty">No resources available</li>';
        return;
    }
    
    resources.forEach(resource => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#" class="resource-item" data-id="${resource.id}">
                <span class="resource-icon">${getResourceIcon(resource.type)}</span>
                <span class="resource-title">${resource.title}</span>
            </a>
        `;
        
        resourcesList.appendChild(li);
    });
    
    // Add event listeners to resource items
    document.querySelectorAll('.resource-item').forEach(item => {
        item.addEventListener('click', handleResourceClick);
    });
}

// Get resource icon
function getResourceIcon(type) {
    switch (type) {
        case 'doc': return '📄';
        case 'sheet': return '📊';
        case 'slide': return '📽️';
        default: return '📁';
    }
}

// Handle resource click
function handleResourceClick(e) {
    e.preventDefault();
    const resourceId = e.currentTarget.dataset.id;
    const resources = JSON.parse(localStorage.getItem('resources')) || [];
    const resource = resources.find(r => r.id === resourceId);
    
    if (!resource) return;
    
    // Display resource in viewer
    displayResource(resource);
}

// Display resource
function displayResource(resource) {
    if (!resourceViewer) return;
    
    resourceViewer.innerHTML = `
        <div class="resource-header">
            <h3>${resource.title}</h3>
            <span class="resource-type">${getTypeName(resource.type)}</span>
        </div>
        <div class="iframe-container">
            ${resource.iframeCode}
        </div>
    `;
}

// Get type name
function getTypeName(type) {
    switch (type) {
        case 'doc': return 'Google Doc';
        case 'sheet': return 'Google Sheet';
        case 'slide': return 'Google Slide';
        default: return type;
    }
}

// Initialize user dashboard
function initUserDashboard() {
    loadUserResources();
    
    // Highlight first resource if available
    const firstResource = document.querySelector('.resource-item');
    if (firstResource) {
        firstResource.click();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initUserDashboard);
