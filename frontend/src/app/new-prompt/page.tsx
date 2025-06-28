'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authUtils } from '../utils/auth';

interface User {
  id: number;
  name: string;
  email: string;
}

const agents = [
  { id: 'claude', name: 'Claude', description: 'Anthropic\'s AI assistant' },
  { id: 'gpt', name: 'ChatGPT', description: 'OpenAI\'s language model' },
  { id: 'gemini', name: 'Gemini', description: 'Google\'s AI model' },
  { id: 'midjourney', name: 'Midjourney', description: 'AI image generation' },
  { id: 'dall-e', name: 'DALL-E', description: 'OpenAI\'s image generator' },
  { id: 'stable-diffusion', name: 'Stable Diffusion', description: 'Open-source image AI' },
];

const categories = [
  'Writing',
  'Programming',
  'Art',
  'Analytics',
  'Photography',
  'Business',
  'Education',
  'Marketing',
  'Research',
  'Other'
];

export default function NewPrompt() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: '',
    agent: '',
    tags: '',
    is_public: true,
  });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim() || 
        !formData.category || !formData.agent) {
      setMessage('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content.trim(),
        category: formData.category,
        agent: formData.agent,
        tags: tagsArray,
        is_public: formData.is_public,
      };

      const response = await authUtils.fetchWithAuth('http://localhost:3000/prompts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Prompt created successfully!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setMessage(result.message || 'Failed to create prompt');
      }
    } catch (error) {
      setMessage('Failed to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-r-2 border-pink-400 absolute top-0"></div>
          </div>
          <span className="mt-4 text-purple-200 font-medium">Loading workspace...</span>
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
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Create New Prompt</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Create New Prompt</h2>
              <p className="text-purple-200 text-lg">Share your AI prompt with the community</p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                message.includes('successfully')
                  ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/30'
                  : 'bg-red-500/20 text-red-200 border-red-500/30'
              }`}>
                <div className="flex items-center">
                  {message.includes('successfully') ? (
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="font-medium">{message}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                  placeholder="Enter a descriptive title for your prompt"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15 resize-none"
                  placeholder="Briefly describe what this prompt does and its use cases"
                  required
                />
              </div>

              {/* Agent and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    AI Agent <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="agent"
                    value={formData.agent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    required
                  >
                    <option value="" className="bg-slate-800 text-white">Select an AI agent</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id} className="bg-slate-800 text-white">
                        {agent.name} - {agent.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    required
                  >
                    <option value="" className="bg-slate-800 text-white">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-slate-800 text-white">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                  placeholder="Enter tags separated by commas (e.g., writing, creative, storytelling)"
                />
                <p className="text-sm text-purple-300 mt-2">Separate multiple tags with commas</p>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-bold text-white mb-3">
                  Prompt Content <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border border-white/20 rounded-xl text-purple-100 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-mono text-sm leading-relaxed resize-none"
                  placeholder="Enter the full prompt content here. Be as detailed and specific as possible to help others use your prompt effectively."
                  required
                />
                <p className="text-sm text-purple-300 mt-2">
                  Write the complete prompt that users can copy and use with their AI assistant
                </p>
              </div>

              {/* Public/Private */}
              <div className="flex items-center space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-purple-500 bg-white/10 border-white/20 rounded focus:ring-purple-400 focus:ring-2"
                />
                <label className="block text-sm text-purple-200 font-medium">
                  Make this prompt public (visible to all users)
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-8 border-t border-white/20">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-white/10 text-purple-200 font-semibold rounded-xl hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 backdrop-blur-sm border border-white/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Amazing Prompt...
                    </div>
                  ) : (
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Prompt
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}