import { NextResponse } from 'next/server';
import { Position } from '@/lib/alpaca';

interface AlpacaError {
  message: string;
  code: number;
}

export async function GET(request: Request) {
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
    console.log('Fetching positions from Alpaca...'); // Debug log
    const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': ALPACA_API_KEY,
        'APCA-API-SECRET-KEY': ALPACA_SECRET_KEY,
        'Accept': 'application/json',
      },
    });

    const responseData = await response.json();
    console.log('Alpaca API response:', response.status, responseData); // Debug log

    if (!response.ok) {
      return NextResponse.json(
        { error: responseData.message || 'Failed to fetch positions' },
        { status: response.status }
      );
    }

    // If no positions, return empty array instead of error
    if (!responseData || !Array.isArray(responseData)) {
      console.log('No positions found or invalid response format');
      return NextResponse.json([]);
    }

    const positions = responseData.map(p => ({
      symbol: String(p.symbol),
      qty: Number(p.qty),
      market_value: Number(p.market_value),
      cost_basis: Number(p.cost_basis),
      unrealized_pl: Number(p.unrealized_pl),
      unrealized_plpc: Number(p.unrealized_plpc),
      current_price: Number(p.current_price),
      lastday_price: Number(p.lastday_price),
      change_today: Number(p.change_today),
    }));

    return NextResponse.json(positions);
  } catch (error) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    );
  }
}
