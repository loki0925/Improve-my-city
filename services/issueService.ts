
import { Issue, IssueStatus } from '../types';

const ISSUES_KEY = 'improve_my_city_issues';

export const getIssues = (): Issue[] => {
  try {
    const issuesJson = localStorage.getItem(ISSUES_KEY);
    if (!issuesJson) return [];
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
