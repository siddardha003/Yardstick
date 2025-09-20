# Deployment Guide for Vercel

This guide will help you deploy both the frontend and backend to Vercel.

## Prerequisites
- Vercel account
- MongoDB Atlas database (or other MongoDB instance)
- Vercel CLI installed: `npm i -g vercel`

## Backend Deployment

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT signing
   - `ADMIN_EMAIL`: Admin user email
   - `ADMIN_PASSWORD`: Admin user password
   - `NODE_ENV`: production

4. **Your backend will be available at:** `https://your-backend-project.vercel.app`

5. **Test the health endpoint:** `https://your-backend-project.vercel.app/health`

## Frontend Deployment

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Set environment variables in Vercel dashboard:**
   - `VITE_API_URL`: Your backend URL from step 4 above

3. **Deploy to Vercel:**
   ```bash
   vercel
   ```

4. **Your frontend will be available at:** `https://your-frontend-project.vercel.app`

## Important Notes

- **Health Endpoint**: The backend includes a `/health` endpoint that returns `{"status":"ok"}` for monitoring
- **CORS**: Already configured to allow all origins for development/testing
- **Authentication**: Uses JWT tokens for secure API access
- **Database**: Multi-tenant architecture with proper tenant isolation
- **API Routes**: All backend routes are available under `/auth`, `/tenants`, `/notes`, and `/users`

## Testing the Deployment

1. Visit your frontend URL
2. Register a new account (this creates a new tenant)
3. Login and test the notes functionality
4. Admin users can access the admin dashboard at `/admin`

## Environment Variables Summary

### Backend (Vercel Environment Variables)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-very-secure-jwt-secret-key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=securepassword
NODE_ENV=production
```

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://your-backend-project.vercel.app
```

## Post-Deployment

- Update any hardcoded URLs in your code to use the production URLs
- Set up monitoring for the health endpoint
- Configure any necessary DNS settings for custom domains
- Enable Vercel Analytics if desired

## Troubleshooting

- Check Vercel function logs in the dashboard for backend issues
- Ensure all environment variables are set correctly
- Verify MongoDB connection string is correct and database is accessible
- Check CORS configuration if you encounter cross-origin issues