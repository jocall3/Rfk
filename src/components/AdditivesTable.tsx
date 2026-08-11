import React from 'react';

interface Additive {
  id: number;
  name: string;
  toxicityLevel: 'Low' | 'Medium' | 'High' | 'Unknown';
  description: string;
}

interface AdditivesTableProps {
  additives: Additive[];
}

const AdditivesTable: React.FC<AdditivesTableProps> = ({ additives }) => {
  const getToxicityColor = (level: Additive['toxicityLevel']) => {
    switch (level) {
      case 'Low': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toxicity Level</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {additives.map((additive) => (
            <tr key={additive.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{additive.name}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getToxicityColor(additive.toxicityLevel)}`}>
                {additive.toxicityLevel}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{additive.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdditivesTable;