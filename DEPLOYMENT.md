# YourGate - Render Deployment Guide

## Environment Variables

### **BACKEND Environment Variables**

Set these in Render Dashboard → Service Settings → Environment:

```
NODE_ENV=production
PORT=5000

# MongoDB Database URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourgate

# JWT Secrets - Generate strong random strings!
# Option 1: Use openssl: openssl rand -base64 32
# Option 2: Generate online: https://www.allkeysgenerator.com/
ACCESS_TOKEN_SECRET=<generate-a-strong-random-string>
REFRESH_TOKEN_SECRET=<generate-a-strong-random-string>

# Token Expiry (leave as default)
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend URL - Important! Set to your frontend Render URL
CLIENT_URL=https://your-frontend-name.onrender.com
```

### **FRONTEND Environment Variables**

Set these in Render Dashboard → Build Environment Variables:

```
VITE_API_URL=https://your-backend-name.onrender.com/api
```

---

## Step-by-Step Deployment

### **1. Deploy Backend to Render**

1. Go to [render.com](https://render.com)
2. Click "Create" → "Web Service"
3. Connect your GitHub repository
4. **Service Settings:**
   - **Name:** yourgate-backend
   - **Environment:** Node
   - **Region:** Choose closest to your users
   - **Branch:** master (or main)
   - **Build Command:** `cd Backend && npm install`
   - **Start Command:** `cd Backend && npm start`

5. **Add Environment Variables:** (from Backend section above)
   - Click "Add Environment Variable"
   - Add all variables from the Backend list

6. Deploy and wait for success ✅

7. **Copy your backend URL** (e.g., `https://yourgate-backend.onrender.com`)

---

### **2. Deploy Frontend to Render**

1. Go to [render.com](https://render.com)
2. Click "Create" → "Static Site"
3. Connect your GitHub repository
4. **Service Settings:**
   - **Name:** yourgate-frontend
   - **Branch:** master (or main)
   - **Build Command:** `cd Frontend && npm install && npm run build`
   - **Publish Directory:** `Frontend/dist`

5. **Add Environment Variables:**
   - Click "Build & Deploy" → "Environment"
   - Add: `VITE_API_URL=https://yourgate-backend.onrender.com/api`
   - (Replace with your actual backend URL from step 1.7)

6. Deploy and wait for success ✅

---

### **3. Update Backend with Frontend URL**

After frontend deployment, go back to backend service:

1. Go to Backend service settings
2. Edit **CLIENT_URL** environment variable
3. Set it to: `https://yourgate-frontend.onrender.com`
4. Save and it will auto-redeploy

---

## Important Notes

⚠️ **MongoDB URI:**
- Must be a valid MongoDB connection string
- If using MongoDB Atlas, whitelist Render IP address: `0.0.0.0/0` (public access)

⚠️ **JWT Secrets:**
- Generate strong random strings - NEVER use defaults!
- Command: `openssl rand -base64 32`

⚠️ **CORS Configuration:**
- Backend allows requests only from `CLIENT_URL`
- If frontend URL changes, update backend `CLIENT_URL` env var

⚠️ **Free Tier Limits:**
- Render free tier services spin down after 15 min of inactivity
- Use paid tier for production apps
- Backend API calls will be slower on first request after spin-down

---

## Troubleshooting

### **Frontend can't connect to backend**
- Check `VITE_API_URL` matches backend service URL
- Check backend `CLIENT_URL` includes your frontend domain
- Check browser console for CORS errors

### **Login/cookies not working**
- Backend has `withCredentials: true`
- Ensure `credentials: true` in CORS config ✓

### **Database connection fails**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist
- Make sure database exists

---

## Summary: Required Env Variables

| Service | Variable | Example Value |
|---------|----------|----------------|
| **Backend** | MONGODB_URI | mongodb+srv://user:pass@cluster.mongodb.net/yourgate |
| **Backend** | ACCESS_TOKEN_SECRET | (random 32 char string) |
| **Backend** | REFRESH_TOKEN_SECRET | (random 32 char string) |
| **Backend** | CLIENT_URL | https://yourgate-frontend.onrender.com |
| **Frontend** | VITE_API_URL | https://yourgate-backend.onrender.com/api |
