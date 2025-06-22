// auth.js - Fixed Authentication Module
const Auth = (function() {
    // Session configuration
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const SESSION_KEY = 'doraBankSession';
    // Initialize users from localStorage
    let users = [];
    try {
        users = JSON.parse(localStorage.getItem('doraBankUsers')) || [];
    } catch (error) {
        console.error('Error parsing localStorage data:', error);
        users = [];
    }
    // Main authentication function
    function authenticate(username, password, isAdmin = false) {
        try {
            console.log('Auth.authenticate called with:', { username, password, isAdmin });
            
            // Verify database is initialized
            if (!localStorage.getItem('doraBankUsers')) {
                console.error("User database not initialized!");
                return null;
            }

            const users = JSON.parse(localStorage.getItem('doraBankUsers'));
            console.log('Available users:', users);
            
            const user = users.find(u => {
                const usernameMatch = u.accountNumber === username || u.email === username;
                const passwordMatch = u.password === password;
                const typeMatch = isAdmin ? u.accountType === 'admin' : u.accountType !== 'admin';
                
                console.log('Checking user:', u.accountNumber, {
                    usernameMatch,
                    passwordMatch,
                    typeMatch,
                    userType: u.accountType,
                    expectedType: isAdmin ? 'admin' : 'not admin'
                });
                
                return usernameMatch && passwordMatch && typeMatch;
            });
            
            console.log('Found user:', user);
            
            if (user) {
                const sessionData = {
                    user: user,
                    timestamp: Date.now(),
                    expiry: Date.now() + SESSION_TIMEOUT
                };
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                console.log('Session created:', sessionData);
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

    // Public API
    return {
        authenticate,
        getCurrentUser,
        checkAuth,
        logout
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

// Global access functions - make sure these are available immediately
window.authenticateUser = function(username, password, isAdmin) {
    console.log('Global authenticateUser called:', { username, password, isAdmin });
    return Auth.authenticate(username, password, isAdmin);
};

window.getCurrentUser = function() {
    console.log('Global getCurrentUser called');
    return Auth.getCurrentUser();
};

window.checkAuth = function(requireAdmin) {
    console.log('Global checkAuth called:', requireAdmin);
    return Auth.checkAuth(requireAdmin);
};

window.logout = function() {
    console.log('Global logout called');
    return Auth.logout();
};

console.log('Auth.js loaded, global functions set up');