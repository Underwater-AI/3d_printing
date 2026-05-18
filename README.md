# Underwater AI — 3D Printing Service

Production-grade 3D printing service website powered by Bambu Lab P2S, based at IISER Kolkata Campus, Mohanpur, Nadia, West Bengal. Funded by MeitY, Government of India.

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 · Vite · Three.js (React Three Fiber + Drei) · Framer Motion · Zustand |
| **Backend** | Node.js · Express · MongoDB (Mongoose) · Razorpay · Nodemailer |
| **Assets** | Real Bambu Lab P2S product images · SVG brand assets · Procedural Three.js textures |
| **Deploy** | Docker · Railway / Render |

## Quick Start

### 1. Clone & configure

```bash
git clone git@github.com:Underwater-AI/3d_printing.git
cd 3d_printing
cp .env.example .env
# Edit .env with your keys (see Environment Variables below)
```

### 2. Run locally

**Client (frontend):**
```bash
cd client
npm install
npm run dev        # → http://localhost:5173
```

**Server (backend):**
```bash
cd server
npm install
npm run dev        # → http://localhost:5000
```

The Vite dev server proxies `/api` and `/uploads` to `localhost:5000` automatically.

### 3. Docker (production)

```bash
docker-compose up --build
# → http://localhost:5000 (serves both API and built frontend)
```

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `RAZORPAY_KEY_ID` | Razorpay dashboard key |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard secret |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature secret |
| `JWT_SECRET` | Random secret for auth tokens |
| `EMAIL_HOST` | SMTP host (e.g. `smtp.gmail.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `587`) |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `CLIENT_URL` | Frontend URL for CORS (default: `http://localhost:5173`) |
| `PORT` | Server port (default: `5000`) |

## Pages

| Route | Description | Auth |
|---|---|---|
| `/` | Home — Hero with 3D printer scene + video, services, printer showcase | Public |
| `/order` | Multi-step print job submission with live pricing | Public |
| `/gallery` | Real Bambu Lab P2S print showcase with category filters | Public |
| `/pricing` | Material pricing table | Public |
| `/track` | Order tracking by ID with timeline | Public |
| `/about` | About Underwater AI, team, printer specs | Public |
| `/admin` | Admin dashboard — job queue, stats, status management | Admin |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms of service | Public |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login, returns JWT |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/jobs` | User | Create print job |
| POST | `/api/jobs/estimate` | User | Get price estimate |
| GET | `/api/jobs` | User | Get user's jobs |
| GET | `/api/jobs/track/:id` | Public | Track order by ID |
| GET | `/api/jobs/:id` | User | Get single job |

### Payment
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |
| POST | `/api/payment/webhook` | Razorpay webhook (HMAC-SHA256) |

### Upload
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload` | Upload STL/3MF/OBJ/STEP file |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Dashboard stats (orders, revenue) |
| GET | `/api/admin/jobs` | All jobs with filters |
| PUT | `/api/admin/jobs/:id/status` | Update job status |

## Project Structure

```
3d_printing/
├── client/                    # React frontend
│   ├── public/
│   │   ├── assets/
│   │   │   ├── printer/       # Bambu Lab P2S product images
│   │   │   │   ├── feature/   # Feature highlight images
│   │   │   │   ├── gallery/   # Gallery showcase images
│   │   │   │   ├── hero/      # Hero section images
│   │   │   │   ├── product/   # Product detail images
│   │   │   │   └── video/     # Printer demo videos
│   │   │   └── ui/            # Brand assets (logo, OG image)
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/         # PrintJobForm, FileUpload, MaterialSelector
│   │   │   ├── layout/        # Navbar, Footer
│   │   │   ├── three/         # PrinterScene (Three.js)
│   │   │   └── ui/            # Badge, Button, Modal, PriceTag
│   │   ├── lib/               # store.js, razorpay.js, pretext.js
│   │   ├── pages/             # Home, Order, Gallery, Track, Dashboard, etc.
│   │   └── styles/            # tokens.css, globals.css
│   └── vite.config.js
├── server/                    # Express backend
│   ├── config/                # db.js, razorpay.js
│   ├── controllers/           # auth, jobs, payment, upload, admin
│   ├── middleware/             # auth, adminOnly, errorHandler
│   ├── models/                # User, PrintJob, Payment, Material
│   ├── routes/                # auth, jobs, payment, upload, admin
│   └── utils/                 # pricing, email, notifications
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Brand

- **Company:** Underwater AI — Computational Marine Imagery
- **Location:** IISER Kolkata Campus, Mohanpur, Nadia, West Bengal — 741246
- **Funded by:** MeitY, Government of India
- **Printer:** Bambu Lab P2S (256³mm build volume, 600mm/s, AI detection, 4-color AMS)
- **Colors:** `#000814` (bg) · `#00d4ff` (accent) · `#ff6b35` (Bambu orange)
- **Fonts:** Space Mono (display) · DM Sans (body) · IBM Plex Mono (labels)

Printer product images courtesy of [Bambu Lab](https://bambulab.com/en-in/p2s). Underwater AI is an independent service provider — not affiliated with or endorsed by Bambu Lab.
