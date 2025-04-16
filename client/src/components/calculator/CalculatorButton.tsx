import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type CalculatorButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "operator" | "equals" | "clear" | "memory" | "scientific";
  className?: string;
};

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  children,
  onClick,
  variant = "default",
  className,
}) => {
  const baseClasses = "calculator-btn-3d flex items-center justify-center rounded-md p-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow";
  
  const variantClasses = {
    default: "bg-white text-gray-800 hover:bg-gray-50",
    operator: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-600 hover:from-amber-100 hover:to-yellow-100",
    equals: "bg-gradient-to-r from-blue-500 to-primary text-white hover:from-blue-600 hover:to-primary",
    clear: "bg-gradient-to-r from-rose-500 to-red-500 text-white hover:from-rose-600 hover:to-red-600",
    memory: "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 hover:from-indigo-200 hover:to-blue-200",
    scientific: "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-600 hover:from-purple-200 hover:to-violet-200"
  };

  return (
    <motion.button
      onClick={onClick}
      className={cn(baseClasses, variantClasses[variant], className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default CalculatorButton;