import { Issue, IssueStatus, Priority } from '../types';

const generateId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// In-memory store for issues
let mockIssues: Issue[] = [];
let isInitialized = false;

const dummyIssuesData: Omit<Issue, 'id'>[] = [
  {
    title: 'Water Logging near Adajan Gam',
    description: 'Heavy water logging after rains on the main road in Adajan. It is causing major traffic jams and is a health hazard.',
    summary: 'Severe water logging in Adajan is causing traffic and health issues.',
    photoUrl: 'https://placehold.co/600x400/3b82f6/ffffff?text=Water+Logging',
    tags: ['flooding', 'drainage', 'monsoon', 'traffic'],
    priority: Priority.HIGH,
    location: { lat: 21.1959, lon: 72.7933 },
    status: IssueStatus.PENDING,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Broken Streetlight in Piplod',
    description: 'The streetlight on the corner near RahulRaj Mall has been broken for over a week. It is very dark and feels unsafe for pedestrians at night.',
    summary: 'A broken streetlight near RahulRaj Mall in Piplod poses a nighttime safety risk.',
    photoUrl: 'https://placehold.co/600x400/1f2937/ffffff?text=Broken+Light',
    tags: ['street_light', 'safety', 'electrical'],
    priority: Priority.MEDIUM,
    location: { lat: 21.1554, lon: 72.7885 },
    status: IssueStatus.IN_PROGRESS,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Garbage Dumped near Varachha Flyover',
    description: 'A huge pile of garbage has been illegally dumped under the Varachha flyover. It smells terrible and is attracting stray animals.',
    summary: 'Illegal garbage dumping under Varachha flyover is creating a sanitation problem.',
    photoUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Garbage+Dump',
    tags: ['sanitation', 'waste', 'health_hazard'],
    priority: Priority.HIGH,
    location: { lat: 21.2139, lon: 72.8653 },
    status: IssueStatus.RESOLVED,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: 'Damaged bench at Gopi Talav',
    description: 'A public bench at the Gopi Talav lakefront is broken and has sharp edges. It could injure someone.',
    summary: 'A broken public bench with sharp edges at Gopi Talav is a safety hazard.',
    photoUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Broken+Bench',
    tags: ['public_property', 'maintenance', 'safety'],
    priority: Priority.LOW,
    location: { lat: 21.1918, lon: 72.8252 },
    status: IssueStatus.PENDING,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const initializeMockData = () => {
    if (!isInitialized) {
        mockIssues = dummyIssuesData.map((issue) => ({
            ...issue,
            id: generateId(),
        }));
        isInitialized = true;
        console.log("Mock data initialized.");
    }
};

export const getIssues = async (): Promise<Issue[]> => {
  initializeMockData();
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return a sorted copy
  return [...mockIssues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export type NewIssueData = Omit<Issue, 'id' | 'createdAt' | 'status' | 'photoUrl'> & { photoFile: File };

export const addIssue = async (newIssueData: NewIssueData): Promise<Issue> => {
  const { photoFile, ...issueData } = newIssueData;

  // For mock data, we create a temporary URL for the uploaded photo.
  const photoUrl = URL.createObjectURL(photoFile);

  const newIssue: Issue = {
    ...issueData,
    photoUrl,
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: IssueStatus.PENDING,
  };

  mockIssues.push(newIssue);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return newIssue;
};

export const getIssueById = async (id: string): Promise<Issue | undefined> => {
  initializeMockData(); // Ensure data is there if this is called first
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockIssues.find(issue => issue.id === id);
};

export const updateIssueStatus = async (id: string, status: IssueStatus): Promise<Issue | undefined> => {
  initializeMockData();
  const issue = mockIssues.find(issue => issue.id === id);
  if (issue) {
    issue.status = status;
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return { ...issue }; // Return a copy
  }
  return undefined;
};