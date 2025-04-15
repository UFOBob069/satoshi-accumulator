export async function getAccountInfo() {
  try {
    const response = await fetch('/api/alpaca/account', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch account info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching account info:', error);
    return null;
  }
}

export async function getPositions() {
  try {
    const response = await fetch('/api/alpaca/positions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch positions');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching positions:', error);
    return [];
  }
} 