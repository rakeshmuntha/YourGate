# YourGate Frontend Architecture

## Tech Stack
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (dark/light theme)
- **State Management:** Redux Toolkit
- **HTTP Client:** Axios (with cookies)
- **Routing:** React Router v6
- **Notifications:** react-hot-toast
- **Icons:** react-icons (Heroicons 2)
- **QR Generation:** qrcode

---

## Folder Structure

```
Frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── ThemeToggle.tsx       # Dark/Light mode switch
│   │   │   ├── LoadingSpinner.tsx    # Reusable spinner
│   │   │   ├── ProtectedRoute.tsx    # Role-based route guard
│   │   │   └── StatCard.tsx          # Dashboard metric card
│   │   └── layout/
│   │       └── DashboardLayout.tsx   # Sidebar + topbar layout w/ Outlet
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── RegisterCommunityPage.tsx
│   │   ├── resident/
│   │   │   ├── ResidentDashboard.tsx
│   │   │   ├── AccessCodesPage.tsx    # Generate QR + short codes
│   │   │   ├── ResidentAmenitiesPage.tsx
│   │   │   └── ResidentBookingsPage.tsx
│   │   ├── security/
│   │   │   ├── SecurityDashboard.tsx
│   │   │   ├── VerifyCodePage.tsx     # Code validation + entry recording
│   │   │   └── SecurityVisitorLogs.tsx
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ManageUsersPage.tsx    # Approve/reject residents
│   │   │   ├── ManageAmenitiesPage.tsx
│   │   │   ├── AdminBookingsPage.tsx
│   │   │   └── AdminVisitorLogs.tsx
│   │   ├── superadmin/
│   │   │   ├── SuperAdminDashboard.tsx
│   │   │   └── CommunitiesPage.tsx    # Approve/reject communities
│   │   ├── UnauthorizedPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── store/
│   │   ├── store.ts                  # Redux store config
│   │   └── slices/
│   │       ├── authSlice.ts          # Auth state + async thunks
│   │       └── themeSlice.ts         # Theme toggle with localStorage
│   ├── services/
│   │   └── api.ts                    # Axios instance + all API calls
│   ├── hooks/
│   │   └── useRedux.ts              # Typed useDispatch/useSelector
│   ├── types/
│   │   └── index.ts                  # All TypeScript interfaces
│   ├── App.tsx                       # Route definitions
│   ├── main.tsx                      # Entry point
│   ├── index.css                     # Tailwind + custom classes
│   └── vite-env.d.ts
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Design System

### Theme
- Uses Tailwind's `class` strategy for dark mode
- Theme preference stored in `localStorage` under key `yourgate-theme`
- Defaults to system preference on first visit
- Toggle button accessible from topbar (all pages) and auth pages

### Custom CSS Classes (defined in `index.css`)
| Class | Usage |
|-------|-------|
| `.btn-primary` | Primary action button (indigo gradient) |
| `.btn-secondary` | Secondary/cancel button |
| `.btn-danger` | Destructive action button |
| `.btn-success` | Confirmation/approve button |
| `.card` | Content container with border + shadow |
| `.input-field` | Form input with focus ring |
| `.badge-pending` | Amber status badge |
| `.badge-approved` | Green status badge |
| `.badge-rejected` | Red status badge |
| `.badge-active` | Blue status badge |
| `.badge-expired` | Gray status badge |

### Color Palette
- Primary: Indigo (500-700 range)
- Gradients on dashboard stats cards
- Consistent dark mode counterparts for all colors

---

## Authentication Flow

1. **App boots** → `fetchCurrentUser()` thunk fires → hits `GET /api/auth/me`
2. Cookie exists? → Returns user → `isAuthenticated = true`
3. No cookie? → 401 → stays on login page
4. **Login** → `POST /api/auth/login` → server sets HTTP-only cookies → user stored in Redux
5. **Logout** → `POST /api/auth/logout` → cookies cleared → Redux state reset
6. All API calls use `withCredentials: true` via Axios instance

---

## Route Protection

`ProtectedRoute` component wraps dashboard layouts:
- Checks `isAuthenticated` and `user.role` against `allowedRoles`
- Redirects to `/login` if unauthenticated
- Redirects to `/unauthorized` if wrong role
- Shows spinner while auth state is loading

---

## Routing Map

### Public
| Path | Page |
|------|------|
| `/login` | Login with redirect to dashboard |
| `/register` | User registration (RESIDENT / SECURITY) |
| `/register-community` | Community + admin registration |

### Resident (`/resident/*`)
| Path | Page |
|------|------|
| `/resident` | Dashboard with stats |
| `/resident/access-codes` | Generate & manage visitor codes |
| `/resident/amenities` | Browse amenities |
| `/resident/bookings` | Book slots & manage bookings |

### Security (`/security/*`)
| Path | Page |
|------|------|
| `/security` | Dashboard with active visitors |
| `/security/verify` | Code validation + entry recording |
| `/security/visitors` | Full visitor log with exit recording |

### Admin (`/admin/*`)
| Path | Page |
|------|------|
| `/admin` | Dashboard with all stats |
| `/admin/users` | Approve/reject/view users |
| `/admin/amenities` | CRUD amenities |
| `/admin/bookings` | View all bookings |
| `/admin/visitors` | View visitor logs |

### Super Admin (`/super-admin/*`)
| Path | Page |
|------|------|
| `/super-admin` | Platform overview stats |
| `/super-admin/communities` | Approve/reject communities |

---

## API Integration

All API calls are centralized in `src/services/api.ts`:
- `authAPI` — login, register, logout, getMe
- `communityAPI` — register, getApproved, getAll, approve, reject
- `adminAPI` — getPendingUsers, approveUser, rejectUser, getUsers
- `accessCodeAPI` — generate, validate, getMyCodes
- `visitorAPI` — entry, exit, getLogs, getActive
- `amenityAPI` — create, getAll, update, delete
- `bookingAPI` — create, getMyBookings, cancel, getCommunityBookings, getAvailability

Vite dev server proxies `/api` requests to `http://localhost:5000`.

---

## Key Components

### DashboardLayout
- Responsive sidebar with role-based navigation
- Mobile hamburger menu with overlay
- Top bar with theme toggle
- User info + sign out in sidebar footer

### VerifyCodePage (Security)
- 3-step flow: Enter Code → Validate → Record Entry
- Manual code entry with uppercase formatting
- Shows code details + resident info after validation

### AccessCodesPage (Resident)
- Card grid of generated codes with status
- Modal for creating new codes (type, expiry, usage limit)
- QR code generation modal using `qrcode` library

### ResidentBookingsPage
- Amenity selector + date picker
- Visual slot availability grid (green = available, strikethrough = taken)
- Active booking list with cancel option
