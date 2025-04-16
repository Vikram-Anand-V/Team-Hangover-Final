import { useState, useEffect, useCallback } from 'react';
import { evaluateExpression, formatResult, loadHistory, saveHistory } from '@/lib/calculatorUtils';
import { useToast } from '@/hooks/use-toast';

type ResultTag = 'basic' | 'scientific' | 'financial' | 'geometry' | 'custom';

type HistoryItem = {
  expression: string;
  result: string;
  timestamp: number;
  tag?: ResultTag;
};

const useCalculator = () => {
  const [display, setDisplay] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [memory, setMemory] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isScientificMode, setScientificMode] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const { toast } = useToast();

  // Load history from localStorage on initial render
  useEffect(() => {
    const savedHistory = loadHistory();
    if (savedHistory && Array.isArray(savedHistory)) {
      setHistory(savedHistory);
    }
  }, []);

  // Helper function to clear the display for a new calculation
  const clearAfterCalculation = useCallback(() => {
    if (isCalculated) {
      setDisplay('0');
      setExpression('');
      setIsCalculated(false);
    }
  }, [isCalculated]);

  // Handle button press
  const handleButtonPress = useCallback((value: string) => {
    setError(null);
    
    // Handle backspace
    if (value === 'backspace') {
      clearAfterCalculation();
      setDisplay(prev => {
        if (prev.length === 1 || prev === 'Error') return '0';
        return prev.slice(0, -1);
      });
      return;
    }
    
    // Clear the calculator if starting a new calculation after a completed one
    clearAfterCalculation();
    
    // If input is an operator or function
    if (['+', '-', '*', '/', '%', '^', '(', ')', '!', 'sin(', 'cos(', 'tan(', 'log10(', 'ln(', 'sqrt(', 'pi', 'e'].includes(value)) {
      if (value === 'pi') {
        setDisplay(prev => prev === '0' ? 'π' : prev + 'π');
        setExpression(prev => prev + 'pi');
      } else if (value === 'e') {
        setDisplay(prev => prev === '0' ? 'e' : prev + 'e');
        setExpression(prev => prev + 'e');
      } else {
        // Handle operators
        let displayValue = value;
        displayValue = displayValue.replace('*', '×');
        displayValue = displayValue.replace('/', '÷');
        displayValue = displayValue.replace('sqrt(', '√(');
        displayValue = displayValue.replace('log10(', 'log(');
        
        setDisplay(prev => (prev === '0' && !['(', 'sin(', 'cos(', 'tan(', 'log10(', 'ln(', 'sqrt('].includes(value)) 
          ? displayValue 
          : prev + displayValue);
        setExpression(prev => prev + value);
      }
      return;
    }
    
    // Handle numbers and decimal point
    setDisplay(prev => {
      if (prev === '0' && value !== '.') return value;
      if (prev === '0' && value === '.') return '0.';
      if (prev.includes('.') && value === '.') return prev;
      return prev + value;
    });
    
    setExpression(prev => prev + value);
  }, [clearAfterCalculation]);

  // Handle equals button
  const handleEquals = useCallback(() => {
    if (!expression) return;
    
    try {
      const result = evaluateExpression(expression);
      const formattedResult = formatResult(result);
      
      setDisplay(formattedResult);
      setIsCalculated(true);
      
      // Add to history with appropriate tag
      let calculationTag: ResultTag = 'basic';
      
      // Determine the type of calculation for tagging
      if (isScientificMode || /sin|cos|tan|log|ln|sqrt|pi|e|\^/.test(expression)) {
        calculationTag = 'scientific';
      } else if (/\*\(1\+[0-9.]+\/[0-9.]+\)\^|[0-9.]+%/.test(expression)) {
        calculationTag = 'financial';
      } else if (/\*r\^2|\*0\.5\*|\^2\+|\^2=/.test(expression)) {
        calculationTag = 'geometry';
      }
      
      const historyItem: HistoryItem = {
        expression,
        result: formattedResult,
        timestamp: Date.now(),
        tag: calculationTag
      };
      
      setHistory(prev => {
        const updatedHistory = [historyItem, ...prev];
        saveHistory(updatedHistory);
        return updatedHistory;
      });
    } catch (err) {
      setError("Invalid expression");
      console.error("Calculation error:", err);
    }
  }, [expression, isScientificMode]);

  // Handle clear button
  const handleClear = useCallback(() => {
    setDisplay('0');
    setExpression('');
    setError(null);
    setIsCalculated(false);
  }, []);

  // Handle memory operations
  const handleMemoryOperation = useCallback((operation: string) => {
    let newMemory = memory;
    
    switch (operation) {
      case 'MC': // Memory Clear
        newMemory = 0;
        break;
      case 'MR': // Memory Recall
        setDisplay(memory.toString());
        break;
      case 'M+': // Memory Add
        try {
          const currentValue = evaluateExpression(display);
          newMemory += currentValue;
        } catch (err) {
          setError("Cannot add to memory: invalid number");
        }
        break;
      case 'M-': // Memory Subtract
        try {
          const currentValue = evaluateExpression(display);
          newMemory -= currentValue;
        } catch (err) {
          setError("Cannot subtract from memory: invalid number");
        }
        break;
      default:
        break;
    }
    
    setMemory(newMemory);
  }, [memory, display]);

  // Copy result to clipboard
  const copyResultToClipboard = useCallback(() => {
    navigator.clipboard.writeText(display)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description: display,
          duration: 2000,
        });
      })
      .catch(err => {
        console.error("Failed to copy:", err);
        setError("Could not copy to clipboard");
      });
  }, [display, toast]);

  // Add custom tag to calculation
  const addCustomTaggedCalculation = useCallback((expr: string) => {
    try {
      const result = evaluateExpression(expr);
      const formattedResult = formatResult(result);
      
      const historyItem: HistoryItem = {
        expression: expr,
        result: formattedResult,
        timestamp: Date.now(),
        tag: 'custom'
      };
      
      setHistory(prev => {
        const updatedHistory = [historyItem, ...prev];
        saveHistory(updatedHistory);
        return updatedHistory;
      });

      toast({
        title: "Added custom calculation",
        description: "Calculation tagged as 'Custom'",
        duration: 2000,
      });
    } catch (err) {
      console.error("Custom calculation error:", err);
      setError("Could not add custom calculation");
    }
  }, [toast]);

  return {
    display,
    expression,
    memory,
    history,
    isScientificMode,
    error,
    setScientificMode,
    handleButtonPress,
    handleClear,
    handleEquals,
    handleMemoryOperation,
    copyResultToClipboard,
    addCustomTaggedCalculation,
  };
};

export default useCalculator;