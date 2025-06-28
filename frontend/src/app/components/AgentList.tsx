'use client';

interface Agent {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

interface AgentListProps {
  selectedAgent: string;
  onAgentSelect: (agentId: string) => void;
  collapsed?: boolean;
}

const agents: Agent[] = [
  {
    id: 'all',
    name: 'All Agents',
    icon: '🤖',
    color: 'from-slate-400 to-slate-600',
    description: 'View prompts for all AI agents'
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: '🧠',
    color: 'from-orange-400 to-orange-600',
    description: 'Anthropic\'s AI assistant'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '💎',
    color: 'from-blue-400 to-blue-600',
    description: 'Google\'s AI model'
  },
  {
    id: 'gpt',
    name: 'ChatGPT',
    icon: '🚀',
    color: 'from-green-400 to-green-600',
    description: 'OpenAI\'s language model'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    icon: '🎨',
    color: 'from-purple-400 to-purple-600',
    description: 'AI image generation'
  },
  {
    id: 'dall-e',
    name: 'DALL-E',
    icon: '🖼️',
    color: 'from-pink-400 to-pink-600',
    description: 'OpenAI\'s image generator'
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    icon: '⚡',
    color: 'from-yellow-400 to-yellow-600',
    description: 'Open-source image AI'
  }
];

export default function AgentList({ selectedAgent, onAgentSelect, collapsed = false }: AgentListProps) {
  return (
    <div className="p-4 h-full">
      {!collapsed && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white mb-2">AI Agents</h2>
          <p className="text-purple-200 text-sm">Choose your AI companion</p>
        </div>
      )}
      
      <div className="space-y-3">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onAgentSelect(agent.id)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-300 group hover:scale-[1.02] ${
              selectedAgent === agent.id
                ? 'bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg'
                : 'hover:bg-white/10 backdrop-blur-sm border border-white/10'
            }`}
            title={collapsed ? agent.name : undefined}
          >
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className={`w-10 h-10 bg-gradient-to-r ${agent.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg transform group-hover:scale-110 transition-transform duration-200`}>
                {agent.icon}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold truncate ${
                    selectedAgent === agent.id ? 'text-white' : 'text-purple-100'
                  }`}>
                    {agent.name}
                  </div>
                  <div className={`text-xs truncate ${
                    selectedAgent === agent.id ? 'text-purple-200' : 'text-purple-300'
                  }`}>
                    {agent.description}
                  </div>
                </div>
              )}
              {!collapsed && selectedAgent === agent.id && (
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse shadow-md"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      {!collapsed && (
        <div className="mt-8 pt-6 border-t border-white/20">
          <button className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-white/30 rounded-xl text-purple-200 hover:border-white/50 hover:text-white hover:bg-white/5 transition-all duration-200 group">
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-sm font-medium">Request Agent</span>
          </button>
        </div>
      )}
    </div>
  );
}