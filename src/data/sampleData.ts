import { Team, User } from '../types';

export const currentUser: User = {
  id: 'user1',
  name: '김개발',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
  role: '프론트엔드 개발자'
};

export const teamMembers: User[] = [
  currentUser,
  {
    id: 'user2',
    name: '이디자인',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    role: 'UI/UX 디자이너'
  },
  {
    id: 'user3',
    name: '박백엔드',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
    role: '백엔드 개발자'
  }
];

export const currentTeam: Team = {
  id: 'team1',
  name: '프로덕트 개발팀',
  members: teamMembers
};