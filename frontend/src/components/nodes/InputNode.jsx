// InputNode.jsx - Refactored to use BaseNode

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.customInput;

export const InputNode = ({ id, data, selected }) => {
  const [name, setName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [type, setType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'inputName', name);
  }, [id, name, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'inputType', type);
  }, [id, type, updateNodeField]);

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
      <TextField
        label="Name"
        value={name}
        onChange={setName}
        placeholder="input_name"
      />
      <SelectField
        label="Type"
        value={type}
        onChange={setType}
        options={[
          { value: 'Text', label: 'Text' },
          { value: 'File', label: 'File' },
        ]}
      />
    </BaseNode>
  );
};

export default InputNode;


