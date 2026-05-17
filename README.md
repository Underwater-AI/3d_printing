# Underwater AI — 3D Printing Service

Precision 3D printing powered by Bambu Lab P2S, based at IISER Kolkata Campus.

## Tech Stack

**Frontend:** React 18 · Vite · Three.js (React Three Fiber) · Framer Motion · Zustand
**Backend:** Node.js · Express · MongoDB · Razorpay · Nodemailer
**Deployment:** Docker · Railway/Render

## Quick Start

### Client (Frontend)
```bash
cd client
npm install
npm run dev        # → http://localhost:5173
```

### Server (Backend)
```bash
cd server
cp ../.env.example ../.env   # Fill in your keys
npm install
npm run dev        # → http://localhost:5000
```

### Docker
```bash
docker-compose up --build
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `MONGODB_URI` — MongoDB Atlas connection string
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` — From Razorpay dashboard
- `JWT_SECRET` — Random secret for auth tokens
- `EMAIL_*` — SMTP credentials for notifications

## Pages

| Route | Description |
|---|---|
| `/` | Home — Hero with 3D printer scene, services, how-it-works |
| `/order` | Multi-step print job submission form |
| `/gallery` | Past prints showcase |
| `/pricing` | Material pricing table |
| `/track` | Order tracking by ID |
| `/about` | About Underwater AI |
| `/admin` | Admin dashboard (JWT-protected) |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/upload` | Upload STL/3MF/OBJ/STEP |
| POST | `/api/jobs` | Create print job |
| GET | `/api/jobs` | Get user's jobs |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |
| POST | `/api/payment/webhook` | Razorpay webhook |
| GET | `/api/admin/stats` | Admin stats |
| GET | `/api/admin/jobs` | All jobs (admin) |

## Brand

- **Company:** Underwater AI — Computational Marine Imagery
- **Location:** IISER Kolkata Campus, Mohanpur, Nadia, West Bengal — 741246
- **Funded by:** MeitY, Government of India
- **Printer:** Bambu Lab P2S (256³mm build volume, 600mm/s)
- **Colors:** `#000814` (bg) · `#00d4ff` (accent) · `#ff6b35` (Bambu orange)
- **Fonts:** Space Mono (display) · DM Sans (body) · IBM Plex Mono (labels)
