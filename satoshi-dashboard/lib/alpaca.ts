export async function getAccountInfo() {
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
  const res = await fetch('/api/alpaca/positions');
  const raw = await res.json();

  return raw.map((p: any) => ({
    ...p,
    qty: parseFloat(p.qty),
    market_value: parseFloat(p.market_value),
    cost_basis: parseFloat(p.cost_basis),
    unrealized_pl: parseFloat(p.unrealized_pl),
    unrealized_plpc: parseFloat(p.unrealized_plpc),
    current_price: parseFloat(p.current_price),
    lastday_price: parseFloat(p.lastday_price),
    change_today: parseFloat(p.change_today),
  }));
}
