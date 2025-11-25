import React, { useState } from 'react';
import { Send, ShieldCheck, BrainCircuit, AlertOctagon } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';
import { EmpathyAnalysis } from '../types';

interface EmpathyGuardianProps {
  onPost: (content: string) => void;
}

const EmpathyGuardian: React.FC<EmpathyGuardianProps> = ({ onPost }) => {
  const [draft, setDraft] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<EmpathyAnalysis | null>(null);

  const handleSubmit = async () => {
    if (!draft.trim()) return;

    setIsAnalyzing(true);
    const result = await analyzeSentiment(draft);
    setIsAnalyzing(false);

    if (result.isToxic || result.score < 50) {
      setAnalysis(result);
    } else {
      // Safe to post directly
      onPost(draft);
      setDraft('');
      setAnalysis(null);
    }
  };

  const confirmPost = () => {
      onPost(draft);
      setDraft('');
      setAnalysis(null);
  };

  const useRewrite = () => {
      if (analysis?.constructiveRewrite) {
          setDraft(analysis.constructiveRewrite);
          setAnalysis(null); // Clear warning, user accepted rewrite
      }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 p-4 glass-panel rounded-2xl relative">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-purple-500/20">
             <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
            <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Share a thought (Thought-to-Text active...)"
                className="w-full bg-transparent border-none text-lg text-white placeholder-slate-500 focus:ring-0 resize-none h-24"
            />
            
            <div className="flex justify-between items-center mt-2 border-t border-slate-700/50 pt-3">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Guardian Active</span>
                </div>
                <button 
                    onClick={handleSubmit}
                    disabled={isAnalyzing || !draft}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all disabled:opacity-50"
                >
                    {isAnalyzing ? 'Analyzing...' : <>Post <Send className="w-4 h-4" /></>}
                </button>
            </div>
        </div>
      </div>

      {/* Intervention Modal / Popup */}
      {analysis && (
          <div className="absolute top-full left-0 right-0 mt-4 p-6 bg-slate-900 border border-red-500/30 rounded-xl shadow-2xl z-20">
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertOctagon className="w-8 h-8 text-red-500" />
                  </div>
                  <div className="flex-1">
                      <h4 className="text-lg font-bold text-red-400 mb-2">Guardian Intervention</h4>
                      <p className="text-slate-300 mb-4">
                          "Are you sure this is the mark you want to leave?"
                      </p>
                      
                      <div className="bg-slate-800 p-4 rounded-lg mb-4 border-l-4 border-amber-500">
                          <h5 className="text-xs uppercase text-amber-500 font-bold mb-1">Future Echo</h5>
                          <p className="text-sm text-slate-300 italic">
                             {analysis.consequencePrediction}
                          </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                            onClick={useRewrite}
                            className="flex-1 px-4 py-3 bg-emerald-600/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-600/30 text-sm text-left"
                        >
                            <strong>Try Constructive Rewrite:</strong><br/>
                            "{analysis.constructiveRewrite}"
                        </button>
                        <div className="flex flex-col gap-2">
                             <button 
                                onClick={() => setAnalysis(null)} 
                                className="px-4 py-2 text-slate-400 hover:text-white text-sm"
                             >
                                Edit Myself
                             </button>
                             <button 
                                onClick={confirmPost}
                                className="px-4 py-2 text-red-400 hover:text-red-300 text-xs opacity-60 hover:opacity-100"
                             >
                                Post Anyway (Affects Karma)
                             </button>
                        </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default EmpathyGuardian;