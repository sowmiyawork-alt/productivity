import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import DailyDose from './components/DailyDose';
import StudyPlan from './components/StudyPlan';
import Spinner from './components/Spinner';
import { getDailyContent } from './services/geminiService';
import type { DailyContent } from './types';
import TechBite from './components/TechBite';
import RefreshIcon from './components/icons/RefreshIcon';

const App: React.FC = () => {
  const [dailyContent, setDailyContent] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchDailyContent = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const content = await getDailyContent();
      setDailyContent(content);
    } catch (err) {
      setError('Failed to fetch daily content. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="flex justify-center mb-8">
          <button
            onClick={fetchDailyContent}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-blue-500/50"
            aria-label="Refresh daily content"
          >
            <RefreshIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Get New Content'}
          </button>
        </div>
        
        {loading && !dailyContent && (
          <div className="flex justify-center items-center h-64">
            <Spinner />
          </div>
        )}
        
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-center my-8">
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        )}

        {dailyContent && (
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TodoList />
            </div>
            <div className="flex flex-col gap-8">
              <DailyDose 
                word={dailyContent.wordOfTheDay}
                thought={dailyContent.thoughtOfTheDay}
              />
              <TechBite 
                concept={dailyContent.techConcept}
              />
              <StudyPlan 
                mathTopic={dailyContent.studyPlan.mathTopic}
                scienceTopic={dailyContent.studyPlan.scienceTopic}
              />
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;