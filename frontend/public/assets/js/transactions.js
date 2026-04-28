class TransactionService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getTransactions() {
        try {
            return await this.api.get(API_CONFIG.ENDPOINTS.TRANSACTION.CURRENT);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }
    }

    async processTransaction(transactionData) {
        try {
            return await this.api.post(API_CONFIG.ENDPOINTS.TRANSACTION.PROCESS, transactionData);
        } catch (error) {
            console.error('Error processing transaction:', error);
            throw error;
        }
    }

    displayTransactions(transactions) {
        const transactionsContainer = document.getElementById('transactionsList');
        if (!transactionsContainer) return;

        transactionsContainer.innerHTML = '';

        if (transactions.length === 0) {
            transactionsContainer.innerHTML = '<p class="no-transactions">No transactions found</p>';
            return;
        }

        transactions.forEach(transaction => {
            const transactionElement = document.createElement('div');
            transactionElement.className = 'transaction-item';
            
            const typeClass = transaction.type === 'deposit' ? 'deposit' : 
                            transaction.type === 'withdraw' ? 'withdraw' : 'transfer';
            
            const amountPrefix = transaction.type === 'deposit' ? '+' : '-';
            
            transactionElement.innerHTML = `
                <div class="transaction-info">
                    <span class="transaction-type ${typeClass}">${transaction.type.toUpperCase()}</span>
                    <span class="transaction-description">${transaction.description}</span>
                    <span class="transaction-date">${new Date(transaction.transactionDate).toLocaleDateString()}</span>
                </div>
                <div class="transaction-amount ${typeClass}">
                    ${amountPrefix}$${transaction.amount.toFixed(2)}
                </div>
            `;
            
            transactionsContainer.appendChild(transactionElement);
        });
    }

    async handleTransactionSubmit(event) {
        event.preventDefault();
        
        const accountNumber = authService.getCurrentUser().accountNumber;
        const type = document.getElementById('transactionType').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const description = document.getElementById('description').value;
        const toAccount = document.getElementById('toAccount')?.value;

        const transactionData = {
            accountNumber,
            type,
            amount,
            description
        };

        if (type === 'transfer' && toAccount) {
            transactionData.toAccount = toAccount;
        }

        try {
            await this.processTransaction(transactionData);
            alert('Transaction successful!');
            await this.loadTransactions();
            event.target.reset();
        } catch (error) {
            alert('Transaction failed: ' + error.message);
        }
    }

    async loadTransactions() {
        if (!authService.checkAuth()) return;

        try {
            const transactions = await this.getTransactions();
            this.displayTransactions(transactions);
        } catch (error) {
            console.error('Error loading transactions:', error);
            alert('Error loading transactions. Please try again.');
        }
    }
}

const transactionService = new TransactionService(apiService);

// Initialize transactions page
document.addEventListener('DOMContentLoaded', () => {
    transactionService.loadTransactions();

    const transactionForm = document.getElementById('transactionForm');
    if (transactionForm) {
        transactionForm.addEventListener('submit', (e) => transactionService.handleTransactionSubmit(e));
    }
});
