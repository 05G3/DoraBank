# DoraBank API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "address": "123 Main St",
  "accountType": "savings",
  "initialBalance": 1000.0
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "accountNumber": "DORA-SAV-12345678",
  "accountType": "savings"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": "507f1f77bcf86cd799439011",
  "email": "john@example.com",
  "accountNumber": "DORA-SAV-12345678",
  "accountType": "savings"
}
```

### Account

#### Get Current Account
```http
GET /accounts/current
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "accountNumber": "DORA-SAV-12345678",
  "userId": "507f1f77bcf86cd799439011",
  "accountType": "savings",
  "balance": 1500.0,
  "accountStatus": "active",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### Get Account by Number (Admin Only)
```http
GET /accounts/{accountNumber}
Authorization: Bearer <token>
```

### Transactions

#### Process Transaction
```http
POST /transactions/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountNumber": "DORA-SAV-12345678",
  "type": "deposit",
  "amount": 500.0,
  "description": "Salary deposit"
}
```

**Transaction Types:**
- `deposit` - Add money to account
- `withdraw` - Remove money from account
- `transfer` - Transfer money to another account (requires `toAccount` field)

**Transfer Example:**
```json
{
  "accountNumber": "DORA-SAV-12345678",
  "type": "transfer",
  "amount": 200.0,
  "description": "Transfer to friend",
  "toAccount": "DORA-SAV-87654321"
}
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "accountNumber": "DORA-SAV-12345678",
  "transactionId": "TXN1704096000000123",
  "type": "deposit",
  "amount": 500.0,
  "description": "Salary deposit",
  "status": "completed",
  "transactionDate": "2024-01-01T10:00:00",
  "createdAt": "2024-01-01T10:00:00"
}
```

#### Get Current User Transactions
```http
GET /transactions/current
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439012",
    "accountNumber": "DORA-SAV-12345678",
    "transactionId": "TXN1704096000000123",
    "type": "deposit",
    "amount": 500.0,
    "description": "Salary deposit",
    "status": "completed",
    "transactionDate": "2024-01-01T10:00:00",
    "createdAt": "2024-01-01T10:00:00"
  }
]
```

#### Get Account Transactions
```http
GET /transactions/account/{accountNumber}
Authorization: Bearer <token>
```

### Cards

#### Request Card
```http
POST /cards/request
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountNumber": "DORA-SAV-12345678",
  "cardType": "debit"
}
```

**Card Types:**
- `debit` - Debit card
- `credit` - Credit card

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "cardNumber": "**** **** **** 1234",
  "userId": "507f1f77bcf86cd799439011",
  "accountNumber": "DORA-SAV-12345678",
  "cardType": "debit",
  "cvv": "123",
  "expiryDate": "12/27",
  "status": "active",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

#### Get Current User Cards
```http
GET /cards/current
Authorization: Bearer <token>
```

#### Get Card by ID
```http
GET /cards/{cardId}
Authorization: Bearer <token>
```

#### Block Card
```http
PUT /cards/{cardId}/block
Authorization: Bearer <token>
```

### Admin (Admin Only)

#### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /admin/users/{userId}
Authorization: Bearer <token>
```

#### Get User by Account Number
```http
GET /admin/users/account/{accountNumber}
Authorization: Bearer <token>
```

#### Delete User
```http
DELETE /admin/users/{userId}
Authorization: Bearer <token>
```

#### Get Bank Statistics
```http
GET /admin/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalBalance": 150000.0,
  "totalUsers": 50
}
```

## WebSocket Endpoints

### Connection
```
ws://localhost:8080/ws
```

### Topics
- `/topic/transactions/{accountNumber}` - Real-time transaction updates
- `/topic/balance/{accountNumber}` - Real-time balance updates
- `/topic/notifications/{accountNumber}` - Real-time notifications

### Example WebSocket Usage
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({ 'Authorization': 'Bearer <token>' }, function() {
    stompClient.subscribe('/topic/transactions/DORA-SAV-12345678', function(message) {
        const transaction = JSON.parse(message.body);
        console.log('New transaction:', transaction);
    });
});
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "message": "Error description",
  "status": 400,
  "timestamp": "2024-01-01T10:00:00"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid or missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

## Validation Rules

### Password
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Email
- Valid email format

### Phone
- Exactly 10 digits

### Amount
- Must be greater than 0
- Maximum precision of 2 decimal places
