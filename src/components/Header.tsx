import React from 'react';
import { Calendar, Users } from 'lucide-react';
import { Team, TeamGoal } from '../types';

interface HeaderProps {
  team: Team;
  selectedGoal: TeamGoal | null;
  showingUnlinked: boolean;
  showingTeamView: boolean;
  onToggleView: () => void;
  onShowAllTasks: () => void;
}

export function Header({
  team,
  selectedGoal,
  showingUnlinked,
  showingTeamView,
  onToggleView,
  onShowAllTasks
}: HeaderProps) {
  const getHeaderText = () => {
    if (showingTeamView) return `${team.name}`;
    if (showingUnlinked) return '연결되지 않은 작업';
    if (selectedGoal) return selectedGoal.title;
    return '오늘의 할 일';
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        {showingTeamView ? (
          <Users className="w-8 h-8 text-indigo-600" />
        ) : (
          <Calendar className="w-8 h-8 text-indigo-600" />
        )}
        <h1 className="text-3xl font-bold text-gray-800">{getHeaderText()}</h1>
      </div>
      <div className="flex items-center gap-4">
        {(selectedGoal || showingUnlinked) && (
          <button
            onClick={onShowAllTasks}
            className="text-sm text-gray-600 hover:text-indigo-600"
          >
            모든 할 일 보기
          </button>
        )}
      </div>
    </div>
  );
}