"use client";

import { FaBitcoin, FaGithub, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FaBitcoin className="text-orange-500 text-2xl mr-2" />
            <span className="font-bold text-white">Satoshi Accumulator</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/your-username/satoshi-accumulator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="GitHub"
            >
              <FaGithub className="h-6 w-6" />
            </a>
            <a 
              href="https://twitter.com/your-twitter" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center md:text-left">
          <p className="text-sm">
            &copy; {currentYear} Satoshi Accumulator. All rights reserved.
          </p>
          <p className="text-xs mt-2">
            Bitcoin price data provided by CoinGecko API. Trading powered by Alpaca.
          </p>
          <p className="text-xs mt-1">
            This is not financial advice. Use at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
} 