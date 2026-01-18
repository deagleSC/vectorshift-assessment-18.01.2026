// TransformNode.jsx - Data transformation node

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.transform;

export const TransformNode = ({ id, data, selected }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');
  const [expression, setExpression] = useState(data?.expression || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'transformType', transformType);
  }, [id, transformType, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'expression', expression);
  }, [id, expression, updateNodeField]);

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
        label="Transform"
        value={transformType}
        onChange={setTransformType}
        options={[
          { value: 'uppercase', label: 'Uppercase' },
          { value: 'lowercase', label: 'Lowercase' },
          { value: 'trim', label: 'Trim' },
          { value: 'reverse', label: 'Reverse' },
          { value: 'json_parse', label: 'JSON Parse' },
          { value: 'json_stringify', label: 'JSON Stringify' },
          { value: 'custom', label: 'Custom Expression' },
        ]}
      />
      {transformType === 'custom' && (
        <TextField
          label="Expression"
          value={expression}
          onChange={setExpression}
          placeholder='value.split(",")'
        />
      )}
    </BaseNode>
  );
};

export default TransformNode;


