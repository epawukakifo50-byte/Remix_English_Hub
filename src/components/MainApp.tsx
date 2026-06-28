import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { fetchWords } from '../api';
import { WordModal } from './WordModal';
import { KanbanBoard } from './KanbanBoard';
import { Dashboard } from './Dashboard';
import { ReviewSession } from './ReviewSession';
import { SettingsView } from './SettingsView';
import { Terminal, Activity, Crosshair, Plus, Settings as SettingsIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function MainApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kanban' | 'review' | 'settings'>('dashboard');
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [words, setWords] = useState<Word[]>([]);

  const loadWords = () => {
    fetchWords().then(setWords).catch(console.error);
  };

  useEffect(() => {
    loadWords();
  }, []);

  const openAddModal = () => {
    setEditingWord(null);
    setIsWordModalOpen(true);
  };

  const openEditModal = (word: Word) => {
    setEditingWord(word);
    setIsWordModalOpen(true);
  };

  // Keyboard shortcut for Quick Add (Alt+A or Alt+C)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'c')) {
        e.preventDefault();
        openAddModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-neutral-200 flex font-mono selection:bg-neon selection:text-black">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-800 bg-neutral-900/60 flex flex-col relative backdrop-blur-md">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-blue to-neon opacity-50"></div>
        
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-xl font-bold text-neutral-100 tracking-widest uppercase flex flex-col gap-1">
            <span className="text-[10px] text-neon flex items-center gap-2">
              <Terminal size={12} />
              ENG_HUB v2.0
            </span>
            SYSTEM.TERMINAL
          </h1>
        </div>

        <nav className="space-y-1 p-4 flex-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-tl-xl rounded-br-xl",
              activeTab === 'dashboard' ? "bg-neutral-800/80 text-neon border border-neutral-700 shadow-sm" : "text-neutral-400 hover:text-neon hover:bg-neutral-800/40 border border-transparent"
            )}
          >
            <Terminal size={14} />
            DASHBOARD
          </button>
          <button 
            onClick={() => setActiveTab('kanban')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-tl-xl rounded-br-xl mt-1",
              activeTab === 'kanban' ? "bg-neutral-800/80 text-accent-blue border border-neutral-700 shadow-sm" : "text-neutral-400 hover:text-accent-blue hover:bg-neutral-800/40 border border-transparent"
            )}
          >
            <Activity size={14} />
            KANBAN_FLOW
          </button>
          <button 
            onClick={() => setActiveTab('review')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-tl-xl rounded-br-xl mt-1",
              activeTab === 'review' ? "bg-neutral-800/80 text-accent-amber border border-neutral-700 shadow-sm" : "text-neutral-400 hover:text-accent-amber hover:bg-neutral-800/40 border border-transparent"
            )}
          >
            <Crosshair size={14} />
            EVAL_SESSION
          </button>
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-4">
          <button 
            onClick={openAddModal}
            className="w-full flex items-center justify-center gap-2 bg-neutral-800 text-neutral-200 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 transition-all rounded-tl-2xl rounded-br-2xl border border-neutral-700 hover:border-transparent"
          >
            <Plus size={16} />
            INIT_CAPTURE
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all rounded-tl-xl rounded-br-xl",
              activeTab === 'settings' ? "bg-neutral-800/80 text-accent-emerald border border-neutral-700 shadow-sm" : "text-neutral-400 hover:text-accent-emerald hover:bg-neutral-800/40 border border-transparent"
            )}
          >
            <SettingsIcon size={14} />
            SYS_CONFIG
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Dashboard words={words} onEditWord={openEditModal} />
            </motion.div>
          )}
          {activeTab === 'kanban' && (
            <motion.div 
              key="kanban"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col w-full"
            >
              <div className="mb-8 border-b border-neutral-800 pb-4">
                <h1 className="text-3xl font-bold text-neon tracking-widest uppercase">SYS.OP // KANBAN</h1>
                <p className="text-neutral-500 mt-2 text-xs uppercase tracking-widest">DRAG AND DROP ENTITIES TO UPDATE STATE</p>
              </div>
              <KanbanBoard words={words} onRefresh={loadWords} onEditWord={openEditModal} />
            </motion.div>
          )}
          {activeTab === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full"
            >
              <ReviewSession words={words} onComplete={() => setActiveTab('dashboard')} />
            </motion.div>
          )}
          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SettingsView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isWordModalOpen && (
          <WordModal 
            isOpen={isWordModalOpen} 
            onClose={() => setIsWordModalOpen(false)} 
            onSaved={loadWords}
            editingWord={editingWord}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
