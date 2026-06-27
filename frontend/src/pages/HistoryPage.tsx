
import type { SessionHistory } from '../types';
import { Clock, PlayCircle } from 'lucide-react';

export function HistoryPage() {
  // Mock history data since backend is not fully implemented
  const mockHistory: SessionHistory[] = [
    { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), text: 'HELLO THANK YOU' },
    { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), text: 'PLEASE HELP ME' },
    { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), text: 'YES I AM GOOD' },
  ];

  const handleReplay = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Translation History</h1>
        
        <div className="space-y-4">
          {mockHistory.map((session) => (
            <div 
              key={session.id} 
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex-1 mr-6">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(session.timestamp).toLocaleString()}
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {session.text}
                </p>
              </div>
              <button
                onClick={() => handleReplay(session.text)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                title="Replay Audio"
              >
                <PlayCircle className="w-8 h-8" />
              </button>
            </div>
          ))}
          
          {mockHistory.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No translation history yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
