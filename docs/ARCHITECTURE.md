# DoraBank System Architecture

## Overview
DoraBank is a production-ready, real-time banking system built with Java Spring Boot backend and a modern frontend. The system follows a clean architecture pattern with separation of concerns.

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MongoDB (MongoDB Atlas for production)
- **Security**: JWT (JSON Web Tokens)
- **Real-time**: WebSocket with STOMP protocol
- **Build Tool**: Maven
- **Containerization**: Docker

### Frontend
- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Real-time**: SockJS + STOMP
- **Deployment**: Nginx (via Docker)

## Architecture Layers

### 1. Presentation Layer (Controllers)
```
com.dorabank.controller/
├── AuthController.java
├── AccountController.java
├── TransactionController.java
├── CardController.java
└── AdminController.java
```

**Responsibilities:**
- Handle HTTP requests
- Validate input data
- Return appropriate HTTP responses
- Delegate business logic to service layer

### 2. Business Logic Layer (Services)
```
com.dorabank.service/
├── AuthService.java
├── AccountService.java
├── TransactionService.java
├── CardService.java
└── AdminService.java
```

**Responsibilities:**
- Implement business rules
- Coordinate between multiple repositories
- Handle transaction management
- Integrate with WebSocket for real-time updates

### 3. Data Access Layer (Repositories)
```
com.dorabank.repository/
├── UserRepository.java
├── AccountRepository.java
├── TransactionRepository.java
└── CardRepository.java
```

**Responsibilities:**
- Database operations
- Query definitions
- Data persistence
- Custom query methods

### 4. Domain Model Layer (Entities)
```
com.dorabank.model/
├── User.java
├── Account.java
├── Transaction.java
└── Card.java
```

**Responsibilities:**
- Define data structure
- Implement domain logic
- Security implementation (UserDetails)
- Database mapping annotations

### 5. Data Transfer Objects (DTOs)
```
com.dorabank.dto/
├── AuthRequest.java
├── AuthResponse.java
├── RegisterRequest.java
├── TransactionRequest.java
└── CardRequest.java
```

**Responsibilities:**
- Request/Response data structures
- Input validation
- Data transformation

### 6. Security Layer
```
com.dorabank.security/
├── JwtUtil.java
├── JwtFilter.java
├── SecurityConfig.java
└── CustomUserDetailsService.java
```

**Responsibilities:**
- JWT token generation and validation
- Authentication and authorization
- Security configuration
- User authentication

### 7. WebSocket Layer
```
com.dorabank.websocket/
├── WebSocketConfig.java
├── NotificationService.java
└── NotificationController.java
```

**Responsibilities:**
- WebSocket configuration
- Real-time message broadcasting
- Topic management
- Client connection handling

### 8. Configuration Layer
```
com.dorabank.config/
├── MongoConfig.java
├── WebConfig.java
└── CorsConfig.java
```

**Responsibilities:**
- Database configuration
- Web configuration
- CORS configuration
- Bean definitions

### 9. Exception Handling
```
com.dorabank.exception/
├── GlobalExceptionHandler.java
└── CustomException.java
```

**Responsibilities:**
- Centralized error handling
- Custom exception definitions
- Error response formatting

### 10. Utility Layer
```
com.dorabank.util/
├── AccountNumberGenerator.java
├── CardGenerator.java
└── ValidationUtil.java
```

**Responsibilities:**
- Common utility functions
- Data generation
- Validation helpers

## Database Schema

### Users Collection
```json
{
  "_id": ObjectId,
  "email": String (unique),
  "password": String (hashed),
  "fullName": String,
  "phone": String,
  "address": String,
  "accountNumber": String (unique),
  "accountType": String (savings/current/admin),
  "balance": Double,
  "createdAt": DateTime,
  "lastLogin": DateTime
}
```

### Accounts Collection
```json
{
  "_id": ObjectId,
  "accountNumber": String (unique),
  "userId": String,
  "accountType": String,
  "balance": Double,
  "accountStatus": String,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Transactions Collection
```json
{
  "_id": ObjectId,
  "accountNumber": String,
  "transactionId": String,
  "type": String (deposit/withdraw/transfer),
  "amount": Double,
  "description": String,
  "fromAccount": String,
  "toAccount": String,
  "status": String,
  "transactionDate": DateTime,
  "createdAt": DateTime
}
```

### Cards Collection
```json
{
  "_id": ObjectId,
  "cardNumber": String (unique),
  "userId": String,
  "accountNumber": String,
  "cardType": String (debit/credit),
  "cvv": String (hashed),
  "expiryDate": String,
  "status": String,
  "createdAt": DateTime,
  "updatedAt": DateTime,
  "expiryDateObj": Date
}
```

## Security Architecture

### Authentication Flow
1. User provides credentials (email/password)
2. Spring Security authenticates using CustomUserDetailsService
3. Upon successful authentication, JWT token is generated
4. Token is returned to client
5. Client includes token in Authorization header for subsequent requests
6. JwtFilter validates token on each protected request

### Authorization
- **Role-based**: Users have roles (USER, ADMIN)
- **Method-level**: @PreAuthorize annotations on controller methods
- **Endpoint-level**: Security configuration in SecurityConfig

### Password Security
- BCrypt hashing algorithm
- Salt rounds: 10 (default)
- Never stored in plain text

## Real-Time Communication

### WebSocket Architecture
- **Protocol**: STOMP over WebSocket
- **Transport**: SockJS with WebSocket fallback
- **Message Broker**: Simple in-memory broker (can be replaced with RabbitMQ/Redis)

### Topics
- `/topic/transactions/{accountNumber}` - Transaction updates
- `/topic/balance/{accountNumber}` - Balance updates
- `/topic/notifications/{accountNumber}` - General notifications

### Flow
1. Client connects to WebSocket endpoint
2. Client subscribes to relevant topics
3. Server broadcasts messages to subscribed clients
4. Client receives and processes updates

## Deployment Architecture

### Docker Compose (Development)
```
┌─────────────────┐
│   Nginx (80)    │
│   Frontend      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Spring Boot    │
│  (8080)         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   MongoDB       │
│   (27017)       │
└─────────────────┘
```

### Production (Cloud)
- **Backend**: Deployed on AWS/Railway/Render
- **Database**: MongoDB Atlas (managed service)
- **Frontend**: CDN or static hosting
- **Load Balancer**: Nginx or cloud provider's LB
- **SSL/TLS**: Terminated at load balancer

## Scalability Considerations

### Horizontal Scaling
- Stateless JWT authentication allows horizontal scaling
- WebSocket sessions can be distributed using message brokers
- Database sharding for large datasets

### Performance Optimization
- Database indexing on frequently queried fields
- Connection pooling for database
- Caching layer (Redis) for frequently accessed data
- CDN for static assets

### Monitoring
- Spring Boot Actuator for health checks
- Application logs (structured logging)
- Performance metrics
- Error tracking

## Design Patterns Used

1. **Repository Pattern**: Data access abstraction
2. **Service Layer Pattern**: Business logic encapsulation
3. **DTO Pattern**: Data transfer objects
4. **Dependency Injection**: Spring IoC container
5. **Singleton Pattern**: Spring beans
6. **Observer Pattern**: WebSocket subscriptions
7. **Filter Pattern**: JWT authentication filter
8. **Strategy Pattern**: Different transaction types

## Security Best Practices

1. **Never expose sensitive data** in logs or error messages
2. **Always validate input** on both client and server
3. **Use HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Regular security updates** for dependencies
6. **Environment variables** for sensitive configuration
7. **Principle of least privilege** for database access
8. **Audit logging** for critical operations

## Future Enhancements

1. **Message Queue**: RabbitMQ or Kafka for async processing
2. **Caching Layer**: Redis for performance
3. **Microservices**: Split into separate services
4. **API Gateway**: Kong or Spring Cloud Gateway
5. **Distributed Tracing**: Zipkin or Jaeger
6. **Circuit Breaker**: Resilience4j
7. **Event Sourcing**: For audit trail
8. **Read Replicas**: For reporting queries
