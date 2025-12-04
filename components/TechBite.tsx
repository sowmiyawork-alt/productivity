import React from 'react';
import type { TechConcept } from '../types';

interface TechBiteProps {
  concept: TechConcept;
}

const TechBite: React.FC<TechBiteProps> = ({ concept }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 shadow-lg">
      <div className="flex justify-between items-baseline">
        <h2 className="text-xl font-bold text-slate-100">Daily Tech Bite</h2>
        <span className="text-sm font-mono bg-slate-700 text-slate-300 px-2 py-1 rounded">
          5-Min Concept
        </span>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-teal-400">{concept.topic}</h3>
        <p className="text-slate-300 whitespace-pre-line">{concept.explanation}</p>
      </div>
    </div>
  );
};

export default TechBite;
