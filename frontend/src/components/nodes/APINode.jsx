// APINode.jsx - HTTP request node

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { TextField, TextAreaField, SelectField } from '../fields';
import { nodeConfig } from '../../config/nodeConfig';
import { useStore } from '../../store';

const config = nodeConfig.api;

export const APINode = ({ id, data, selected }) => {
  const [url, setUrl] = useState(data?.url || '');
  const [method, setMethod] = useState(data?.method || 'GET');
  const [headers, setHeaders] = useState(data?.headers || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  useEffect(() => {
    updateNodeField(id, 'url', url);
  }, [id, url, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'method', method);
  }, [id, method, updateNodeField]);

  useEffect(() => {
    updateNodeField(id, 'headers', headers);
  }, [id, headers, updateNodeField]);

  return (
    <BaseNode
      id={id}
      title={config.title}
      icon={config.icon}
      category={config.category}
      inputs={config.defaultInputs}
      outputs={config.defaultOutputs}
      selected={selected}
      minWidth={260}
    >
      <TextField
        label="URL"
        value={url}
        onChange={setUrl}
        placeholder="https://api.example.com"
      />
      <SelectField
        label="Method"
        value={method}
        onChange={setMethod}
        options={[
          { value: 'GET', label: 'GET' },
          { value: 'POST', label: 'POST' },
          { value: 'PUT', label: 'PUT' },
          { value: 'DELETE', label: 'DELETE' },
        ]}
      />
      <TextAreaField
        label="Headers (JSON)"
        value={headers}
        onChange={setHeaders}
        placeholder='{"Authorization": "Bearer ..."}'
        rows={2}
      />
    </BaseNode>
  );
};

export default APINode;



