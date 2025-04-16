import { useEffect } from 'react';
import { parseKeystroke } from '@/lib/calculatorUtils';

const useKeyboardInput = (
  handleInput: (value: string) => void,
  handleEquals: () => void,
  handleClear: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevents capturing keyboard events when user is typing in an input field or textarea
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = event.key;
      
      // Handle Equals/Enter key
      if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEquals();
        return;
      }
      
      // Handle Clear/Escape key
      if (key === 'Escape') {
        event.preventDefault();
        handleClear();
        return;
      }
      
      // Parse other keystrokes
      const value = parseKeystroke(key);
      if (value) {
        event.preventDefault();
        handleInput(value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleInput, handleEquals, handleClear]);
};

export default useKeyboardInput;