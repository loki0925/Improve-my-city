export enum IssueStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  summary: string;
  photoUrl: string; // Public URL from Firebase Storage
  tags: string[];
  priority: Priority;
  location: {
    lat: number;
    lon: number;
  } | null;
  status: IssueStatus;
  createdAt: string; // ISO string
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}