# YourGate Backend Architecture

## Tech Stack
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Auth:** Cookie-based (HTTP-only) with Access + Refresh token strategy
- **Validation:** Zod
- **Password Hashing:** bcryptjs

---

## Folder Structure

```
Backend/
├── src/
│   ├── config/
│   │   ├── db.ts              # MongoDB connection setup
│   │   └── env.ts             # Environment variable loader
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── community.controller.ts
│   │   ├── accessCode.controller.ts
│   │   ├── visitor.controller.ts
│   │   ├── amenity.controller.ts
│   │   └── booking.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── admin.service.ts
│   │   ├── community.service.ts
│   │   ├── accessCode.service.ts
│   │   ├── visitor.service.ts
│   │   ├── amenity.service.ts
│   │   └── booking.service.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Community.ts
│   │   ├── AccessCode.ts
│   │   ├── VisitorLog.ts
│   │   ├── Amenity.ts
│   │   └── Booking.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── community.routes.ts
│   │   ├── accessCode.routes.ts
│   │   ├── visitor.routes.ts
│   │   ├── amenity.routes.ts
│   │   └── booking.routes.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts   # isAuthenticated, authorizeRoles
│   │   └── validate.middleware.ts # Zod body validation
│   ├── validators/
│   │   └── schemas.ts           # Zod schemas for all endpoints
│   ├── utils/
│   │   ├── token.ts             # JWT sign/verify + short code generator
│   │   ├── cookies.ts           # HTTP-only cookie helpers
│   │   └── errors.ts            # AppError class
│   ├── types/
│   │   └── index.ts             # Enums & interfaces (Role, Status, etc.)
│   ├── app.ts                   # Express app entry point
│   └── seed.ts                  # Seed script for dev data
├── .env
├── package.json
└── tsconfig.json
```

---

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| Clean Architecture | Controllers → Services → Models (no business logic in controllers) |
| Multi-Tenancy | Every query is scoped by `communityId` |
| RBAC | Middleware-based: `authorizeRoles(Role.ADMIN, Role.RESIDENT)` |
| Security | HTTP-only cookies, bcrypt, Zod validation, no cross-community access |
| Modularity | One file per resource per layer (controller, service, model, route) |

---

## Roles

| Role | Description |
|------|-------------|
| `SUPER_ADMIN` | Manages entire platform, approves/rejects communities |
| `ADMIN` | Manages one community — approves residents, creates amenities |
| `RESIDENT` | Generates visitor access codes, books amenities |
| `SECURITY` | Validates access codes, records visitor entry/exit |

---

## Authentication Flow

1. **Login** → Server validates credentials → sets `accessToken` + `refreshToken` as HTTP-only cookies
2. **Every request** → `isAuthenticated` middleware reads cookie → verifies access token
3. **Token expired** → Middleware auto-refreshes using refresh token cookie
4. **Logout** → Clears both cookies + removes refreshToken from DB

---

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register (creates PENDING user) |
| POST | `/login` | No | Login (only APPROVED users) |
| POST | `/logout` | Yes | Clear cookies |
| GET | `/me` | Yes | Get current user profile |

### Admin (`/api/admin`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/pending-users` | ADMIN | List pending users |
| PATCH | `/approve-user/:id` | ADMIN | Approve user |
| PATCH | `/reject-user/:id` | ADMIN | Reject user |
| GET | `/users` | ADMIN | All community users |

### Community (`/api/community`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register community + admin |
| GET | `/approved` | No | List approved communities (for registration) |
| GET | `/all` | SUPER_ADMIN | All communities |
| PATCH | `/approve/:id` | SUPER_ADMIN | Approve community |
| PATCH | `/reject/:id` | SUPER_ADMIN | Reject community |

### Access Code (`/api/access-code`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/generate` | RESIDENT | Generate visitor code |
| POST | `/validate` | SECURITY | Validate a code |
| GET | `/my` | RESIDENT | My generated codes |

### Visitor (`/api/visitor`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/entry` | SECURITY | Record entry |
| POST | `/exit` | SECURITY | Record exit |
| GET | `/logs` | ADMIN/SECURITY | Visitor logs |
| GET | `/active` | SECURITY | Currently inside visitors |

### Amenities (`/api/amenities`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ADMIN | Create amenity |
| GET | `/` | ADMIN/RESIDENT | List amenities |
| PUT | `/:id` | ADMIN | Update amenity |
| DELETE | `/:id` | ADMIN | Delete amenity |

### Bookings (`/api/bookings`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | RESIDENT | Book a slot |
| GET | `/my` | RESIDENT | My bookings |
| DELETE | `/:id` | RESIDENT | Cancel booking |
| GET | `/community` | ADMIN | All community bookings |
| GET | `/availability` | Any auth | Slot availability |

---

## Database Models

### User
- `name`, `email`, `password`, `role`, `flatNumber`, `communityId`, `status`, `refreshToken`
- Indexes: `email` (unique), `communityId + status`

### Community
- `communityName`, `address`, `adminId`, `status`, `paymentCompleted`
- Index: `adminId`

### AccessCode
- `code` (unique), `type`, `generatedBy`, `communityId`, `expiresAt`, `usageLimit`, `usedCount`, `status`
- Indexes: `code`, `communityId`, `generatedBy`

### VisitorLog
- `visitorName`, `visitorType`, `codeUsed`, `entryTime`, `exitTime`, `communityId`, `verifiedBy`
- Index: `communityId + entryTime`

### Amenity
- `name`, `description`, `communityId`, `bookingLimitPerUser`, `timeSlots[]`
- Index: `communityId`

### Booking
- `userId`, `amenityId`, `communityId`, `slotTime`, `date`, `status`
- Indexes: `amenityId + date + slotTime`, `userId + amenityId`

---

## Seed Data Accounts
| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@yourgate.com | password123 |
| Admin | admin@greenvalley.com | password123 |
| Resident | resident@greenvalley.com | password123 |
| Security | security@greenvalley.com | password123 |
| Pending Resident | pending@greenvalley.com | password123 |

Community: **Green Valley Residency** (APPROVED)
Pending Community: **Sunrise Park Villas** (PENDING)
