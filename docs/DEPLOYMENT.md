# DoraBank Deployment Guide

## Prerequisites

### Development Environment
- Java 17 or higher
- Maven 3.6+
- MongoDB 7.0+ (or MongoDB Atlas account)
- Docker and Docker Compose
- Git

### Production Environment
- Cloud provider account (AWS, Railway, Render, etc.)
- MongoDB Atlas account
- Domain name (optional)
- SSL certificate (optional but recommended)

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DoraBank
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/dorabank

# JWT Configuration
JWT_SECRET=YourSuperSecretKeyForJWTTokenGenerationMustBeAtLeast256BitsLongForSecurity

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8080

# Spring Profile
SPRING_PROFILES_ACTIVE=dev
```

### 3. Start MongoDB (Local)
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or use MongoDB Atlas
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Build and Run Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 5. Serve Frontend
```bash
cd frontend/public
python3 -m http.server 3000
# Or use any static file server
```

The frontend will be available at `http://localhost:3000`

## Docker Deployment

### Using Docker Compose (Recommended for Development)

1. **Build and Start Services**
```bash
cd docker
docker-compose up --build
```

This will start:
- MongoDB on port 27017
- Spring Boot backend on port 8080
- Nginx frontend on port 3000

2. **Stop Services**
```bash
docker-compose down
```

3. **View Logs**
```bash
docker-compose logs -f
```

4. **Restart Services**
```bash
docker-compose restart
```

### Using Docker Build

1. **Build Backend Image**
```bash
docker build -f docker/Dockerfile -t dorabank-backend .
```

2. **Run Backend Container**
```bash
docker run -d \
  -p 8080:8080 \
  -e SPRING_DATA_MONGODB_URI=mongodb://host.docker.internal:27017/dorabank \
  -e JWT_SECRET=YourSecretKey \
  dorabank-backend
```

## Production Deployment

### Option 1: AWS Deployment

#### 1. Deploy MongoDB (MongoDB Atlas)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for testing, specific IPs for production)
5. Get the connection string

#### 2. Deploy Backend on AWS EC2

1. **Launch EC2 Instance**
   - Choose Amazon Linux 2 or Ubuntu
   - Instance type: t2.medium or higher
   - Configure security group to allow ports 80, 443, 8080

2. **Install Java and Maven**
```bash
sudo yum install java-17-amazon-corretto -y
sudo yum install maven -y
```

3. **Clone and Build**
```bash
git clone <repository-url>
cd DoraBank/backend
mvn clean package -DskipTests
```

4. **Create Systemd Service**
```bash
sudo nano /etc/systemd/system/dorabank.service
```

Add the following:
```ini
[Unit]
Description=DoraBank Spring Boot Application
After=syslog.target network.target

[Service]
User=ec2-user
ExecStart=/usr/bin/java -jar /home/ec2-user/DoraBank/backend/target/dora-bank-1.0.0.jar
SuccessExitStatus=143
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

5. **Start Service**
```bash
sudo systemctl daemon-reload
sudo systemctl enable dorabank
sudo systemctl start dorabank
sudo systemctl status dorabank
```

6. **Configure Nginx as Reverse Proxy**
```bash
sudo yum install nginx -y
sudo nano /etc/nginx/conf.d/dorabank.conf
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /ws {
        proxy_pass http://localhost:8080/ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location / {
        root /home/ec2-user/DoraBank/frontend/public;
        try_files $uri $uri/ /index.html;
    }
}
```

7. **Enable SSL with Let's Encrypt**
```bash
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Railway Deployment

#### 1. Deploy Backend
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Spring Boot application
3. Configure environment variables:
   - `SPRING_DATA_MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your JWT secret key
   - `CORS_ALLOWED_ORIGINS`: Your frontend URL
4. Deploy

#### 2. Deploy Frontend
1. Create a new Railway project for static site
2. Connect to your frontend directory
3. Deploy

### Option 3: Render Deployment

#### 1. Deploy Backend
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `mvn clean package -DskipTests`
4. Set start command: `java -jar backend/target/*.jar`
5. Add environment variables
6. Deploy

#### 2. Deploy Frontend
1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set publish directory: `frontend/public`
4. Deploy

## Environment Variables

### Required Variables
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation (min 256 bits)
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### Optional Variables
- `SPRING_PROFILES_ACTIVE` - Spring profile (dev/prod)
- `SERVER_PORT` - Server port (default: 8080)
- `JWT_EXPIRATION` - JWT token expiration time in milliseconds (default: 86400000)

## MongoDB Atlas Setup

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier
   - Select a region closest to your users
   - Name your cluster

3. **Create Database User**
   - Go to Database Access
   - Click "Add New Database User"
   - Choose username and password
   - Select "Read and write to any database"

4. **Whitelist IP Addresses**
   - Go to Network Access
   - Click "Add IP Address"
   - For development: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IP addresses

5. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

## Monitoring and Logging

### Spring Boot Actuator
The application includes Spring Boot Actuator for monitoring:

- Health check: `http://localhost:8080/actuator/health`
- Info: `http://localhost:8080/actuator/info`
- Metrics: `http://localhost:8080/actuator/metrics`

### Application Logs
Logs are written to console and can be viewed:
- Docker: `docker-compose logs -f backend`
- Systemd: `journalctl -u dorabank -f`
- Cloud provider: Check provider's logging dashboard

## Backup and Recovery

### MongoDB Backup
```bash
# Using mongodump
mongodump --uri="mongodb://user:password@host:port/database" --out=/backup/path

# Using Atlas
# Automated backups are available in the free tier
```

### Restore from Backup
```bash
# Using mongorestore
mongorestore --uri="mongodb://user:password@host:port/database" /backup/path
```

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong passwords for MongoDB
- [ ] Enable SSL/TLS for all connections
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable monitoring and alerting
- [ ] Review and update dependencies regularly
- [ ] Implement rate limiting
- [ ] Set up logging and audit trails
- [ ] Configure CORS properly for production

## Troubleshooting

### Backend won't start
1. Check MongoDB connection
2. Verify environment variables
3. Check port conflicts
4. Review application logs

### WebSocket connection fails
1. Verify WebSocket endpoint is accessible
2. Check firewall rules
3. Ensure STOMP library is loaded
4. Check JWT token validity

### Frontend can't connect to API
1. Verify CORS configuration
2. Check API endpoint URL
3. Ensure backend is running
4. Check network connectivity

### MongoDB connection issues
1. Verify connection string
2. Check IP whitelist
3. Ensure MongoDB is running
4. Check authentication credentials

## Scaling Considerations

### Horizontal Scaling
- Deploy multiple backend instances behind a load balancer
- Use MongoDB Atlas for automatic scaling
- Implement session affinity for WebSocket connections
- Consider using Redis for session management

### Vertical Scaling
- Increase instance size based on load
- Monitor CPU and memory usage
- Scale database resources accordingly

### Performance Optimization
- Enable database indexing
- Implement caching layer (Redis)
- Use CDN for static assets
- Optimize database queries
- Enable compression

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and rotate secrets quarterly
- Monitor disk usage
- Check backup integrity
- Review security logs
- Performance tuning

### Rolling Updates
```bash
# Update backend without downtime
docker-compose up -d --no-deps backend
# Or use blue-green deployment strategy
```
