import React, { useState } from 'react';

interface TimelineEvent {
  year: number;
  title: string;
  type: 'regulation' | 'appointment';
  description: string;
}

const timelineData: TimelineEvent[] = [
  { year: 2010, title: 'Dodd-Frank Act', type: 'regulation', description: 'Major financial regulatory reform.' },
  { year: 2012, title: 'Agency Head Transition', type: 'appointment', description: 'Former industry lobbyist appointed to regulatory board.' },
  { year: 2015, title: 'Deregulation Initiative', type: 'regulation', description: 'Rollback of specific oversight provisions.' },
  { year: 2018, title: 'Economic Growth Act', type: 'regulation', description: 'Adjustments to capital requirements.' },
  { year: 2021, title: 'New Oversight Chair', type: 'appointment', description: 'Former executive takes lead on policy enforcement.' },
];

export const RegulatoryTimeline: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'regulation' | 'appointment'>('all');

  const filteredEvents = filter === 'all' 
    ? timelineData 
    : timelineData.filter(event => event.type === filter);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Regulatory & Revolving Door Timeline</h2>
      
      <div className="mb-6 flex gap-2">
        {(['all', 'regulation', 'appointment'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded capitalize ${filter === type ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="relative border-l-2 border-gray-200 ml-3">
        {filteredEvents.map((event, index) => (
          <div key={index} className="mb-8 ml-6">
            <span className="absolute -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 ring-8 ring-white"></span>
            <h3 className="text-lg font-semibold text-gray-900">{event.year}: {event.title}</h3>
            <span className="text-sm font-medium text-blue-600 uppercase">{event.type}</span>
            <p className="mt-2 text-gray-600">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};