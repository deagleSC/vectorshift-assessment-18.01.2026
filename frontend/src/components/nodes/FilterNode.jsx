// FilterNode.jsx - Filter data based on conditions

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, ToggleField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.filter;

export const FilterNode = ({ id, data, selected }) => {
  const [expression, setExpression] = useState(data?.expression || '');
  const [caseSensitive, setCaseSensitive] = useState(data?.caseSensitive ?? true);
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'expression', expression);
  }, [id, expression, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'caseSensitive', caseSensitive);
  }, [id, caseSensitive, updateNodeField]);

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
        label="Filter Expression"
        value={expression}
        onChange={setExpression}
        placeholder='value.includes("search")'
      />
      <ToggleField
        label="Case Sensitive"
        checked={caseSensitive}
        onChange={setCaseSensitive}
      />
    </BaseNode>
  );
};

export default FilterNode;


