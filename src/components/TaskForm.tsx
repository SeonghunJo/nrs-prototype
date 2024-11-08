import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import { Task, TeamGoal } from '../types';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  teamGoals: TeamGoal[];
}

export function TaskForm({ onAddTask, teamGoals }: TaskFormProps) {
  const [newTask, setNewTask] = useState('');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    onAddTask({
      title: newTask,
      time: selectedTime,
      teamGoalId: selectedGoalId || undefined
    });
    
    setNewTask('');
    setSelectedGoalId('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="flex-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          >
            <option value="">팀 목표 선택 (선택사항)</option>
            {teamGoals.map(goal => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="새로운 할 일을 입력하세요"
            className="flex-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            추가
          </button>
        </div>
      </div>
    </form>
  );
}