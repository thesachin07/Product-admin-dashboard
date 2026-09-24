# Product Admin Dashboard

A small admin dashboard to manage products, built on top of the
[DummyJSON](https://dummyjson.com) API. Users log in, browse a paginated
product list with search, filter and sort, view product details, and perform
add / edit / delete operations.

Built as part of a frontend assignment. Next.js (App Router), React, Tailwind
CSS, Axios.

---

## Live

- **Live URL:** https://product-admin-dashboard-bice.vercel.app/
- **Repo:** https://github.com/thesachin07/Product-admin-dashboard/

---

## Demo credentials

```
username: emilys
password: emilyspass
```

---

## Tech

- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- Axios (single shared instance with interceptors)
- No state management library, no data-fetching library, no UI kit

---

## Getting started

```bash
git clone <repo-url>
cd product-admin-dashboard
npm install
cp .env.example .env.local   # or create .env.local manually
npm run dev
```

Open `http://localhost:3000`. You will be redirected to `/login`.

### Environment

```
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com
```

The base URL is read from env so the API can be swapped without touching code.

### Scripts

```bash
npm run dev      # local dev
npm run build    # production build
npm start        # run production build
npm run lint     # eslint
```

---

## Features

### Auth
- Login via `POST /auth/login` with the demo credentials
- Auth token and user stored in `localStorage`
- All `/products/*` routes protected; unauthenticated users are redirected to `/login`
- Logout clears session and redirects
- Inline validation and API error messages
- Submit is disabled while a request is in flight

### Products list
- Paginated fetch using `limit` and `skip`
- Responsive: table on `md+`, cards below
- Displays thumbnail, title, category, price, rating, stock
- "Showing X–Y of Z" counter
- Page size selector: 10 / 20 / 50
- Page numbers with ellipsis, Previous/Next with disabled boundaries

### Search
- Debounced input (500 ms) before hitting `/products/search`
- Cancels in-flight requests when a new query arrives
- Resets to page 1 on change

### Filter & sort
- Category dropdown populated from `/products/categories`
- Sort by price, rating or title (asc / desc)
- Sort applied client-side so behaviour is consistent across list, search and category endpoints

### Product details
- `/products/[id]` with image gallery, description, price, stock, reviews
- Dedicated "not found" UI for invalid ids

### Add / Edit / Delete
- Reusable form for add and edit with validation
- Delete behind a confirmation modal
- All changes are reflected in the UI even though the API does not persist them (see Design decisions)

### States
- Loading spinner during fetches
- Empty state when a query returns nothing
- Error state with a Retry action

---

## Project structure

```
app/
  layout.js                     Root layout, wraps app in AuthProvider
  page.js                       Redirects / → /login
  login/page.js                 Login page
  products/
    layout.js                   Protected layout with navbar
    page.js                     Product list
    add/page.js                 Add product
    [id]/page.js                Product detail
    [id]/edit/page.js           Edit product

features/
  auth/
    components/                 LoginForm, ...
    state/AuthContext.js        Global auth state
    service/auth.api.js         Login API
  products/
    components/                 ProductGrid, Table, Card, Pagination,
                                SearchBar, FilterSort, ProductForm
    hooks/                      useProducts, useProductDetail,
                                useCategories, useDebounce
    service/product.api.js      Products API
    state/productStore.js       Local overlay for add/edit/delete

shared/
  components/                   Button, Input, Modal, Spinner,
                                EmptyState, ErrorState, Navbar,
                                ProtectedRoute
  utils/                        urlHelpers, authStorage, validators

lib/
  api/axiosClient.js            Shared axios instance + interceptors
```

API calls live under `features/*/service/`. Components and hooks never call
`axios` directly.

---

## URL as state

Everything that changes the list lives in the URL, not in component state:

```
/products?page=2&limit=20&q=iphone&category=smartphones&sortBy=price&order=asc
```

- Refresh keeps the same view
- Links are shareable
- Back/forward work
- Invalid values are sanitised before use (see Design decisions)

---

## Design decisions

### Axios in one place

`lib/api/axiosClient.js` is the only axios instance in the app. It attaches
the auth token on every request and normalises errors to a single shape:

```js
{ message, status, isCanceled }
```

`isCanceled` is important — components can distinguish "request was
superseded" from "request failed" and skip rendering an error in the first
case.

### Search and category are mutually exclusive

DummyJSON exposes search and category filtering as separate endpoints:

```
/products/search?q=...
/products/category/{slug}?limit&skip
```

They cannot be combined server-side. Combining them client-side would break
pagination (the server returns the wrong `total`).

The app decides: **search wins**. When the user types a query, the category
parameter is cleared from the URL. When the user picks a category, the search
input is cleared.

The alternative — silently applying both — would show confusing results and
a broken page count. Making the two mutually exclusive keeps behaviour
predictable and honest about what the API can do.

### Optimistic add / edit / delete

DummyJSON accepts write requests but does not persist them. The list would
revert on the next fetch.

To keep the demo useful, every write is written to a small overlay in
`localStorage` under `product_local_changes`:

```json
{
  "added":   [ ...products ],
  "updated": { "1": { ...fields } },
  "deleted": [ "1" ]
}
```

The list hook applies this overlay after every fetch:

```js
const merged = apiProducts
  .filter((p) => !deletedSet.has(String(p.id)))
  .map((p) => overrides[String(p.id)] ? { ...p, ...overrides[String(p.id)] } : p)
```

The API call still happens — the app is honest that the API does not persist,
but the UI stays consistent across refreshes and navigation.

The detail page reads the same overlay, so an edited product looks the same
on `/products` and `/products/1`.

### Fetch logic in a hook, not in the page

`useProducts` owns fetching, cancellation, sorting and merging. The page
component just renders the states:

```js
if (loading) return <Spinner />
if (error)   return <ErrorState onRetry={refresh} />
if (empty)   return <EmptyState />
return <ProductGrid ... />
```

This keeps the page small and lets the hook be reused (e.g. by the detail
page's sibling logic) without dragging UI along.

---

## Problems faced and how they were fixed

### 1. Race condition on fast typing

**Symptom:** typing quickly into search could show results for an older query
because an earlier request resolved after a newer one.

**Fix, two layers:**

1. **Debounce** (`useDebounce`, 500 ms) — reduces how often requests fire.
2. **AbortController** — every effect run creates a controller, passes its
   `signal` to axios, and aborts it in the effect cleanup. The response
   handler also checks `controller.signal.aborted` before touching state.

The axios interceptor tags canceled requests with `isCanceled: true`, so
they can be silently dropped instead of being treated as errors.

Verified locally with a 2 s `delay` on the search endpoint: only the last
request completes, the rest resolve as `ERR_CANCELED`.

### 2. Local changes not showing on the detail page

**Symptom:** after editing a product, the list showed the new value but
`/products/[id]` still showed the old one.

**Cause:** `useProductDetail` fetched the product directly from the API and
never consulted the local overlay.

**Fix:** `useProductDetail` now reads `product_local_changes` and merges
overrides into the API response. It also short-circuits for products that
only exist locally (added, not yet persisted anywhere).

### 3. A duplicate store was silently shadowing the real one

At one point the project had two `productStore.js` files — one under
`features/products/state/` (with string-normalised ids) and one under
`app/products/state/` (without). `useProducts` was importing the wrong one,
so `"1" !== 1` comparisons in the delete filter always returned `false` and
deleted products kept reappearing.

**Fix:** removed the duplicate folder, fixed the imports, and kept a single
canonical store. All ids are normalised with `String(id)` at the boundary.

### 4. Invalid URL values

`?page=abc`, `?page=999`, `?limit=999` all originally broke the page or
produced a stuck state.

**Fix:** every URL param is parsed through a small validator in
`shared/utils/urlHelpers.js`:

```js
parsePage('abc')  // → 1
parsePage('-5')   // → 1
parseLimit('999') // → 10
parseSortBy('xx') // → ''
```

The list hook never reads raw strings from `useSearchParams`.

---

## AI usage

I used AI as a pair programmer, not as a code generator.

- Drafting boilerplate for the axios interceptors, and the debounce hook —
  things I understand but did not want to type out.
- Explaining DummyJSON's response shapes and quirks (partial PUT responses,
  which endpoints ignore `sortBy`).
- Debugging the delete filter bug above — I described the symptom, AI
  pointed at the string/number comparison, I confirmed and fixed it.
- Sanity-checking the search/category decision against the API docs.

Everything committed was read, adapted and tested locally before it landed.
The architecture, the folder layout, the URL-state approach and the
optimistic-update strategy are mine; they were the shape I wanted from the
start.

---

## Known limitations

- DummyJSON does not persist writes; refresh is fine thanks to the local
  overlay, but clearing `localStorage` reverts everything.
- Sort is applied client-side on the current page. Sorting across the full
  result set would require either an endpoint that supports it or fetching
  every page — neither is worth it for this API.
- The overlay is keyed to the browser. Two tabs will see each other's edits
  only after a reload.

---

## What's next if this had more time

- Refresh token handling (DummyJSON returns one, currently unused).
- Optimistic UI (update before the request resolves) rather than after.
- Move the overlay to IndexedDB for larger data sets.
- Vitest for `urlHelpers`, `validators` and `productStore`.
