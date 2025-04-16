import React from 'react';
import { motion } from 'framer-motion';

type CalculatorDisplayProps = {
  display: string;
  expression: string;
  error: string | null;
  copyToClipboard: () => void;
};

const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  display,
  expression,
  error,
  copyToClipboard
}) => {
  return (
    <div className="p-4 bg-gradient-to-r from-slate-800 to-gray-900 text-white border-b border-gray-700">
      <div className="relative">
        {/* Expression */}
        <div className="text-sm text-gray-400 mb-1 h-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {expression}
        </div>
        
        {/* Main Display */}
        <div className="flex justify-between items-center">
          <motion.div 
            className="text-3xl font-bold overflow-x-auto whitespace-nowrap scrollbar-hide pr-8"
            animate={{ opacity: error ? 0.5 : 1 }}
          >
            {display}
          </motion.div>
          
          <motion.button
            className="absolute right-0 top-0 p-1 text-gray-400 hover:text-white transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyToClipboard}
            title="Copy result"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </motion.button>
        </div>
        
        {/* Error Message */}
        {error && (
          <motion.div 
            className="text-red-500 text-sm mt-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CalculatorDisplay;