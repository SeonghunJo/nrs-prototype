import React, { useState } from 'react';
import { Calendar, MessageCircle, Timer, Users } from 'lucide-react';
import { Task, Team, TeamGoal, User } from '../types';

interface MeetingViewProps {
  team: Team;
  tasks: Task[];
  teamGoals: TeamGoal[];
  currentUser: User;
}

export function MeetingView({ team, tasks, teamGoals, currentUser }: MeetingViewProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const tasksByMember = team.members.map(member => {
    const memberTasks = tasks.filter(task => 
      task.userId === member.id && 
      task.createdAt.startsWith(selectedDate)
    );

    const completedTasks = memberTasks.filter(task => task.completed);
    const blockedTasks = memberTasks.filter(task => task.checkin?.status === 'blocked');
    
    return {
      member,
      tasks: memberTasks,
      completionRate: memberTasks.length ? 
        (completedTasks.length / memberTasks.length) * 100 : 0,
      blockers: blockedTasks
    };
  });

  const goalProgress = teamGoals.map(goal => {
    const goalTasks = tasks.filter(task => task.teamGoalId === goal.id);
    const completedTasks = goalTasks.filter(task => task.completed);
    
    return {
      goal,
      totalTasks: goalTasks.length,
      completedTasks: completedTasks.length,
      progress: goalTasks.length ? 
        (completedTasks.length / goalTasks.length) * 100 : 0
    };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-800">팀 데일리 스크럼</h2>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Timer className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">팀원 현황</h3>
          </div>
          <div className="space-y-6">
            {tasksByMember.map(({ member, tasks, completionRate, blockers }) => (
              <div key={member.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{member.name}</h4>
                      <p className="text-sm text-gray-500">{tasks.length}개의 할 일</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {completionRate.toFixed(0)}% 완료
                    </div>
                    {blockers.length > 0 && (
                      <div className="text-sm text-red-600">
                        {blockers.length}개의 블로커
                      </div>
                    )}
                  </div>
                </div>
                {blockers.length > 0 && (
                  <div className="pl-11">
                    <div className="text-sm bg-red-50 text-red-700 p-3 rounded-lg">
                      {blockers.map(task => (
                        <div key={task.id} className="flex items-start gap-2">
                          <MessageCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{task.title}</div>
                            {task.checkin?.comment && (
                              <p className="text-sm mt-1">{task.checkin.comment}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold text-gray-800">목표 진행 현황</h3>
          </div>
          <div className="space-y-6">
            {goalProgress.map(({ goal, totalTasks, completedTasks, progress }) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    <h4 className="font-medium text-gray-800">{goal.title}</h4>
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedTasks}/{totalTasks}개 완료
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: goal.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}