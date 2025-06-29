'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface PromptListProps {
  selectedAgent: string;
}

export default function PromptList({ selectedAgent }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const router = useRouter();

  // Fetch prompts from API
  const fetchPrompts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedAgent !== 'all') params.append('agent', selectedAgent);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/prompts?${params}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setPrompts(data.map((prompt: Prompt) => ({
          ...prompt,
          isLiked: false // TODO: Implement user-specific likes
        })));
      }
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAgent, selectedCategory, searchTerm]);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/prompts/categories`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(['all', ...data]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleLike = async (promptId: number) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/prompts/${promptId}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setPrompts(prev => prev.map(prompt => 
          prompt.id === promptId 
            ? { 
                ...prompt, 
                isLiked: !prompt.isLiked,
                likes_count: prompt.isLiked ? prompt.likes_count - 1 : prompt.likes_count + 1
              }
            : prompt
        ));
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handlePromptClick = (promptId: number) => {
    router.push(`/prompt/${promptId}`);
  };

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {selectedAgent === 'all' ? 'All Prompts' : `${selectedAgent.charAt(0).toUpperCase() + selectedAgent.slice(1)} Prompts`}
            </h1>
            <p className="text-purple-200 text-lg">
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-300 mr-2"></div>
                  Discovering prompts...
                </span>
              ) : (
                `${prompts.length} ${prompts.length === 1 ? 'prompt' : 'prompts'} available`
              )}
            </p>
          </div>
          <button 
            onClick={() => router.push('/new-prompt')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Prompt
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search prompts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15 min-w-[150px]"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800 text-white">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-pink-400 absolute top-0"></div>
          </div>
          <span className="mt-4 text-purple-200 font-medium">Discovering amazing prompts...</span>
        </div>
      )}

      {/* Prompts Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => handlePromptClick(prompt.id)}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white group-hover:text-purple-200 transition-colors duration-200 line-clamp-2 text-lg mb-2">
                    {prompt.title}
                  </h3>
                  <p className="text-sm text-purple-200 line-clamp-3 leading-relaxed">
                    {prompt.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {prompt.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-purple-100 border border-white/20"
                  >
                    #{tag}
                  </span>
                ))}
                {prompt.tags.length > 3 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-purple-300 border border-white/10">
                    +{prompt.tags.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                    {prompt.category}
                  </span>
                  <span className="text-sm text-purple-300">by {prompt.user.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(prompt.id);
                  }}
                  className={`inline-flex items-center space-x-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                    prompt.isLiked 
                      ? 'text-red-400 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' 
                      : 'text-purple-300 hover:text-red-400 hover:bg-red-500/20 border border-white/20 hover:border-red-500/30'
                  }`}
                >
                  <svg className="w-4 h-4" fill={prompt.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm font-medium">{prompt.likes_count}</span>
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {!isLoading && prompts.length === 0 && (
        <div className="text-center py-16">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
            <svg className="relative mx-auto h-12 w-12 text-purple-300 mt-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No prompts found</h3>
          <p className="text-purple-200 mb-6">Try adjusting your search or filters, or create the first prompt!</p>
          <button 
            onClick={() => router.push('/new-prompt')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create First Prompt
          </button>
        </div>
      )}
    </div>
  );
}