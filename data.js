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

    // [Rest of the existing BankDB implementation remains exactly the same]
    // ... (all other functions stay unchanged)

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