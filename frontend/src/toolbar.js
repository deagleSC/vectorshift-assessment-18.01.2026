// toolbar.js

import { DraggableNode } from './draggableNode';
import { nodeConfig } from './config/nodeConfig';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from './lib/utils';

// Group nodes by category
const categories = {
  general: {
    label: 'General',
    nodes: ['customInput', 'customOutput', 'text'],
  },
  ai: {
    label: 'LLMs',
    nodes: ['llm'],
  },
  data: {
    label: 'Data Transformation',
    nodes: ['transform', 'merge'],
  },
  logic: {
    label: 'Logic',
    nodes: ['conditional', 'filter'],
  },
  integrations: {
    label: 'Integrations',
    nodes: ['api'],
  },
};

export const PipelineToolbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef(null);
  
  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search when empty and blur
  const handleBlur = () => {
    if (!searchQuery) {
      setSearchOpen(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchOpen(false);
  };

  // Filter nodes based on search
  const filterNodes = (nodeTypes) => {
    if (!searchQuery) return nodeTypes;
    return nodeTypes.filter(type => {
      const config = nodeConfig[type];
      return config?.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  };

  return (
    <div className="flex-shrink-0 bg-white border-b border-slate-200">
      <Tabs defaultValue="general" className="w-full">
        <div className="flex items-center gap-4 px-4 border-b border-slate-100">
          {/* Collapsible Search with Animation */}
          <div className="relative flex items-center">
            <div
              className={cn(
                "relative flex items-center overflow-hidden transition-all duration-300 ease-out",
                searchOpen ? "w-48" : "w-8"
              )}
            >
              <button
                onClick={() => !searchOpen && setSearchOpen(true)}
                className={cn(
                  "absolute left-0 h-8 flex items-center justify-center transition-all duration-300",
                  searchOpen 
                    ? "w-8 pointer-events-none" 
                    : "w-8 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
                title="Search nodes"
              >
                <Search className="w-4 h-4 text-slate-400" />
              </button>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onBlur={handleBlur}
                className={cn(
                  "h-8 pl-8 pr-8 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all duration-300",
                  searchOpen ? "opacity-100" : "opacity-0"
                )}
              />
              {searchQuery && searchOpen && (
                <button
                  onClick={clearSearch}
                  className="absolute right-2 p-0.5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
          
          {/* Tabs */}
          <TabsList className="h-10 bg-transparent p-0 gap-0">
            {Object.entries(categories).map(([key, { label }]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="relative h-10 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-slate-500 data-[state=active]:text-slate-900 font-medium text-sm transition-colors hover:text-slate-700"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {Object.entries(categories).map(([key, { nodes }]) => (
          <TabsContent key={key} value={key} className="mt-0 px-4 py-3">
            <div className="flex flex-wrap gap-2">
              {filterNodes(nodes).map((type) => {
                const config = nodeConfig[type];
                if (!config) return null;
                return (
                  <DraggableNode
                    key={type}
                    type={type}
                    label={config.title}
                    icon={config.icon}
                    category={config.category}
                  />
                );
              })}
              {filterNodes(nodes).length === 0 && (
                <span className="text-sm text-slate-400">No nodes found</span>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
