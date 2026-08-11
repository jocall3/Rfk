import React, { useState } from 'react';

interface FormData {
  question: string;
  answer: string;
  source: string;
  confidence: number;
}

const DataGatheringForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    question: '',
    answer: '',
    source: '',
    confidence: 5,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulate API call to save the markdown data
    try {
      console.log('Saving research data:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setFormData({ question: '', answer: '', source: '', confidence: 5 });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving data:', error);
      setStatus('idle');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Research Data Entry: Next 20 Questions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Question</label>
          <input
            required
            name="question"
            value={formData.question}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Enter the research question..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Answer</label>
          <textarea
            required
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="Provide the detailed answer..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Source</label>
          <input
            required
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="URL or reference citation..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confidence Level (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            name="confidence"
            value={formData.confidence}
            onChange={handleChange}
            className="mt-1 block w-20 border border-gray-300 rounded-md p-2"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {status === 'submitting' ? 'Saving...' : 'Submit Research Entry'}
        </button>
        {status === 'success' && (
          <p className="text-green-600 text-center mt-2">Entry saved successfully!</p>
        )}
      </form>
    </div>
  );
};

export default DataGatheringForm;