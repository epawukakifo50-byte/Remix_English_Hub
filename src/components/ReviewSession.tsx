import React, { useState } from 'react';
import { Word } from '../types';
import { updateWordFull } from '../api';
import { CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Props {
  words: Word[];
  onComplete: () => void;
}

export function ReviewSession({ words, onComplete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Simple logic to pick words that are learning or mastering
  const [reviewQueue] = useState(() => {
    return words.filter(w => w.status === 'learning' || w.status === 'mastering').sort(() => Math.random() - 0.5);
  });

  if (reviewQueue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 font-mono">
        <CheckSquare size={48} className="text-neon" />
        <h2 className="text-2xl font-bold text-neon uppercase tracking-widest">QUEUE_EMPTY</h2>
        <p className="text-neutral-500 text-xs tracking-widest uppercase">No pending review operations</p>
      </div>
    );
  }

  if (currentIndex >= reviewQueue.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 font-mono">
        <CheckSquare size={48} className="text-neon" />
        <h2 className="text-2xl font-bold text-neon uppercase tracking-widest">CYCLE_COMPLETE</h2>
        <button onClick={onComplete} className="border border-neon text-neon px-8 py-3 uppercase tracking-widest font-bold hover:bg-neon hover:text-black transition">
          RETURN_TO_HUB
        </button>
      </div>
    );
  }

  const currentWord = reviewQueue[currentIndex];

  const handleRate = async (rating: 'again' | 'hard' | 'good' | 'easy') => {
    // In a real app, calculate SM-2 nextReview date here.
    // For now, just advance the queue.
    try {
      // Mock update to trigger last reviewed date update
      await updateWordFull(currentWord.id, { data: { lastReviewed: new Date().toISOString() } });
    } catch (e) {}

    setShowAnswer(false);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 flex flex-col items-center font-mono">
      <div className="text-[10px] tracking-widest text-neutral-500 mb-8 uppercase flex items-center gap-4">
        <span className="w-12 h-px bg-neutral-800"></span>
        SEQ: {currentIndex + 1} / {reviewQueue.length}
        <span className="w-12 h-px bg-neutral-800"></span>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 w-full p-12 text-center relative mb-8 min-h-[300px] flex flex-col justify-center rounded-tl-3xl rounded-br-3xl overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-neon to-accent-emerald opacity-50"></div>
        
        {currentWord.source && (
          <div className="absolute top-6 right-6 text-[10px] bg-neon text-black px-2 py-0.5 font-bold uppercase tracking-widest rounded-tl-lg rounded-br-lg">
            {currentWord.source}
          </div>
        )}
        {currentWord.isIrregularVerb ? (
          <div className={cn("text-left mx-auto mb-6", showAnswer ? "w-full max-w-3xl flex flex-col gap-6" : "flex flex-col gap-4")}>
            <div className={cn("flex items-center", showAnswer ? "justify-between" : "gap-4")}>
              <div className={cn("flex items-center gap-4", showAnswer ? "w-1/2 pr-6 border-r border-neutral-800/50" : "")}>
                <span className="text-neutral-500 font-normal text-xl min-w-[30px]">V1</span> 
                <span className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">{(currentWord.word.split(' | ').length > 1 ? currentWord.word.split(' | ') : currentWord.word.split(' - '))[0] || ''}</span>
              </div>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-1/2 pl-6 text-2xl md:text-3xl text-neon font-bold uppercase tracking-widest break-words">
                  {(currentWord.translation?.split(' | ').length > 1 ? currentWord.translation.split(' | ') : currentWord.translation?.split(' - ') || [])[0] || '-'}
                </motion.div>
              )}
            </div>
            <div className={cn("flex items-center", showAnswer ? "justify-between" : "gap-4")}>
              <div className={cn("flex items-center gap-4", showAnswer ? "w-1/2 pr-6 border-r border-neutral-800/50" : "")}>
                <span className="text-neutral-500 font-normal text-xl min-w-[30px]">V2</span> 
                <span className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">{(currentWord.word.split(' | ').length > 1 ? currentWord.word.split(' | ') : currentWord.word.split(' - '))[1] || ''}</span>
              </div>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-1/2 pl-6 text-2xl md:text-3xl text-neon font-bold uppercase tracking-widest break-words">
                  {(currentWord.translation?.split(' | ').length > 1 ? currentWord.translation.split(' | ') : currentWord.translation?.split(' - ') || [])[1] || '-'}
                </motion.div>
              )}
            </div>
            <div className={cn("flex items-center", showAnswer ? "justify-between" : "gap-4")}>
              <div className={cn("flex items-center gap-4", showAnswer ? "w-1/2 pr-6 border-r border-neutral-800/50" : "")}>
                <span className="text-neutral-500 font-normal text-xl min-w-[30px]">V3</span> 
                <span className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">{(currentWord.word.split(' | ').length > 1 ? currentWord.word.split(' | ') : currentWord.word.split(' - '))[2] || ''}</span>
              </div>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-1/2 pl-6 text-2xl md:text-3xl text-neon font-bold uppercase tracking-widest break-words">
                  {(currentWord.translation?.split(' | ').length > 1 ? currentWord.translation.split(' | ') : currentWord.translation?.split(' - ') || [])[2] || '-'}
                </motion.div>
              )}
            </div>
          </div>
        ) : (
          <div className={cn("mx-auto", showAnswer ? "w-full max-w-3xl flex items-center justify-between gap-8 mb-6" : "mb-6")}>
            <div className={cn("flex-1", showAnswer ? "text-right pr-8 border-r border-neutral-800/50" : "")}>
              <h2 className={cn("font-bold text-white uppercase tracking-wider", showAnswer ? "text-4xl md:text-5xl" : "text-5xl")}>
                {currentWord.word}
              </h2>
            </div>
            {showAnswer && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex-1 text-left pl-8 text-3xl md:text-4xl text-neon font-bold uppercase tracking-widest break-words">
                {currentWord.translation}
              </motion.div>
            )}
          </div>
        )}
        
        {showAnswer ? (
          <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)', y: 10 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {currentWord.content && (
              <div className="text-neutral-400 text-xs uppercase tracking-wider mt-4 border-l-2 border-neon pl-4 text-left max-w-3xl mx-auto">
                {currentWord.content}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-neutral-600 uppercase tracking-widest text-xs animate-pulse">[ AWAITING_DECRYPTION ]</div>
        )}
      </div>

      {!showAnswer ? (
        <button 
          onClick={() => setShowAnswer(true)}
          className="w-full max-w-sm border border-neon text-neon uppercase font-bold tracking-widest py-4 hover:bg-neon hover:text-black transition-all hover:scale-[1.02] active:scale-95 rounded-tl-2xl rounded-br-2xl"
        >
          DECRYPT_DATA
        </button>
      ) : (
        <div className="grid grid-cols-4 gap-4 w-full">
          <button onClick={() => handleRate('again')} className="border border-neutral-700 hover:border-red-500 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 py-4 uppercase font-bold tracking-widest transition-all group rounded-tl-2xl rounded-br-2xl hover:scale-[1.02] active:scale-95">
            AGAIN <span className="block text-[10px] mt-1 opacity-50 group-hover:opacity-100">1m</span>
          </button>
          <button onClick={() => handleRate('hard')} className="border border-neutral-700 hover:border-accent-amber text-neutral-400 hover:text-accent-amber hover:bg-accent-amber/10 py-4 uppercase font-bold tracking-widest transition-all group rounded-tl-2xl rounded-br-2xl hover:scale-[1.02] active:scale-95">
            HARD <span className="block text-[10px] mt-1 opacity-50 group-hover:opacity-100">1d</span>
          </button>
          <button onClick={() => handleRate('good')} className="border border-neutral-700 hover:border-accent-blue text-neutral-400 hover:text-accent-blue hover:bg-accent-blue/10 py-4 uppercase font-bold tracking-widest transition-all group rounded-tl-2xl rounded-br-2xl hover:scale-[1.02] active:scale-95">
            GOOD <span className="block text-[10px] mt-1 opacity-50 group-hover:opacity-100">3d</span>
          </button>
          <button onClick={() => handleRate('easy')} className="border border-neutral-700 hover:border-accent-emerald text-neutral-400 hover:text-accent-emerald hover:bg-accent-emerald/10 py-4 uppercase font-bold tracking-widest transition-all group rounded-tl-2xl rounded-br-2xl hover:scale-[1.02] active:scale-95">
            EASY <span className="block text-[10px] mt-1 opacity-50 group-hover:opacity-100">4d</span>
          </button>
        </div>
      )}
    </div>
  );
}
