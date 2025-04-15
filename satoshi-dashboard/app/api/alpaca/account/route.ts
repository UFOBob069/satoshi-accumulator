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
  try {
    const response = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET || '',
      },
    });

    if (!response.ok) {
      const error = await response.json() as AlpacaError;
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const account = await response.json() as AlpacaAccount;
    return NextResponse.json(account);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 