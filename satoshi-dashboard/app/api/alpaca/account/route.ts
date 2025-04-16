import { NextResponse } from 'next/server';

interface AlpacaAccount {
  equity: number;
  cash: number;
  buying_power: number;
  portfolio_value: number;
}

interface AlpacaError {
  message: string;
  code: number;
}

export async function GET(request: Request) {
  const ALPACA_API_KEY = process.env.ALPACA_API_KEY;
  const ALPACA_SECRET_KEY = process.env.ALPACA_SECRET_KEY;

  if (!ALPACA_API_KEY || !ALPACA_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Alpaca API credentials not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const account = await response.json();
    return NextResponse.json(account);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 