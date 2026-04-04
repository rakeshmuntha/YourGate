# YourGate - Deployment Guide

## Architecture

- **Frontend**: Vercel (React + Vite PWA)
- **Backend**: Render (Node.js + Express)
- **Database**: MongoDB Atlas
- **Auth**: JWT Bearer tokens (localStorage) + cookie fallback
- **API Routing**: Vercel rewrites proxy `/api/*` to Render backend (same-origin for mobile)

---

## Environment Variables

### **Backend (Render)**

Set in Render Dashboard → Service → Environment:

```
NODE_ENV=production
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/yourgate

# JWT Secrets - NEVER use defaults in production!
# Generate: openssl rand -base64 32
ACCESS_TOKEN_SECRET=<generate-a-strong-random-string>
REFRESH_TOKEN_SECRET=<generate-a-different-random-string>

# Token Expiry
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Frontend URL (your Vercel domain)
CLIENT_URL=https://yourgate.vercel.app
```

### **Frontend (Vercel)**

Set in Vercel Dashboard → Project → Settings → Environment Variables:

```
VITE_API_URL=/api
```

> **Important:** Use `/api` (relative path), NOT an absolute URL. The Vercel rewrite in `vercel.json` proxies requests to the backend. This makes auth cookies/tokens work on mobile.

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

5. **Add all Backend environment variables** from the list above

6. Deploy and wait for success

7. **Copy your backend URL** (e.g., `https://yourgate.onrender.com`)

---

### **2. Update `vercel.json`**

Make sure `vercel.json` has the correct backend URL:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://yourgate.onrender.com/api/:path*" },
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Replace `yourgate.onrender.com` with your actual Render backend URL.

---

### **3. Deploy Frontend to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. **Framework Preset:** Vite
4. **Root Directory:** `Frontend`
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Add Environment Variable:** `VITE_API_URL` = `/api`
8. Deploy

---

### **4. Update Backend CLIENT_URL**

After frontend deploys, go back to Render:

1. Edit `CLIENT_URL` to your Vercel URL: `https://yourgate.vercel.app`
2. Save — backend auto-redeploys

---

## Mobile PWA Support

The app works as a PWA on both Android and iOS:

- **Auth**: Uses Bearer tokens stored in `localStorage` (avoids cross-origin cookie issues on mobile)
- **Token refresh**: Automatic — axios interceptor refreshes expired tokens silently
- **Service worker**: Excludes `/api/` routes from navigation fallback
- **iOS**: `apple-mobile-web-app-capable` + `apple-touch-icon` configured
- **Android**: Web app manifest with standalone display mode
- **Default theme**: Dark mode

### Install as PWA
- **Android Chrome**: Menu → "Add to Home Screen"
- **iOS Safari**: Share → "Add to Home Screen"

---

## Important Notes

**MongoDB Atlas:**
- Must be a valid MongoDB connection string
- Whitelist IP: `0.0.0.0/0` (allow all) for Render's dynamic IPs

**JWT Secrets:**
- Generate strong random strings: `openssl rand -base64 32`
- Use different strings for ACCESS and REFRESH secrets

**CORS:**
- Backend accepts requests from `CLIENT_URL` and requests with no origin (Vercel proxy)
- Bearer token auth works regardless of CORS cookie restrictions

**Free Tier:**
- Render free tier spins down after 15 min idle — first request after sleep is slow
- Use paid tier for production

---

## Troubleshooting

### Frontend can't connect to backend
- Verify `vercel.json` has the correct Render backend URL
- Check `VITE_API_URL` is set to `/api` (relative, not absolute)
- Check Render backend is running: visit `https://yourgate.onrender.com/api/health`

### Login fails on mobile
- Check `NODE_ENV=production` is set on backend
- Verify the token interceptor is working — open browser DevTools → Application → Local Storage → look for `yourgate_access_token`
- Clear the PWA cache: uninstall PWA, clear site data, reinstall

### CORS errors
- Ensure `CLIENT_URL` on backend matches your Vercel domain exactly (no trailing slash)
- Check browser console for the specific blocked origin

### Database connection fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access → `0.0.0.0/0` is whitelisted

---

## Summary: Required Env Variables

| Service | Variable | Value |
|---------|----------|-------|
| **Backend** | `NODE_ENV` | `production` |
| **Backend** | `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/yourgate` |
| **Backend** | `ACCESS_TOKEN_SECRET` | (random 32+ char string) |
| **Backend** | `REFRESH_TOKEN_SECRET` | (different random 32+ char string) |
| **Backend** | `CLIENT_URL` | `https://yourgate.vercel.app` |
| **Frontend** | `VITE_API_URL` | `/api` |
