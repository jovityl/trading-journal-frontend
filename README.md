# Trading Journal

> An AI-powered options trading journal that scores trade discipline using manual checks + Claude chart analysis.

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
- 📊 **Dashboard** — P&L, win rate, discipline score, 30-day chart, recent trades
- 📝 **Trade logging** — full trade form with chart + IBKR screenshot upload
- 🤖 **AI scoring** — Claude analyzes your chart and scores entry/exit quality (0-80)
- ✅ **Discipline tracking** — manual ticks for stop loss, profit target, position sizing, DTE (0-20)
- 🔍 **Filters** — by ticker, option type, strategy, date range
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

## 📂 Project Structure

```
src/
├── components/     # Reusable components (modals, etc)
├── pages/          # Full pages (Dashboard, Trades, Settings...)
├── layout/         # App shell (sidebar + main area)
├── services/       # Axios API instance
├── hooks/          # Custom React hooks (useAuthToken)
├── types/          # TypeScript interfaces
├── App.tsx         # Routing
└── main.tsx        # Entry point + providers
```

## 🔗 Related

- [Backend repository](https://github.com/jovityl/trading-journal-backend)
