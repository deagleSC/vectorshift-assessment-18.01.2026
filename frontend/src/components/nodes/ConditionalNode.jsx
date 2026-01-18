// ConditionalNode.jsx - Logic branching node

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.conditional;

export const ConditionalNode = ({ id, data, selected }) => {
  const [operator, setOperator] = useState(data?.operator || 'equals');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'operator', operator);
  }, [id, operator, updateNodeField]);

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
        label="Operator"
        value={operator}
        onChange={setOperator}
        options={[
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' },
          { value: 'isEmpty', label: 'Is Empty' },
        ]}
      />
      <p className="text-[10px] text-muted-foreground mt-1">
        Compares Value against Condition
      </p>
    </BaseNode>
  );
};

export default ConditionalNode;



