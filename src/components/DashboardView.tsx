import React from 'react';
import { BarChart3, Target, Users2, ListTodo } from 'lucide-react';
import { Task, Team, TeamGoal, User } from '../types';

interface DashboardViewProps {
  team: Team;
  tasks: Task[];
  teamGoals: TeamGoal[];
}

export function DashboardView({ team, tasks, teamGoals }: DashboardViewProps) {
  // 목표별 진행률 계산
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

  // 팀원별 목표 연결 비율 계산
  const memberGoalStats = team.members.map(member => {
    const memberTasks = tasks.filter(task => task.userId === member.id);
    const tasksWithGoals = memberTasks.filter(task => task.teamGoalId);
    
    return {
      member,
      totalTasks: memberTasks.length,
      tasksWithGoals: tasksWithGoals.length,
      connectionRate: memberTasks.length ?
        (tasksWithGoals.length / memberTasks.length) * 100 : 0
    };
  });

  // 전체 팀의 목표 연결 비율
  const teamStats = {
    totalTasks: tasks.length,
    tasksWithGoals: tasks.filter(task => task.teamGoalId).length,
    connectionRate: tasks.length ?
      (tasks.filter(task => task.teamGoalId).length / tasks.length) * 100 : 0
  };

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800">목표 진행률</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800">
              {(goalProgress.reduce((acc, curr) => acc + curr.progress, 0) / goalProgress.length).toFixed(0)}%
            </div>
            <p className="text-sm text-gray-500 mt-1">전체 목표 평균 진행률</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-gray-800">팀 연결률</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800">
              {teamStats.connectionRate.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-500 mt-1">목표와 연결된 업무 비율</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <ListTodo className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">전체 업무</h3>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800">
              {teamStats.tasksWithGoals} / {teamStats.totalTasks}
            </div>
            <p className="text-sm text-gray-500 mt-1">목표 연결 / 전체 업무</p>
          </div>
        </div>
      </div>

      {/* 목표별 진행 현황 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">목표별 진행 현황</h3>
        </div>
        <div className="space-y-6">
          {goalProgress.map(({ goal, totalTasks, completedTasks, progress }) => (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: goal.color }}
                  />
                  <h4 className="font-medium text-gray-800">{goal.title}</h4>
                </div>
                <div className="text-sm text-gray-600">
                  {progress.toFixed(0)}% 완료
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: goal.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{completedTasks}개 완료</span>
                  <span>{totalTasks}개 업무</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 팀원별 목표 연결 현황 */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Users2 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">팀원별 목표 연결 현황</h3>
        </div>
        <div className="space-y-6">
          {memberGoalStats.map(({ member, totalTasks, tasksWithGoals, connectionRate }) => (
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
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {connectionRate.toFixed(0)}% 연결
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${connectionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{tasksWithGoals}개 연결됨</span>
                  <span>{totalTasks}개 업무</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}