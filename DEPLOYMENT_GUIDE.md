# DoraBank Deployment Guide

## Overview
This guide will help you deploy the DoraBank application with:
- **Backend**: Spring Boot API hosted on Render
- **Frontend**: Static website hosted on Netlify
- **Database**: MongoDB Atlas (cloud-based)

## Prerequisites
- GitHub account
- Render account (free tier available)
- Netlify account (free tier available)
- MongoDB Atlas account (free tier available)

---

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Repository name: `dora-bank`
4. Description: `Complete banking application with Spring Boot backend and React frontend`
5. Make it **Public** (required for free Render deployment)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 1.2 Push Local Code to GitHub
```bash
# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dora-bank.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Setup MongoDB Atlas

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new organization
4. Create a new project named "DoraBank"

### 2.2 Create Cluster
1. Click "Build a Cluster"
2. Choose **M0 Sandbox** (free tier)
3. Select a cloud provider and region closest to your users
4. Cluster name: `DoraBank-Cluster`
5. Click "Create Cluster"

### 2.3 Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Username: `admin`
4. Password: Generate a strong password (save this!)
5. Click "Create User"

### 2.4 Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 2.5 Get Connection String
1. Go to "Clusters" → "DoraBank-Cluster"
2. Click "Connect"
3. Select "Drivers"
4. Copy the connection string (it will look like this):
   ```
   mongodb+srv://admin:<password>@cluster0.s6zxngd.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

## Step 3: Deploy Backend to Render

### 3.1 Prepare Backend for Render
Create a new file `render.yaml` in the root directory:

```yaml
services:
  - type: web
    name: dora-bank-api
    env: java
    buildCommand: ./mvnw clean install
    startCommand: java -jar backend/target/dora-bank-1.0.0.jar
    healthCheckPath: /actuator/health
    envVars:
      - key: SPRING_DATA_MONGODB_URI
        value: mongodb+srv://admin:YOUR_PASSWORD@cluster0.s6zxngd.mongodb.net/dorabank?retryWrites=true&w=majority
      - key: JWT_SECRET
        value: your-super-secret-jwt-key-at-least-256-bits-long
      - key: CORS_ALLOWED_ORIGINS
        value: https://your-app-name.netlify.app
```

### 3.2 Deploy to Render
1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select the `dora-bank` repository
5. Use the following settings:
   - **Name**: `dora-bank-api`
   - **Root Directory**: `.` (leave blank)
   - **Runtime**: `Java`
   - **Build Command**: `./mvnw clean install`
   - **Start Command**: `java -jar backend/target/dora-bank-1.0.0.jar`
   - **Instance Type**: `Free`
6. Click "Advanced Settings"
7. Add Environment Variables:
   - `SPRING_DATA_MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure 256-bit key
   - `CORS_ALLOWED_ORIGINS`: `https://your-app-name.netlify.app` (we'll update this later)
8. Click "Create Web Service"

### 3.3 Wait for Deployment
Render will automatically build and deploy your backend. This may take 5-10 minutes.

---

## Step 4: Prepare Frontend for Netlify

### 4.1 Update API Configuration
Edit `frontend/public/services/api.js`:

```javascript
const API_BASE_URL = 'https://dora-bank-api.onrender.com/api';
```

### 4.2 Create Netlify Build Configuration
Create `frontend/netlify.toml`:

```toml
[build]
  publish = "public"
  command = "echo 'No build command needed for static site'"

[[redirects]]
  from = "/api/*"
  to = "https://dora-bank-api.onrender.com/api/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### 4.3 Update CORS in Render
1. Go back to your Render dashboard
2. Edit your `dora-bank-api` service
3. Update `CORS_ALLOWED_ORIGINS` to include your Netlify URL
4. Redeploy the service

---

## Step 5: Deploy Frontend to Netlify

### 5.1 Deploy to Netlify
1. Go to [Netlify](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select the `dora-bank` repository
5. Use these settings:
   - **Base directory**: `frontend`
   - **Build command**: Leave blank (static site)
   - **Publish directory**: `public`
6. Click "Create site"

### 5.2 Update Site Name
1. Once deployed, click "Site settings"
2. Change site name to something memorable (e.g., `dora-bank-app`)
3. Your site will be available at `https://dora-bank-app.netlify.app`

### 5.3 Update CORS Again
1. Go back to Render
2. Update `CORS_ALLOWED_ORIGINS` with your actual Netlify URL
3. Redeploy the backend

---

## Step 6: Test the Application

### 6.1 Test Backend
1. Visit your Render API URL: `https://dora-bank-api.onrender.com`
2. You should see the Spring Boot application running
3. Test health endpoint: `https://dora-bank-api.onrender.com/actuator/health`

### 6.2 Test Frontend
1. Visit your Netlify URL: `https://your-app-name.netlify.app`
2. Try registering a new user
3. Login and test the dashboard
4. Test card requests and transactions

---

## Step 7: Environment Variables Summary

### Render Backend Environment Variables:
- `SPRING_DATA_MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Your secure JWT secret (256-bit minimum)
- `CORS_ALLOWED_ORIGINS`: Your Netlify frontend URL

### Netlify Frontend:
- No environment variables needed for basic deployment
- API URL is hardcoded in `frontend/public/services/api.js`

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**:
   - Ensure `CORS_ALLOWED_ORIGINS` in Render matches your Netlify URL exactly
   - Wait for backend to redeploy after CORS changes

2. **MongoDB Connection Errors**:
   - Verify your MongoDB connection string
   - Ensure IP access is configured (0.0.0.0/0)
   - Check database user credentials

3. **Build Failures**:
   - Check Render logs for specific error messages
   - Ensure Maven dependencies are correct

4. **Frontend Not Loading**:
   - Check browser console for API errors
   - Verify API URL in `frontend/public/services/api.js`

### Getting Help:
- Render logs: Dashboard → Your Service → Logs
- Netlify logs: Site settings → Functions → Logs
- MongoDB logs: Atlas → Clusters → Your Cluster → Logs

---

## Security Considerations

1. **Change Default Passwords**: Update any default credentials
2. **Use HTTPS**: Both Render and Netlify provide SSL certificates
3. **Environment Variables**: Never commit secrets to Git
4. **Database Security**: Use strong passwords and limit IP access
5. **JWT Secret**: Use a cryptographically secure secret

---

## Cost Summary (Free Tier)

- **Render**: Free tier includes:
  - 750 hours/month of server time
  - 100GB bandwidth
  - SSL certificates
  
- **Netlify**: Free tier includes:
  - 100GB bandwidth
  - 300 build minutes
  - SSL certificates
  - Custom domains
  
- **MongoDB Atlas**: Free tier includes:
  - 512MB storage
  - Unlimited reads/writes
  
Total cost: **$0/month** (within free tier limits)

---

## Next Steps

1. **Monitor Usage**: Keep an eye on free tier limits
2. **Backup Data**: Set up MongoDB backups
3. **Custom Domain**: Add custom domain to Netlify if desired
4. **Analytics**: Add monitoring and analytics
5. **Scaling**: Upgrade plans if usage increases

Congratulations! Your DoraBank application is now live on the internet!
