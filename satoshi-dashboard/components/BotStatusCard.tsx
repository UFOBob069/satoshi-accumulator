"use client";

import { useState, useEffect } from 'react';
import { BotStatusData, BotSignals, getLatestBotStatus } from '../lib/firestore';
import { FaRobot, FaExchangeAlt, FaChartBar, FaInfoCircle } from 'react-icons/fa';

export default function BotStatusCard() {
  const [botStatus, setBotStatus] = useState<BotStatusData | null>(null);
  const [wittyComment, setWittyComment] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const status = await getLatestBotStatus();
        setBotStatus(status);
        
        if (status) {
          // Make a direct API call to the OpenAI route
          const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ botStatus: status }),
          });

          if (!response.ok) {
            throw new Error('Failed to generate witty comment');
          }

          const data = await response.json();
          setWittyComment(data.comment || 'Stack those sats!');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bot status:', err);
        setError('Failed to load bot status. Please try again later.');
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

  if (!botStatus) {
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center">
          <FaRobot className="mr-2" /> Bot Status
        </h2>
        <div className="text-center py-4 text-gray-400">
          No bot status data available. The bot might not be running.
        </div>
      </div>
    );
  }

  const { 
    action = 'unknown', 
    buy_score = 0, 
    sell_score = 0, 
    price = 0, 
    qty = 0, 
    timestamp = new Date().toISOString(),
    signals = {} as BotSignals
  } = botStatus;

  const formattedDate = timestamp ? new Date(timestamp).toLocaleString() : 'N/A';
  const actionColor = action === 'buy' ? 'text-green-400' : action === 'sell' ? 'text-red-400' : 'text-yellow-400';

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-orange-500 flex items-center">
        <FaRobot className="mr-2" /> Bot Status
      </h2>
      
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <p className="text-xl font-medium italic text-yellow-300 mb-2">&ldquo;{wittyComment}&rdquo;</p>
        <p className="text-right text-sm text-gray-400">- Satoshi Accumulator GPT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center">
            <FaExchangeAlt className="mr-2 text-blue-400" /> Latest Action
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Action:</span>
              <span className={`font-bold uppercase ${actionColor}`}>{action}</span>
            </div>
            <div className="flex justify-between">
              <span>Price:</span>
              <span className="font-bold">${typeof price === 'number' ? price.toLocaleString() : 'N/A'}</span>
            </div>
            {qty > 0 && (
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-bold">{typeof qty === 'number' ? qty.toFixed(8) : '0'} BTC</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Buy Score:</span>
              <span className="font-bold text-green-400">{buy_score}</span>
            </div>
            <div className="flex justify-between">
              <span>Sell Score:</span>
              <span className="font-bold text-red-400">{sell_score}</span>
            </div>
            <div className="flex justify-between">
              <span>Timestamp:</span>
              <span className="font-bold">{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center">
            <FaChartBar className="mr-2 text-purple-400" /> Key Indicators
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>1h RSI:</span>
              <span className={`font-bold ${signals.rsi_1h > 70 ? 'text-red-400' : signals.rsi_1h < 30 ? 'text-green-400' : 'text-white'}`}>
                {typeof signals.rsi_1h === 'number' ? signals.rsi_1h.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>4h RSI:</span>
              <span className={`font-bold ${signals.rsi_4h > 70 ? 'text-red-400' : signals.rsi_4h < 30 ? 'text-green-400' : 'text-white'}`}>
                {typeof signals.rsi_4h === 'number' ? signals.rsi_4h.toFixed(2) : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>1h EMA:</span>
              <span className="font-bold">${typeof signals.ema_1h === 'number' ? signals.ema_1h.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>4h EMA:</span>
              <span className="font-bold">${typeof signals.ema_4h === 'number' ? signals.ema_4h.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>4h Trend:</span>
              <span className={`font-bold ${signals.ema_4h_trend_bullish ? 'text-green-400' : 'text-red-400'}`}>
                {signals.ema_4h_trend_bullish ? 'Bullish' : 'Bearish'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-300 flex items-center">
          <FaInfoCircle className="mr-2 text-cyan-400" /> Technical Signals
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>BB 1h Upper Touch:</span>
              <span className="text-gray-400">
                {signals.bb_1h_upper_touch ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>BB 4h Upper Touch:</span>
              <span className="text-gray-400">
                {signals.bb_4h_upper_touch ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bullish Div 1h:</span>
              <span className="text-gray-400">
                {signals.bullish_div_1h ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bullish Div 4h:</span>
              <span className="text-gray-400">
                {signals.bullish_div_4h ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>BB 1h Lower Touch:</span>
              <span className="text-gray-400">
                {signals.bb_1h_lower_touch ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>BB 4h Lower Touch:</span>
              <span className="text-gray-400">
                {signals.bb_4h_lower_touch ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bearish Div 1h:</span>
              <span className="text-gray-400">
                {signals.bearish_div_1h ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bearish Div 4h:</span>
              <span className="text-gray-400">
                {signals.bearish_div_4h ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 