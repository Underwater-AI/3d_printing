# System Architecture

## Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18 · Vite · Three.js (React Three Fiber + Drei) · Framer Motion · Zustand |
| **Backend** | Node.js · Express · MongoDB (Mongoose) · Razorpay · Nodemailer |
| **Assets** | Real Bambu Lab P2S product images · SVG brand assets · Procedural Three.js textures |
| **Deploy** | GitHub Pages (frontend) · Docker · Railway / Render (full stack) |

## Directory Structure

```
3d_printing/
├── client/                        # React frontend (Vite)
│   ├── public/
│   │   ├── assets/
│   │   │   ├── printer/           # Bambu Lab P2S product images
│   │   │   │   ├── feature/       # Feature highlight images
│   │   │   │   ├── gallery/       # Gallery showcase images
│   │   │   │   ├── hero/          # Hero section images
│   │   │   │   ├── product/       # Product detail images
│   │   │   │   └── video/         # Printer demo videos
│   │   │   └── ui/                # Brand assets (logo, OG image)
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── forms/             # PrintJobForm, FileUpload, MaterialSelector
│   │   │   ├── layout/            # Navbar, Footer
│   │   │   ├── three/             # PrinterScene (Three.js)
│   │   │   └── ui/                # Badge, Button, Modal, PriceTag, etc.
│   │   ├── lib/                   # store.js, razorpay.js, pretext.js
│   │   ├── pages/                 # Route-level page components
│   │   ├── styles/                # tokens.css, globals.css
│   │   ├── App.jsx                # Root component with routing
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   └── vite.config.js
├── server/                        # Express backend
│   ├── config/                    # db.js, razorpay.js, multer.js
│   ├── controllers/               # auth, jobs, payment, upload, admin
│   ├── middleware/                 # auth, adminOnly, errorHandler
│   ├── models/                    # User, PrintJob, Payment, Material
│   ├── routes/                    # auth, jobs, payment, upload, admin
│   ├── utils/                     # pricing, email, notifications
│   └── index.js                   # Server entry point
├── uploads/                       # Uploaded STL/3MF/OBJ/STEP files
├── scripts/                       # Utility scripts
├── Dockerfile                     # Multi-stage production build
├── docker-compose.yml             # Development compose setup
├── .env.example                   # Environment variable template
└── .github/workflows/             # CI/CD (ci.yml, deploy.yml)
```

## Frontend Architecture

### Routing (React Router v6)

All pages are lazy-loaded via `React.lazy()` with `Suspense` fallbacks. Routes are wrapped in `AnimatePresence` for page transitions.

| Route | Component | Auth | Description |
|---|---|---|---|
| `/` | `Home` | Public | Hero with 3D printer scene, services, printer showcase |
| `/order` | `Order` | Public | Multi-step print job submission with live pricing |
| `/gallery` | `Gallery` | Public | Bambu Lab P2S print showcase with category filters |
| `/pricing` | `Pricing` | Public | Material pricing table |
| `/track` | `Track` | Public | Order tracking by ID with timeline |
| `/about` | `About` | Public | About Underwater AI, team, printer specs |
| `/assets` | `FreeAssets` | Public | Free 3D model assets |
| `/admin` | `Dashboard` | Admin | Job queue, stats, status management |
| `/privacy` | `Privacy` | Public | Privacy policy |
| `/terms` | `Terms` | Public | Terms of service |

### Component Organization

```
components/
├── forms/
│   ├── FileUpload.jsx         # Drag-and-drop file upload (react-dropzone)
│   ├── MaterialSelector.jsx   # Material picker with properties
│   └── PrintJobForm.jsx       # Multi-step order form
├── layout/
│   ├── Navbar.jsx             # Navigation bar
│   └── Footer.jsx             # Site footer
├── three/
│   └── PrinterScene.jsx       # Three.js 3D printer model viewer
└── ui/
    ├── Badge.jsx              # Status badges
    ├── Button.jsx             # Reusable button component
    ├── ErrorBoundary.jsx      # Error boundary wrapper
    ├── Modal.jsx              # Modal dialog
    ├── PageTransition.jsx     # Framer Motion page wrapper
    ├── PriceTag.jsx           # Price display component
    └── ScrollReveal.jsx       # Scroll-triggered animations
```

### State Management (Zustand)

Three stores manage client-side state:

- **`useAuthStore`** — User authentication (login, register, logout). Persists to `localStorage`.
- **`useJobStore`** — Current print job data during the order flow.
- **`useUIStore`** — UI state (mobile detection).

### Styling

Styles follow a token-based design system:

- `styles/tokens.css` — CSS custom properties for colors, typography, spacing, shadows, transitions
- `styles/globals.css` — Reset, base element styles, utility classes

All components use CSS custom properties from `tokens.css` for consistent theming.

## Backend Architecture

### Server Entry (`server/index.js`)

The Express server:
1. Applies security middleware (Helmet, CORS, rate limiting)
2. Connects to MongoDB (graceful fallback if unavailable)
3. Mounts API routes under `/api/`
4. Serves uploaded files from `/uploads/`
5. In production, serves the React build and handles SPA routing

### Routes → Controllers → Models

```
Request → Route → Middleware → Controller → Model → Response
```

- **Routes** (`server/routes/`) — Define endpoints and apply middleware
- **Controllers** (`server/controllers/`) — Business logic for each resource
- **Models** (`server/models/`) — Mongoose schemas and database operations
- **Middleware** (`server/middleware/`) — Auth verification, admin check, error handling

### Middleware Pipeline

1. **`helmet()`** — Security headers
2. **`cors()`** — Cross-origin resource sharing
3. **`express-rate-limit`** — 100 requests per 15 minutes per IP
4. **`express.json()`** — Body parsing (10MB limit)
5. **`protect`** — JWT authentication (per-route)
6. **`adminOnly`** — Admin role check (per-route)
7. **`errorHandler`** — Centralized error handling

### Database Models

#### User
```
name, email (unique), password (bcrypt hashed), phone, role (user|admin)
```

#### PrintJob
```
customerId → User, customerName, customerEmail, customerPhone,
fileId, originalName, fileSize, filePath,
material (PLA|PLA+|PETG|ABS|ASA|TPU|PA-CF), color, layerHeight, infill,
supports, brim, multicolor, quantity,
deliveryMethod (pickup|courier), address, city, state, pincode,
estimatedWeight, estimatedPrintTime, materialCost, setupFee, deliveryCost, gst, totalCost,
status (pending|confirmed|printing|quality_check|ready|dispatched|delivered|cancelled)
```

#### Payment
```
jobId → PrintJob, razorpayOrderId (unique), razorpayPaymentId,
amount, status (created|paid|captured|failed|refunded)
```

#### Material
```
name (unique), displayName, pricePerGram, minCharge, available,
category (standard|engineering|flexible|specialty), colors[], properties
```

## 3D Scene (Three.js)

The `PrinterScene` component (`client/src/components/three/PrinterScene.jsx`) renders an interactive 3D printer model using:

- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Helpers (OrbitControls, Stars, Float, Environment, ContactShadows)
- **GLTF model** — Loaded via `useGLTF` from `/assets/printer/models/printer-google.glb`

Features:
- Auto-rotation with gentle floating animation
- Studio environment lighting with sage green and gold point lights
- Starfield background
- Contact shadows for grounding
- Low-power fallback: detects `< 4GB` device memory or missing WebGL and shows a static image instead

## Design System

See [DESIGN.md](./DESIGN.md) for the complete design system reference.

The design uses a warm espresso + sage green palette:

- **Backgrounds:** `#1a1612` (primary) → `#342e28` (elevated)
- **Accent:** `#8fae7e` (sage) · `#c4a882` (gold)
- **Typography:** Cormorant Garamond (display), Outfit (body), JetBrains Mono (labels)
- **Fluid type scale:** Smoothly interpolates from 375px to 1280px viewport

## Payment Flow (Razorpay)

```
1. User submits print job → POST /api/jobs
2. Frontend calls → POST /api/payment/create-order { jobId }
3. Server creates Razorpay order → returns orderId, amount, keyId
4. Frontend opens Razorpay checkout modal
5. User completes payment
6. Frontend calls → POST /api/payment/verify { orderId, paymentId, signature, jobId }
7. Server verifies HMAC-SHA256 signature
8. Server updates Payment and PrintJob status → sends confirmation emails
```

Webhook support: `POST /api/payment/webhook` handles `payment.captured` events with HMAC-SHA256 verification.

## File Upload Flow

```
1. User selects file (drag-and-drop or file picker)
2. Frontend validates extension (.stl, .3mf, .obj, .step, .stp)
3. Frontend calls → POST /api/upload (multipart/form-data)
4. Multer validates extension and size (max 100MB)
5. File saved to /uploads/ with unique timestamp filename
6. Server returns { fileId, originalName, fileSize, filePath }
7. Frontend includes fileId in the print job submission
```

Supported formats: STL, 3MF, OBJ, STEP/STP
