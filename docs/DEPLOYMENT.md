# Deployment Guide

## GitHub Pages (Frontend Only)

The frontend is automatically deployed to GitHub Pages on every push to `main` via GitHub Actions.

**Live URL:** https://underwater-ai.github.io/3d_printing/

### How It Works

The `.github/workflows/deploy.yml` workflow:
1. Checks out the repository
2. Installs client dependencies (`npm ci`)
3. Builds with `BASE_PATH=/3d_printing/` (required for GitHub Pages subdirectory)
4. Uploads the `client/dist` artifact
5. Deploys to GitHub Pages

### Manual Trigger

The workflow can also be triggered manually via `workflow_dispatch` from the Actions tab.

### Configuration

The `BASE_PATH` environment variable in `vite.config.js` controls the base URL:

```js
const base = process.env.BASE_PATH || '/';
```

For GitHub Pages, this is set to `/3d_printing/` during build.

### Limitations

GitHub Pages serves **frontend only** — API calls will fail unless the backend is hosted separately. The site works as a static showcase/demo.

---

## Docker Deployment

### Production Build

The `Dockerfile` uses a multi-stage build:

```bash
# Build and run
docker-compose up --build

# Or manually
docker build -t uai-3dprint .
docker run -p 5000:5000 --env-file .env uai-3dprint
```

**What happens:**
1. **Builder stage:** Builds the React client and installs server production dependencies
2. **Production stage:** Copies built client + server, exposes port 5000
3. Server serves both the API and the built frontend

### Development with Docker Compose

```bash
docker-compose up --build
```

This runs:
- **Server** on port `5000` (Express + API)
- **Client** on port `5173` (Vite dev server with HMR)

The client volume-mounts `src/` for live reloading.

---

## Railway Deployment

### Steps

1. Push code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select the repository
4. Railway auto-detects the `Dockerfile`
5. Add environment variables (see below)
6. Deploy

### Environment Variables

Set these in the Railway dashboard:

```
MONGODB_URI=mongodb+srv://...
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
JWT_SECRET=your_jwt_secret
CLIENT_URL=https://your-app.up.railway.app
NODE_ENV=production
PORT=5000
```

---

## Render Deployment

### Steps

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect the repository
4. Configure:
   - **Build Command:** `cd client && npm ci && npm run build && cd ../server && npm ci --omit=dev`
   - **Start Command:** `cd server && node index.js`
   - **Environment:** Docker (or use the build command approach)
5. Add environment variables
6. Deploy

### Alternative: Docker

Render also supports Docker deployments. Use the existing `Dockerfile`:

1. New → Web Service → Docker
2. Select the repository
3. Render auto-detects the `Dockerfile`
4. Add environment variables
5. Deploy

---

## Environment Variables Reference

Copy `.env.example` to `.env` and fill in:

| Variable | Required | Description | Example |
|---|---|---|---|
| `PORT` | No | Server port (default: `5000`) | `5000` |
| `NODE_ENV` | No | Environment mode | `production` |
| `CLIENT_URL` | Yes | Frontend URL for CORS | `http://localhost:5173` |
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens | `random_secret_string` |
| `JWT_EXPIRES_IN` | No | JWT token expiry (default: `7d`) | `7d` |
| `RAZORPAY_KEY_ID` | Yes | Razorpay dashboard key | `rzp_live_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay dashboard secret | `your_secret` |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signature secret | `whsec_xxx` |
| `EMAIL_HOST` | No | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | No | SMTP port | `587` |
| `EMAIL_USER` | No | SMTP username | `user@gmail.com` |
| `EMAIL_PASS` | No | SMTP password (app password for Gmail) | `your_app_password` |
| `MAX_FILE_SIZE_MB` | No | Max upload size in MB (default: `100`) | `100` |
| `UPLOAD_DIR` | No | Upload directory (default: `./uploads`) | `./uploads` |
| `ADMIN_EMAIL` | No | Default admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | No | Default admin password | `changeme` |

---

## MongoDB Setup

### MongoDB Atlas (Recommended)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user (Database Access → Add User)
4. Whitelist your IP (Network Access → Add IP Address) — use `0.0.0.0/0` for all IPs
5. Get the connection string (Database → Connect → Drivers)
6. Set as `MONGODB_URI` in `.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/underwaterai_printing?retryWrites=true&w=majority
```

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt install mongodb

# macOS
brew tap mongodb/brew && brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb
# or
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/underwaterai_printing
```

### Docker MongoDB

Add a MongoDB service to `docker-compose.yml`:

```yaml
services:
  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Then set:
```
MONGODB_URI=mongodb://mongodb:27017/underwaterai_printing
```

---

## Razorpay Setup

1. Go to [dashboard.razorpay.com](https://dashboard.razorpay.com)
2. Sign up / Login
3. Go to Settings → API Keys → Generate Key
4. Copy Key ID and Key Secret
5. Go to Settings → Webhooks → Add Webhook
6. Set URL: `https://your-domain.com/api/payment/webhook`
7. Select event: `payment.captured`
8. Copy the webhook secret

---

## Gmail SMTP Setup (for email notifications)

1. Enable 2-Factor Authentication on your Google account
2. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use the app password as `EMAIL_PASS`
