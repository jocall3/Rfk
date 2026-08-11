import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const REBELLION_QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Question ${i + 1}: Foundations of Dissent`,
  slug: `question-${i + 1}`,
}));

const NEXT_PHASE_QUESTIONS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Research Inquiry ${i + 1}: Strategic Expansion`,
  slug: `research-${i + 1}`,
}));

export default function RebellionLandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <Head>
        <title>Rebellion | Knowledge Base</title>
      </Head>

      <main className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-gray-700 pb-6">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Rebellion Section</h1>
          <p className="text-lg text-gray-400">
            A structured repository for critical inquiry, documentation, and strategic research.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-white">Phase 1: Foundational Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REBELLION_QUESTIONS.map((q) => (
              <Link 
                key={q.id} 
                href={`/rebellion/questions/${q.slug}`}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                {q.title}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">Phase 2: Advanced Research Inquiries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NEXT_PHASE_QUESTIONS.map((q) => (
              <Link 
                key={q.id} 
                href={`/rebellion/research/${q.slug}`}
                className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors opacity-75 hover:opacity-100"
              >
                {q.title}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}