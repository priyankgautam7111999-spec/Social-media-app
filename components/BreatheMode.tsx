import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

interface BreatheModeProps {
  isActive: boolean;
  onDismiss: () => void;
}

const BreatheMode: React.FC<BreatheModeProps> = ({ isActive, onDismiss }) => {
  const [step, setStep] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
        setStep(prev => (prev + 1) % 3);
    }, 4000); // 4 second cadence
    return () => clearInterval(interval);
  }, [isActive]);

  const getText = () => {
      if (step === 0) return "Inhale...";
      if (step === 1) return "Hold...";
      return "Exhale...";
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display text-cyan-200 mb-2">Mindful Engine Activated</h2>
            <p className="text-slate-400">You've been scrolling for a while. Let's reset.</p>
          </div>

          <motion.div
            animate={{
              scale: step === 0 ? 1.5 : step === 1 ? 1.5 : 1,
              opacity: step === 1 ? 0.8 : 1,
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-48 h-48 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur-2xl flex items-center justify-center"
          >
             <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                <Wind className="w-12 h-12 text-white" />
             </div>
          </motion.div>

          <h3 className="text-4xl font-light text-white mt-12 font-display min-w-[200px] text-center">
            {getText()}
          </h3>

          <button
            onClick={onDismiss}
            className="mt-16 px-8 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-sm uppercase tracking-widest"
          >
            I'm Ready to Continue
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BreatheMode;