# Satoshi Accumulator Dashboard

A real-time cryptocurrency trading dashboard built with Next.js that displays trading history, bot status, and market signals for Bitcoin trading.

## Features

- 📊 Real-time trading history display
- 🤖 Bot status monitoring with key indicators
- 📈 Technical analysis signals (RSI, EMA, Bollinger Bands)
- 💹 Live price updates
- 🔄 Automatic data refresh every 5 minutes
- 🌙 Dark mode interface

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Firebase/Firestore
- TailwindCSS
- React Icons

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/UFOBob069/satoshi-accumulator.git
cd satoshi-accumulator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

## Overview

The Satoshi Accumulator Dashboard provides a central place to monitor your Bitcoin accumulation strategy. It displays:

- Current account and position balances from Alpaca
- Latest bot trading activity and technical indicators from Firestore
- Trading history with key signals
- Witty commentary on market conditions via ChatGPT

## Features

- **Account Dashboard**: View current portfolio value, cash balance, buying power, and Bitcoin position details
- **Bot Status**: Monitor the latest trading bot action, buy/sell scores, and technical indicators
- **Trading History**: Review past trades and understand the signals that triggered them
- **AI Commentary**: Get witty, Bitcoin-maximalist commentary on current market conditions
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Data refreshes automatically every 5 minutes

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS (styling)
- Firebase/Firestore (real-time database)
- Alpaca API (trading platform integration)
- OpenAI API (ChatGPT integration)

## Getting Started

### Prerequisites

- Node.js 16.x or later
- An Alpaca trading account with API keys
- A Firebase project with Firestore database
- An OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/satoshi-accumulator.git
cd satoshi-accumulator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your API keys:
```
# OpenAI API Key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# Alpaca API Keys
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard.

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fsatoshi-accumulator)

## Firestore Data Structure

The dashboard expects your Firestore database to have a `bot_status` collection with documents containing:

```
{
  action: "buy" | "sell" | "hold",
  buy_score: number,
  sell_score: number,
  price: number,
  qty: number,
  message: string,
  timestamp: string,
  type: string,
  signals: {
    bb_1h_lower_touch: boolean,
    bb_1h_upper_touch: boolean,
    bb_4h_lower_touch: boolean,
    bb_4h_upper_touch: boolean,
    bearish_div_1h: boolean,
    bearish_div_4h: boolean,
    bullish_div_1h: boolean,
    bullish_div_4h: boolean,
    ema_1h: number,
    ema_4h: number,
    ema_4h_trend_bullish: boolean,
    price_1h: number,
    price_4h: number,
    rsi_1h: number,
    rsi_1h_overbought: boolean,
    rsi_1h_oversold: boolean,
    rsi_4h: number,
    rsi_4h_overbought: boolean,
    rsi_4h_oversold: boolean,
    rsi_4h_pullback: boolean
  }
}
```

## License

MIT

## Disclaimer

This dashboard is for informational purposes only. It is not financial advice, and trading cryptocurrency involves risk. Use at your own discretion.
