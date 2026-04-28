// auth.js - Simplified Authentication Module
const Auth = (function() {
    // Session configuration
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const SESSION_KEY = 'doraBankSession';
    const USERS_KEY = 'doraBankUsers';
    
    // Initialize users array
    if (!localStorage.getItem(USERS_KEY)) {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
    }

    // Main authentication function
    function authenticate(username, password, isAdmin = false) {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY));
            const user = users.find(u => {
                const usernameMatch = u.accountNumber === username || u.email === username;
                const passwordMatch = u.password === password;
                const typeMatch = isAdmin ? u.accountType === 'admin' : u.accountType !== 'admin';
                return usernameMatch && passwordMatch && typeMatch;
            });
            
            if (user) {
                const sessionData = {
                    user: user,
                    timestamp: Date.now(),
                    expiry: Date.now() + SESSION_TIMEOUT
                };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                return user;
            }
            return null;
        } catch (error) {
            console.error("Authentication error:", error);
            return null;
        }
    }

    // Get current user
    function getCurrentUser() {
        try {
            const sessionData = sessionStorage.getItem(SESSION_KEY);
            if (!sessionData) return null;
            
            const session = JSON.parse(sessionData);
            
            // Check session expiry
            if (Date.now() > session.expiry) {
                sessionStorage.removeItem(SESSION_KEY);
                return null;
            }
            
            return session.user;
        } catch (error) {
            console.error("Session error:", error);
            return null;
        }
    }

    // Check authentication
    function checkAuth(requireAdmin = false) {
        const user = getCurrentUser();
        if (!user || (requireAdmin && user.accountType !== 'admin')) {
            sessionStorage.removeItem(SESSION_KEY);
            window.location.href = 'login.html';
            return null;
        }
        return user;
    }

    // Logout function
    function logout() {
        sessionStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
        return false;
    }

    // Add new user
    function addUser(user) {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY));
            users.push(user);
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            return user;
        } catch (error) {
            console.error('Error adding user:', error);
            throw error;
        }
    }

    // Get user by account number
    function getUserByAccount(accountNumber) {
        try {
            const users = JSON.parse(localStorage.getItem(USERS_KEY));
            return users.find(u => u.accountNumber === accountNumber);
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    // Public API
    return {
        authenticate,
        getCurrentUser,
        checkAuth,
        logout,
        addUser,
        getUserByAccount
    };
})();

// Add the validation functions
function validatePassword(password) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

// Export Auth module
window.Auth = Auth;

// Global access functions
window.authenticateUser = Auth.authenticate.bind(Auth);
window.getCurrentUser = Auth.getCurrentUser.bind(Auth);
window.checkAuth = Auth.checkAuth.bind(Auth);
window.logout = Auth.logout.bind(Auth);