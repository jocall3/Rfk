import React, { useState, useMemo } from 'react';

interface PathwayNode {
  id: string;
  label: string;
  type: 'substrate' | 'enzyme' | 'product';
  x: number;
  y: number;
}

interface PathwayEdge {
  from: string;
  to: string;
}

const INITIAL_NODES: PathwayNode[] = [
  { id: 'glucose', label: 'Glucose', type: 'substrate', x: 50, y: 100 },
  { id: 'hexokinase', label: 'Hexokinase', type: 'enzyme', x: 200, y: 50 },
  { id: 'g6p', label: 'Glucose-6-Phosphate', type: 'product', x: 350, y: 100 },
  { id: 'pgi', label: 'Phosphoglucose Isomerase', type: 'enzyme', x: 500, y: 50 },
  { id: 'f6p', label: 'Fructose-6-Phosphate', type: 'product', x: 650, y: 100 },
];

const INITIAL_EDGES: PathwayEdge[] = [
  { from: 'glucose', to: 'hexokinase' },
  { from: 'hexokinase', to: 'g6p' },
  { from: 'g6p', to: 'pgi' },
  { from: 'pgi', to: 'f6p' },
];

export const MetabolicPathwayVisualizer: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodes = useMemo(() => INITIAL_NODES, []);
  const edges = useMemo(() => INITIAL_EDGES, []);

  return (
    <div className="w-full h-96 border border-gray-200 rounded-lg bg-white p-4 overflow-hidden">
      <h2 className="text-lg font-bold mb-4">Metabolic Pathway Visualization</h2>
      <svg className="w-full h-full" viewBox="0 0 800 200">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
          </marker>
        </defs>
        
        {edges.map((edge, index) => {
          const fromNode = nodes.find(n => n.id === edge.from)!;
          const toNode = nodes.find(n => n.id === edge.to)!;
          return (
            <line
              key={index}
              x1={fromNode.x + 40}
              y1={fromNode.y + 20}
              x2={toNode.x - 10}
              y2={toNode.y + 20}
              stroke="#94a3b8"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        })}

        {nodes.map((node) => (
          <g 
            key={node.id} 
            onClick={() => setSelectedNode(node.id)}
            className="cursor-pointer transition-transform hover:scale-105"
          >
            <rect
              x={node.x}
              y={node.y}
              width={100}
              height={40}
              rx={node.type === 'enzyme' ? 20 : 4}
              fill={selectedNode === node.id ? '#3b82f6' : node.type === 'enzyme' ? '#fef3c7' : '#dcfce7'}
              stroke={selectedNode === node.id ? '#1e40af' : '#94a3b8'}
              strokeWidth="2"
            />
            <text
              x={node.x + 50}
              y={node.y + 25}
              textAnchor="middle"
              className="text-xs font-medium select-none"
              fill={selectedNode === node.id ? '#ffffff' : '#1f2937'}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-4 p-2 bg-gray-50 rounded text-sm">
        {selectedNode ? `Selected: ${nodes.find(n => n.id === selectedNode)?.label}` : 'Click a node to inspect details'}
      </div>
    </div>
  );
};