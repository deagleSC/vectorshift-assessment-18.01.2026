// nodeConfig.js - Centralized configuration for all node types

import {
  Upload,
  Download,
  Bot,
  Type,
  Globe,
  GitBranch,
  Shuffle,
  GitMerge,
  Filter,
} from 'lucide-react';

export const nodeConfig = {
  // Input Node - Start node for pipelines
  customInput: {
    type: 'customInput',
    title: 'Input',
    icon: Upload,
    iconColorClass: 'text-blue-500',
    category: 'input',
    description: 'Receives input data for the pipeline',
    defaultInputs: [],
    defaultOutputs: [{ id: 'value', label: 'value', type: 'Text' }],
    defaultData: {
      inputName: '',
      inputType: 'Text',
    },
    fields: [
      { name: 'inputName', type: 'text', label: 'Name', placeholder: 'input_name' },
      {
        name: 'inputType',
        type: 'select',
        label: 'Type',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ],
      },
    ],
  },

  // Output Node - End node for pipelines
  customOutput: {
    type: 'customOutput',
    title: 'Output',
    icon: Download,
    iconColorClass: 'text-purple-500',
    category: 'output',
    description: 'Outputs data from the pipeline',
    defaultInputs: [{ id: 'value', label: 'value' }],
    defaultOutputs: [],
    defaultData: {
      outputName: '',
      outputType: 'Text',
    },
    fields: [
      { name: 'outputName', type: 'text', label: 'Name', placeholder: 'output_name' },
      {
        name: 'outputType',
        type: 'select',
        label: 'Type',
        options: [
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ],
      },
    ],
  },

  // LLM Node - AI language model
  llm: {
    type: 'llm',
    title: 'LLM',
    icon: Bot,
    iconColorClass: 'text-cyan-500',
    category: 'ai',
    description: 'Large Language Model for text generation',
    defaultInputs: [
      { id: 'system', label: 'system' },
      { id: 'prompt', label: 'prompt' },
    ],
    defaultOutputs: [{ id: 'response', label: 'response', type: 'Text' }],
    defaultData: {},
    fields: [],
  },

  // Text Node - Text manipulation with variable support
  text: {
    type: 'text',
    title: 'Text',
    icon: Type,
    iconColorClass: 'text-slate-500',
    category: 'data',
    description: 'Text input with variable interpolation support',
    defaultInputs: [],
    defaultOutputs: [{ id: 'output', label: 'output', type: 'Text' }],
    defaultData: {
      text: '{{input}}',
    },
    fields: [
      { name: 'text', type: 'textarea', label: 'Text', placeholder: 'Enter text with {{variables}}' },
    ],
    dynamicInputs: true,
  },

  // API Node - HTTP requests
  api: {
    type: 'api',
    title: 'API Request',
    icon: Globe,
    iconColorClass: 'text-pink-500',
    category: 'integration',
    description: 'Make HTTP requests to external APIs',
    defaultInputs: [{ id: 'body', label: 'body' }],
    defaultOutputs: [{ id: 'response', label: 'response', type: 'JSON' }],
    defaultData: {
      url: '',
      method: 'GET',
      headers: '',
    },
    fields: [
      { name: 'url', type: 'text', label: 'URL', placeholder: 'https://api.example.com' },
      {
        name: 'method',
        type: 'select',
        label: 'Method',
        options: [
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
        ],
      },
      { name: 'headers', type: 'textarea', label: 'Headers (JSON)', placeholder: '{"Authorization": "Bearer ..."}' },
    ],
  },

  // Conditional Node - Logic branching
  conditional: {
    type: 'conditional',
    title: 'Conditional',
    icon: GitBranch,
    iconColorClass: 'text-amber-500',
    category: 'logic',
    description: 'Branch logic based on conditions',
    defaultInputs: [
      { id: 'value', label: 'value' },
      { id: 'condition', label: 'condition' },
    ],
    defaultOutputs: [
      { id: 'true', label: 'true', type: 'Text' },
      { id: 'false', label: 'false', type: 'Text' },
    ],
    defaultData: {
      operator: 'equals',
    },
    fields: [
      {
        name: 'operator',
        type: 'select',
        label: 'Operator',
        options: [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' },
          { value: 'isEmpty', label: 'Is Empty' },
        ],
      },
    ],
  },

  // Transform Node - Data transformation
  transform: {
    type: 'transform',
    title: 'Transform',
    icon: Shuffle,
    iconColorClass: 'text-emerald-500',
    category: 'data',
    description: 'Transform and manipulate data',
    defaultInputs: [{ id: 'input', label: 'input' }],
    defaultOutputs: [{ id: 'output', label: 'output', type: 'Text' }],
    defaultData: {
      transformType: 'uppercase',
      expression: '',
    },
    fields: [
      {
        name: 'transformType',
        type: 'select',
        label: 'Transform',
        options: [
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'lowercase', label: 'Lowercase' },
          { value: 'trim', label: 'Trim' },
          { value: 'reverse', label: 'Reverse' },
          { value: 'json_parse', label: 'JSON Parse' },
          { value: 'json_stringify', label: 'JSON Stringify' },
          { value: 'custom', label: 'Custom Expression' },
        ],
      },
      { name: 'expression', type: 'text', label: 'Expression', placeholder: 'value.split(",")' },
    ],
  },

  // Merge Node - Combine multiple inputs
  merge: {
    type: 'merge',
    title: 'Merge',
    icon: GitMerge,
    iconColorClass: 'text-emerald-500',
    category: 'data',
    description: 'Combine multiple inputs into one output',
    defaultInputs: [
      { id: 'input1', label: 'input_1' },
      { id: 'input2', label: 'input_2' },
      { id: 'input3', label: 'input_3' },
    ],
    defaultOutputs: [{ id: 'merged', label: 'merged', type: 'Text' }],
    defaultData: {
      strategy: 'concat',
      separator: '\\n',
    },
    fields: [
      {
        name: 'strategy',
        type: 'select',
        label: 'Strategy',
        options: [
          { value: 'concat', label: 'Concatenate' },
          { value: 'array', label: 'Array' },
          { value: 'object', label: 'Object' },
        ],
      },
      { name: 'separator', type: 'text', label: 'Separator', placeholder: '\\n' },
    ],
  },

  // Filter Node - Filter data
  filter: {
    type: 'filter',
    title: 'Filter',
    icon: Filter,
    iconColorClass: 'text-amber-500',
    category: 'logic',
    description: 'Filter data based on conditions',
    defaultInputs: [{ id: 'input', label: 'input' }],
    defaultOutputs: [
      { id: 'passed', label: 'passed', type: 'Text' },
      { id: 'failed', label: 'failed', type: 'Text' },
    ],
    defaultData: {
      expression: '',
      caseSensitive: true,
    },
    fields: [
      { name: 'expression', type: 'text', label: 'Filter Expression', placeholder: 'value.includes("search")' },
      { name: 'caseSensitive', type: 'toggle', label: 'Case Sensitive' },
    ],
  },
};

// Get all node types for toolbar
export const getNodeTypes = () => Object.keys(nodeConfig);

// Get config for a specific node type
export const getNodeConfig = (type) => nodeConfig[type];

// Get nodes by category
export const getNodesByCategory = (category) => {
  return Object.values(nodeConfig).filter((node) => node.category === category);
};

// Get all categories
export const getCategories = () => {
  const categories = new Set(Object.values(nodeConfig).map((node) => node.category));
  return Array.from(categories);
};

export default nodeConfig;
