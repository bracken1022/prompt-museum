'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AgentList from '../components/AgentList';
import PromptList from '../components/PromptList';
import { authUtils } from '../utils/auth';

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!authUtils.isAuthenticated()) {
      router.push('/');
      return;
    }
    const userData = authUtils.getUser();
    if (userData) {
      setUser(userData);
    }
  }, [router]);

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          <span className="text-purple-100 font-medium">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-60 h-60 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-full px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Prompt Museum</h1>
                  <p className="text-purple-200 text-sm">AI Prompt Collection</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user.name}</p>
                  <p className="text-purple-200 text-xs">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM9 4h9a2 2 0 012 2v9M9 4V2a2 2 0 00-2-2H5a2 2 0 00-2 2v2M9 4H7m2 0v11M7 4H5v11h2m0 0v2a2 2 0 002 2h2" />
                  </svg>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 font-medium rounded-lg transition-all duration-200 border border-red-500/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex h-[calc(100vh-89px)]">
        {/* Left Panel - Agent List */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-72'} transition-all duration-300 bg-white/5 backdrop-blur-md border-r border-white/10 overflow-y-auto`}>
          <AgentList 
            selectedAgent={selectedAgent} 
            onAgentSelect={setSelectedAgent}
            collapsed={sidebarCollapsed}
          />
        </div>

        {/* Main Panel - Prompts */}
        <div className="flex-1 overflow-y-auto bg-white/5 backdrop-blur-sm">
          <PromptList selectedAgent={selectedAgent} />
        </div>
      </div>
    </div>
  );
}