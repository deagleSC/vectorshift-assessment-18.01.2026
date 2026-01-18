// BaseNode.jsx - Clean, professional base node component with collapsible outputs

import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '../../lib/utils';
import { nodeConfig } from '../../config/nodeConfig';
import { Settings, MoreHorizontal, ChevronRight, Square } from 'lucide-react';

// Output type badge colors
const outputTypeColors = {
  Text: 'bg-blue-100 text-blue-700 border-blue-200',
  File: 'bg-purple-100 text-purple-700 border-purple-200',
  Image: 'bg-pink-100 text-pink-700 border-pink-200',
  JSON: 'bg-amber-100 text-amber-700 border-amber-200',
  default: 'bg-slate-100 text-slate-600 border-slate-200',
};

// Output Card Component (no header, just content)
const OutputCard = ({ outputs }) => {
  if (!outputs || outputs.length === 0) return null;

  return (
    <div
      className="h-full bg-white border-t border-r border-b border-slate-200 rounded-r-lg flex flex-col"
      style={{ minWidth: 130 }}
    >
      {/* Header */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-100 bg-slate-50/50 rounded-tr-lg">
        <Square className="w-2.5 h-2.5 text-slate-400" />
        <span className="text-[11px] font-medium text-slate-500">Outputs</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-1.5 space-y-1 overflow-auto">
        {outputs.map((output) => (
          <div
            key={output.id}
            className="flex items-center justify-between gap-2 px-1.5 py-1 rounded bg-slate-50/50"
          >
            <span className="text-[11px] text-slate-600 truncate">
              {output.label}
            </span>
            <span className={cn(
              'text-[9px] font-medium px-1 py-0.5 rounded border flex-shrink-0',
              outputTypeColors[output.type] || outputTypeColors.default
            )}>
              {output.type || 'Text'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BaseNode = ({
  id,
  title,
  icon: Icon,
  category,
  inputs = [],
  outputs = [],
  children,
  selected,
  minWidth = 240,
  minHeight = 'auto',
  showOutputCard = true,
}) => {
  const [outputCardOpen, setOutputCardOpen] = useState(true);
  const config = Object.values(nodeConfig).find(c => c.title === title);
  const iconColorClass = config?.iconColorClass || 'text-slate-500';
  const hasOutputs = showOutputCard && outputs.length > 0;
  const showCard = hasOutputs && outputCardOpen;

  return (
    // Outer wrapper - selection border goes here to encompass both node and output card
    <div
      className={cn(
        'flex items-stretch rounded-lg transition-all duration-150',
        selected
          ? 'ring-2 ring-primary ring-offset-1'
          : ''
      )}
    >
      {/* Main Node */}
      <div
        className={cn(
          'relative z-10 bg-white border shadow-sm',
          showCard ? 'rounded-l-lg border-r-0' : 'rounded-lg',
          selected
            ? 'border-primary'
            : 'border-slate-200 hover:border-slate-300'
        )}
        style={{ minWidth, minHeight }}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50",
          showCard ? 'rounded-tl-lg' : 'rounded-t-lg'
        )}>
          <div className="flex items-center gap-2">
            {Icon && <Icon className={cn('w-4 h-4', iconColorClass)} />}
            <span className="text-sm font-medium text-slate-700">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {/* Outputs toggle button - only show if node has outputs */}
            {hasOutputs && (
              <button
                onClick={() => setOutputCardOpen(!outputCardOpen)}
                className={cn(
                  "p-1 rounded transition-colors",
                  outputCardOpen
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                )}
                title={outputCardOpen ? "Hide outputs" : "Show outputs"}
              >
                <ChevronRight className={cn(
                  "w-3.5 h-3.5 transition-transform",
                  outputCardOpen && "rotate-180"
                )} />
              </button>
            )}
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 space-y-3">
          {children}
        </div>

        {/* Input Handles */}
        {inputs.map((input, index) => (
          <Handle
            key={input.id}
            type="target"
            position={Position.Left}
            id={input.id}
            className="!w-2.5 !h-2.5 !bg-slate-400 !border-2 !border-white"
            style={{
              top: `${((index + 1) / (inputs.length + 1)) * 100}%`,
            }}
            title={input.label}
          />
        ))}

        {/* Output Handles - on main node when output card is hidden */}
        {!showCard && outputs.map((output, index) => (
          <Handle
            key={output.id}
            type="source"
            position={Position.Right}
            id={output.id}
            className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-white"
            style={{
              top: `${((index + 1) / (outputs.length + 1)) * 100}%`,
            }}
            title={output.label}
          />
        ))}
      </div>

      {/* Output Card - only shown when expanded */}
      {showCard && (
        <div
          className={cn(
            'relative z-0 self-stretch border-t border-r border-b rounded-r-lg',
            selected ? 'border-primary' : 'border-slate-200'
          )}
          style={{ marginLeft: -1 }}
        >
          <OutputCard outputs={outputs} />
          {/* Output Handles - on output card */}
          {outputs.map((output, index) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              className="!w-2.5 !h-2.5 !bg-primary !border-2 !border-white !right-0"
              style={{
                top: `${((index + 1) / (outputs.length + 1)) * 100}%`,
              }}
              title={output.label}
            />
          ))}
        </div>
      )}
    </div>
  );
};
