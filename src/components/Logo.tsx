import React from 'react';
import { BarChart2, Clock } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center text-blue-600">
        <BarChart2 size={32} className="text-blue-500" />
        <Clock size={32} className="text-red-500 -ml-1" />
      </div>
      <div className="font-bold text-2xl text-gray-800">
        Ranking <span className="text-blue-600">NOW</span>
      </div>
    </div>
  );
}