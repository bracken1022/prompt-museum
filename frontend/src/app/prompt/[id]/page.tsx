'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { authUtils } from '../../utils/auth';

interface Prompt {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  agent: string;
  tags: string[];
  likes_count: number;
  isLiked: boolean;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function PromptDetail() {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const params = useParams();
  const promptId = parseInt(params.id as string);

  useEffect(() => {
    // Check if user is logged in
    if (!authUtils.isAuthenticated()) {
      router.push('/');
      return;
    }

    // Fetch prompt data from API
    const fetchPrompt = async () => {
      try {
        const response = await fetch(`http://localhost:3000/prompts/${promptId}`);
        if (response.ok) {
          const data = await response.json();
          setPrompt({
            ...data,
            isLiked: false // TODO: Implement user-specific likes
          });
        } else {
          setPrompt(null);
        }
      } catch (error) {
        console.error('Failed to fetch prompt:', error);
        setPrompt(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrompt();
  }, [promptId, router]);

  const handleCopy = async () => {
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleLike = async () => {
    if (prompt) {
      try {
        const response = await fetch(`http://localhost:3000/prompts/${prompt.id}/like`, {
          method: 'POST',
        });
        
        if (response.ok) {
          setPrompt(prev => prev ? {
            ...prev,
            isLiked: !prev.isLiked,
            likes_count: prev.isLiked ? prev.likes_count - 1 : prev.likes_count + 1
          } : null);
        }
      } catch (error) {
        console.error('Failed to toggle like:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-pink-400 absolute top-0"></div>
          </div>
          <span className="mt-4 text-purple-200 font-medium">Loading prompt...</span>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <svg className="relative mx-auto h-12 w-12 text-purple-300 mt-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Prompt Not Found</h2>
          <p className="text-purple-200 mb-6 text-lg">The prompt you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
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
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 text-purple-200 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                  prompt.isLiked 
                    ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' 
                    : 'text-purple-200 bg-white/10 hover:bg-white/20 border border-white/20 hover:text-red-400 hover:bg-red-500/20 hover:border-red-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill={prompt.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">{prompt.likes_count}</span>
              </button>
              
              <button
                onClick={handleCopy}
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 backdrop-blur-sm ${
                  copied 
                    ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                    : 'text-purple-200 bg-white/10 hover:bg-white/20 border border-white/20 hover:text-green-400 hover:bg-green-500/20 hover:border-green-500/30'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {copied ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  )}
                </svg>
                <span className="font-medium">{copied ? 'Copied!' : 'Copy Prompt'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          <div className="p-8">
            {/* Title and Meta */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{prompt.title}</h1>
              <p className="text-xl text-purple-200 mb-6 leading-relaxed">{prompt.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                  {prompt.category}
                </span>
                <span className="inline-flex items-center px-4 py-2 rounded-full font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
                  {prompt.agent.charAt(0).toUpperCase() + prompt.agent.slice(1)}
                </span>
                <span className="text-purple-300">by <span className="text-white font-medium">{prompt.user.name}</span></span>
                <span className="text-purple-400">•</span>
                <span className="text-purple-300">{new Date(prompt.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {prompt.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-purple-100 border border-white/20 hover:bg-white/30 transition-colors duration-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prompt Content */}
            <div className="border-t border-white/20 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Prompt Content</h2>
                <button
                  onClick={handleCopy}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    copied 
                      ? 'text-green-400 bg-green-500/20 border border-green-500/30' 
                      : 'text-purple-200 bg-white/10 hover:bg-white/20 border border-white/20 hover:text-green-400 hover:bg-green-500/20 hover:border-green-500/30'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {copied ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                  </svg>
                  <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <pre className="whitespace-pre-wrap text-sm text-purple-100 font-mono leading-relaxed overflow-x-auto">
                  {prompt.content}
                </pre>
              </div>
            </div>

            {/* Usage Tips */}
            <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="text-2xl mr-3">💡</span>
                Usage Tips
              </h3>
              <ul className="text-purple-200 space-y-3">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span>Copy the prompt content and paste it into your AI assistant</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span>Customize the prompt for your specific use case</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span>Experiment with different variations to get better results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-3 mt-1">•</span>
                  <span>Consider the context and provide relevant examples when using the prompt</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}