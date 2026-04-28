class AuthService {
    constructor(apiService) {
        this.api = apiService;
    }

    async register(userData) {
        try {
            const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
            if (response.token) {
                this.api.setToken(response.token);
                localStorage.setItem('user_info', JSON.stringify(response));
            }
            return response;
        } catch (error) {
            console.error('Registration Error:', error);
            throw error;
        }
    }

    async login(email, password) {
        try {
            const response = await this.api.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
            if (response.token) {
                this.api.setToken(response.token);
                localStorage.setItem('user_info', JSON.stringify(response));
            }
            return response;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    }

    logout() {
        this.api.clearToken();
        localStorage.removeItem('user_info');
        window.location.href = '/frontend/public/login.html';
    }

    getCurrentUser() {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    }

    isAuthenticated() {
        return this.api.isAuthenticated();
    }

    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/frontend/public/login.html';
            return false;
        }
        return true;
    }

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.accountType === 'admin';
    }
}

const authService = new AuthService(apiService);
