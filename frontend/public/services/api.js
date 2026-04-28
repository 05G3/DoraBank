const API_BASE_URL = 'https://dora-bank-api.onrender.com/api';

class ApiService {
    constructor() {
        this.baseUrl = API_BASE_URL;
        this.wsUrl = API_CONFIG.WS_URL;
    }

    getHeaders() {
        const token = localStorage.getItem('jwt_token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    async get(endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('GET Error:', error);
            throw error;
        }
    }

    async post(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('POST Error:', error);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('PUT Error:', error);
            throw error;
        }
    }

    async delete(endpoint) {
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('DELETE Error:', error);
            throw error;
        }
    }

    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    setToken(token) {
        localStorage.setItem('jwt_token', token);
    }

    getToken() {
        return localStorage.getItem('jwt_token');
    }

    clearToken() {
        localStorage.removeItem('jwt_token');
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

const apiService = new ApiService();
