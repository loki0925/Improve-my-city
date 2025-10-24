import { Issue, IssueStatus } from '../types';

const ISSUES_KEY = 'improve_my_city_issues';

const dummyIssues: Issue[] = [
  {
    id: 'IMC-DUMMY-1',
    title: 'Major Pothole on Fell Street',
    description: 'There is a large and dangerous pothole near the intersection of Fell and Divisadero. It has been there for weeks and is getting worse.',
    summary: 'A large, hazardous pothole requires immediate attention near Fell and Divisadero.',
    photoUrl: 'https://placehold.co/600x400/94a3b8/ffffff?text=Pothole+Issue',
    tags: ['pothole', 'road_damage', 'safety_hazard'],
    location: { lat: 37.7749, lon: -122.4376 },
    status: IssueStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'IMC-DUMMY-2',
    title: 'Streetlight Out at Panhandle',
    description: 'The streetlight on the corner of Oak and Ashbury is completely out, making the corner very dark and unsafe at night.',
    summary: 'A broken streetlight at Oak and Ashbury creates a nighttime safety concern.',
    photoUrl: 'https://placehold.co/600x400/facc15/ffffff?text=Streetlight+Out',
    tags: ['street_light', 'electrical', 'darkness'],
    location: { lat: 37.7709, lon: -122.4468 },
    status: IssueStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: 'IMC-DUMMY-3',
    title: 'Overflowing Garbage Can in Golden Gate Park',
    description: 'The garbage can near the Conservatory of Flowers is overflowing, and trash is blowing everywhere. It needs to be emptied.',
    summary: 'An overflowing trash can near the Conservatory of Flowers requires immediate cleanup.',
    photoUrl: 'https://placehold.co/600x400/4ade80/ffffff?text=Trash+Overflow',
    tags: ['sanitation', 'garbage', 'park'],
    location: { lat: 37.7717, lon: -122.4633 },
    status: IssueStatus.RESOLVED,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
  },
    {
    id: 'IMC-DUMMY-4',
    title: 'Faded Crosswalk at Haight-Ashbury',
    description: 'The crosswalk at the famous Haight-Ashbury intersection is very faded and difficult for drivers to see. It needs repainting.',
    summary: 'The iconic Haight-Ashbury crosswalk is faded and needs repainting for pedestrian safety.',
    photoUrl: 'https://placehold.co/600x400/e5e7eb/ffffff?text=Faded+Crosswalk',
    tags: ['road_safety', 'pedestrian', 'maintenance'],
    location: { lat: 37.7699, lon: -122.4469 },
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