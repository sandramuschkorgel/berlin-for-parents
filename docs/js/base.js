// Base functionality for all pages

// Update all dynamic content from CONFIG
document.addEventListener("DOMContentLoaded", function() {
    // Update page title
    if (typeof pageTitle !== 'undefined') {
        document.title = `${pageTitle} - ${CONFIG.APP_NAME}`;
    } else {
        document.title = CONFIG.APP_NAME;
    }
    
    // Update nav logo
    document.getElementById('nav-logo-text').textContent = CONFIG.APP_NAME;
    
    // Update footer with current year and app name
    document.getElementById('footer-text').textContent = 
        `© ${CONFIG.YEAR} ${CONFIG.APP_NAME}. All rights reserved.`;
    
    // Highlight active nav link
    highlightActiveNavLink();
});

function highlightActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Utility function for API calls
async function fetchFromAPI(endpoint) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}
