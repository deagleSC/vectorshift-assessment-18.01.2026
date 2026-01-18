// MergeNode.jsx - Combine multiple inputs

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.merge;

export const MergeNode = ({ id, data, selected }) => {
  const [strategy, setStrategy] = useState(data?.strategy || 'concat');
  const [separator, setSeparator] = useState(data?.separator || '\\n');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'strategy', strategy);
  }, [id, strategy, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'separator', separator);
  }, [id, separator, updateNodeField]);

  return (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      category={config.category}
      inputs={config.defaultInputs}
      outputs={config.defaultOutputs}
      selected={selected}
    >
      <SelectField
        label="Strategy"
        value={strategy}
        onChange={setStrategy}
        options={[
          { value: 'concat', label: 'Concatenate' },
          { value: 'array', label: 'Array' },
          { value: 'object', label: 'Object' },
        ]}
      />
      {strategy === 'concat' && (
        <TextField
          label="Separator"
          value={separator}
          onChange={setSeparator}
          placeholder="\\n"
        />
      )}
    </BaseNode>
  );
};

export default MergeNode;



