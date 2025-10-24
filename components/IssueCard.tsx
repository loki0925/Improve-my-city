
import React from 'react';
import { Issue } from '../types';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

interface IssueCardProps {
  issue: Issue;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const timeAgo = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };
    
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
      <img className="h-48 w-full object-cover" src={issue.photoUrl} alt={issue.title} />
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="text-lg font-bold text-brand-dark leading-tight flex-1">{issue.title}</h3>
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[issue.status]}`}>{issue.status}</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center gap-1.5 ${PRIORITY_COLORS[issue.priority]}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 01-1-1V6z" clipRule="evenodd" /></svg>
                    {issue.priority} Priority
                </span>
            </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 flex-grow italic">"{issue.summary}"</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {issue.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded-full">#{tag}</span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-2">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v5.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L11 10.414V5z" clipRule="evenodd" /></svg>
            <span className="font-mono">{issue.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
            <span>{issue.location ? `${issue.location.lat.toFixed(4)}, ${issue.location.lon.toFixed(4)}` : 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            <span>Reported {timeAgo(issue.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
