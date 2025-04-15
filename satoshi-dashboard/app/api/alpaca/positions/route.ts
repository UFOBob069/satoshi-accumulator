import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use fetch instead of the Alpaca SDK to avoid Node.js module issues
    const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch positions');
    }

    const positions = await response.json();
    
    const formattedPositions = positions.map((position: any) => ({
      symbol: position.symbol,
      qty: parseFloat(position.qty),
      market_value: parseFloat(position.market_value),
      cost_basis: parseFloat(position.cost_basis),
      unrealized_pl: parseFloat(position.unrealized_pl),
      unrealized_plpc: parseFloat(position.unrealized_plpc),
      current_price: parseFloat(position.current_price),
      lastday_price: parseFloat(position.lastday_price),
      change_today: parseFloat(position.change_today),
    }));

    return NextResponse.json(formattedPositions);
  } catch (error: any) {
    console.error('Error fetching positions:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch positions' },
      { status: 500 }
    );
  }
} 