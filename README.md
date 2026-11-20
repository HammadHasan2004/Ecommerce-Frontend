# Rasad – Frontend (Web App)

React web app for **Rasad**, a B2B raw-material marketplace for Karachi home industries. Buyers browse, add to cart, order and pay (COD or MetaMask on Sepolia); suppliers manage products, orders and see analytics.

## Tech stack

| Area | Technology |
|---|---|
| UI | React 19, Vite 8, Tailwind CSS 4 |
| Routing | react-router-dom 7 |
| State | React Context (Auth, Cart) |
| Payments | ethers v6 + MetaMask (Sepolia testnet) |
| Image recognition | Teachable Machine model (TensorFlow.js, loaded in the browser) |
| Icons / lint | lucide-react, oxlint |

## Prerequisites

- Node.js 20 or newer and npm
- The Rasad backend running (locally on port 8000, or deployed)
- For payments: the MetaMask browser extension with some Sepolia test ETH (free from any Sepolia faucet)

## Setup

```bash
# 1. clone and enter the project
git clone https://github.com/HammadHasan2004/Ecommerce-Frontend.git
cd Ecommerce-Frontend

# 2. install dependencies
npm install

# 3. start the backend first (see backend README), then:
npm run dev
```

Open `http://localhost:5173`.

No `.env` file is needed. All API calls go to `/api/v1/...`, and in development Vite forwards `/api` to `http://localhost:8000` (see `vite.config.js`). If your backend uses another port, change `target` there.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload (port 5173) |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | Run oxlint |

## Project structure

```
src/
├── main.jsx, App.jsx     # entry + routes
├── api/client.js         # fetch wrapper: cookies, silent token refresh, URL cleanup
├── context/              # AuthContext, CartContext
├── lib/                  # metamask.js, payOrder.js, config.js, categoryModel.js
├── components/           # shared UI
└── pages/
    ├── buyer/            # marketplace, cart, orders, order detail
    └── supplier/         # products, orders, analytics
public/                   # Teachable Machine files: model.json, metadata.json, weights.bin
vercel.json               # rewrites /api → backend, SPA fallback
```

## Using MetaMask payments

1. Install MetaMask and switch to the **Sepolia** test network.
2. Get free test ETH from a Sepolia faucet.
3. The supplier must have saved a wallet address in their profile. It must be a **different** wallet from the buyer's (MetaMask blocks sending data transactions between two of its own accounts, error `-32602`; use a second Chrome profile or an external wallet for the supplier).
4. Place an order → choose *Pay with MetaMask* → confirm in the popup.

`PKR_PER_ETH` in `src/lib/config.js` (800000) is a fixed demo rate and must match the backend `.env`.

## Photo search (Teachable Machine)

The model in `public/` (5 classes, 224×224 input, 0.7 confidence threshold) predicts a raw-material category from a photo and filters the marketplace. TensorFlow.js and the Teachable Machine library are loaded from a CDN, so an internet connection is required.

## Deployment (Vercel)

1. Import the GitHub repo into Vercel (framework preset: Vite). Build command `npm run build`, output `dist`.
2. In `vercel.json`, set the `destination` of the `/api/:path*` rewrite to your deployed backend URL (e.g. the Render URL).
3. On the backend, set `CORS_ORIGIN` to your Vercel URL (no trailing slash).
4. Redeploy. If the site shows old data or HTML-instead-of-JSON errors, hard-refresh (Ctrl+Shift+R) or use Incognito.

## Troubleshooting

| Problem | Likely cause |
|---|---|
| Blank products / `Unexpected token '<'` | `/api` rewrite not reaching backend; check `vercel.json` and that the backend is awake |
| Login works then logs out | Cookies blocked; use the same site for frontend and `/api` (Vercel rewrite) |
| First request very slow in production | Render free tier waking from sleep |
| MetaMask button does nothing | Extension missing/locked, or not on Sepolia |
| `could not coalesce error` on pay | Supplier wallet is an account inside the same MetaMask |
