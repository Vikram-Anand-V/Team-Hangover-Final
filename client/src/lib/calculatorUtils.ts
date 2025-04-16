import { math } from "../main";

// Evaluate a mathematical expression
export const evaluateExpression = (expr: string): number => {
  try {
    // Replace special functions and constants
    let processedExpr = expr
      .replace(/ln\(/g, "log(")
      .replace(/log10\(/g, "log10(")
      .replace(/sin\(/g, "sin(")
      .replace(/cos\(/g, "cos(")
      .replace(/tan\(/g, "tan(")
      .replace(/sqrt\(/g, "sqrt(")
      .replace(/pi/g, "pi")
      .replace(/e/g, "e");

    return math.evaluate(processedExpr);
  } catch (error) {
    console.error("Evaluation error:", error);
    throw new Error("Invalid expression");
  }
};

// Format a number for display
export const formatResult = (num: number, maxPrecision = 10): string => {
  if (Number.isNaN(num)) return "Error";
  if (!Number.isFinite(num)) return num > 0 ? "Infinity" : "-Infinity";

  // Convert to string first to handle scientific notation
  const strValue = num.toString();
  
  // Check if number is already in scientific notation
  if (strValue.includes("e")) return strValue;
  
  // Check if it's an integer (no decimal part)
  if (Number.isInteger(num)) return strValue;
  
  // For decimal numbers, format with appropriate precision
  const formatted = num.toFixed(maxPrecision);
  // Remove trailing zeros
  return formatted.replace(/\.?0+$/, "");
};

// Parse a keystroke into a calculator action
export const parseKeystroke = (key: string): string | null => {
  // Numbers and basic operators
  if (/^[0-9+\-*/.()]$/.test(key)) {
    return key;
  }

  // Map keyboard keys to calculator actions
  const keyMap: Record<string, string> = {
    Enter: "=",
    "=": "=",
    Escape: "C",
    Backspace: "backspace",
    Delete: "C",
    "%": "%",
    "^": "^",
    p: "pi",
    e: "e", 
    s: "sin(",
    c: "cos(",
    t: "tan(",
    l: "log10(",
    n: "ln("
  };

  return keyMap[key] || null;
};

// Load history from localStorage
export const loadHistory = () => {
  try {
    const savedHistory = localStorage.getItem("calculatorHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  } catch (error) {
    console.error("Error loading history:", error);
    return [];
  }
};

// Save history to localStorage
export const saveHistory = (history: any[]) => {
  try {
    localStorage.setItem("calculatorHistory", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving history:", error);
  }
};

// Speech recognition utilities
export const parseSpeechToExpression = (speech: string): string => {
  if (!speech) return '';
  
  // Clean up the speech text
  let expression = speech.toLowerCase().trim()
    .replace(/\s+/g, ' ')
    .replace(/\bplus\b/g, '+')
    .replace(/\bminus\b/g, '-')
    .replace(/\btimes\b/g, '*')
    .replace(/\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/')
    .replace(/\bdivide\b/g, '/')
    .replace(/\bpoint\b/g, '.')
    .replace(/\bdot\b/g, '.')
    .replace(/\bequals\b/g, '=')
    .replace(/\bequal\b/g, '=')
    .replace(/\bis\b/g, '=')
    .replace(/\bto the power of\b/g, '^')
    .replace(/\bpower\b/g, '^')
    .replace(/\bexponent\b/g, '^')
    .replace(/\bsin\b/g, 'sin(')
    .replace(/\bcosine\b/g, 'cos(')
    .replace(/\bcos\b/g, 'cos(')
    .replace(/\btangent\b/g, 'tan(')
    .replace(/\btan\b/g, 'tan(')
    .replace(/\blog\b/g, 'log10(')
    .replace(/\bln\b/g, 'ln(')
    .replace(/\bsquare root\b/g, 'sqrt(')
    .replace(/\bsquare root of\b/g, 'sqrt(')
    .replace(/\bsqrt\b/g, 'sqrt(')
    .replace(/\broot\b/g, 'sqrt(')
    .replace(/\bpi\b/g, 'pi')
    .replace(/\beuleur\b/g, 'e')
    .replace(/\be\b/g, 'e')
    .replace(/\bpercent\b/g, '%')
    .replace(/\bopen\b/g, '(')
    .replace(/\bclose\b/g, ')')
    .replace(/\bopening\b/g, '(')
    .replace(/\bclosing\b/g, ')')
    .replace(/\bparenthesis\b/g, '')
    .replace(/\bparentheses\b/g, '');
  
  // Handle numbers written as words
  expression = expression
    .replace(/\bzero\b/g, '0')
    .replace(/\bone\b/g, '1')
    .replace(/\btwo\b/g, '2')
    .replace(/\bthree\b/g, '3')
    .replace(/\bfour\b/g, '4')
    .replace(/\bfive\b/g, '5')
    .replace(/\bsix\b/g, '6')
    .replace(/\bseven\b/g, '7')
    .replace(/\beight\b/g, '8')
    .replace(/\bnine\b/g, '9')
    .replace(/\bten\b/g, '10');
  
  // Remove any remaining spaces
  expression = expression.replace(/\s+/g, '');
  
  // Add closing parentheses for functions if needed
  if (expression.includes('(') && !expression.includes(')')) {
    expression += ')';
  }
  
  // Remove equals sign at the end if present (we will calculate anyway)
  if (expression.endsWith('=')) {
    expression = expression.slice(0, -1);
  }
  
  return expression;
};