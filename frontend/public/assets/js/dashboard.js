class DashboardService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getCurrentAccount() {
        try {
            return await this.api.get(API_CONFIG.ENDPOINTS.ACCOUNT.CURRENT);
        } catch (error) {
            console.error('Error fetching account:', error);
            throw error;
        }
    }

    async getUserInfo() {
        try {
            return authService.getCurrentUser();
        } catch (error) {
            console.error('Error fetching user info:', error);
            throw error;
        }
    }

    displayAccountInfo(account) {
        const balanceElement = document.getElementById('balance');
        const accountNumberElement = document.getElementById('accountNumber');
        const accountTypeElement = document.getElementById('accountType');

        if (balanceElement) {
            balanceElement.textContent = `$${account.balance.toFixed(2)}`;
        }
        if (accountNumberElement) {
            accountNumberElement.textContent = account.accountNumber;
        }
        if (accountTypeElement) {
            accountTypeElement.textContent = account.accountType;
        }
    }

    displayUserInfo(user) {
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');

        if (userNameElement) {
            userNameElement.textContent = user.fullName;
        }
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    }

    async initializeDashboard() {
        if (!authService.checkAuth()) return;

        try {
            const [account, user] = await Promise.all([
                this.getCurrentAccount(),
                this.getUserInfo()
            ]);

            this.displayAccountInfo(account);
            this.displayUserInfo(user);
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            alert('Error loading dashboard. Please try again.');
        }
    }
}

const dashboardService = new DashboardService(apiService);

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    dashboardService.initializeDashboard();
});
