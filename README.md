# Keyora ⚡

> **Precision Speed Typing & Competitive Trainer**  
> Engineered for developers, competitive typists, and keyboard enthusiasts.

![Keyora Logo](/public/logo.svg)

Keyora is an elite speed typing trainer and competitive leaderboard platform built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and the **HTML5 Web Audio API**.

---

## 🚀 Features

- **⚡ Zero-Latency Typing Engine**: Real-time keystroke processing with microsecond accuracy, error tracking, and smooth cursor dynamics (Smooth Line, Terminal Block, Underline, Neon Pulse).
- **🎵 Synthesized Mechanical Soundscapes**: Clicky mechanical switches (Cherry MX Blue, Brown, Red, and Vintage Typewriter) generated natively in real-time via the Web Audio API with zero external audio assets.
- **📊 Comprehensive Telemetry**: Second-by-second WPM progression curves, raw WPM, accuracy %, consistency rating, and error cluster heatmaps.
- **🎯 Targeted Practice Laboratory**: Dedicated drills for programming syntax (`{}`, `[]`, `=>`, `&&`), top-row numeric accuracy, trigraph frequencies, or custom passages.
- **🏆 Global Hall of Fame**: Competitive rankings filterable by duration (15s, 30s, 60s, 120s), mode, and languages (English, Code, Quotes, Numbers, Spanish).
- **🎨 Multi-Theme Ecosystem**: Instant theme switching between **Cyber Neon**, **Nord Frost**, **Dracula**, **Amber Sunset**, and **Matrix Terminal**.
- **🔐 Authentication & User Profiles**: Full profile history, personal bests, milestone achievement badges, and hardware rig configuration.
- **⌨️ Keyboard Shortcuts**:
  - `Tab` + `Enter`: Instant restart test
  - `Esc`: Pause test or clear practice drill
  - `Ctrl` + `Backspace`: Delete entire word

---

## 📁 Architecture & Directory Structure

```
keyora/
├── public/
│   ├── favicon.svg
│   ├── logo.svg
│   └── images/
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── practice/page.tsx
│   │   ├── results/[id]/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── history/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── about/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── auth/register/route.ts
│   │       ├── tests/route.ts
│   │       ├── tests/[id]/route.ts
│   │       ├── passages/route.ts
│   │       ├── leaderboard/route.ts
│   │       ├── users/me/route.ts
│   │       └── health/route.ts
│   ├── components/
│   │   ├── layout/ (Navbar, Footer, MobileMenu)
│   │   ├── typing/ (TypingTest, TypingArea, Timer, StatsBar, Selectors)
│   │   ├── results/ (ResultCard, ProgressChart)
│   │   ├── auth/ (LoginForm, RegisterForm)
│   │   └── ui/ (Button, Card, Modal, ThemeToggle)
│   ├── hooks/ (useTypingTest, useTheme)
│   ├── lib/ (prisma, auth, validations, utils)
│   ├── services/ (testService, passageService, leaderboardService)
│   ├── utils/ (calculateWPM, calculateAccuracy, formatTime)
│   ├── types/ (index.ts)
│   └── data/ (passages.ts)
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.example
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with v20 & v22 LTS)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/keyora.git
cd keyora

# Install dependencies
npm install
```

### 3. Database Setup (Prisma SQLite)
```bash
# Push schema to SQLite database (creates prisma/dev.db)
npx prisma db push

# Seed demo users, passages, and leaderboards
npx prisma db seed
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

```bash
# Run unit tests
npm run test:unit
```

---

## 📜 License
MIT License &copy; 2026 Keyora.
