import React, { useState, useEffect, useCallback } from 'react';
import { Issue, IssueStatus, User } from './types';
import * as issueService from './services/issueService';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import IssueList from './components/IssueList';
import Chatbot from './components/Chatbot';
import AuthPage from './components/AuthPage';
import { getChatbotResponse } from './services/geminiService';
import { useAuth } from './contexts/AuthContext';

type View = 'dashboard' | 'report';

const App: React.FC = () => {
  const { currentUser } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchIssues = useCallback(async () => {
    setIsLoading(true);
    const loadedIssues = await issueService.getIssues();
    setIssues(loadedIssues);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchIssues();
    }
  }, [currentUser, fetchIssues]);

  const handleNewIssueAdded = (newIssue: Issue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setCurrentView('dashboard');
  };

  const handleIssueStatusChange = async (issueId: string, newStatus: IssueStatus) => {
    const updatedIssue = await issueService.updateIssueStatus(issueId, newStatus);
    if (updatedIssue) {
      setIssues(prevIssues =>
        prevIssues.map(issue =>
          issue.id === issueId ? updatedIssue : issue
        )
      );
    }
  };
  
  const handleChatbotQuery = async (query: string): Promise<string> => {
      const idMatch = query.match(/\b[a-zA-Z0-9]{20}\b/);
      return await getChatbotResponse(idMatch ? idMatch[0] : '');
  };

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark">
      <Header currentView={currentView} setCurrentView={setCurrentView} currentUser={currentUser} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'dashboard' ? (
          <IssueList 
            issues={issues} 
            isLoading={isLoading} 
            currentUser={currentUser} 
            onStatusChange={handleIssueStatusChange} 
          />
        ) : (
          <IssueForm onIssueAdded={handleNewIssueAdded} />
        )}
      </main>
      <Chatbot onSendMessage={handleChatbotQuery} />
    </div>
  );
};

export default App;