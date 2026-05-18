# API Reference

Base URL: `http://localhost:5000/api` (development) or `/api` (production)

All responses are JSON. Errors follow the format:
```json
{ "error": "Error message" }
```

## Authentication

Protected routes require a `Bearer` token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

## Auth Routes

### POST `/api/auth/register`

Register a new user.

**Auth:** None

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+919876543210"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` — Email already registered
- `400` — Validation error (missing fields, password too short)

---

### POST `/api/auth/login`

Login with email and password.

**Auth:** None

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user"
  }
}
```

**Errors:**
- `400` — Email and password required
- `401` — Invalid credentials

---

### GET `/api/auth/me`

Get current authenticated user.

**Auth:** Required

**Response (200):**
```json
{
  "user": {
    "_id": "60d5ecb74b24a1234567890a",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "user"
  }
}
```

---

## Job Routes

### POST `/api/jobs`

Create a new print job.

**Auth:** Required

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "+919876543210",
  "fileId": "1699999999999-123456789.stl",
  "originalName": "my-model.stl",
  "fileSize": 2048576,
  "filePath": "/uploads/1699999999999-123456789.stl",
  "material": "PLA",
  "color": "White",
  "layerHeight": 0.2,
  "infill": 20,
  "supports": false,
  "brim": false,
  "multicolor": false,
  "quantity": 1,
  "deliveryMethod": "pickup",
  "specialInstructions": "Please print slowly for best quality"
}
```

**Response (201):**
```json
{
  "job": {
    "_id": "60d5ecb74b24a1234567890b",
    "customerId": "60d5ecb74b24a1234567890a",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "customerPhone": "+919876543210",
    "fileId": "1699999999999-123456789.stl",
    "originalName": "my-model.stl",
    "material": "PLA",
    "color": "White",
    "layerHeight": 0.2,
    "infill": 20,
    "supports": false,
    "brim": false,
    "multicolor": false,
    "quantity": 1,
    "deliveryMethod": "pickup",
    "materialCost": 100,
    "setupFee": 50,
    "deliveryCost": 0,
    "gst": 27,
    "totalCost": 177,
    "status": "pending",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### POST `/api/jobs/estimate`

Get a price estimate without creating a job.

**Auth:** None

**Request Body:**
```json
{
  "material": "PLA",
  "quantity": 2,
  "deliveryMethod": "courier",
  "multicolor": false,
  "estimatedWeight": 50,
  "state": "West Bengal",
  "city": "Kolkata"
}
```

**Response (200):**
```json
{
  "materialCost": 200,
  "setupFee": 50,
  "multicolorFee": 0,
  "deliveryCost": 80,
  "gst": 60,
  "totalCost": 390
}
```

---

### GET `/api/jobs`

Get all jobs for the authenticated user.

**Auth:** Required

**Response (200):**
```json
{
  "jobs": [
    {
      "_id": "60d5ecb74b24a1234567890b",
      "customerName": "John Doe",
      "originalName": "my-model.stl",
      "material": "PLA",
      "status": "pending",
      "totalCost": 177,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### GET `/api/jobs/track/:id`

Track a job by ID (public endpoint). Supports full 24-char MongoDB ObjectId or partial ID suffix.

**Auth:** None

**Query Parameters:**
| Param | Type | Description |
|---|---|---|
| `email` | string | Optional — verify order belongs to this email |

**Response (200):**
```json
{
  "job": {
    "_id": "60d5ecb74b24a1234567890b",
    "customerName": "John Doe",
    "originalName": "my-model.stl",
    "material": "PLA",
    "color": "White",
    "status": "printing",
    "totalCost": 177,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "printedAt": "2025-01-16T14:00:00.000Z"
  }
}
```

**Errors:**
- `404` — Order not found
- `404` — Order not found for this email (if email mismatch)

---

### GET `/api/jobs/:id`

Get a single job by ID.

**Auth:** Required (owner or admin)

**Response (200):**
```json
{
  "job": {
    "_id": "60d5ecb74b24a1234567890b",
    "customerId": "60d5ecb74b24a1234567890a",
    "customerName": "John Doe",
    "customerEmail": "john@example.com",
    "material": "PLA",
    "status": "confirmed",
    "totalCost": 177,
    "paidAt": "2025-01-15T11:00:00.000Z"
  }
}
```

**Errors:**
- `404` — Job not found
- `403` — Not authorized

---

## Payment Routes

### POST `/api/payment/create-order`

Create a Razorpay order for a print job.

**Auth:** Required

**Request Body:**
```json
{
  "jobId": "60d5ecb74b24a1234567890b"
}
```

**Response (200):**
```json
{
  "orderId": "order_ABC123xyz",
  "amount": 17700,
  "currency": "INR",
  "keyId": "rzp_test_xxxxxxxxxxxx"
}
```

**Errors:**
- `404` — Job not found
- `500` — Razorpay credentials not configured

---

### POST `/api/payment/verify`

Verify a Razorpay payment signature.

**Auth:** Required

**Request Body:**
```json
{
  "razorpay_order_id": "order_ABC123xyz",
  "razorpay_payment_id": "pay_DEF456uvw",
  "razorpay_signature": "a1b2c3d4e5f6...",
  "jobId": "60d5ecb74b24a1234567890b"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified. Your print job is confirmed!"
}
```

**Errors:**
- `400` — Invalid payment signature

---

### POST `/api/payment/webhook`

Razorpay webhook endpoint. Verifies HMAC-SHA256 signature from `x-razorpay-signature` header.

**Auth:** None (signature-verified)

**Events Handled:**
- `payment.captured` — Updates payment status to `captured`

**Response (200):**
```json
{ "received": true }
```

---

## Upload Routes

### POST `/api/upload`

Upload a 3D model file.

**Auth:** Required

**Content-Type:** `multipart/form-data`

**Form Fields:**
| Field | Type | Description |
|---|---|---|
| `file` | File | STL, 3MF, OBJ, STEP, or STP file (max 100MB) |

**Response (200):**
```json
{
  "fileId": "1699999999999-123456789.stl",
  "originalName": "my-model.stl",
  "fileSize": 2048576,
  "filePath": "/uploads/1699999999999-123456789.stl"
}
```

**Errors:**
- `400` — No file uploaded
- `400` — Invalid file type (allowed: `.stl`, `.3mf`, `.obj`, `.step`, `.stp`)
- `400` — File too large (max 100MB)

---

## Admin Routes

All admin routes require authentication with an admin role.

### GET `/api/admin/stats`

Get dashboard statistics.

**Auth:** Required (admin)

**Response (200):**
```json
{
  "ordersToday": 5,
  "ordersWeek": 23,
  "totalOrders": 156,
  "revenueToday": 8500,
  "revenueMonth": 45200
}
```

---

### GET `/api/admin/jobs`

Get all jobs with optional filters.

**Auth:** Required (admin)

**Query Parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `status` | string | — | Filter by status |
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Results per page |

**Response (200):**
```json
{
  "jobs": [
    {
      "_id": "60d5ecb74b24a1234567890b",
      "customerName": "John Doe",
      "customerEmail": "john@example.com",
      "originalName": "my-model.stl",
      "material": "PLA",
      "status": "pending",
      "totalCost": 177,
      "createdAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 156,
  "page": 1,
  "pages": 4
}
```

---

### PUT `/api/admin/jobs/:id/status`

Update a job's status.

**Auth:** Required (admin)

**Request Body:**
```json
{
  "status": "printing"
}
```

**Valid Status Values:**
`pending` → `confirmed` → `printing` → `quality_check` → `ready` → `dispatched` → `delivered`

Special: `cancelled` (from any status)

**Response (200):**
```json
{
  "job": {
    "_id": "60d5ecb74b24a1234567890b",
    "status": "printing",
    "printedAt": "2025-01-16T14:00:00.000Z"
  }
}
```

**Notes:**
- Setting status to `printing` automatically sets `printedAt`
- Setting status to `delivered` automatically sets `deliveredAt`

---

### GET `/api/admin/materials`

Get all materials.

**Auth:** Required (admin)

**Response (200):**
```json
{
  "materials": [
    {
      "_id": "60d5ecb74b24a1234567890c",
      "name": "PLA",
      "displayName": "PLA (Polylactic Acid)",
      "pricePerGram": 2.00,
      "minCharge": 50,
      "available": true,
      "category": "standard",
      "colors": ["White", "Black", "Red", "Blue", "Green"],
      "properties": {
        "tempRange": "190-220°C",
        "bedTemp": "50-60°C",
        "flexible": false,
        "foodSafe": true
      }
    }
  ]
}
```

---

### PUT `/api/admin/materials/:id`

Update a material's properties.

**Auth:** Required (admin)

**Request Body:**
```json
{
  "pricePerGram": 2.50,
  "available": false
}
```

**Response (200):**
```json
{
  "material": {
    "_id": "60d5ecb74b24a1234567890c",
    "name": "PLA",
    "pricePerGram": 2.50,
    "available": false
  }
}
```

---

## Health Check

### GET `/health`

Server health check.

**Auth:** None

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

---

## Error Codes

| Code | Description |
|---|---|
| `400` | Bad request / Validation error |
| `401` | Not authorized / Invalid token |
| `403` | Forbidden (admin access required) |
| `404` | Resource not found |
| `429` | Rate limit exceeded (100 req/15 min) |
| `500` | Internal server error |
