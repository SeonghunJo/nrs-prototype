import React from 'react';
import { LayersIcon, Target } from 'lucide-react';
import { TeamGoal } from '../types';

interface TeamGoalsListProps {
  goals: TeamGoal[];
  onSelect: (goal: TeamGoal) => void;
  onShowUnlinked: () => void;
  showingUnlinked: boolean;
}

export function TeamGoalsList({ goals, onSelect, onShowUnlinked, showingUnlinked }: TeamGoalsListProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">팀 목표</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map(goal => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal)}
            className="group text-left p-5 rounded-xl border-2 hover:border-indigo-500 transition-all bg-white hover:shadow-lg"
            style={{ borderColor: `${goal.color}30` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: goal.color }}
              />
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {goal.title}
              </h3>
            </div>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </button>
        ))}
        <button
          onClick={onShowUnlinked}
          className={`text-left p-5 rounded-xl border-2 hover:border-indigo-500 transition-all bg-white hover:shadow-lg ${
            showingUnlinked ? 'border-indigo-500' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <LayersIcon className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">기타 작업</h3>
          </div>
          <p className="text-sm text-gray-600">팀 목표와 연결되지 않은 작업 목록</p>
        </button>
      </div>
    </div>
  );
}