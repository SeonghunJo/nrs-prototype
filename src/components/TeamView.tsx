import React from 'react';
import { Users } from 'lucide-react';
import { Task, Team, User } from '../types';
import { TaskItem } from './TaskItem';

interface TeamViewProps {
  team: Team;
  tasks: Task[];
  currentUser: User;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onCheckin?: (id: string, status: 'completed' | 'in-progress' | 'blocked', comment: string) => void;
  showCheckin?: boolean;
}

export function TeamView({ 
  team, 
  tasks, 
  currentUser, 
  onToggleTask, 
  onDeleteTask,
  onCheckin,
  showCheckin 
}: TeamViewProps) {
  const tasksByUser = team.members.map(member => ({
    user: member,
    tasks: tasks.filter(task => task.userId === member.id)
      .sort((a, b) => a.time.localeCompare(b.time))
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-800">{team.name} 팀원들의 할 일</h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {tasksByUser.map(({ user, tasks }) => (
          <div key={user.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>

            <div className="space-y-3 pl-11">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    onDelete={user.id === currentUser.id ? onDeleteTask : undefined}
                    onCheckin={user.id === currentUser.id ? onCheckin : undefined}
                    showCheckin={showCheckin}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-sm py-3">오늘 등록된 할 일이 없습니다.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}