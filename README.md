# DoraBank - Production-Ready Banking System

A modern, production-ready banking system built with Java Spring Boot backend and real-time WebSocket capabilities. This system has been transformed from a Node.js application into a scalable, secure, enterprise-grade banking platform.

## 🏗️ Architecture

- **Backend**: Java Spring Boot 3.2.0 with MongoDB
- **Frontend**: HTML5, CSS3, JavaScript with WebSocket integration
- **Real-time**: STOMP over WebSocket for live updates
- **Authentication**: JWT-based stateless authentication
- **Deployment**: Docker containerization with docker-compose

## ✨ Features

- **User Management**: Registration, login, profile management
- **Account Management**: Savings and current accounts
- **Transaction Processing**: Deposits, withdrawals, transfers with real-time updates
- **Card Management**: Debit and credit card generation with secure storage
- **Admin Dashboard**: User management, bank statistics
- **Real-time Notifications**: WebSocket-based live transaction and balance updates
- **Security**: JWT authentication, role-based authorization, input validation
- **Scalability**: Stateless design, containerization ready

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB 7.0+ (or MongoDB Atlas account)
- Docker and Docker Compose (for containerized deployment)
- Git

## 🚀 Quick Start with Docker

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DoraBank
```

### 2. Start All Services
```bash
cd docker
docker-compose up --build
```

This will start:
- MongoDB database on port 27017
- Spring Boot backend on port 8080
- Nginx frontend on port 3000

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Health Check: http://localhost:8080/actuator/health

### 4. Stop Services
```bash
docker-compose down
```

## 🛠️ Manual Setup

### Backend Setup

1. **Navigate to Backend Directory**
```bash
cd backend
```

2. **Configure Application Properties**
Edit `src/main/resources/application.properties`:
```properties
spring.data.mongodb.uri=mongodb://localhost:27017/dorabank
jwt.secret=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForSecurity
```

3. **Build the Application**
```bash
mvn clean install
```

4. **Run the Application**
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to Frontend Directory**
```bash
cd frontend/public
```

2. **Serve the Frontend**
```bash
python3 -m http.server 3000
# Or use any static file server
```

The frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
dorabank/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/dorabank/
│   │   ├── controller/              # REST Controllers
│   │   ├── service/                 # Business Logic
│   │   ├── repository/              # MongoDB Access Layer
│   │   ├── model/                   # MongoDB Entities
│   │   ├── dto/                     # Request/Response DTOs
│   │   ├── security/                # Security Layer
│   │   ├── config/                  # App Configuration
│   │   ├── websocket/               # Real-time System
│   │   ├── exception/               # Global Exception Handling
│   │   └── util/                    # Utility Classes
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   └── pom.xml
│
├── frontend/                         # Client-side Application
│   └── public/
│       ├── index.html
│       ├── login.html
│       ├── dashboard.html
│       ├── assets/
│       │   ├── css/styles.css
│       │   ├── js/
│       │   │   ├── auth.js
│       │   │   ├── dashboard.js
│       │   │   ├── transactions.js
│       │   │   ├── card.js
│       │   │   └── websocket.js
│       │   └── images/
│       ├── services/
│       │   ├── api.js
│       │   └── authService.js
│       └── config/
│           └── config.js
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── nginx.conf
│   └── .dockerignore
│
├── docs/
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
└── README.md
```

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Hashing**: BCrypt with salt rounds
- **Role-Based Authorization**: Admin and user roles
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Configuration**: Configurable cross-origin resource sharing
- **Card Security**: Masked card numbers, hashed CVV storage

## 📡 Real-Time Features

The system uses WebSocket with STOMP protocol for real-time updates:

- **Transaction Updates**: Live notifications when transactions occur
- **Balance Updates**: Real-time balance changes
- **Topic-based Subscriptions**: Users subscribe to their account-specific topics

### WebSocket Topics
- `/topic/transactions/{accountNumber}` - Transaction updates
- `/topic/balance/{accountNumber}` - Balance updates
- `/topic/notifications/{accountNumber}` - General notifications

## 📚 API Documentation

Complete API documentation is available in [docs/API.md](docs/API.md)

Key Endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/accounts/current` - Get current account
- `POST /api/transactions/process` - Process transaction
- `POST /api/cards/request` - Request card
- `GET /api/admin/users` - Get all users (Admin only)

## 🗄️ Database Schema

### Collections
- **users**: User accounts with authentication data
- **accounts**: Account details and balances
- **transactions**: Transaction history
- **cards**: Card information

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed schema information.

## 🚢 Deployment

### Docker Deployment
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Cloud Deployment Options
- **AWS EC2**: Full control over infrastructure
- **Railway**: Easy deployment with automatic builds
- **Render**: Simple static site and web service deployment

### MongoDB Atlas Setup
1. Create a MongoDB Atlas account
2. Create a free cluster
3. Set up database user and whitelist IPs
4. Get connection string and update configuration

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
mvn test
```

### Test API Endpoints
Use Postman or curl to test endpoints:
```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"Password123","phone":"9876543210","address":"123 Main St","accountType":"savings","initialBalance":1000}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/dorabank
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForSecurity
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080
SPRING_PROFILES_ACTIVE=dev
```

### Production Configuration
Use `application-prod.properties` for production settings:
- MongoDB Atlas connection string
- Environment-specific JWT secret
- CORS configuration for production domain

## 📈 Monitoring

### Spring Boot Actuator
- Health: `http://localhost:8080/actuator/health`
- Metrics: `http://localhost:8080/actuator/metrics`
- Info: `http://localhost:8080/actuator/info`

### Logs
Application logs are written to console and can be viewed:
- Docker: `docker-compose logs -f backend`
- Manual: Check console output

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Check [docs/API.md](docs/API.md) for API documentation
- Check [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for architecture details
- Check [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment guides

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Mobile app (React Native/Flutter)
- [ ] Advanced analytics dashboard
- [ ] Multi-currency support
- [ ] Investment and savings features
- [ ] Loan management system
- [ ] Credit scoring
- [ ] Automated fraud detection

---

**Built with ❤️ using Java Spring Boot and MongoDB**
