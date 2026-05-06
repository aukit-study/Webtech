// Authentication utilities
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
        const loginButtons = document.querySelectorAll('.login-btn');
        const logoutButtons = document.querySelectorAll('.logout-btn');
        const userMenus = document.querySelectorAll('.user-menu');

        if (this.isLoggedIn()) {
            // Show logout buttons, hide login buttons
            loginButtons.forEach(btn => btn.style.display = 'none');
            logoutButtons.forEach(btn => btn.style.display = 'block');
            userMenus.forEach(menu => menu.style.display = 'block');
        } else {
            // Show login buttons, hide logout buttons
            loginButtons.forEach(btn => btn.style.display = 'block');
            logoutButtons.forEach(btn => btn.style.display = 'none');
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
    // Login buttons
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    });

    // Logout buttons
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            authManager.logout();
        });
    });
});

// Make it globally available
window.authManager = authManager;