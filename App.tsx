
import React, { useState, useEffect, useCallback } from 'react';
import { Issue } from './types';
import * as issueService from './services/issueService';
import Header from './components/Header';
import IssueForm from './components/IssueForm';
import IssueList from './components/IssueList';
import Chatbot from './components/Chatbot';
import { getChatbotResponse } from './services/geminiService';

type View = 'dashboard' | 'report';

const App: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const fetchIssues = useCallback(() => {
    setIsLoading(true);
    const loadedIssues = issueService.getIssues();
    setIssues(loadedIssues);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const handleNewIssueAdded = (newIssue: Issue) => {
    setIssues(prevIssues => [newIssue, ...prevIssues]);
    setCurrentView('dashboard');
  };
  
  const handleChatbotQuery = (query: string): string => {
      const idMatch = query.match(/IMC-\w+/i);
      return getChatbotResponse(idMatch ? idMatch[0] : '');
  };

  return (
    <div className="min-h-screen bg-brand-gray text-brand-dark">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        {currentView === 'dashboard' ? (
          <IssueList issues={issues} isLoading={isLoading} />
        ) : (
          <IssueForm onIssueAdded={handleNewIssueAdded} />
        )}
      </main>
      <Chatbot onSendMessage={handleChatbotQuery} />
    </div>
  );
};

export default App;
