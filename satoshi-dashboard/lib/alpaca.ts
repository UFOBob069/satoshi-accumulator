// lib/alpaca.ts

export interface Position {
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

export interface AccountInfo {
  equity: number;
  cash: number;
  buying_power: number;
  portfolio_value: number;
}

export async function getAccountInfo(): Promise<AccountInfo | null> {
  try {
    const res = await fetch('/api/alpaca/account');
    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to fetch account info:', data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Fetch error (account):', error);
    return null;
  }
}

export async function getPositions(): Promise<Position[]> {
  try {
    console.log('Fetching positions...'); // Debug log
    const res = await fetch('/api/alpaca/positions');
    const data = await res.json();
    console.log('Positions response:', data); // Debug log

    if (!res.ok) {
      console.error('Failed to fetch positions:', data);
      throw new Error(data.error || 'Failed to fetch positions');
    }

    // If we get an empty array, that's fine
    if (Array.isArray(data) && data.length === 0) {
      return [];
    }

    // If we get an error object instead of an array
    if (!Array.isArray(data)) {
      console.error('Invalid positions data:', data);
      throw new Error('Invalid response format');
    }

    return data.map((p: any) => ({
      symbol: String(p.symbol || ''),
      qty: Number(p.qty || 0),
      market_value: Number(p.market_value || 0),
      cost_basis: Number(p.cost_basis || 0),
      unrealized_pl: Number(p.unrealized_pl || 0),
      unrealized_plpc: Number(p.unrealized_plpc || 0),
      current_price: Number(p.current_price || 0),
      lastday_price: Number(p.lastday_price || 0),
      change_today: Number(p.change_today || 0),
    }));
  } catch (error) {
    console.error('Error in getPositions:', error);
    throw error; // Let the component handle the error
  }
}
