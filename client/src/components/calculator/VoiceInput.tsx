import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';
import { parseSpeechToExpression } from '@/lib/calculatorUtils';

interface VoiceInputProps {
  onSpeechResult: (expression: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onSpeechResult }) => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    hasRecognitionSupport,
    error 
  } = useSpeechRecognition();

  // Process speech results when transcript changes
  useEffect(() => {
    if (transcript) {
      const parsedExpression = parseSpeechToExpression(transcript);
      if (parsedExpression) {
        onSpeechResult(parsedExpression);
      }
    }
  }, [transcript, onSpeechResult]);

  if (!hasRecognitionSupport) {
    return (
      <div className="text-center p-2 bg-red-50 text-red-600 text-xs rounded-md">
        Your browser doesn't support speech recognition
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.button
        onClick={isListening ? stopListening : startListening}
        className={`flex items-center justify-center rounded-full p-1 ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white animate-pulse shadow-md' 
            : 'bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary hover:bg-gradient-to-r hover:from-primary/30 hover:to-blue-500/30'
        } transition-all duration-200`}
        whileTap={{ scale: 0.95 }}
        aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isListening 
              ? "M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" 
              : "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            }
          />
        </svg>
      </motion.button>
      
      {isListening && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-2 left-0 right-0 bg-white p-2 rounded-md shadow-lg text-sm z-10"
        >
          <p className="text-gray-500 text-xs">Listening...</p>
          {transcript && <p className="font-medium truncate">{transcript}</p>}
        </motion.div>
      )}
      
      {error && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-red-50 p-2 rounded-md text-red-600 text-xs">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;