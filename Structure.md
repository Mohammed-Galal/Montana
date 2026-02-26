# Foodoma Project Structure Guide

This README explains how the project is organized and what each folder/file is responsible for.

## 1) Repository Layout (Root)

```text
Foodoma/
+- public/                         # Static files served directly by CRA
+- src/                            # Main React application source code
+- build/                          # Production build output (generated)
+- node_modules/                   # Installed dependencies (generated)
+- .env                            # Runtime environment variables
+- .gitignore                      # Git ignore rules
+- app.json                        # Small app-level metadata file
+- Avail-API.md                    # API endpoint reference/inventory notes
+- Foot.postman_collection_user.json # Postman collection for backend APIs
+- missed.md                       # Local analysis/notes
+- package.json                    # Scripts + dependency manifest
+- package-lock.json               # Locked dependency versions
+- README.md                       # Project documentation
```

## 2) `src/` (Application Code)

```text
src/
+- bootstrap.js
+- index.jsx
+- index.scss
+- reportWebVitals.js
+- setupTests.js
+- translation.js
+- Modal.jsx
+- CurrencySymbol.jsx
+- Footer.jsx
+- Header/
+- Nav/
+- Pages/
+- services/
+- shared/
+- icons/
+- store/
```

### Core entry and app boot files

- `src/index.jsx`: React entry point; mounts app and providers.
- `src/bootstrap.js`: startup/runtime boot logic (global runtime values, version checks, etc.).
- `src/index.scss`: global stylesheet imported at app start.
- `src/reportWebVitals.js`: CRA web-vitals helper.
- `src/setupTests.js`: test runtime setup.
- `src/translation.js`: language/translation helper wiring.
- `src/Modal.jsx`: shared modal wrapper/component.
- `src/CurrencySymbol.jsx`: reusable currency UI helper.
- `src/Footer.jsx`: global footer component.

### `src/Pages/` (Route-level features)

`Pages` holds user-facing screens and page-specific subcomponents/styles.

- Top-level route files:
  - `About.jsx`
  - `All_Products.jsx`
  - `Invoice.jsx`
  - `_Invoice.jsx` (legacy/alternate invoice implementation)
  - `Jobs.jsx`
  - `NotFound.jsx`
  - `PaymentForm.jsx`
  - `PrivacyPolicy.jsx`
  - `pageMap.js` (maps page keys/metadata)
  - `index.jsx` (route composition)

- Feature folders:
  - `Pages/Home/`: home page composition sections (`Banner`, `About`, `Departments`, `Products`, `Occasions`, `Rate`, `Services`) plus local styles/data.
  - `Pages/Product/`: product details screen and SCSS.
  - `Pages/Cart/`: cart page and cart-specific helpers (`Recommended.jsx`).
  - `Pages/Checkout/`: checkout flow (`OrderInfo`, `OrderOptions`, `OrderSchedule`) and styles.
  - `Pages/Restaurant/`: restaurant/branch listing and related UI styles.
  - `Pages/Settings/`: account/settings area split into `mobile/` and `desktop/`, each with tab components (`account`, `addresses`, `fav`, `history`, `wallet`, etc.).
  - `Pages/User/`: auth/profile actions screen.
  - `Pages/Alerts/`: notifications/alerts page.
  - `Pages/Bookings/`: booking/early-booking page.
  - `Pages/Design/`: custom design/special-order workflow (`index.jsx`, `_index.jsx`, styles).
  - `Pages/FAQs/`: FAQ page with local JSON data and styles.

### `src/store/` (Redux state)

- `store/index.js`: Redux store setup + startup dispatch/bootstrap side effects.
- `store/products.js`: products, categories, cart, and related mutations.
- `store/user.js`: user auth/profile/addresses/order-history state.
- `store/restaurant.js`: selected branch and restaurant state.
- `store/settings.js`: app settings/configuration state.
- `store/sliders.js`: home slider/banner state.

### `src/services/` (API and initialization helpers)

- `services/api.js`: centralized API utilities and grouped endpoint methods.
- `services/appInitializer.js`: startup orchestration helpers used during app hydration.

### `src/shared/` (Reusable cross-page UI)

- `shared/Carousel.jsx`: reusable carousel wrapper.
- `shared/isMobile.js`: viewport/device detection helper.
- `shared/productItem/`: reusable product card UI (`index.jsx`, `index.scss`) plus old versions (`old_index.jsx`, `old_index.scss`).

### `src/Header/` and `src/Nav/` (Layout shell)

Both are split by device mode:

- `desktop.jsx`
- `mobile.jsx`
- `index.jsx`
- `index.scss`

Extra header utility:

- `Header/DownloadForm.jsx`: header-specific form/action component.

### `src/icons/` (Icon components)

Contains reusable icon components in JSX/SVG (for example: `Cart.jsx`, `Globe.jsx`, `Loc.jsx`, `Sar.jsx`, `Plus.jsx`, `Minus.jsx`, etc.).

## 3) `public/` (Static Assets and Runtime JSON)

```text
public/
+- index.html
+- index.css
+- manifest.json
+- robots.txt
+- favicon.ico / favicon.png / logo.png
+- checkoutForm.html
+- asset-manifest.json
+- assets/
```

### Top-level `public` files

- `index.html`: HTML template used by CRA.
- `index.css`: static/global CSS loaded from HTML.
- `manifest.json`: PWA metadata.
- `robots.txt`: crawler instructions.
- `checkoutForm.html`: static HTML helper used by payment/checkout flow.
- `asset-manifest.json`: build output asset manifest (generated).

### `public/assets/`

Contains runtime images, videos, documents, and JSON used directly by UI/pages:

- `assets/languages/`: localization dictionaries (`ar.json`, `en.json`, `map.json`).
- `assets/page-title.json`: route/page title mapping.
- `assets/nationalities.json`: nationality dataset used in forms.
- `assets/settings/`: settings/account icons.
- `assets/home/`: home page visuals grouped by section (`banner`, `departments`, `icons`, `services`, `products`, `footer`, etc.) and some static PDFs.
- `assets/jobs/`: jobs module imagery (banner, upload, success, icons).
- Other shared media files (`loader.gif`, `heart.mp4`, `vat.webp`, etc.).

## 4) Configuration and Environment

- `.env`: runtime variables (example: API base URL like `REACT_APP_API_URL`).
- `package.json` scripts typically drive:
  - local dev (`start`)
  - production build (`build`)
  - tests (`test`)

## 5) API and Integration Documents

- `Foot.postman_collection_user.json`: request examples and endpoint contract snapshots.
- `Avail-API.md`: endpoint inventory/reference document.
- `missed.md`: local notes for uncovered endpoints/flows.

## 6) Generated vs Source Files

Generated (do not hand-edit):

- `node_modules/`
- `build/`
- `public/asset-manifest.json`

Source-controlled implementation files are mainly under:

- `src/`
- `public/assets/` (static assets)
- root docs/config (`README.md`, `package.json`, API docs)

## 7) Quick Navigation Tips

- Start feature work from `src/Pages/<Feature>/`.
- Trace API usage through `src/services/api.js` and startup behavior in `src/store/index.js` / `src/services/appInitializer.js`.
- Check shared components before duplicating UI (`src/shared/`, `src/Header/`, `src/Nav/`, `src/icons/`).
- For copy/content/localization updates, inspect `public/assets/languages/` and page JSON files in `public/assets/`.
