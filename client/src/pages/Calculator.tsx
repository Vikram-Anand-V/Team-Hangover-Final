import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import CalculatorDisplay from "@/components/calculator/CalculatorDisplay";
import CalculatorButton from "@/components/calculator/CalculatorButton";
import ModeToggle from "@/components/calculator/ModeToggle";
import HistoryPanel from "@/components/calculator/HistoryPanel";
import VoiceInput from "@/components/calculator/VoiceInput";
import FormulaReference from "@/components/calculator/FormulaReference";
import useCalculator from "@/hooks/useCalculator";
import useKeyboardInput from "@/hooks/useKeyboardInput";

const Calculator = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [showFormulas, setShowFormulas] = useState(false);
  const {
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
  } = useCalculator();

  // Setup keyboard input handling
  useKeyboardInput(handleButtonPress, handleEquals, handleClear);

  const toggleHistory = () => {
    if (showFormulas) setShowFormulas(false);
    setShowHistory(!showHistory);
  };
  
  const toggleFormulas = () => {
    if (showHistory) setShowHistory(false);
    setShowFormulas(!showFormulas);
  };
  
  // Handle speech recognition result
  const handleSpeechResult = useCallback((expression: string) => {
    if (!expression) return;
    
    // Process the voice input expression
    handleButtonPress(expression);
    
    // Automatically calculate the result
    setTimeout(() => {
      handleEquals();
    }, 500); // Small delay to ensure the expression is fully processed
  }, [handleButtonPress, handleEquals]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full flex flex-col relative backdrop-blur-md bg-opacity-90 transform perspective-1000 rotate-y-1 hover:rotate-y-0 transition-transform duration-500">
        {/* Calculator Header */}
        <div className="bg-gradient-to-r from-primary/20 to-indigo-500/20 px-4 py-3 flex justify-between items-center border-b border-blue-100">
          <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
            {isScientificMode ? "Scientific Calculator" : "Basic Calculator"}
          </h1>
          <div className="flex space-x-2">
            <VoiceInput onSpeechResult={handleSpeechResult} />
            <ModeToggle
              isScientificMode={isScientificMode}
              toggleMode={() => setScientificMode(!isScientificMode)}
            />
            <button
              onClick={toggleFormulas}
              className={`p-1 rounded hover:bg-primary/20 transition-colors ${
                showFormulas ? 'bg-primary/20 text-primary' : 'text-primary'
              }`}
              aria-label="Toggle formula reference"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </button>
            <button
              onClick={toggleHistory}
              className={`p-1 rounded hover:bg-primary/20 transition-colors ${
                showHistory ? 'bg-primary/20 text-primary' : 'text-primary'
              }`}
              aria-label="Toggle history"
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="flex flex-grow">
          {/* Calculator Pad */}
          <div className="flex-grow flex flex-col">
            {/* Display */}
            <CalculatorDisplay
              display={display}
              expression={expression}
              error={error}
              copyToClipboard={copyResultToClipboard}
            />

            {/* Memory Display */}
            {memory !== 0 && (
              <div className="bg-gradient-to-r from-primary/5 to-indigo-500/5 px-4 py-1 text-sm text-right border-t border-blue-50">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 font-semibold">Memory: {memory}</span>
              </div>
            )}

            {/* Calculator Buttons */}
            <div className="flex-grow grid gap-1 p-2 bg-gradient-to-b from-gray-50 to-slate-100">
              {/* Scientific Mode Row */}
              {isScientificMode && (
                <div className="grid grid-cols-5 gap-1">
                  <CalculatorButton
                    onClick={() => handleButtonPress("sin(")}
                    variant="scientific"
                  >
                    sin
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("cos(")}
                    variant="scientific"
                  >
                    cos
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("tan(")}
                    variant="scientific"
                  >
                    tan
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("log10(")}
                    variant="scientific"
                  >
                    log
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("ln(")}
                    variant="scientific"
                  >
                    ln
                  </CalculatorButton>
                </div>
              )}

              {/* Memory Row / Parentheses and Exponents */}
              <div className="grid grid-cols-5 gap-1">
                <CalculatorButton
                  onClick={() => handleMemoryOperation("MC")}
                  variant="memory"
                >
                  MC
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleMemoryOperation("MR")}
                  variant="memory"
                >
                  MR
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleMemoryOperation("M+")}
                  variant="memory"
                >
                  M+
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleMemoryOperation("M-")}
                  variant="memory"
                >
                  M-
                </CalculatorButton>
                {isScientificMode ? (
                  <CalculatorButton
                    onClick={() => handleButtonPress("^")}
                    variant="operator"
                  >
                    x<sup>y</sup>
                  </CalculatorButton>
                ) : (
                  <CalculatorButton
                    onClick={() => handleButtonPress("%")}
                    variant="operator"
                  >
                    %
                  </CalculatorButton>
                )}
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-4 gap-1">
                <CalculatorButton onClick={handleClear} variant="clear">
                  C
                </CalculatorButton>
                {isScientificMode && (
                  <>
                    <CalculatorButton
                      onClick={() => handleButtonPress("(")}
                      variant="operator"
                    >
                      (
                    </CalculatorButton>
                    <CalculatorButton
                      onClick={() => handleButtonPress(")")}
                      variant="operator"
                    >
                      )
                    </CalculatorButton>
                  </>
                )}
                {!isScientificMode && (
                  <>
                    <CalculatorButton
                      onClick={() => handleButtonPress("backspace")}
                      variant="operator"
                    >
                      ⌫
                    </CalculatorButton>
                    <CalculatorButton
                      onClick={() => handleButtonPress("(")}
                      variant="operator"
                    >
                      (
                    </CalculatorButton>
                  </>
                )}
                <CalculatorButton
                  onClick={() => handleButtonPress("/")}
                  variant="operator"
                >
                  ÷
                </CalculatorButton>
              </div>

              {/* Numeric Pad and Operators */}
              <div className="grid grid-cols-4 gap-1">
                <CalculatorButton 
                  onClick={() => handleButtonPress("7")}
                  className="bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-bold hover:from-purple-500 hover:to-indigo-600"
                >
                  7
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("8")}
                  className="bg-gradient-to-br from-blue-400 to-cyan-500 text-white font-bold hover:from-blue-500 hover:to-cyan-600"
                >
                  8
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("9")}
                  className="bg-gradient-to-br from-teal-400 to-emerald-500 text-white font-bold hover:from-teal-500 hover:to-emerald-600"
                >
                  9
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleButtonPress("*")}
                  variant="operator"
                >
                  ×
                </CalculatorButton>
              </div>

              <div className="grid grid-cols-4 gap-1">
                <CalculatorButton 
                  onClick={() => handleButtonPress("4")}
                  className="bg-gradient-to-br from-green-400 to-teal-500 text-white font-bold hover:from-green-500 hover:to-teal-600"
                >
                  4
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("5")}
                  className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-bold hover:from-cyan-500 hover:to-blue-600"
                >
                  5
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("6")}
                  className="bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-bold hover:from-indigo-500 hover:to-violet-600"
                >
                  6
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleButtonPress("-")}
                  variant="operator"
                >
                  −
                </CalculatorButton>
              </div>

              <div className="grid grid-cols-4 gap-1">
                <CalculatorButton 
                  onClick={() => handleButtonPress("1")}
                  className="bg-gradient-to-br from-pink-400 to-rose-500 text-white font-bold hover:from-pink-500 hover:to-rose-600"
                >
                  1
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("2")}
                  className="bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold hover:from-orange-500 hover:to-amber-600"
                >
                  2
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress("3")}
                  className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-bold hover:from-amber-500 hover:to-yellow-600"
                >
                  3
                </CalculatorButton>
                <CalculatorButton
                  onClick={() => handleButtonPress("+")}
                  variant="operator"
                >
                  +
                </CalculatorButton>
              </div>

              <div className="grid grid-cols-4 gap-1">
                {isScientificMode ? (
                  <CalculatorButton
                    onClick={() => handleButtonPress("sqrt(")}
                    variant="scientific"
                  >
                    √
                  </CalculatorButton>
                ) : (
                  <CalculatorButton
                    onClick={() => handleButtonPress(")")}
                    variant="operator"
                  >
                    )
                  </CalculatorButton>
                )}
                <CalculatorButton 
                  onClick={() => handleButtonPress("0")}
                  className="bg-gradient-to-br from-sky-400 to-blue-500 text-white font-bold hover:from-sky-500 hover:to-blue-600"
                >
                  0
                </CalculatorButton>
                <CalculatorButton 
                  onClick={() => handleButtonPress(".")}
                  className="bg-gradient-to-br from-slate-400 to-gray-600 text-white font-bold hover:from-slate-500 hover:to-gray-700"
                >
                  .
                </CalculatorButton>
                <CalculatorButton
                  onClick={handleEquals}
                  variant="equals"
                  className="bg-gradient-to-br from-primary to-blue-700 text-white font-bold hover:from-primary hover:to-blue-800 shadow-lg"
                >
                  =
                </CalculatorButton>
              </div>

              {/* Scientific Functions - Row 3 */}
              {isScientificMode && (
                <div className="grid grid-cols-5 gap-1">
                  <CalculatorButton
                    onClick={() => handleButtonPress("!")}
                    variant="scientific"
                  >
                    x!
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("pi")}
                    variant="scientific"
                  >
                    π
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("e")}
                    variant="scientific"
                  >
                    e
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("backspace")}
                    variant="operator"
                  >
                    ⌫
                  </CalculatorButton>
                  <CalculatorButton
                    onClick={() => handleButtonPress("%")}
                    variant="operator"
                  >
                    %
                  </CalculatorButton>
                </div>
              )}
            </div>
          </div>

          {/* Side Panels */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: showHistory ? 300 : 0,
              opacity: showHistory ? 1 : 0,
            }}
            className="bg-gradient-to-b from-indigo-50 to-white border-l border-indigo-100 overflow-hidden"
          >
            {showHistory && (
              <HistoryPanel 
                history={history} 
                onSelectItem={handleButtonPress} 
                onAddCustomTag={addCustomTaggedCalculation}
              />
            )}
          </motion.div>
          
          {/* Formula Reference Panel */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{
              width: showFormulas ? 350 : 0,
              opacity: showFormulas ? 1 : 0,
            }}
            className="bg-gradient-to-b from-indigo-50 to-white border-l border-indigo-100 overflow-hidden"
          >
            {showFormulas && (
              <FormulaReference 
                onSelectFormula={handleButtonPress}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;