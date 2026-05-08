// Authentication utilities
// Global utility for Toast Notifications
window.showNotification = function(message, type = 'success') {
    // Create a beautiful custom toast notification
    const notification = document.createElement('div');
    notification.className = `custom-toast ${type}`;

    const icon = type === 'success' ? 'bi-check-circle-fill' : 'bi-info-circle-fill';

    notification.innerHTML = `
        <i class="bi ${icon} custom-toast-icon ${type}"></i>
        <span style="flex-grow: 1;">${message}</span>
        <button type="button" class="custom-toast-close" onclick="this.parentElement.classList.remove('show'); setTimeout(()=>this.parentElement.remove(), 400);">
            <i class="bi bi-x-lg"></i>
        </button>
    `;

    document.body.appendChild(notification);

    // Trigger animation
    requestAnimationFrame(() => {
        notification.classList.add('show');
    });

    // Remove after 3.5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) notification.remove();
            }, 400); // Wait for transition
        }
    }, 3500);
};

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('userToken');
        this.user = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.updateUI();
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.token;
    }

    // Get stored token
    getToken() {
        return this.token;
    }

    // Login user
    login(token) {
        this.token = token;
        localStorage.setItem('userToken', token);
        this.updateUI();
    }

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('userToken');
        this.updateUI();
        // Redirect to home page
        window.location.href = 'index.html';
    }

    // Check authentication status with server
    async checkAuthStatus() {
        if (!this.token) return false;

        try {
            const response = await fetch('http://localhost:3000/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.user = data.user;
                return true;
            } else {
                // Token invalid, logout
                this.logout();
                return false;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }

    // Update UI based on auth status
    updateUI() {
        const authButtons = document.querySelectorAll('.auth-btn');
        const userMenus = document.querySelectorAll('.user-menu');

        if (this.isLoggedIn()) {
            authButtons.forEach(btn => {
                btn.textContent = 'Logout';
                if (btn.tagName === 'BUTTON') {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                }
            });
            userMenus.forEach(menu => menu.style.display = 'block');
        } else {
            authButtons.forEach(btn => {
                btn.textContent = 'Login';
                if (btn.tagName === 'BUTTON') {
                    btn.classList.add('btn-outline-primary');
                    btn.classList.remove('btn-primary');
                }
            });
            userMenus.forEach(menu => menu.style.display = 'none');
        }
    }

    // Get current user info
    getUser() {
        return this.user;
    }
}

// Global auth manager instance
const authManager = new AuthManager();

// Add event listeners for login/logout buttons
document.addEventListener('DOMContentLoaded', () => {
    // Auth buttons (Login/Logout)
    const authButtons = document.querySelectorAll('.auth-btn');
    authButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (authManager.isLoggedIn()) {
                authManager.logout();
            } else {
                window.location.href = 'login.html';
            }
        });
    });
});

// Make it globally available
window.authManager = authManager;