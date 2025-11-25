import { Post, User, ContentType, Goal } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Mercer',
  handle: '@architect_2050',
  avatar: 'https://picsum.photos/200/200',
  karma: 12450,
  skills: ['Holographic Design', 'React', 'Quantum Ethics']
};

export const MOCK_NETWORK: User[] = [
    { id: 'u2', name: 'Rohan Gupta', handle: '@rohan_py', avatar: 'https://picsum.photos/201/201', karma: 8000, skills: ['Python', 'AI Safety'] },
    { id: 'u3', name: 'Sarah Chen', handle: '@sarah_bio', avatar: 'https://picsum.photos/202/202', karma: 9500, skills: ['Bio-Engineering', 'Protein Folding'] },
    { id: 'u4', name: 'Jara Solis', handle: '@jara_art', avatar: 'https://picsum.photos/203/203', karma: 11000, skills: ['VR Sculpting', 'History'] },
];

export const GOALS: Goal[] = [
  { id: 'g1', label: 'Learn Something New', prompt: 'Prioritize educational content, tutorials, and scientific discoveries.' },
  { id: 'g2', label: 'Deep Relaxation', prompt: 'Show only art, nature, and calming discussions. Remove news and debates.' },
  { id: 'g3', label: 'Collaboration', prompt: 'Show projects needing help and community events.' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    author: MOCK_NETWORK[0],
    content: 'Just finished a module on ethical AI constraints. The "Guardian" pattern is fascinating. Anyone want to review my code?',
    type: ContentType.PROJECT,
    timestamp: new Date(),
    truthScore: 98,
    relatedTopics: ['AI', 'Ethics', 'Python'],
    collaboratorsNeeded: ['Code Reviewer']
  },
  {
    id: 'p2',
    author: MOCK_NETWORK[1],
    content: 'The protein folding simulation results are in. We might have a cure for the new strain. Universal Basic Compute at work!',
    type: ContentType.NEWS,
    imageUrl: 'https://picsum.photos/600/400',
    timestamp: new Date(Date.now() - 3600000),
    truthScore: 99,
    relatedTopics: ['Science', 'Health']
  },
  {
    id: 'p3',
    author: MOCK_NETWORK[2],
    content: 'Sunset in the Neo-Tokyo VR district tonight is breathtaking. Join me in the Sanctum.',
    type: ContentType.IMAGE,
    imageUrl: 'https://picsum.photos/600/401',
    timestamp: new Date(Date.now() - 7200000),
    truthScore: 100,
    relatedTopics: ['Art', 'Relaxation', 'VR']
  },
  {
    id: 'p4',
    author: { ...MOCK_NETWORK[0], name: 'Unknown', handle: '@anon_bot' }, // Simulate a bot/spam
    content: 'Why is everyone ignoring the real truth about the water supply?! Wake up sheeple!',
    type: ContentType.TEXT,
    timestamp: new Date(Date.now() - 10000),
    truthScore: 12, // Low truth score
    relatedTopics: ['Conspiracy', 'Rage']
  }
];
