import React, { useState, useEffect } from 'react';
import { MOCK_POSTS, MOCK_USER, GOALS } from './constants';
import { Post, Goal } from './types';
import { filterFeedByGoal } from './services/geminiService';
import LiquidFeed from './components/LiquidFeed';
import BreatheMode from './components/BreatheMode';
import EmpathyGuardian from './components/EmpathyGuardian';
import Sanctum from './components/Sanctum';
import Dashboard from './components/Dashboard';
import { LayoutGrid, User as UserIcon, Activity, Hexagon } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'sanctum' | 'dashboard'>('feed');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(MOCK_POSTS);
  const [activeGoal, setActiveGoal] = useState<Goal | null>(null);
  const [timeActive, setTimeActive] = useState(0);
  const [breatheActive, setBreatheActive] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Mindful Engine Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeActive(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger Breathe Mode after "20 mins" (simulated as 30s for demo)
  useEffect(() => {
    if (timeActive > 30 && timeActive % 31 === 0 && !breatheActive) {
      setBreatheActive(true);
    }
  }, [timeActive, breatheActive]);

  // Handle Goal Change
  const handleGoalSelect = async (goalId: string) => {
    const goal = GOALS.find(g => g.id === goalId);
    if (!goal) return;
    setActiveGoal(goal);

    // Filter Logic
    const matchingIds = await filterFeedByGoal(posts, goal);
    const filtered = posts.filter(p => matchingIds.includes(p.id));
    setFilteredPosts(filtered.length > 0 ? filtered : posts); // Fallback if filter too aggressive
  };

  const handlePost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: MOCK_USER,
      content: content,
      type: 'TEXT' as any,
      timestamp: new Date(),
      relatedTopics: [],
      truthScore: 100 // Self-verified for now
    };
    setPosts([newPost, ...posts]);
    setFilteredPosts([newPost, ...filteredPosts]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-30 h-16 glass-panel flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Hexagon className="text-cyan-400 w-8 h-8 fill-cyan-400/20" />
          <span className="font-display text-2xl font-bold tracking-widest text-white">AETHERIA</span>
        </div>

        <div className="flex items-center gap-6">
            <button 
                onClick={() => setActiveTab('feed')}
                className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors ${activeTab === 'feed' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
                <LayoutGrid className="w-4 h-4" /> Feed
            </button>
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
                <Activity className="w-4 h-4" /> Wellness
            </button>
            <button 
                onClick={() => setActiveTab('sanctum')}
                className={`flex items-center gap-2 text-sm uppercase tracking-wider transition-colors ${activeTab === 'sanctum' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
                <UserIcon className="w-4 h-4" /> Sanctum
            </button>
        </div>

        <div className="flex items-center gap-4">
             <div className="text-right">
                 <div className="text-[10px] text-slate-400 uppercase">Karma</div>
                 <div className="font-display text-yellow-400">{MOCK_USER.karma.toLocaleString()}</div>
             </div>
             <img src={MOCK_USER.avatar} className="w-10 h-10 rounded-full border border-slate-600" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20 pb-10 px-4 h-screen flex flex-col">
          
          {/* Feed Controls */}
          {activeTab === 'feed' && (
              <div className="flex justify-center mb-6 z-20 relative">
                  <div className="bg-slate-800/80 rounded-full p-1 flex items-center shadow-lg border border-slate-700">
                      <span className="px-4 text-xs text-slate-400 uppercase font-bold">Intention:</span>
                      <select 
                        className="bg-transparent text-sm text-white focus:outline-none p-2 rounded-md cursor-pointer"
                        onChange={(e) => handleGoalSelect(e.target.value)}
                        defaultValue=""
                      >
                          <option value="" disabled>Select Goal...</option>
                          <option value="all">Unfiltered Flow</option>
                          {GOALS.map(g => (
                              <option key={g.id} value={g.id}>{g.label}</option>
                          ))}
                      </select>
                  </div>
              </div>
          )}

          {activeTab === 'feed' && (
              <div className="flex-1 relative flex flex-col gap-6 max-w-7xl mx-auto w-full">
                  <EmpathyGuardian onPost={handlePost} />
                  <div className="flex-1 min-h-0 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl">
                      <LiquidFeed posts={filteredPosts} onPostClick={setSelectedPost} />
                  </div>
              </div>
          )}

          {activeTab === 'dashboard' && (
               <div className="max-w-7xl mx-auto w-full h-[calc(100vh-140px)]">
                   <Dashboard user={MOCK_USER} />
               </div>
          )}
      </main>

      {/* Overlays */}
      <BreatheMode isActive={breatheActive} onDismiss={() => { setBreatheActive(false); setTimeActive(0); }} />
      
      {activeTab === 'sanctum' && (
          <Sanctum user={MOCK_USER} posts={posts} onClose={() => setActiveTab('feed')} />
      )}
      
      {/* Post Detail Modal (Simple) */}
      {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPost(null)}>
              <div className="bg-slate-900 border border-slate-700 p-8 max-w-lg w-full rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                  <h2 className="text-xl font-display text-cyan-400 mb-4">{selectedPost.author.name}</h2>
                  <p className="text-slate-300 leading-relaxed text-lg mb-6">{selectedPost.content}</p>
                  <div className="flex justify-between items-center text-sm text-slate-500">
                      <span>Truth Score: <span className={selectedPost.truthScore && selectedPost.truthScore > 90 ? "text-emerald-400" : "text-red-400"}>{selectedPost.truthScore}%</span></span>
                      <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full">Give Karma</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;