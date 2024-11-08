export interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: string;
  teamGoalId?: string;
  userId: string;
  createdAt: string;
  checkin?: {
    status: 'completed' | 'in-progress' | 'blocked';
    comment?: string;
    checkinTime: string;
  };
}

export interface TeamGoal {
  id: string;
  title: string;
  description: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Team {
  id: string;
  name: string;
  members: User[];
}