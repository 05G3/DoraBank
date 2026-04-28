class CardService {
    constructor(apiService) {
        this.api = apiService;
    }

    async getCards() {
        try {
            return await this.api.get(API_CONFIG.ENDPOINTS.CARD.CURRENT);
        } catch (error) {
            console.error('Error fetching cards:', error);
            throw error;
        }
    }

    async requestCard(cardData) {
        try {
            return await this.api.post(API_CONFIG.ENDPOINTS.CARD.REQUEST, cardData);
        } catch (error) {
            console.error('Error requesting card:', error);
            throw error;
        }
    }

    async blockCard(cardId) {
        try {
            return await this.api.put(API_CONFIG.ENDPOINTS.CARD.BLOCK(cardId), {});
        } catch (error) {
            console.error('Error blocking card:', error);
            throw error;
        }
    }

    displayCards(cards) {
        const cardsContainer = document.getElementById('cardsList');
        if (!cardsContainer) return;

        cardsContainer.innerHTML = '';

        if (cards.length === 0) {
            cardsContainer.innerHTML = '<p class="no-cards">No cards found. Request a new card to get started.</p>';
            return;
        }

        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = `card-item ${card.cardType.toLowerCase()}`;
            
            const statusClass = card.status === 'active' ? 'active' : 'blocked';
            
            cardElement.innerHTML = `
    <div class="card-number">
        ${formatCardNumber(card.cardNumber)}
    </div>

    <div class="card-details">
        <div>
            <span>Expiry</span>
            <p>${card.expiryDate}</p>
        </div>

        <div>
            <span>${card.cardType.toUpperCase()}</span>
            <p>${card.status.toUpperCase()}</p>
        </div>
    </div>
`;
            
            cardsContainer.appendChild(cardElement);
        });

        // Add event listeners for block buttons
        document.querySelectorAll('.block-card-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const cardId = e.target.dataset.cardId;
                if (confirm('Are you sure you want to block this card?')) {
                    await this.handleBlockCard(cardId);
                }
            });
        });
    }


    async handleBlockCard(cardId) {
        try {
            await this.blockCard(cardId);
            alert('Card blocked successfully');
            await this.loadCards();
        } catch (error) {
            alert('Error blocking card: ' + error.message);
        }
    }

    async handleCardRequest(event) {
        event.preventDefault();
        
        const accountNumber = authService.getCurrentUser().accountNumber;
        const cardType = document.getElementById('cardType').value;

        try {
            const card = await this.requestCard({ accountNumber, cardType });
            alert('Card requested successfully!\nCard Number: ' + card.cardNumber + '\nCVV: ' + card.cvv + '\nExpiry: ' + card.expiryDate);
            await this.loadCards();
            event.target.reset();
        } catch (error) {
            alert('Card request failed: ' + error.message);
        }
    }

    async loadCards() {
        if (!authService.checkAuth()) return;

        try {
            const cards = await this.getCards();
            this.displayCards(cards);
        } catch (error) {
            console.error('Error loading cards:', error);
            alert('Error loading cards. Please try again.');
        }
    }
}

const cardService = new CardService(apiService);
function formatCardNumber(number) {
    return number.replace(/(.{4})/g, "$1 ").trim();
}

// Initialize cards page
document.addEventListener('DOMContentLoaded', () => {
    cardService.loadCards();

    const cardRequestForm = document.getElementById('cardRequestForm');
    if (cardRequestForm) {
        cardRequestForm.addEventListener('submit', (e) => cardService.handleCardRequest(e));
    }
});
