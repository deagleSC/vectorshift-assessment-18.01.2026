// OutputNode.jsx - Refactored to use BaseNode

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.customOutput;

export const OutputNode = ({ id, data, selected }) => {
  const [name, setName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [type, setType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'outputName', name);
  }, [id, name, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'outputType', type);
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
        placeholder="output_name"
      />
      <SelectField
        label="Type"
        value={type}
        onChange={setType}
        options={[
          { value: 'Text', label: 'Text' },
          { value: 'Image', label: 'Image' },
        ]}
      />
    </BaseNode>
  );
};

export default OutputNode;



