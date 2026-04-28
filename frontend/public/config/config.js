const API_BASE_URL = 'https://dora-bank-api.onrender.com/api';
const WS_URL = 'https://dora-bank-api.onrender.com/ws';

const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    WS_URL: WS_URL,
    ENDPOINTS: {
        AUTH: {
            REGISTER: `${API_BASE_URL}/auth/register`,
            LOGIN: `${API_BASE_URL}/auth/login`
        },
        ACCOUNT: {
            CURRENT: `${API_BASE_URL}/accounts/current`,
            BY_NUMBER: (accountNumber) => `${API_BASE_URL}/accounts/${accountNumber}`
        },
        TRANSACTION: {
            PROCESS: `${API_BASE_URL}/transactions/process`,
            CURRENT: `${API_BASE_URL}/transactions/current`,
            BY_ACCOUNT: (accountNumber) => `${API_BASE_URL}/transactions/account/${accountNumber}`
        },
        CARD: {
            REQUEST: `${API_BASE_URL}/cards/request`,
            CURRENT: `${API_BASE_URL}/cards/current`,
            BY_ID: (cardId) => `${API_BASE_URL}/cards/${cardId}`,
            BLOCK: (cardId) => `${API_BASE_URL}/cards/${cardId}/block`
        },
        ADMIN: {
            USERS: `${API_BASE_URL}/admin/users`,
            STATS: `${API_BASE_URL}/admin/stats`
        }
    }
};
