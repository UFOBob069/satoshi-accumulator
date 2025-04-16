"use client";

import { useState, useEffect } from 'react';
import { getAccountInfo, getPositions, Position } from '../lib/alpaca';
import { FaBitcoin, FaDollarSign, FaChartLine } from 'react-icons/fa';

interface AccountInfo {
  equity: number;
  cash: number;
  buying_power: number;
  portfolio_value: number;
}

export default function AccountDashboard() {
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors
        
        const [accountData, positionsData] = await Promise.all([
          getAccountInfo(),
          getPositions()
        ]);
        
        if (accountData === null) {
          throw new Error('Failed to fetch account data');
        }
        
        setAccountInfo(accountData);
        setPositions(positionsData || []); // Ensure we always set an array
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        setPositions([]); // Reset positions on error
        setLoading(false);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 300000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const btcPosition = positions.find(p => p.symbol === 'BTC/USD') || 
                      positions.find(p => p.symbol === 'BTCUSD');

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center">
        <FaBitcoin className="mr-2" /> Satoshi Accumulator Dashboard
      </h2>

      {accountInfo && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-gray-300 flex items-center">
              <FaDollarSign className="mr-2 text-green-400" /> Account Overview
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Portfolio Value:</span>
                <span className="font-bold">${accountInfo.portfolio_value.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Cash Balance:</span>
                <span className="font-bold">${accountInfo.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Buying Power:</span>
                <span className="font-bold">${accountInfo.buying_power.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {btcPosition && (
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-gray-300 flex items-center">
                <FaChartLine className="mr-2 text-orange-400" /> Bitcoin Position
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Quantity:</span>
                  <span className="font-bold">
                    {typeof btcPosition.qty === 'string' 
                      ? parseFloat(btcPosition.qty).toFixed(8) 
                      : btcPosition.qty.toFixed(8)
                    } BTC
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Value:</span>
                  <span className="font-bold">${btcPosition.market_value.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Basis:</span>
                  <span className="font-bold">${btcPosition.cost_basis.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit/Loss:</span>
                  <span className={`font-bold ${btcPosition.unrealized_pl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${btcPosition.unrealized_pl.toLocaleString()} ({(btcPosition.unrealized_plpc * 100).toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-bold">${btcPosition.current_price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>24h Change:</span>
                  <span className={`font-bold ${btcPosition.change_today >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(btcPosition.change_today * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {positions.length === 0 && (
        <div className="text-center py-4 text-gray-400">
          No positions found. The bot hasn't accumulated any Bitcoin yet.
        </div>
      )}

      <p className="text-xs mt-1">
        This dashboard isn&apos;t financial advice. Use at your own risk.
      </p>
    </div>
  );
}
