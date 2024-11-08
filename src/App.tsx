import React, { useState, useEffect } from 'react';
import { Task, TeamGoal } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { TeamGoalsList } from './components/TeamGoalsList';
import { TeamView } from './components/TeamView';
import { MeetingView } from './components/MeetingView';
import { DashboardView } from './components/DashboardView';
import { Header } from './components/Header';
import { currentTeam, currentUser } from './data/sampleData';

const initialTeamGoals: TeamGoal[] = [
  {
    id: '1',
    title: 'Q1 제품 출시',
    description: '새로운 기능 개발 및 안정화',
    color: '#4F46E5'
  },
  {
    id: '2',
    title: '고객 만족도 향상',
    description: '사용자 피드백 반영 및 개선',
    color: '#059669'
  },
  {
    id: '3',
    title: '팀 역량 강화',
    description: '기술 스택 향상 및 지식 공유',
    color: '#DC2626'
  }
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('teamTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedGoal, setSelectedGoal] = useState<TeamGoal | null>(null);
  const [showingUnlinked, setShowingUnlinked] = useState(false);
  const [view, setView] = useState<'personal' | 'team' | 'meeting' | 'dashboard'>('personal');

  useEffect(() => {
    localStorage.setItem('teamTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'userId' | 'createdAt'>) => {
    setTasks([...tasks, {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    }]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleCheckin = (id: string, status: 'completed' | 'in-progress' | 'blocked', comment: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? {
        ...task,
        checkin: {
          status,
          comment,
          checkinTime: new Date().toISOString()
        }
      } : task
    ));
  };

  const handleGoalSelect = (goal: TeamGoal) => {
    setSelectedGoal(goal);
    setShowingUnlinked(false);
  };

  const handleShowUnlinked = () => {
    setShowingUnlinked(true);
    setSelectedGoal(null);
  };

  const handleShowAllTasks = () => {
    setSelectedGoal(null);
    setShowingUnlinked(false);
  };

  const filteredTasks = showingUnlinked
    ? tasks.filter(task => !task.teamGoalId)
    : selectedGoal
    ? tasks.filter(task => task.teamGoalId === selectedGoal.id)
    : tasks;

  const myTasks = filteredTasks.filter(task => task.userId === currentUser.id)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-10">
          <Header
            team={currentTeam}
            selectedGoal={selectedGoal}
            showingUnlinked={showingUnlinked}
            showingTeamView={view !== 'personal'}
            onToggleView={() => setView(view === 'personal' ? 'team' : 'personal')}
            onShowAllTasks={handleShowAllTasks}
          />

          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-lg border border-gray-100 bg-white p-1 shadow-sm">
              <button
                onClick={() => setView('personal')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'personal' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                개인 할 일
              </button>
              <button
                onClick={() => setView('team')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'team' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                팀 전체 보기
              </button>
              <button
                onClick={() => setView('meeting')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'meeting' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                팀 회의
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-indigo-600'
                }`}
              >
                대시보드
              </button>
            </div>
          </div>

          {view === 'dashboard' ? (
            <DashboardView
              team={currentTeam}
              tasks={tasks}
              teamGoals={initialTeamGoals}
            />
          ) : view === 'meeting' ? (
            <MeetingView
              team={currentTeam}
              tasks={tasks}
              teamGoals={initialTeamGoals}
              currentUser={currentUser}
            />
          ) : view === 'team' ? (
            <TeamView
              team={currentTeam}
              tasks={filteredTasks}
              currentUser={currentUser}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onCheckin={handleCheckin}
              showCheckin={true}
            />
          ) : (
            <>
              <TeamGoalsList 
                goals={initialTeamGoals} 
                onSelect={handleGoalSelect}
                onShowUnlinked={handleShowUnlinked}
                showingUnlinked={showingUnlinked}
              />
              
              <TaskForm
                onAddTask={addTask}
                teamGoals={initialTeamGoals}
              />

              <div className="space-y-4">
                {myTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    teamGoal={initialTeamGoals.find(g => g.id === task.teamGoalId)}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                    onCheckin={handleCheckin}
                    showCheckin={true}
                  />
                ))}
                {myTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {showingUnlinked 
                      ? '연결되지 않은 작업이 없습니다.'
                      : selectedGoal 
                        ? `'${selectedGoal.title}'에 연결된 할 일이 없습니다.`
                        : '할 일이 없습니다. 새로운 할 일을 추가해보세요!'}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;