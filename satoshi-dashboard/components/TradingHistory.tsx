"use client";

import { useState, useEffect } from 'react';
import { BotStatusData, BotSignals, getRecentBotStatuses } from '../lib/firestore';
import { FaHistory, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function TradingHistory() {
  const [tradingHistory, setTradingHistory] = useState<BotStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const history = await getRecentBotStatuses(20);
        setTradingHistory(history);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching trading history:', err);
        setError('Failed to load trading history. Please try again later.');
        setLoading(false);
      }
    }

    fetchData();
    // Set up interval to refresh data every 5 minutes
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

  if (tradingHistory.length === 0) {
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center">
          <FaHistory className="mr-2" /> Trading History
        </h2>
        <div className="text-center py-4 text-gray-400">
          No trading history available. The bot might not have made any trades yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center">
        <FaHistory className="mr-2" /> Trading History
      </h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Action
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Price
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Buy/Sell Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Key Signals
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {tradingHistory.map((trade, index) => {
              const { 
                action = 'unknown',
                buy_score = 0,
                sell_score = 0,
                price = 0,
                qty = 0,
                timestamp = new Date().toISOString(),
                signals = {} as BotSignals
              } = trade;

              const actionColor = 
                action === 'buy' 
                  ? 'bg-green-900 text-green-300' 
                  : action === 'sell' 
                    ? 'bg-red-900 text-red-300' 
                    : 'bg-yellow-900 text-yellow-300';
              
              const formattedDate = timestamp 
                ? new Date(timestamp.replace(/(\.\d{3})\d+/, '$1')).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                  })
                : 'N/A';
              
              // Key signal highlights to show
              const keySignals = [];
              if (signals.rsi_1h && signals.rsi_1h < 30) keySignals.push('1h RSI Oversold');
              if (signals.rsi_1h && signals.rsi_1h > 70) keySignals.push('1h RSI Overbought');
              if (signals.rsi_4h && signals.rsi_4h < 30) keySignals.push('4h RSI Oversold');
              if (signals.rsi_4h && signals.rsi_4h > 70) keySignals.push('4h RSI Overbought');
              if (signals.bb_1h_lower_touch) keySignals.push('1h BB Lower Touch');
              if (signals.bb_1h_upper_touch) keySignals.push('1h BB Upper Touch');
              if (signals.bullish_div_1h) keySignals.push('1h Bullish Div');
              if (signals.bearish_div_1h) keySignals.push('1h Bearish Div');
              if (signals.bullish_div_4h) keySignals.push('4h Bullish Div');
              if (signals.bearish_div_4h) keySignals.push('4h Bearish Div');
              
              return (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {formattedDate}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full uppercase ${actionColor}`}>
                      {action === 'buy' ? (
                        <><FaArrowUp className="mr-1" /> Buy</>
                      ) : action === 'sell' ? (
                        <><FaArrowDown className="mr-1" /> Sell</>
                      ) : (
                        action || 'N/A'
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-100">
                    ${typeof price === 'number' ? price.toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                    {typeof qty === 'number' && qty > 0 ? qty.toFixed(8) + ' BTC' : '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <span className="text-green-400 font-medium">{buy_score}</span>
                    {' - '}
                    <span className="text-red-400 font-medium">{sell_score}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {keySignals.map((signal, idx) => (
                        <span 
                          key={idx} 
                          className={`px-1.5 py-0.5 text-xs rounded-md ${
                            signal.includes('Bullish') || signal.includes('Oversold') || signal.includes('Lower') 
                              ? 'bg-green-900 text-green-300' 
                              : signal.includes('Bearish') || signal.includes('Overbought') || signal.includes('Upper')
                                ? 'bg-red-900 text-red-300'
                                : 'bg-blue-900 text-blue-300'
                          }`}
                        >
                          {signal}
                        </span>
                      ))}
                      {keySignals.length === 0 && (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
} 