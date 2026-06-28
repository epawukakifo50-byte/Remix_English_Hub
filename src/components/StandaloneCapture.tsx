import React, { useState, useEffect } from 'react';
import { Terminal, X, CheckSquare } from 'lucide-react';
import { addWord, fetchContexts } from '../api';
import { motion } from 'motion/react';
import { ComboBox } from './ComboBox';

export function StandaloneCapture() {
  const [word, setWord] = useState('');
  const [isIrregular, setIsIrregular] = useState(false);
  const [baseForm, setBaseForm] = useState('');
  const [pastForm, setPastForm] = useState('');
  const [participleForm, setParticipleForm] = useState('');
  const [baseTrans, setBaseTrans] = useState('');
  const [pastTrans, setPastTrans] = useState('');
  const [participleTrans, setParticipleTrans] = useState('');
  const [translation, setTranslation] = useState('');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const [contexts, setContexts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchContexts().then(setContexts);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalWord = isIrregular ? [baseForm, pastForm, participleForm].map(s => s.trim()).filter(Boolean).join(' | ') : word;
    const finalTrans = isIrregular ? [baseTrans, pastTrans, participleTrans].map(s => s.trim()).join(' | ') : translation;
    const formattedSource = source.trim() ? (source.trim().startsWith('[[') ? source.trim() : `[[${source.trim()}]]`) : "";
    if (!finalWord) return;
    
    setIsSubmitting(true);
    try {
      await addWord({ word: finalWord, translation: finalTrans, source: formattedSource, content, status: 'inbox', isIrregularVerb: isIrregular });
      setSuccess(true);
      setTimeout(() => {
        window.close(); // Only works if window was opened by script
        // Reset form just in case window.close() blocked
        setWord(''); setBaseForm(''); setPastForm(''); setParticipleForm(''); setIsIrregular(false);
        setTranslation(''); setBaseTrans(''); setPastTrans(''); setParticipleTrans('');
        setSource(''); setContent(''); setSuccess(false);
      }, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="h-screen w-screen bg-transparent flex flex-col items-center justify-center p-6 space-y-6 font-mono relative overflow-hidden">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
          <CheckSquare size={64} className="text-accent-emerald relative z-10 mb-6" />
          <h2 className="text-3xl font-bold text-white uppercase tracking-widest relative z-10">DATA_CAPTURED</h2>
          <p className="text-neutral-500 text-xs uppercase tracking-widest relative z-10 mt-2">SAFE TO TERMINATE CONNECTION</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-transparent p-6 flex flex-col font-mono selection:bg-neon selection:text-black relative overflow-hidden">
      
      <div className="relative z-10 flex justify-between items-center mb-6 border-b border-neutral-800 pb-4 max-w-xl mx-auto w-full pt-8">
        <h2 className="text-2xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
          <Terminal size={24} className="text-neon" /> [ INIT_CAPTURE ]
        </h2>
        <button onClick={() => window.close()} className="text-neutral-500 hover:text-neon transition hover:scale-110">
          <X size={24} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col relative z-10 max-w-xl mx-auto w-full bg-neutral-900/60 p-8 rounded-tl-3xl rounded-br-3xl border border-neutral-800 shadow-xl backdrop-blur-md">
        <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-neon to-transparent"></div>
        
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="checkbox" 
            id="isIrregular"
            checked={isIrregular}
            onChange={(e) => setIsIrregular(e.target.checked)}
            className="accent-neon w-4 h-4"
          />
          <label htmlFor="isIrregular" className="text-xs uppercase tracking-widest text-neutral-400 font-bold cursor-pointer">
            IRREGULAR VERB
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Target_Entity</label>
          {isIrregular ? (
            <div className="grid grid-cols-3 gap-2">
              <input 
                autoFocus
                type="text" 
                value={baseForm} 
                onChange={e => setBaseForm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neon font-bold focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V1 (PRESENT)"
                required
              />
              <input 
                type="text" 
                value={pastForm} 
                onChange={e => setPastForm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neon font-bold focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V2 (PAST)"
                required
              />
              <input 
                type="text" 
                value={participleForm} 
                onChange={e => setParticipleForm(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neon font-bold focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V3"
                required
              />
            </div>
          ) : (
            <input 
              autoFocus
              type="text" 
              value={word} 
              onChange={e => setWord(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neon font-bold focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase rounded-tl-xl rounded-br-xl transition-all"
              placeholder="E.G. OBFUSCATE"
              required
            />
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Translation_Hash</label>
          {isIrregular ? (
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                value={baseTrans} 
                onChange={e => setBaseTrans(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V1 Trans"
              />
              <input 
                type="text" 
                value={pastTrans} 
                onChange={e => setPastTrans(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V2 Trans"
              />
              <input 
                type="text" 
                value={participleTrans} 
                onChange={e => setParticipleTrans(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                placeholder="V3 Trans"
              />
            </div>
          ) : (
            <input 
              type="text" 
              value={translation} 
              onChange={e => setTranslation(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
            />
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Source_Reference</label>
          <ComboBox
            options={contexts}
            value={source}
            onChange={setSource}
            placeholder="Select or type source"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">Telemetry_Notes</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)}
            className="w-full flex-1 bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-300 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald focus:outline-none resize-none rounded-tl-xl rounded-br-xl transition-all min-h-[100px]"
          />
        </div>
        <div className="pt-6 border-t border-neutral-800 mt-auto">
          <button 
            type="submit" 
            disabled={isSubmitting || (!isIrregular && !word) || (isIrregular && (!baseForm || !pastForm || !participleForm))}
            className="w-full bg-neutral-800 text-neutral-200 font-bold uppercase tracking-widest py-4 border border-neutral-700 hover:border-transparent hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-neutral-800 disabled:hover:text-neutral-200 disabled:hover:scale-100 disabled:hover:border-neutral-700 rounded-tl-2xl rounded-br-2xl shadow-md"
          >
            {isSubmitting ? 'PROCESSING...' : 'TRANSMIT_TO_HUB'}
          </button>
        </div>
      </form>
    </div>
  );
}
