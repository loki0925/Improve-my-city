
import { Issue, IssueStatus, Priority } from '../types';

const ISSUES_KEY = 'improve_my_city_issues';

const dummyIssues: Issue[] = [
  {
    id: 'IMC-DUMMY-1',
    title: 'Water Logging near Adajan Gam',
    description: 'Heavy water logging after rains on the main road in Adajan. It is causing major traffic jams and is a health hazard.',
    summary: 'Severe water logging in Adajan is causing traffic and health issues.',
    photoUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Water+Logging',
    tags: ['flooding', 'drainage', 'monsoon', 'traffic'],
    priority: Priority.HIGH,
    location: { lat: 21.1959, lon: 72.7933 },
    status: IssueStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'IMC-DUMMY-2',
    title: 'Broken Streetlight in Piplod',
    description: 'The streetlight on the corner near RahulRaj Mall has been broken for over a week. It is very dark and feels unsafe for pedestrians at night.',
    summary: 'A broken streetlight near RahulRaj Mall in Piplod poses a nighttime safety risk.',
    photoUrl: 'https://placehold.co/600x400/1f2937/ffffff?text=Broken+Light',
    tags: ['street_light', 'safety', 'electrical'],
    priority: Priority.MEDIUM,
    location: { lat: 21.1554, lon: 72.7885 },
    status: IssueStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: 'IMC-DUMMY-3',
    title: 'Garbage Dumped near Varachha Flyover',
    description: 'A huge pile of garbage has been illegally dumped under the Varachha flyover. It smells terrible and is attracting stray animals.',
    summary: 'Illegal garbage dumping under Varachha flyover is creating a sanitation problem.',
    photoUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Garbage+Dump',
    tags: ['sanitation', 'waste', 'health_hazard'],
    priority: Priority.HIGH,
    location: { lat: 21.2139, lon: 72.8653 },
    status: IssueStatus.RESOLVED,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
    {
    id: 'IMC-DUMMY-4',
    title: 'Damaged bench at Gopi Talav',
    description: 'A public bench at the Gopi Talav lakefront is broken and has sharp edges. It could injure someone.',
    summary: 'A broken public bench with sharp edges at Gopi Talav is a safety hazard.',
    photoUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Broken+Bench',
    tags: ['public_property', 'maintenance', 'safety'],
    priority: Priority.LOW,
    location: { lat: 21.1918, lon: 72.8252 },
    status: IssueStatus.PENDING,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];


export const getIssues = (): Issue[] => {
  try {
    const issuesJson = localStorage.getItem(ISSUES_KEY);
    // If no issues exist in localStorage, initialize with dummy data
    if (!issuesJson || JSON.parse(issuesJson).length === 0) {
      localStorage.setItem(ISSUES_KEY, JSON.stringify(dummyIssues));
      const initialIssues = JSON.parse(localStorage.getItem(ISSUES_KEY)!) as Issue[];
      return initialIssues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    const issues = JSON.parse(issuesJson) as Issue[];
    // Sort by most recent first
    return issues.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Failed to parse issues from localStorage", error);
    return [];
  }
};

export const addIssue = (newIssueData: Omit<Issue, 'id' | 'createdAt' | 'status'>): Issue => {
  const issues = getIssues();
  const newIssue: Issue = {
    ...newIssueData,
    id: `IMC-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: IssueStatus.PENDING,
  };
  localStorage.setItem(ISSUES_KEY, JSON.stringify([newIssue, ...issues]));
  return newIssue;
};

export const getIssueById = (id: string): Issue | undefined => {
  const issues = getIssues();
  return issues.find(issue => issue.id === id);
};

// This function would be used by an admin panel, but we include it for completeness.
export const updateIssueStatus = (id: string, status: IssueStatus): Issue | undefined => {
  let issues = getIssues();
  const issueIndex = issues.findIndex(issue => issue.id === id);
  if (issueIndex !== -1) {
    issues[issueIndex].status = status;
    localStorage.setItem(ISSUES_KEY, JSON.stringify(issues));
    return issues[issueIndex];
  }
  return undefined;
};
