// ui.js
// Displays the drag-and-drop UI

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { MousePointer2 } from 'lucide-react';

// Import refactored node components
import {
  InputNode,
  OutputNode,
  LLMNode,
  TextNode,
  APINode,
  ConditionalNode,
  TransformNode,
  MergeNode,
  FilterNode,
} from './components/nodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Register all node types
const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  api: APINode,
  conditional: ConditionalNode,
  transform: TransformNode,
  merge: MergeNode,
  filter: FilterNode,
};

// Minimap node colors by category
const nodeColorMap = {
  customInput: '#3b82f6',
  customOutput: '#8b5cf6',
  llm: '#06b6d4',
  text: '#64748b',
  transform: '#10b981',
  merge: '#10b981',
  conditional: '#f59e0b',
  filter: '#f59e0b',
  api: '#ec4899',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  const getInitNodeData = (nodeID, type) => {
    return { id: nodeID, nodeType: type };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData('application/reactflow')) {
        const appData = JSON.parse(
          event.dataTransfer.getData('application/reactflow')
        );
        const type = appData?.nodeType;

        if (typeof type === 'undefined' || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        const newNode = {
          id: nodeID,
          type,
          position,
          data: getInitNodeData(nodeID, type),
        };

        addNode(newNode);
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        snapToGrid
        connectionLineType="smoothstep"
        connectionLineStyle={{ stroke: '#8b5cf6', strokeWidth: 1.5 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background 
          color="#e2e8f0" 
          gap={gridSize} 
          size={1}
          variant="dots"
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => nodeColorMap[node.type] || '#6b7280'}
          nodeStrokeWidth={3}
          nodeBorderRadius={4}
          maskColor="rgba(0, 0, 0, 0.08)"
          style={{ width: 140, height: 90 }}
        />
        
        {/* Empty state - vertically and horizontally centered */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center p-6 bg-white rounded-lg border border-slate-200 shadow-sm pointer-events-auto">
              <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-slate-100 flex items-center justify-center">
                <MousePointer2 className="w-5 h-5 text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-700 mb-1">Start Building</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">
                Drag nodes from the toolbar to create your pipeline
              </p>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
};
