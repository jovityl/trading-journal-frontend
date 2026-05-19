# Trading Journal

> An AI-powered options trading journal with violation tag discipline tracking and Claude chart analysis.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Auth0](https://img.shields.io/badge/Auth0-EB5424?logo=auth0&logoColor=white)

## 📸 Screenshots

### Dashboard
![Dashboard](docs/dashboard.png)

### Trade Detail with AI Feedback
![Trade Detail](docs/trade-detail.png)

### Log a New Trade
![New Trade](docs/new-trade.png)

## ✨ Features

- 🔐 **Auth0 login** — Google + email/password
- 📊 **Dashboard** — P&L, win rate, discipline score, equity curve, 30-day P&L chart, recent trades
- 📈 **Discipline analytics** — violation tag frequency chart and clean trade rate, toggleable on the dashboard
- 📝 **Trade logging** — full trade form with chart + IBKR screenshot upload
- 🤖 **AI scoring** — Claude analyzes your uploaded chart and scores entry/exit quality (0-100)
- 🏷 **Violation tags** — tag behavioral mistakes (FOMO, revenge trade, oversized position, etc.) per trade; no tags = clean trade
- 🔍 **Filters** — by ticker, option type, strategy, date range, and violation tag
- 💬 **AI trade chat** — ask Claude questions about any trade using its context
- ⚙️ **Settings** — daily loss/profit limits with dashboard alerts

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| Data fetching | React Query (TanStack) |
| Forms | React Hook Form |
| Charts | Recharts |
| Auth | Auth0 React SDK |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- The [backend](https://github.com/jovityl/trading-journal-backend) running locally
- Auth0 account with a SPA application

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file in the project root**
   ```
   VITE_AUTH0_DOMAIN=your-tenant.auth0.com
   VITE_AUTH0_CLIENT_ID=your-spa-client-id
   VITE_AUTH0_AUDIENCE=https://trading-journal-api
   VITE_API_BASE_URL=https://localhost:7160
   ```

3. **Configure Auth0** (in your Auth0 dashboard)
   - Allowed Callback URLs: `http://localhost:5173`
   - Allowed Logout URLs: `http://localhost:5173/login`
   - Allowed Web Origins: `http://localhost:5173`
   - Enable Refresh Token Rotation

4. **Run the dev server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173)

### Docker

The frontend is included in the backend's `docker-compose.yml`. To run the full stack (API + DB + frontend) in Docker, follow the Docker setup in the [backend repository](https://github.com/jovityl/trading-journal-backend). The frontend will be available at `http://localhost:3000`.

## 📂 Project Structure

```
src/
├── components/     # Reusable components (modals, tables, etc)
├── pages/          # Full pages (Dashboard, Trades, Trade Detail, Settings...)
├── layout/         # App shell (sidebar + main area)
├── services/       # Axios API instance + service functions
├── hooks/          # Custom React hooks (useDashboard, useTrades, useMe...)
├── types/          # TypeScript interfaces
├── utils/          # Formatting helpers (pnlColor, scoreColor, etc)
├── App.tsx         # Routing
└── main.tsx        # Entry point + providers
```

## 🏷 Discipline System

Trades are assessed using two independent scores:

- **Discipline Score** — derived from violation tags you select when logging a trade. 0 tags = 100 (clean), 1 = 70, 2 = 40, 3+ = 10. Shown as a badge on the trade detail page.
- **AI Score** — Claude analyzes the uploaded chart screenshot and scores 0-100 based on entry/exit quality and trade setup.

The dashboard's **Discipline** tab shows which violation tags appear most often across all your trades, and your overall clean trade rate.

## 🔗 Related

- [Backend repository](https://github.com/jovityl/trading-journal-backend)
