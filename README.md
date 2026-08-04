# 🚀 SnipLink — High-Throughput URL Shortener & Analytics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18%2B-blue.svg)](https://react.dev/)
[![Redis](https://img.shields.io/badge/Redis-v7%2B-red.svg)](https://redis.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v6%2B-brightgreen.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)

A full-stack, enterprise-grade **URL Shortener**, **Dynamic QR Code Generator**, and **Real-Time Analytics Platform** built with **React**, **Node.js**, **Express**, **MongoDB**, and a hybrid **Redis + In-Memory Rate Limiting** engine.

🌐 **Live Demo:** [https://bharat-url-shortener.vercel.app/](https://bharat-url-shortener.vercel.app/)  
💻 **GitHub Repository:** [https://github.com/Bharat940/url-shortener-analytics](https://github.com/Bharat940/url-shortener-analytics)

---

## 🌟 Key Features

### 🚀 High-Performance Shortening & Redirection Engine
- **Sub-50ms Redirection Latency**: High-throughput processing capable of **108+ redirects/sec**.
- **Custom Link Slugs**: Registered users can brand short links with personalized slugs (e.g., `/my-brand-link`).
- **Fail-Safe Rate Limiting**: Hybrid Redis + In-Memory fallback store that protects endpoints against spam, burst traffic, and DDoS attacks without single-point-of-failure downtimes.

### 📷 Instant Dynamic QR Code Generator
- **High-Resolution PNG QR Codes**: Sub-60ms dynamic QR generation for any web URL.
- **1-Click Downloads & Popover Previews**: Download PNG images or preview QR codes right from your dashboard.

### 📊 Real-Time Analytics & Audience Insights
- **Interactive Recharts Visualizer**: Real-time Area, Bar, and Donut charts tracking total clicks, geolocation (country), device breakdown (Mobile/Desktop/Tablet), and browser distribution.
- **Preset Quick-Filter Time Pills**: 1-click date filters (**7 Days**, **30 Days**, **90 Days**, **All Time**, **Custom Range**).
- **Smooth Date Filling Algorithm**: Generates continuous timelines for all time periods, filling inactive days with zero-click data points for clean visualization.

### 🎨 Human-Centered OKLCH Design System
- **Modern OKLCH Color Palette**: Built with modern semantic OKLCH color variables (`var(--background)`, `var(--card)`, `var(--primary)`, `var(--border)`).
- **Light & Dark Mode**: Instant theme switching with persistent Redux state.
- **Subtle Micro-Interactions**: Hover lifts, smooth motion curves (`cubic-bezier`), and accessible contrast ratios.

---

## 📊 Empirical Performance & Benchmarks

SnipLink includes a built-in automated performance suite ([Backend/benchmark.js](Backend/benchmark.js)) to measure throughput, latency profiles, and security rate-limiting efficiency under load.

| Metric | Result | Benchmark Conditions |
| :--- | :--- | :--- |
| **HTTP Throughput** | **~108+ redirects/sec** | 1,000 requests @ 50 concurrent connections |
| **Redirection Latency** | **454.9 ms (p50: 420 ms)** | Measured under sustained peak load |
| **Dynamic QR Speed** | **< 58.6 ms / code** | High-res PNG data URL generation |
| **Spam Blocking Rate** | **80% Blocked** | 100 continuous unauthenticated spam requests |

To run the performance benchmark locally:
```bash
cd Backend
node benchmark.js
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Core**: React 18, Vite 6
- **Routing & State**: TanStack Router (`@tanstack/react-router`), Redux Toolkit, TanStack React Query
- **Styling & UI**: TailwindCSS v4, Ant Design (`antd`), `@ant-design/icons`, OKLCH Design System
- **Charts & Data**: Recharts (`AreaChart`, `BarChart`, `PieChart`), Day.js

### **Backend**
- **Core**: Node.js, Express.js
- **Database & Cache**: MongoDB Atlas (Mongoose ORM), Upstash Redis / Redis Cloud
- **Security & Auth**: JWT (JSON Web Tokens), BCrypt password hashing, Cors, Helmet
- **Rate Limiting**: Hybrid Redis + In-Memory Sliding Window Store
- **Geolocation**: `geoip-lite` IP lookup engine
- **QR Code Engine**: `qrcode` PNG encoder

---

## 📁 Project Architecture

```
URL_Shortner/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & Redis configuration
│   │   ├── controllers/     # Auth, ShortUrl, & Analytics controllers
│   │   ├── dao/             # Data Access Objects & DB queries
│   │   ├── middlewares/     # Auth JWT & Hybrid Rate Limiter middlewares
│   │   ├── models/          # Mongoose Schemas (User, ShortUrl, Click)
│   │   ├── routes/          # Express API route declarations
│   │   ├── services/        # Analytics & ShortUrl business logic
│   │   └── utils/           # QR Generator & URL helper functions
│   ├── app.js               # Express application entry point
│   ├── benchmark.js         # Automated performance benchmark script
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── api/             # Axios API client modules
│   │   ├── components/      # NavBar, ShortenUrlForm, QrCodeForm, Analytics, UserUrl
│   │   ├── pages/           # Homepage, Dashboard, AuthPage
│   │   ├── store/           # Redux slices (Auth, Theme)
│   │   ├── RootLayout.jsx   # Top-level routing layout & Auth check
│   │   ├── main.jsx         # App entry point
│   │   └── index.css        # Modern OKLCH design system & Tailwind v4 theme
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints Reference

### **Authentication** (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new member account | No |
| `POST` | `/api/auth/login` | Authenticate user & return JWT token | No |
| `GET` | `/api/auth/logout` | Sign out & invalidate session | Yes |
| `GET` | `/api/auth/me` | Fetch current authenticated profile | Yes |

### **URL Shortening & Management** (`/api/create`, `/api/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/create` | Shorten URL & optional QR code generation | Optional (Guest limit: 20/day) |
| `POST` | `/api/user/urls` | Fetch all URLs created by logged-in user | Yes |

### **Analytics & Insights** (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics?start=...&end=...` | Fetch aggregate click trends, geo & device stats | Yes |
| `GET` | `/api/analytics/url/:urlId` | Fetch detailed analytics for a specific short link | Yes |

### **Health Check & Redirection**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Uptime monitoring ping endpoint | No |
| `GET` | `/:id` | High-speed redirect to original destination | No |

---

## ⚡ Local Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI
- **Redis** *(Optional)*: Redis Cloud / Upstash or local Redis server. If omitted, app seamlessly operates with the built-in In-Memory fallback store.

### 1. Clone Repository
```bash
git clone https://github.com/Bharat940/url-shortener-analytics.git
cd url-shortener-analytics
```

### 2. Configure & Run Backend
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:
```env
PORT=3000
NODE_ENV=development
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/url_shortener
JWT_SECRET=your_super_secret_jwt_key
REDIS_URL=redis://default:password@your-redis-host:6379
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
ANONYMOUS_URL_LIMIT=20
ANONYMOUS_EXPIRATION_SECONDS=86400
```

Start the backend server:
```bash
npm start
```

### 3. Configure & Run Frontend
In a new terminal window:
```bash
cd Frontend
npm install
```

Create a `.env` file inside `Frontend/`:
```env
VITE_APP_URL=http://localhost:3000
```

Start the frontend development server:
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for details.
