import { IssueStatus } from './types';

export const STATUS_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [IssueStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-300',
  [IssueStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-300',
};

export const STATUS_MARKER_COLORS: Record<IssueStatus, string> = {
  [IssueStatus.PENDING]: '#FBBF24', // Tailwind yellow-400
  [IssueStatus.IN_PROGRESS]: '#60A5FA', // Tailwind blue-400
  [IssueStatus.RESOLVED]: '#4ADE80', // Tailwind green-400
};
