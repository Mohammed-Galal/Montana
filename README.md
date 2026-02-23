# Foodoma Project Review

## 1) Project Overview

Foodoma is a React + Redux single-page web app for food ordering with branch selection, product browsing, custom/special orders, cart/checkout, account management, alerts, invoices, and jobs application flows.

The app is bilingual (Arabic/English), mobile-aware, and heavily driven by backend configuration and APIs under:

- `REACT_APP_API_URL + /public/api`

Current `.env` active backend base:

- `REACT_APP_API_URL=https://montana-sa.amir-adel.com/admin`

---

## 2) Tech Stack

- Frontend: React 18 (CRA)
- Routing: `react-router-dom` v6
- State: Redux Toolkit + React Redux
- Styling: SCSS + Bootstrap 5 + some MUI components
- UI libs: Swiper, Reactstrap
- Date/time: `moment`, `dayjs`, MUI Date Picker
- Maps: `@vis.gl/react-google-maps` (Google Maps + Places)
- Payment integration: MyFatoorah embedded session (`window.myfatoorah`)

---

## 3) Runtime and Configuration

- Language files loaded from `public/assets/languages/*`
- Page title map loaded from `public/assets/page-title.json`
- Global bootstrap values in `src/bootstrap.js`:
  - version gate (`localStorage.ver`) with hard reset on version change
  - `window.priceTypes`
  - `window.Nutriants`
- Dynamic custom CSS injected from backend settings via `settings.customCSS`
- Auth token stored in `localStorage` as `Bearer <token>`
- Branch slug, cart items, active address index, and coupon also persisted in `localStorage`

---

## 4) High-Level Structure Analysis

### Root-level

- `src/`: application source
- `public/`: static assets, language JSON, SEO/page-title JSON
- `Foot.postman_collection_user.json`: backend API collection reference

### `src/` main modules

- `src/Pages/`: route-level pages and user workflows
- `src/store/`: Redux slices + startup bootstrapping side effects
- `src/services/`: centralized API layer (`api.js`) and alternative app initializer (`appInitializer.js`)
- `src/shared/`: reusable UI/components (`Carousel`, `productItem`, mobile detection)
- `src/Header/`, `src/Nav/`, `src/Footer.jsx`: global layout/navigation
- `src/icons/`: SVG/JSX icon components

### `src/Pages/` functional areas

- Discovery/commercial: `Home`, `All_Products`, `Product`, `Design`, `Bookings`, `Restaurant`
- Transactional: `Cart`, `Checkout`, `Invoice`
- Account: `User`, `Settings`, `Alerts`
- Informational/static: `About`, `FAQs`, `PrivacyPolicy`, `NotFound`
- Careers: `Jobs`

---

## 5) Routing and Navigation

Defined in `src/Pages/index.jsx`.

Main routes:

- `/`
- `/jobs/:jobId?`
- `/faq`
- `/restaurant`
- `/about-us`
- `/all-products/:category?`
- `/products/:slug` (uses query `id`, `isCustom`)
- `/design/:style?`
- `/early-booking`
- `/cart`
- `/checkout`
- `/invoice/:id?` (+ query variants)
- `/alerts`
- `/user/:action?`
- `/settings/:tab?`
- `/privacy-policy`

---

## 6) Services and State Architecture

### API Service Layer

File: `src/services/api.js`

Centralized wrappers:

- `getFetchOpts(method, body)` (adds `Authorization` header from localStorage)
- `fetchAPI(endpoint, options)` with JSON parsing + error throw

Domain groups:

- `settingsAPI`
- `restaurantAPI`
- `productsAPI`
- `userAPI`
- `slidersAPI`

### App Initialization Service

File: `src/services/appInitializer.js`

Contains startup helpers for categories, geolocation, settings, branches, sliders, user data, and restaurant preload. It appears to be a refactor target but current app startup still relies on side effects in `src/store/index.js`.

### Redux Slices

- `src/store/products.js`
  - product data, categories, special/custom and early booking sections
  - cart management and persistence
  - cashback and favorites
- `src/store/user.js`
  - auth/profile, location, alerts, addresses, previous orders
- `src/store/restaurant.js`
  - current branch + branches list + parsed working hours
- `src/store/settings.js`
  - backend settings and runtime CSS injection
- `src/store/sliders.js`
  - homepage/marketing slider payloads

### Store Bootstrapping

File: `src/store/index.js`

On import, the store triggers startup API requests (settings, restaurants, sliders, categories, user/session hydration, restaurant/menu hydration).

---

## 7) Functionalities and Feature Map

### Catalog and Product Experience

- Branch-dependent product catalog loading
- Product cards with nutrition info and pricing type labels
- Product details with addon selection and dynamic total
- Favorite toggling for authenticated users
- Category/product filtering and occasion views

### Special Orders and Booking

- Custom design flow (`/design`) with image uploads, phrase/comment, addon composition
- Early booking page with countdown based on slider metadata

### Cart and Pricing

- Cart item quantity/addon recalculation
- Coupon validation (`apply-coupon`)
- Wallet/cashback/tax/delivery charge calculations
- Rule preventing mixed cart type between special and regular items

### Checkout and Order Placement

- Delivery vs self-pickup mode
- Address selection and nearest branch check for delivery
- Optional scheduled orders (when backend enables it)
- Payment methods: MyFatoorah + COD (based on config and order type)
- Place order via multipart form payload

### Invoice and Payment Callback

- Generates printable order invoice
- Handles payment callback validation for online payments
- Invoice route supports direct callback flow and previous-order lookup flow

### Authentication and User Account

- Login/register with optional OTP verification flow
- Forgot/reset password flow
- OTP resend + verification endpoints
- User profile update, phone change via OTP
- Wallet balance retrieval
- Address management (create/delete)
- Order history + cancellation + resume payment for pending orders

### Notifications

- Alerts list rendering from backend payload
- Mark one/all notifications as read

### Jobs Module

- Jobs listing
- Job details fetch by ID
- Application form submit with PDF CV upload

### Localization and SEO

- Language switch (RTL/LTR)
- Dynamic SEO title/description/OpenGraph/Twitter tags from settings and page mapping

---

## 8) API Endpoints Used in Source Code

Base URL pattern in frontend code:

- `${REACT_APP_API_URL}/public/api`

### Branch, settings, products

- `POST /get-settings`
- `POST /get-all-restaurant`
- `POST /get-restaurant-info/{slug}`
- `POST /get-restaurant-items/{slug}`
- `POST /get-delivery-restaurants`
- `GET /getItemcategories` (called as `/public/api/getItemcategories`)
- `GET /getSliders`

### Auth and user profile

- `POST /login` (dynamic from `/user/login` action)
- `POST /register` (dynamic from `/user/register` action)
- `POST /update-user-info`
- `POST /update-user-data`
- `POST /forgot-password`
- `POST /user/reset-password`
- `POST /user/verify-otp`
- `POST /resend/otp`
- `POST /change-mobile-otp`
- `POST /change-mobile`

### Favorites, notifications, addresses

- `POST /toggle-favorite-item`
- `POST /get-favorite-items`
- `POST /get-user-notifications`
- `POST /mark-one-notification-read`
- `POST /mark-all-notifications-read`
- `POST /get-addresses`
- `POST /save-address`
- `POST /delete-address`

### Orders, wallet, checkout

- `POST /cash-back`
- `POST /get-orders`
- `POST /get-wallet-transactions`
- `POST /apply-coupon`
- `POST /place-order`
- `POST /cancel-order`
- `POST /payment-callback`

### Jobs

- `POST /jobs`
- `GET /job-details/{id}`
- `POST /applay-job` (spelling in backend endpoint as used by app)

---

## 9) Extra Endpoints Present in Postman Collection

File: `Foot.postman_collection_user.json`

Endpoints visible in collection but not clearly used directly in current frontend source:

- `/toggle-favorite`
- `/get-favorite-stores`
- `/get-order-items`
- `/set-default-address`
- `/popular-geo-locations`
- `/popular-locations`

(Other endpoints in Postman overlap with those already used in the app code.)

---

## 10) Important Notes and Observations

- `src/services/appInitializer.js` looks like an in-progress centralization, while startup still executes from `src/store/index.js` side effects.
- There is duplicate endpoint logic across `store/index.js` and page-level direct `fetch` calls.
- Some endpoint naming inconsistencies come from backend contracts (example: `applay-job`).
- Payment flow depends on global `window.myfatoorah` availability.
- Map autocomplete and geolocation features depend on valid Google API key in settings (`googleApiKey`).

---

## 11) Suggested Next Refactor Targets

- Consolidate all network calls into `src/services/api.js` and remove duplicated direct `fetch` usage.
- Move startup side effects out of `src/store/index.js` into a single bootstrap/init orchestrator.
- Standardize auth header handling and endpoint method declarations.
- Add API typing/schema guards for critical payloads (orders, user, restaurant menu).
- Add smoke tests for auth, cart, checkout, and payment callback flows.
