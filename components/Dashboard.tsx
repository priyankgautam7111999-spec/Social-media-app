import React, { useState } from 'react';
import { User, SynergyMatch } from '../types';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Heart, Search } from 'lucide-react';
import { findSynergy } from '../services/geminiService';
import { MOCK_NETWORK } from '../constants';

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const [synergyQuery, setSynergyQuery] = useState('');
    const [matches, setMatches] = useState<SynergyMatch[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Mock wellbeing data
    const data = [
        { day: 'M', score: 65 },
        { day: 'T', score: 72 },
        { day: 'W', score: 68 },
        { day: 'T', score: 85 },
        { day: 'F', score: 92 },
        { day: 'S', score: 88 },
        { day: 'S', score: 95 },
    ];

    const handleSynergySearch = async () => {
        setIsSearching(true);
        const results = await findSynergy(synergyQuery, MOCK_NETWORK);
        setMatches(results);
        setIsSearching(false);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Wellness Score */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-display text-emerald-300 flex items-center gap-2">
                        <Heart className="w-5 h-5" /> Digital Well-being
                    </h3>
                    <span className="text-3xl font-bold text-white">92<span className="text-sm text-slate-400 font-normal">/100</span></span>
                </div>
                <div className="flex-1 min-h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#6ee7b7' }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm text-slate-400 mt-4 text-center italic">
                    "Your interactions this week have been 92% positive. Great job maintaining harmony."
                </p>
            </div>

            {/* Synergy Finder */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col">
                <h3 className="text-xl font-display text-purple-300 flex items-center gap-2 mb-4">
                    <Zap className="w-5 h-5" /> Synergy Finder
                </h3>
                <div className="mb-4">
                    <label className="text-xs text-slate-400 mb-1 block">Project / Skill Need</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
                            placeholder="e.g. Need Python Dev for AI..."
                            value={synergyQuery}
                            onChange={(e) => setSynergyQuery(e.target.value)}
                        />
                        <button 
                            onClick={handleSynergySearch} 
                            disabled={isSearching}
                            className="p-2 bg-purple-600 rounded-lg text-white hover:bg-purple-500 disabled:opacity-50"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3">
                    {isSearching ? (
                        <div className="text-center text-slate-500 py-4 animate-pulse">Scanning Neural Network...</div>
                    ) : matches.length > 0 ? (
                        matches.map((m, idx) => (
                            <div key={idx} className="p-3 bg-slate-800/50 rounded-xl border border-white/5 hover:border-purple-500/30 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={m.user.avatar} className="w-8 h-8 rounded-full" />
                                    <span className="font-bold text-sm text-white">{m.user.name}</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-snug">{m.reason}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-600 text-xs py-10">
                            Describe a need to find collaborators in your cluster.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;