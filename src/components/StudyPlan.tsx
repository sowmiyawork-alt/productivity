import React from 'react';
import type { StudyTopic } from '../types';

interface StudyPlanProps {
  mathTopic: StudyTopic;
  scienceTopic: StudyTopic;
}

// Function to get the day of the year
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const StudyPlan: React.FC<StudyPlanProps> = ({ mathTopic, scienceTopic }) => {
  const dayOfYear = getDayOfYear();

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-baseline">
        <h2 className="text-xl font-bold text-slate-100">Daily O-Level Prep</h2>
        <span className="text-sm font-mono bg-slate-700 text-slate-300 px-2 py-1 rounded">
          Day {dayOfYear}/365
        </span>
      </div>
      <div className="mt-4 space-y-5">
        <div>
          <h3 className="text-lg font-semibold text-purple-300">Mathematics</h3>
          <p className="font-bold text-slate-200 mt-2">{mathTopic.topic}</p>
          <p className="text-slate-400 mt-1 whitespace-pre-line text-sm">{mathTopic.explanation}</p>
        </div>
        <div className="border-t border-slate-700/50"></div>
        <div>
          <h3 className="text-lg font-semibold text-blue-300">Science</h3>
          <p className="font-bold text-slate-200 mt-2">{scienceTopic.topic}</p>
          <p className="text-slate-400 mt-1 whitespace-pre-line text-sm">{scienceTopic.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default StudyPlan;