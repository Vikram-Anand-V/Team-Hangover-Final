import React from 'react';
import { motion } from 'framer-motion';

type ModeToggleProps = {
  isScientificMode: boolean;
  toggleMode: () => void;
};

const ModeToggle: React.FC<ModeToggleProps> = ({
  isScientificMode,
  toggleMode
}) => {
  return (
    <button
      onClick={toggleMode}
      className="p-1 rounded hover:bg-primary/20 text-primary transition-colors"
      aria-label={isScientificMode ? "Switch to basic mode" : "Switch to scientific mode"}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isScientificMode ? 180 : 0 }}
        transition={{ duration: 0.5 }}
      >
        {isScientificMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3zM16 7v10H8V7h8z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7v10M16 12H8" />
          </svg>
        )}
      </motion.div>
    </button>
  );
};

export default ModeToggle;