// LLMNode.jsx - Refactored to use BaseNode

import { BaseNode } from './BaseNode';
import { nodeConfig } from '../../config/nodeConfig';
import { Sparkles } from 'lucide-react';

const config = nodeConfig.llm;

export const LLMNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      category={config.category}
      inputs={config.defaultInputs}
      outputs={config.defaultOutputs}
      selected={selected}
      minWidth={220}
    >
      <div className="flex items-start gap-2 p-2 bg-cyan-50/50 rounded-lg border border-cyan-100">
        <Sparkles className="w-4 h-4 text-cyan-500 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-cyan-700 leading-relaxed">
          Large Language Model for text generation.
        </p>
      </div>
    </BaseNode>
  );
};

export default LLMNode;
