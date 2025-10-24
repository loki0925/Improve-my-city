
export enum IssueStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  summary: string;
  photoUrl: string; // base64 data URL
  tags: string[];
  location: {
    lat: number;
    lon: number;
  } | null;
  status: IssueStatus;
  createdAt: string; // ISO string
}
