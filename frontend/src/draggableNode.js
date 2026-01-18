// draggableNode.js

import { nodeConfig } from './config/nodeConfig';

export const DraggableNode = ({ type, label, icon: Icon }) => {
  const config = nodeConfig[type];
  const iconColorClass = config?.iconColorClass || 'text-slate-500';

  const onDragStart = (event, nodeType) => {
    const appData = { nodeType };
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-grab hover:border-slate-300 hover:shadow-sm transition-all duration-150 select-none"
      onDragStart={(event) => onDragStart(event, type)}
      onDragEnd={(event) => (event.target.style.cursor = 'grab')}
      draggable
    >
      {Icon && <Icon className={`w-4 h-4 ${iconColorClass}`} />}
      <span className="text-sm font-medium text-slate-700">{label}</span>
    </div>
  );
};
