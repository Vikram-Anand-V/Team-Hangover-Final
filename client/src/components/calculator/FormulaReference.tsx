import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export interface FormulaCategory {
  name: string;
  icon: React.ReactNode;
  formulas: Formula[];
}

export interface Formula {
  name: string;
  expression: string;
  description: string;
  example?: string;
  variables?: { [key: string]: string };
}

interface FormulaReferenceProps {
  onSelectFormula: (formula: string) => void;
}

const FormulaReference: React.FC<FormulaReferenceProps> = ({ onSelectFormula }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const formulaCategories: FormulaCategory[] = [
    {
      name: "Algebra",
      icon: <span className="text-blue-500">f(x)</span>,
      formulas: [
        {
          name: "Quadratic Formula",
          expression: "(-b + sqrt(b^2 - 4*a*c)) / (2*a)",
          description: "Finds the roots of a quadratic equation ax² + bx + c = 0",
          variables: { "a": "coefficient of x²", "b": "coefficient of x", "c": "constant term" },
          example: "For 2x² + 5x - 3 = 0, use a=2, b=5, c=-3"
        },
        {
          name: "Polynomial Factor",
          expression: "(x - a) * (x - b) * ...",
          description: "Expands to a polynomial with roots at a, b, ...",
          example: "(x - 2) * (x + 3) = x² + x - 6"
        },
        {
          name: "Binomial Expansion",
          expression: "(a + b)^n",
          description: "Expands a binomial raised to power n",
          example: "(x + 1)^3 = x^3 + 3x^2 + 3x + 1"
        }
      ]
    },
    {
      name: "Geometry",
      icon: <span className="text-green-500">△</span>,
      formulas: [
        {
          name: "Circle Area",
          expression: "pi * r^2",
          description: "Area of a circle with radius r",
          variables: { "r": "radius" },
          example: "For r=5, Area = π × 5² = 78.54"
        },
        {
          name: "Triangle Area",
          expression: "0.5 * b * h",
          description: "Area of a triangle with base b and height h",
          variables: { "b": "base", "h": "height" },
          example: "For b=6, h=4, Area = 0.5 × 6 × 4 = 12"
        },
        {
          name: "Pythagoras Theorem",
          expression: "a^2 + b^2 = c^2",
          description: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other sides",
          variables: { "a, b": "perpendicular sides", "c": "hypotenuse" },
          example: "If a=3, b=4, then c=√(3² + 4²) = 5"
        },
        {
          name: "Sphere Volume",
          expression: "(4/3) * pi * r^3",
          description: "Volume of a sphere with radius r",
          variables: { "r": "radius" },
          example: "For r=3, Volume = (4/3) × π × 3³ = 113.1"
        }
      ]
    },
    {
      name: "Trigonometry",
      icon: <span className="text-red-500">sin</span>,
      formulas: [
        {
          name: "Sine Law",
          expression: "a/sin(A) = b/sin(B) = c/sin(C)",
          description: "Relates sides and angles in any triangle",
          variables: { "a,b,c": "sides", "A,B,C": "opposite angles" },
          example: "If a=4, A=30°, B=45°, then b = 4 × sin(45°)/sin(30°) = 5.66"
        },
        {
          name: "Cosine Law",
          expression: "c^2 = a^2 + b^2 - 2*a*b*cos(C)",
          description: "Finds the third side of a triangle given two sides and the included angle",
          variables: { "a,b": "known sides", "C": "angle between sides a and b", "c": "side opposite to angle C" },
          example: "If a=4, b=5, C=60°, then c² = 4² + 5² - 2×4×5×cos(60°) = 36 - 20 = 16, so c=4"
        },
        {
          name: "Tangent Half-Angle",
          expression: "tan(θ/2) = (1 - cos(θ))/sin(θ)",
          description: "Express tangent of half an angle in terms of sine and cosine",
          variables: { "θ": "angle" },
          example: "For θ=60°, tan(30°) = (1-cos(60°))/sin(60°) = 0.577"
        }
      ]
    },
    {
      name: "Calculus",
      icon: <span className="text-purple-500">∫</span>,
      formulas: [
        {
          name: "Power Rule (Derivative)",
          expression: "d/dx(x^n) = n*x^(n-1)",
          description: "Derivative of x raised to power n",
          variables: { "n": "exponent" },
          example: "d/dx(x³) = 3x²"
        },
        {
          name: "Power Rule (Integral)",
          expression: "∫x^n dx = x^(n+1)/(n+1) + C",
          description: "Indefinite integral of x raised to power n (n≠-1)",
          variables: { "n": "exponent", "C": "constant of integration" },
          example: "∫x² dx = x³/3 + C"
        },
        {
          name: "Exponential Derivative",
          expression: "d/dx(e^x) = e^x",
          description: "Derivative of the exponential function",
          example: "d/dx(e^(2x)) = 2e^(2x)"
        }
      ]
    },
    {
      name: "Financial",
      icon: <span className="text-amber-500">$</span>,
      formulas: [
        {
          name: "Compound Interest",
          expression: "P * (1 + r/n)^(n*t)",
          description: "Calculates final amount with compound interest",
          variables: { "P": "principal", "r": "annual interest rate", "n": "compounds per year", "t": "time in years" },
          example: "For P=1000, r=0.05, n=12, t=5, amount = 1000 × (1+0.05/12)^(12×5) = $1,283.36"
        },
        {
          name: "Simple Interest",
          expression: "P * (1 + r * t)",
          description: "Calculates final amount with simple interest",
          variables: { "P": "principal", "r": "annual interest rate", "t": "time in years" },
          example: "For P=1000, r=0.05, t=5, amount = 1000 × (1+0.05×5) = $1,250"
        },
        {
          name: "Present Value",
          expression: "FV / (1 + r)^t",
          description: "Calculates present value of a future amount",
          variables: { "FV": "future value", "r": "discount rate", "t": "time periods" },
          example: "For FV=2000, r=0.05, t=10, PV = 2000/(1+0.05)^10 = $1,227.83"
        }
      ]
    }
  ];

  const filteredCategories = searchTerm.trim() === ''
    ? formulaCategories
    : formulaCategories.map(category => ({
        ...category,
        formulas: category.formulas.filter(formula => 
          formula.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          formula.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.formulas.length > 0);

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-indigo-50 to-white">
      <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
        Formula Reference
      </h3>
      
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search formulas..."
          className="w-full p-2 pl-8 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 absolute left-2 top-2.5 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        {searchTerm && (
          <button
            className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        )}
      </div>
      
      <Tabs defaultValue={filteredCategories[0]?.name || "Algebra"} className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-5 h-auto mb-2">
          {filteredCategories.map((category) => (
            <TabsTrigger 
              key={category.name} 
              value={category.name}
              className="flex flex-col items-center p-1 text-xs"
            >
              <div className="text-base font-medium">{category.icon}</div>
              <span>{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        <div className="flex-grow overflow-hidden">
          {filteredCategories.map((category) => (
            <TabsContent 
              key={category.name} 
              value={category.name}
              className="h-full data-[state=active]:flex flex-col m-0"
            >
              <ScrollArea className="flex-grow">
                <div className="space-y-3 pr-3">
                  {category.formulas.map((formula, index) => (
                    <motion.div 
                      key={index}
                      className="p-3 rounded-md bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{formula.name}</h4>
                        <Badge 
                          className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                          onClick={() => onSelectFormula(formula.expression)}
                        >
                          Use
                        </Badge>
                      </div>
                      <div className="mt-2 bg-gray-50 p-2 rounded text-sm font-mono overflow-x-auto">
                        {formula.expression}
                      </div>
                      <p className="mt-2 text-xs text-gray-600">{formula.description}</p>
                      
                      {formula.variables && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium">Variables:</h5>
                          <div className="grid grid-cols-2 gap-1 mt-1">
                            {Object.entries(formula.variables).map(([variable, desc], i) => (
                              <div key={i} className="text-xs">
                                <span className="font-mono text-primary">{variable}</span>: {desc}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {formula.example && (
                        <div className="mt-2">
                          <h5 className="text-xs font-medium">Example:</h5>
                          <p className="text-xs italic">{formula.example}</p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default FormulaReference;