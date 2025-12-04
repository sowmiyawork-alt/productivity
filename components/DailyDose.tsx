
import React from 'react';
import type { WordOfTheDay } from '../types';

interface DailyDoseProps {
  word: WordOfTheDay;
  thought: string;
}

const DailyDose: React.FC<DailyDoseProps> = ({ word, thought }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Word of the Day</h3>
        <p className="text-2xl font-bold text-slate-100">{word.word}</p>
        <p className="text-slate-400 mt-1">{word.definition}</p>
      </div>
      <div className="border-t border-slate-700"></div>
      <div>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Thought of the Day</h3>
        <p className="text-slate-300 italic">"{thought}"</p>
      </div>
    </div>
  );
};

export default DailyDose;
