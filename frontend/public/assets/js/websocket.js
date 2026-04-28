class WebSocketService {
    constructor() {
        this.socket = null;
        this.stompClient = null;
        this.connected = false;
        this.subscriptions = [];
    }

    connect() {
        if (this.connected) return;

        const token = apiService.getToken();
        if (!token) {
            console.error('No JWT token found for WebSocket connection');
            return;
        }

        const socket = new SockJS(API_CONFIG.WS_URL);
        this.stompClient = Stomp.over(socket);

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        this.stompClient.connect(headers, () => {
            console.log('WebSocket connected');
            this.connected = true;
            this.onConnect();
        }, (error) => {
            console.error('WebSocket connection error:', error);
            this.connected = false;
        });
    }

    disconnect() {
        if (this.stompClient && this.connected) {
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions = [];
            this.stompClient.disconnect();
            this.connected = false;
            console.log('WebSocket disconnected');
        }
    }

    onConnect() {
        // Subscribe to transaction updates
        const accountNumber = authService.getCurrentUser()?.accountNumber;
        if (accountNumber) {
            this.subscribeToTransactions(accountNumber);
            this.subscribeToBalance(accountNumber);
        }
    }

    subscribeToTransactions(accountNumber) {
        const subscription = this.stompClient.subscribe(
            `/topic/transactions/${accountNumber}`,
            (message) => {
                const transaction = JSON.parse(message.body);
                this.onTransactionUpdate(transaction);
            }
        );
        this.subscriptions.push(subscription);
    }

    subscribeToBalance(accountNumber) {
        const subscription = this.stompClient.subscribe(
            `/topic/balance/${accountNumber}`,
            (message) => {
                const account = JSON.parse(message.body);
                this.onBalanceUpdate(account);
            }
        );
        this.subscriptions.push(subscription);
    }

    onTransactionUpdate(transaction) {
        console.log('Transaction update received:', transaction);
        // Refresh transactions list
        if (typeof transactionService !== 'undefined') {
            transactionService.loadTransactions();
        }
        // Show notification
        this.showNotification(`Transaction: ${transaction.type} of $${transaction.amount}`);
    }

    onBalanceUpdate(account) {
        console.log('Balance update received:', account);
        // Update balance display
        const balanceElement = document.getElementById('balance');
        if (balanceElement) {
            balanceElement.textContent = `$${account.balance.toFixed(2)}`;
        }
        this.showNotification('Balance updated');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'websocket-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

const webSocketService = new WebSocketService();

// Connect to WebSocket when authenticated
document.addEventListener('DOMContentLoaded', () => {
    if (authService.isAuthenticated()) {
        webSocketService.connect();
    }
});

// Disconnect on page unload
window.addEventListener('beforeunload', () => {
    webSocketService.disconnect();
});
