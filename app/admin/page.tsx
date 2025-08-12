'use client';

import { useState } from 'react';

interface SpamLog {
  timestamp: string;
  ip: string;
  spamScore?: number;
  reason: string;
  name: string;
  email: string;
  message: string;
  wasSent: boolean;
}

interface SpamData {
  totalSpamAttempts: number;
  recentSpam: SpamLog[];
  allSpam: SpamLog[];
  dailyStats: {
    date: string;
    sentToday: number;
    filteredToday: number;
    totalToday: number;
    limitReached: boolean;
    limit: number;
  };
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [spamData, setSpamData] = useState<SpamData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSpamLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/spam-log?password=${password}`);
      if (response.ok) {
        const data = await response.json();
        setSpamData(data);
        setIsAuthenticated(true);
      } else {
        alert('Invalid password');
      }
    } catch (error) {
      console.error('Error fetching spam logs:', error);
      alert('Error fetching spam logs');
    }
    setLoading(false);
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all spam logs?')) return;
    
    try {
      const response = await fetch(`/api/spam-log?password=${password}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' })
      });
      
      if (response.ok) {
        alert('Logs cleared');
        fetchSpamLogs();
      }
    } catch (error) {
      console.error('Error clearing logs:', error);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Spam Logs Admin</h1>
          
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
              />
            </div>
            
            <button
              onClick={fetchSpamLogs}
              disabled={loading || !password}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Loading...' : 'View Spam Logs'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Spam Logs Admin</h1>
          <button
            onClick={clearLogs}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Clear All Logs
          </button>
        </div>

        {spamData && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Summary</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                Total spam attempts: <span className="font-semibold text-red-600">{spamData.totalSpamAttempts}</span>
              </p>
            </div>

            {/* Daily Statistics */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Today's Statistics ({spamData.dailyStats.date})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-800 dark:text-green-200 font-semibold">
                    Emails Sent: {spamData.dailyStats.sentToday}/{spamData.dailyStats.limit}
                  </p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 font-semibold">
                    Filtered Out: {spamData.dailyStats.filteredToday}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 font-semibold">
                    Total Attempts: {spamData.dailyStats.totalToday}
                  </p>
                </div>
                <div className={`border rounded-lg p-4 ${spamData.dailyStats.limitReached ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800'}`}>
                  <p className={`font-semibold ${spamData.dailyStats.limitReached ? 'text-orange-800 dark:text-orange-200' : 'text-gray-800 dark:text-gray-200'}`}>
                    Status: {spamData.dailyStats.limitReached ? '🚫 Daily Limit Reached' : '✅ Accepting Messages'}
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Spam */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Recent Spam Attempts (Last 20)</h2>
              
              {spamData.recentSpam.length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No spam attempts recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {spamData.recentSpam.map((log, index) => (
                    <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4 bg-slate-50 dark:bg-slate-700">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          Score: {log.spamScore || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong>IP:</strong> {log.ip}
                        </div>
                        <div>
                          <strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                            log.wasSent 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                          }`}>
                            {log.wasSent ? '✅ Sent' : '❌ Filtered'}
                          </span>
                        </div>
                        <div>
                          <strong>Reason:</strong> {log.reason}
                        </div>
                        <div>
                          <strong>Score:</strong> {log.spamScore || 'N/A'}
                        </div>
                        <div>
                          <strong>Name:</strong> {log.name}
                        </div>
                        <div>
                          <strong>Email:</strong> {log.email}
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <strong>Message:</strong>
                        <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                          {log.message.length > 200 ? log.message.substring(0, 200) + '...' : log.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
