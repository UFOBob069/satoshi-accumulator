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
    const res = await fetch('/api/alpaca/positions');
    const raw = await res.json();

    return raw.map((p: any) => ({
      symbol: p.symbol,
      qty: parseFloat(p.qty),
      market_value: parseFloat(p.market_value),
      cost_basis: parseFloat(p.cost_basis),
      unrealized_pl: parseFloat(p.unrealized_pl),
      unrealized_plpc: parseFloat(p.unrealized_plpc),
      current_price: parseFloat(p.current_price),
      lastday_price: parseFloat(p.lastday_price),
      change_today: parseFloat(p.change_today),
    }));
  } catch (error) {
    console.error('Fetch error (positions):', error);
    return [];
  }
}
