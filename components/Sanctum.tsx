import React from 'react';
import { User, Post } from '../types';
import { motion } from 'framer-motion';

interface SanctumProps {
  user: User;
  posts: Post[];
  onClose: () => void;
}

const Sanctum: React.FC<SanctumProps> = ({ user, posts, onClose }) => {
  return (
    <div className="fixed inset-0 z-40 bg-black text-white overflow-hidden perspective-1000">
      <div className="absolute top-8 left-8 z-50">
        <button onClick={onClose} className="text-white/70 hover:text-white uppercase tracking-widest text-sm border-b border-transparent hover:border-white transition-all">
          ← Exit Sanctum
        </button>
      </div>
      
      {/* 3D Scene Container */}
      <div className="w-full h-full flex items-center justify-center relative preserve-3d">
        {/* Floor */}
        <div className="absolute w-[200vw] h-[200vh] bg-gradient-to-t from-purple-900/20 to-transparent bottom-0 transform rotate-x-90 translate-y-[50vh] grid-floor" />

        {/* User Hologram Center */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center justify-center z-10"
        >
            <div className="relative">
                <div className="w-48 h-48 rounded-full border-2 border-cyan-500/50 p-1 shadow-[0_0_50px_rgba(6,182,212,0.5)]">
                     <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
                </div>
                {/* Holographic Rings */}
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-300/30 animate-[spin_10s_linear_infinite]" />
                <div className="absolute -inset-4 rounded-full border border-dotted border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]" />
            </div>
            <h1 className="mt-8 text-5xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                {user.name}
            </h1>
            <p className="text-slate-400 font-light tracking-widest mt-2">{user.handle}</p>
            <div className="flex gap-2 mt-4">
                {user.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-cyan-200">
                        {skill}
                    </span>
                ))}
            </div>
        </motion.div>

        {/* Floating Memory Orbs (Posts) */}
        {posts.slice(0, 5).map((post, i) => {
             // Calculate random positions around the user
             const angle = (i / 5) * Math.PI * 2;
             const x = Math.cos(angle) * 350;
             const y = Math.sin(angle) * 200;
             
             return (
                 <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 0, y: 0 }}
                    animate={{ opacity: 1, x, y: y - 50 }}
                    transition={{ delay: i * 0.2, duration: 1.5, type: 'spring' }}
                    className="absolute w-48 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform"
                    style={{ transformStyle: 'preserve-3d' }}
                 >
                     <div className="text-[10px] text-cyan-400 mb-2 uppercase tracking-wider">{post.timestamp.toLocaleDateString()}</div>
                     <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">"{post.content}"</p>
                 </motion.div>
             )
        })}
      </div>
    </div>
  );
};

export default Sanctum;