import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use fetch instead of the Alpaca SDK to avoid Node.js module issues
    const response = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY || '',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch account information');
    }

    const account = await response.json();
    
    return NextResponse.json({
      equity: parseFloat(account.equity),
      cash: parseFloat(account.cash),
      buying_power: parseFloat(account.buying_power),
      portfolio_value: parseFloat(account.portfolio_value),
    });
  } catch (error: any) {
    console.error('Error fetching account info:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch account information' },
      { status: 500 }
    );
  }
} 