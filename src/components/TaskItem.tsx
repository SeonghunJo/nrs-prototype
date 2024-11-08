import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, MessageSquare, Trash2 } from 'lucide-react';
import { Task, TeamGoal } from '../types';
import { CheckinModal } from './CheckinModal';

interface TaskItemProps {
  task: Task;
  teamGoal?: TeamGoal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onCheckin?: (id: string, status: 'completed' | 'in-progress' | 'blocked', comment: string) => void;
  showCheckin?: boolean;
}

export function TaskItem({ task, teamGoal, onToggle, onDelete, onCheckin, showCheckin = false }: TaskItemProps) {
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);

  const getStatusColor = () => {
    if (!task.checkin) return '';
    switch (task.checkin.status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  const getStatusText = () => {
    if (!task.checkin) return '';
    switch (task.checkin.status) {
      case 'completed': return '완료';
      case 'in-progress': return '진행중';
      case 'blocked': return '블록됨';
      default: return '';
    }
  };

  return (
    <>
      <div
        className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
          task.completed ? 'bg-gray-50' : 'bg-white'
        } border border-gray-100 hover:shadow-md`}
      >
        <button
          onClick={() => onToggle(task.id)}
          className="focus:outline-none"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <Clock className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">{task.time}</span>
          <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
            {task.title}
          </span>
          {teamGoal && (
            <span
              className="text-sm px-3 py-1 rounded-full"
              style={{
                backgroundColor: `${teamGoal.color}20`,
                color: teamGoal.color
              }}
            >
              {teamGoal.title}
            </span>
          )}
          {task.checkin && (
            <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor()}`}>
              {getStatusText()}
              {task.checkin.comment && (
                <MessageSquare className="inline-block w-4 h-4 ml-1" />
              )}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showCheckin && onCheckin && (
            <button
              onClick={() => setIsCheckinOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 px-3 py-1 rounded hover:bg-indigo-50 text-sm font-medium"
            >
              체크인
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {isCheckinOpen && onCheckin && (
        <CheckinModal
          task={task}
          onCheckin={(status, comment) => {
            onCheckin(task.id, status, comment);
            setIsCheckinOpen(false);
          }}
          onClose={() => setIsCheckinOpen(false)}
        />
      )}
    </>
  );
}