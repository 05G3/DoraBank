// Database module
const BankDB = (function() {
    // Private variables
    let users = [];
    let transactions = [];
    let cards = [];

    // Initialize database
    function init() {
        const storedUsers = localStorage.getItem('doraBankUsers');
        const storedTransactions = localStorage.getItem('doraBankTransactions');
        const storedCards = localStorage.getItem('doraBankCards');

        users = storedUsers ? JSON.parse(storedUsers) : [
            // Default admin user
            {
                fullName: "Admin User",
                email: "admin@dorabank.com",
                phone: "9876543210",
                address: "Bank Headquarters",
                accountType: "admin",
                balance: "0",
                accountNumber: "ADMIN-001",
                password: "admin123",
                cards: []
            },
            // Default regular user
            {
                fullName: "Test User",
                email: "user@dorabank.com",
                phone: "9876543211",
                address: "123 Main St",
                accountType: "savings",
                balance: "5000",
                accountNumber: "DORA-SAV-1234",
                password: "user123",
                cards: []
            },
            // Added myself as a user
            {
                fullName: "AI Assistant",
                email: "ai@dorabank.com",
                phone: "9876543212",
                address: "Cloud Server",
                accountType: "savings",
                balance: "10000",
                accountNumber: "DORA-SAV-5678",
                password: "aiassistant123",
                cards: []
            }
        ];

        transactions = storedTransactions ? JSON.parse(storedTransactions) : [
            {
                date: new Date().toISOString().split('T')[0],
                accountNumber: "DORA-SAV-1234",
                type: "deposit",
                amount: 5000,
                description: "Initial deposit"
            },
            {
                date: new Date().toISOString().split('T')[0],
                accountNumber: "DORA-SAV-5678",
                type: "deposit",
                amount: 10000,
                description: "Initial deposit"
            }
        ];

        cards = storedCards ? JSON.parse(storedCards) : [];

        // Save initial data if empty
        if (!storedUsers) localStorage.setItem('doraBankUsers', JSON.stringify(users));
        if (!storedTransactions) localStorage.setItem('doraBankTransactions', JSON.stringify(transactions));
        if (!storedCards) localStorage.setItem('doraBankCards', JSON.stringify(cards));
    }

    // User management functions
    function addUser(user) {
        users.push(user);
        localStorage.setItem('doraBankUsers', JSON.stringify(users));
        return user;
    }

    function getUsers() {
        return users;
    }

    function getUserByAccount(accountNumber) {
        return users.find(user => user.accountNumber === accountNumber);
    }

    function updateUser(accountNumber, updates) {
        const userIndex = users.findIndex(user => user.accountNumber === accountNumber);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('doraBankUsers', JSON.stringify(users));
            return users[userIndex];
        }
        return null;
    }

    // Transaction management functions
    function addTransaction(transaction) {
        transactions.push(transaction);
        localStorage.setItem('doraBankTransactions', JSON.stringify(transactions));
        return transaction;
    }

    function getTransactions() {
        return transactions;
    }

    function getTransactionsByAccount(accountNumber) {
        return transactions.filter(transaction => transaction.accountNumber === accountNumber);
    }

    // Card management functions
    function addCard(card) {
        cards.push(card);
        localStorage.setItem('doraBankCards', JSON.stringify(cards));
        return card;
    }

    function getCards() {
        return cards;
    }

    function getCardsByAccount(accountNumber) {
        return cards.filter(card => card.accountNumber === accountNumber);
    }

    // Utility functions
    function generateCardNumber() {
        return '4' + Math.random().toString().slice(2, 16);
    }

    function generateExpiryDate() {
        const now = new Date();
        const year = now.getFullYear() + 5;
        const month = String(now.getMonth() + 1).padStart(2, '0');
        return `${month}/${year.toString().slice(-2)}`;
    }

    function generateCVV() {
        return String(Math.floor(Math.random() * 900) + 100);
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    // Initialize the database
    init();

    // Public API
    return {
        addUser,
        getUsers,
        getUserByAccount,
        updateUser,
        addTransaction,
        getTransactions,
        getTransactionsByAccount,
        addCard,
        getCards,
        getCardsByAccount,
        generateCardNumber,
        generateExpiryDate,
        generateCVV,
        formatDate
    };
})();