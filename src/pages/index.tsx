import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Dashboard = () => {
  const stats = [
    { label: 'Total Questions Answered', value: '20' },
    { label: 'Pending Research Items', value: '20' },
    { label: 'Total Ingredients Analyzed', value: '142' },
    { label: 'Research Completion', value: '50%' },
  ];

  const toxicIngredient = {
    name: 'Phthalates',
    description: 'Often found in fragrances and plastics, linked to endocrine disruption.',
    riskLevel: 'High',
  };

  const recentActivity = [
    'Analyzed Parabens in skincare',
    'Researched Formaldehyde-releasing preservatives',
    'Completed Phase 1: Initial 20 questions',
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Head>
        <title>Toxicology Research Dashboard</title>
      </Head>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Research Dashboard</h1>
        <p className="text-gray-600">Tracking toxic ingredients and research progress.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500 uppercase">{stat.label}</p>
            <p className="text-2xl font-semibold text-blue-600">{stat.value}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Toxic Ingredient of the Day</h2>
          <div className="p-4 bg-red-50 border-l-4 border-red-500">
            <h3 className="text-lg font-bold text-red-800">{toxicIngredient.name}</h3>
            <p className="text-red-700 mt-1">{toxicIngredient.description}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-red-200 text-red-800 text-xs font-bold rounded">
              Risk: {toxicIngredient.riskLevel}
            </span>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <li key={idx} className="text-sm text-gray-700 border-b pb-2 last:border-0">
                • {activity}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-10 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
        <div className="flex gap-4">
          <Link href="/questions" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            View All Questions
          </Link>
          <Link href="/research" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition">
            Start New Research
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;