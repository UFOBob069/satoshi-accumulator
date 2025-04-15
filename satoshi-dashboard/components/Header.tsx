"use client";

import { useState, useEffect } from 'react';
import { FaBitcoin, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBitcoinPrice() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const data = await response.json();
        
        if (data.bitcoin) {
          setCurrentPrice(data.bitcoin.usd);
          setPriceChange(data.bitcoin.usd_24h_change || 0);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        setLoading(false);
      }
    }

    fetchBitcoinPrice();
    
    // Refresh price every minute
    const intervalId = setInterval(fetchBitcoinPrice, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gray-900 text-white border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaBitcoin className="text-orange-500 text-3xl mr-3" />
            <h1 className="text-xl font-bold">Satoshi Accumulator</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="hover:text-orange-400 transition-colors duration-200">Dashboard</a>
                </li>
                <li>
                  <a href="#history" className="hover:text-orange-400 transition-colors duration-200">Trading History</a>
                </li>
                <li>
                  <a href="https://github.com/your-username/satoshi-accumulator" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors duration-200">GitHub</a>
                </li>
              </ul>
            </nav>
            
            {!loading && currentPrice && (
              <div className="flex items-center bg-gray-800 px-4 py-2 rounded-lg">
                <FaBitcoin className="text-orange-500 mr-2" />
                <div>
                  <span className="font-bold">${currentPrice.toLocaleString()}</span>
                  <span className={`ml-2 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav>
              <ul className="flex flex-col space-y-4">
                <li>
                  <a 
                    href="#" 
                    className="block hover:text-orange-400 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a 
                    href="#history" 
                    className="block hover:text-orange-400 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Trading History
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com/your-username/satoshi-accumulator" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block hover:text-orange-400 transition-colors duration-200"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </nav>
            
            {!loading && currentPrice && (
              <div className="flex items-center mt-4 bg-gray-800 px-4 py-2 rounded-lg w-fit">
                <FaBitcoin className="text-orange-500 mr-2" />
                <div>
                  <span className="font-bold">${currentPrice.toLocaleString()}</span>
                  <span className={`ml-2 text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
} 