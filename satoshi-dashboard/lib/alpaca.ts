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

export async function getPositions() {
  try {
    const res = await fetch('/api/alpaca/positions');

    const data = await res.json();

    if (!res.ok) {
      console.error('Failed to fetch positions:', data);
      return [];
    }

    console.log('✅ Fetched positions:', data);
    return data;
  } catch (error) {
    console.error('Fetch error (positions):', error);
    return [];
  }
}
