import { NextResponse } from 'next/server';

// Add proper types instead of any
interface AlpacaError {
  message: string;
  code: number;
}

interface AlpacaPosition {
  symbol: string;
  qty: number;
  market_value: number;
  cost_basis: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  current_price: number;
  lastday_price: number;
  change_today: number;
}

export async function GET(request: Request) {
  try {
    // Use fetch instead of the Alpaca SDK to avoid Node.js module issues
    const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET || '',
      },
    });

    if (!response.ok) {
      const error = await response.json() as AlpacaError;
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    const positions = await response.json() as AlpacaPosition[];
    
    const formattedPositions = positions.map((position: AlpacaPosition) => ({
      symbol: position.symbol,
      qty: parseFloat(position.qty.toString()),
      market_value: parseFloat(position.market_value.toString()),
      cost_basis: parseFloat(position.cost_basis.toString()),
      unrealized_pl: parseFloat(position.unrealized_pl.toString()),
      unrealized_plpc: parseFloat(position.unrealized_plpc.toString()),
      current_price: parseFloat(position.current_price.toString()),
      lastday_price: parseFloat(position.lastday_price.toString()),
      change_today: parseFloat(position.change_today.toString()),
    }));

    return NextResponse.json(formattedPositions);
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 