// TextNode.jsx - Text node with dynamic handles, variable validation, and autocomplete

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useEdges, useNodes } from 'reactflow';
import { BaseNode } from './BaseNode';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';
import { cn } from '../../lib/utils';
import { AlertCircle, Info } from 'lucide-react';

const config = nodeConfig.text;

// Extract variables from text using {{variableName}} or {{nodeId.handle}} pattern
const extractVariables = (text) => {
  const regex = /\{\{([a-zA-Z_$][a-zA-Z0-9_$.-]*)\}\}/g;
  const variables = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }
  return Array.from(variables);
};

// Highlighted text display component
const HighlightedText = ({ text, validVars, invalidVars }) => {
  if (!text) return null;

  const parts = text.split(/(\{\{[a-zA-Z_$][a-zA-Z0-9_$.-]*\}\})/g);

  return (
    <div className="whitespace-pre-wrap break-words text-[11px] font-mono leading-relaxed">
      {parts.map((part, index) => {
        const match = part.match(/^\{\{([a-zA-Z_$][a-zA-Z0-9_$.-]*)\}\}$/);
        if (match) {
          const varName = match[1];
          const isValid = validVars.includes(varName);
          const isInvalid = invalidVars.includes(varName);
          return (
            <span
              key={index}
              className={cn(
                'px-1 py-0.5 rounded text-[10px]',
                isValid
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : isInvalid
                    ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-amber-100 text-amber-700 border border-amber-200'
              )}
            >
              {part}
            </span>
          );
        }
        return <span key={index} className="text-slate-600">{part}</span>;
      })}
    </div>
  );
};

// Autocomplete dropdown component
const AutocompleteDropdown = ({ variables, onSelect, position }) => {
  return (
    <div
      className="absolute z-50 bg-white border border-slate-200 rounded-md shadow-lg py-1 min-w-[220px] max-h-[200px] overflow-auto"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-2 py-1 text-[10px] font-medium text-slate-400 uppercase border-b border-slate-100">
        Available Variables
      </div>
      {variables.length > 0 ? (
        variables.map((v, index) => (
          <button
            key={index}
            onClick={() => onSelect(v.fullName)}
            className="w-full px-2 py-1.5 text-left hover:bg-primary/5 flex items-center justify-between gap-2 transition-colors"
          >
            <span className="text-xs font-mono text-primary font-medium">{`{{${v.fullName}}}`}</span>
            <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{v.nodeType}</span>
          </button>
        ))
      ) : (
        <div className="px-2 py-3 text-xs text-slate-400 text-center">
          No other nodes on canvas yet.
          <br />
          <span className="text-[10px]">Add nodes to see their outputs here.</span>
        </div>
      )}
    </div>
  );
};

export const TextNode = ({ id, data, selected }) => {
  const [text, setText] = useState(data?.text || '');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompletePos, setAutocompletePos] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Use hooks that properly track changes
  const allNodes = useNodes();
  const allEdges = useEdges();

  // Extract variables for dynamic handles
  const variables = useMemo(() => extractVariables(text), [text]);

  // Get ALL available variables from ALL other nodes
  // Format: nodeName.outputHandle (e.g., input_1.value, llm.response)
  const availableVariables = useMemo(() => {
    const availableVars = [];

    allNodes.forEach(node => {
      // Skip self
      if (node.id === id) return;

      const nodeConfigItem = nodeConfig[node.type];
      if (nodeConfigItem && nodeConfigItem.defaultOutputs) {
        // Get the display name from node data based on node type
        let nodeName = node.id; // fallback to node ID

        if (node.type === 'customInput' && node.data?.inputName) {
          nodeName = node.data.inputName;
        } else if (node.type === 'customOutput' && node.data?.outputName) {
          nodeName = node.data.outputName;
        } else if (node.type === 'llm') {
          nodeName = 'llm';
        } else if (node.type === 'text') {
          nodeName = 'text';
        }

        // Add output variables from this node in format: nodeName.outputId
        nodeConfigItem.defaultOutputs.forEach(output => {
          const fullName = `${nodeName}.${output.id}`;

          availableVars.push({
            fullName,
            nodeId: node.id,
            handleId: output.id,
            handleLabel: output.label,
            nodeType: nodeConfigItem.title,
            displayName: nodeName,
            type: output.type || 'Text',
          });
        });
      }
    });

    return availableVars;
  }, [id, allNodes]);

  // Map of valid variable names
  const validVariableNames = useMemo(() => {
    return new Set(availableVariables.map(v => v.fullName));
  }, [availableVariables]);

  // Find which handles are connected to this node
  const connectedHandles = useMemo(() => {
    return allEdges.filter(e => e.target === id).map(e => e.targetHandle);
  }, [id, allEdges]);

  // Categorize variables
  const { validVars, invalidVars, unconnectedVars } = useMemo(() => {
    const valid = [];
    const invalid = [];
    const unconnected = [];

    variables.forEach(v => {
      if (validVariableNames.has(v)) {
        if (connectedHandles.includes(v)) {
          valid.push(v);
        } else {
          unconnected.push(v);
        }
      } else {
        invalid.push(v);
      }
    });

    return { validVars: valid, invalidVars: invalid, unconnectedVars: unconnected };
  }, [variables, validVariableNames, connectedHandles]);

  // Create inputs - always have a default "input" handle plus dynamic ones for variables
  const allInputs = useMemo(() => {
    const inputs = [];

    // Add handles for each valid variable used
    variables.forEach(varName => {
      if (validVariableNames.has(varName) && !inputs.find(i => i.id === varName)) {
        inputs.push({
          id: varName,
          label: varName.split('.').pop() // Show just the handle name
        });
      }
    });

    // Always have at least a default input handle if no variables
    if (inputs.length === 0) {
      inputs.push({ id: 'input', label: 'input' });
    }

    return inputs;
  }, [variables, validVariableNames]);

  // Calculate dynamic dimensions based on text content
  const dimensions = useMemo(() => {
    const lines = text.split('\n');
    const lineCount = lines.length;
    const maxLineLength = Math.max(...lines.map(line => line.length), 0);

    const hasWarnings = invalidVars.length > 0 || unconnectedVars.length > 0;
    const baseWidth = 280;
    const baseHeight = hasWarnings ? 240 : 200;
    const charWidth = 6.5;
    const paddingWidth = 80;
    const lineHeight = 18;
    const paddingHeight = hasWarnings ? 200 : 160;

    const calculatedWidth = Math.min(
      Math.max(baseWidth, maxLineLength * charWidth + paddingWidth),
      480
    );

    const calculatedHeight = Math.min(
      Math.max(baseHeight, lineCount * lineHeight + paddingHeight),
      450
    );

    return { width: calculatedWidth, height: calculatedHeight };
  }, [text, invalidVars.length, unconnectedVars.length]);

  // Update store when text changes
  useEffect(() => {
    updateNodeField(id, 'text', text);
  }, [id, text, updateNodeField]);

  // Update store with current variables
  useEffect(() => {
    updateNodeField(id, 'variables', variables);
  }, [id, variables, updateNodeField]);

  // Handle text input change
  const handleTextChange = useCallback((e) => {
    const newText = e.target.value;
    const cursorPos = e.target.selectionStart;
    setText(newText);
    setCursorPosition(cursorPos);

    // Check if we should show autocomplete
    const textBeforeCursor = newText.slice(0, cursorPos);
    const lastTwoChars = textBeforeCursor.slice(-2);

    if (lastTwoChars === '{{') {
      const textarea = textareaRef.current;
      if (textarea) {
        const lineHeight = 18;
        const lines = textBeforeCursor.split('\n');
        const currentLine = lines.length;
        const top = currentLine * lineHeight + 80;
        setAutocompletePos({ top, left: 10 });
        setShowAutocomplete(true);
      }
    } else {
      setShowAutocomplete(false);
    }
  }, []);

  // Handle autocomplete selection
  const handleAutocompleteSelect = useCallback((varName) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const beforeCursor = text.slice(0, cursorPosition);
      const afterCursor = text.slice(cursorPosition);
      const newText = beforeCursor + varName + '}}' + afterCursor;
      setText(newText);
      setShowAutocomplete(false);

      setTimeout(() => {
        textarea.focus();
        const newCursorPos = cursorPosition + varName.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  }, [text, cursorPosition]);

  // Close autocomplete on blur
  const handleBlur = useCallback(() => {
    setTimeout(() => setShowAutocomplete(false), 200);
  }, []);

  return (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      category={config.category}
      inputs={allInputs}
      outputs={config.defaultOutputs}
      selected={selected}
      minWidth={dimensions.width}
      minHeight={dimensions.height}
    >
      <div className="space-y-2 relative">
        {/* Help text */}
        <div className="flex items-start gap-1.5 p-1.5 bg-blue-50/50 border border-blue-100 rounded text-[10px] text-blue-600">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>Type <code className="px-1 bg-blue-100 rounded">{'{{'}</code> to insert variables</span>
        </div>

        {/* Textarea with autocomplete */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onBlur={handleBlur}
            placeholder='Hello {{customInput-1.value}}!'
            className="w-full p-2 text-[11px] font-mono bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors resize-none leading-relaxed nodrag"
            style={{ minHeight: Math.max(60, text.split('\n').length * 18 + 10) }}
          />

          {/* Autocomplete dropdown */}
          {showAutocomplete && (
            <AutocompleteDropdown
              variables={availableVariables}
              onSelect={handleAutocompleteSelect}
              position={autocompletePos}
            />
          )}
        </div>

        {/* Preview with highlighting */}
        {text && (
          <div className="p-2 bg-slate-50/50 border border-slate-100 rounded-md">
            <div className="text-[10px] font-medium text-slate-400 uppercase mb-1">Preview</div>
            <HighlightedText text={text} validVars={validVars} invalidVars={[...invalidVars, ...unconnectedVars]} />
          </div>
        )}

        {/* Unconnected variables warning */}
        {unconnectedVars.length > 0 && (
          <div className="flex items-start gap-1.5 p-2 bg-amber-50 border border-amber-100 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-medium text-amber-700">
                Unconnected variables
              </p>
              <p className="text-[10px] text-amber-600">
                {unconnectedVars.map(v => `{{${v}}}`).join(', ')} — connect the source nodes
              </p>
            </div>
          </div>
        )}

        {/* Invalid variables warning */}
        {invalidVars.length > 0 && (
          <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-100 rounded-md">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-medium text-red-700">
                Invalid variables
              </p>
              <p className="text-[10px] text-red-600">
                {invalidVars.map(v => `{{${v}}}`).join(', ')} — no matching node output
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default TextNode;
