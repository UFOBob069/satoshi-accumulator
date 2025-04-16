import { NextResponse } from 'next/server';

interface AlpacaError {
  message: string;
  code: number;
}

interface AlpacaPosition {
  symbol: string;
  qty: string; // Alpaca returns string values for numbers
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

export async function GET() {
  const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
  const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;

  if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
    console.error("❌ Missing Alpaca API credentials");
    return NextResponse.json(
      { error: 'Alpaca API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
      },
    });

    console.log("📡 Alpaca response status:", response.status);

    if (!response.ok) {
      const error: AlpacaError = await response.json();
      console.error("❌ Alpaca API error:", error);
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const positions: AlpacaPosition[] = await response.json();
    console.log("✅ Positions fetched:", positions.length);

    return NextResponse.json(positions);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error("🚨 Fetch failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
