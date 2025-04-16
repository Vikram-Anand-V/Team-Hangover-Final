import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";

type ResultTag = 'basic' | 'scientific' | 'financial' | 'geometry' | 'custom';

type HistoryItem = {
  expression: string;
  result: string;
  timestamp: number;
  tag?: ResultTag;
};

type HistoryPanelProps = {
  history: HistoryItem[];
  onSelectItem: (value: string) => void;
  onAddCustomTag?: (value: string) => void;
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, onAddCustomTag }) => {
  const getTagColor = (tag?: ResultTag) => {
    switch (tag) {
      case 'basic':
        return 'bg-blue-100 text-blue-700';
      case 'scientific':
        return 'bg-purple-100 text-purple-700';
      case 'financial':
        return 'bg-green-100 text-green-700';
      case 'geometry':
        return 'bg-amber-100 text-amber-700';
      case 'custom':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTagLabel = (tag?: ResultTag) => {
    return tag ? tag.charAt(0).toUpperCase() + tag.slice(1) : 'Misc';
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="text-lg font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
        Calculation History
      </h3>
      
      {history.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-400 text-sm">
          No calculations yet
        </div>
      ) : (
        <ScrollArea className="flex-grow">
          <div className="space-y-3 pr-3">
            {history.map((item, index) => (
              <motion.div 
                key={index}
                className="p-3 rounded-md bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getTagColor(item.tag)}>{getTagLabel(item.tag)}</Badge>
                  <div className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <div 
                  className="break-all cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onSelectItem(item.expression)}
                >
                  <div className="text-sm font-mono">{item.expression}</div>
                </div>
                
                <div className="mt-1 text-right">
                  <span className="text-lg font-semibold text-gray-800">{item.result}</span>
                </div>
                
                {onAddCustomTag && (
                  <div className="mt-2 flex justify-end">
                    <button
                      onClick={() => onAddCustomTag(item.expression)}
                      className="text-xs text-indigo-500 hover:text-indigo-700 transition-colors"
                    >
                      + Add custom tag
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default HistoryPanel;