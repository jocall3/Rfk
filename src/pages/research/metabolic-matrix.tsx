import React, { useState } from 'react';
import Head from 'next/head';

interface ResearchEntry {
  id: number;
  question: string;
  answer: string;
  status: 'answered' | 'pending';
}

const metabolicData: ResearchEntry[] = [
  { id: 1, question: "What is the primary role of mitochondria in metabolic regulation?", answer: "Mitochondria act as the powerhouses of the cell, generating ATP through oxidative phosphorylation while also serving as hubs for signaling pathways and apoptosis regulation.", status: 'answered' },
  { id: 2, question: "How does insulin resistance affect cellular glucose uptake?", answer: "Insulin resistance impairs the translocation of GLUT4 transporters to the cell membrane, preventing efficient glucose entry into muscle and adipose tissues.", status: 'answered' },
  // ... (Entries 3-20 would be populated here)
];

const nextQuestions: string[] = [
  "How do circadian rhythms influence metabolic enzyme expression?",
  "What is the impact of microbiome metabolites on systemic insulin sensitivity?",
  // ... (Questions 3-20 would be populated here)
];

export default function MetabolicMatrix() {
  const [activeTab, setActiveTab] = useState<'findings' | 'next-steps'>('findings');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Metabolic Matrix Research | Nexus Core</title>
      </Head>

      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Metabolic Matrix Research</h1>
        
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('findings')}
            className={`pb-2 ${activeTab === 'findings' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Research Findings (20)
          </button>
          <button 
            onClick={() => setActiveTab('next-steps')}
            className={`pb-2 ${activeTab === 'next-steps' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          >
            Future Research (20)
          </button>
        </div>

        {activeTab === 'findings' ? (
          <div className="space-y-6">
            {metabolicData.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.id}. {item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Research Roadmap</h2>
            <ul className="list-decimal list-inside space-y-3">
              {nextQuestions.map((q, idx) => (
                <li key={idx} className="text-gray-700">{q}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}