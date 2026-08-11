import React, { useState, useMemo } from 'react';
import Head from 'next/head';

interface Question {
  id: number;
  text: string;
  category: string;
  status: 'answered' | 'pending';
}

const ALL_QUESTIONS: Question[] = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  text: `Research Question #${i + 1}: ${i < 20 ? 'Initial Core Inquiry' : i < 40 ? 'Secondary Exploration' : 'Advanced Research Topic'}`,
  category: i < 20 ? 'Core' : i < 40 ? 'Secondary' : 'Advanced',
  status: i < 40 ? 'answered' : 'pending',
}));

export default function QuestionsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'answered' | 'pending'>('all');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const filteredQuestions = useMemo(() => {
    return ALL_QUESTIONS
      .filter((q) => {
        const matchesSearch = q.text.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || q.status === filter;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => (sort === 'asc' ? a.id - b.id : b.id - a.id));
  }, [search, filter, sort]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Research Questions Dashboard | {filteredQuestions.length} Items</title>
      </Head>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Research Questions Repository</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search questions..."
            className="flex-1 min-w-[200px] p-2 border rounded-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          <select className="p-2 border rounded-md" value={filter} onChange={(e) => setFilter(e.target.value as any)}>
            <option value="all">All Statuses</option>
            <option value="answered">Answered</option>
            <option value="pending">Pending</option>
          </select>

          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}
          >
            Sort ID: {sort.toUpperCase()}
          </button>
        </div>

        <div className="grid gap-4">
          {filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white p-4 rounded shadow-sm border-l-4 border-blue-500 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500 font-mono">ID: {q.id}</span>
                <p className="font-medium text-gray-800">{q.text}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${q.status === 'answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {q.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}