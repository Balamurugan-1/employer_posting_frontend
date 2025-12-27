'use client';

import { useState } from 'react';
import api from '@/utils/api';
import ReactMarkdown from 'react-markdown';

export default function SmartMatch() {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setAiResponse(''); 

    try {
      const res = await api.post('/jobs/smart-match', { query });
      setAiResponse(res.data.ai_response);
    } catch (error) {
      console.error("AI Search failed", error);
      setAiResponse("⚠️ Sorry, the AI is having trouble connecting right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 text-blue-600">AI Career Match</h1>
      <p className="text-gray-600 mb-8">
        Don't just search keywords. Tell us about your skills, experience, and what you are looking for.
      </p>

      <div className="mb-8 space-y-4">
        <textarea
          className="w-full p-4 border rounded-lg shadow-sm h-32 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. I am a fresh graduate with strong skills in Python and React. I am looking for a remote Junior Developer role..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Analyzing your profile...' : 'Find My Perfect Match ✨'}
        </button>
      </div>

      {aiResponse && (
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Top Matches for You</h2>
          <div className="prose text-gray-700">
           
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}