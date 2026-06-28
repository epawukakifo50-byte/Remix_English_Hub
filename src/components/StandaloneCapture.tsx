import React, { useState, useEffect, useRef } from 'react';
import { X, CheckSquare, Trash2 } from 'lucide-react';
import { addWord, fetchContexts } from '../api';
import { motion, AnimatePresence } from 'motion/react';
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Quick Capture';
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

  return (
    <div className="h-screen w-screen bg-transparent flex items-start justify-center pt-8 px-4 pb-4 font-mono selection:bg-neon selection:text-black overflow-auto m-0">
      
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div 
            key="success"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex flex-col items-center bg-neutral-900 border border-neutral-700 p-12 w-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-tl-3xl rounded-br-3xl relative mt-4"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-accent-blue to-accent-emerald"></div>
            <CheckSquare size={64} className="text-accent-emerald mb-6" />
            <h2 className="text-3xl font-bold text-white uppercase tracking-widest text-center">DATA_CAPTURED</h2>
            <p className="text-neutral-500 text-xs uppercase tracking-widest mt-2 text-center">SAFE TO TERMINATE CONNECTION</p>
          </motion.div>
        ) : (
          <motion.div 
            key="form"
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-neutral-900 border border-neutral-700 p-6 w-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-tl-3xl rounded-br-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-accent-blue to-accent-emerald"></div>

            <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
              <h2 className="text-xl font-bold text-neutral-100 uppercase tracking-widest">Init Capture</h2>
              <button onClick={() => window.close()} className="text-neutral-500 hover:text-neon hover:scale-110 transition p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm text-neutral-400 mb-1">Target Entity</label>
                {isIrregular ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      autoFocus
                      type="text" 
                      value={baseForm} 
                      onChange={e => setBaseForm(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-neon focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase font-bold rounded-tl-xl rounded-br-xl transition-all"
                      placeholder="V1 (PRESENT)"
                      required
                    />
                    <input 
                      type="text" 
                      value={pastForm} 
                      onChange={e => setPastForm(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-neon focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase font-bold rounded-tl-xl rounded-br-xl transition-all"
                      placeholder="V2 (PAST)"
                      required
                    />
                    <input 
                      type="text" 
                      value={participleForm} 
                      onChange={e => setParticipleForm(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-neon focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase font-bold rounded-tl-xl rounded-br-xl transition-all"
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
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-neon focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none uppercase font-bold rounded-tl-xl rounded-br-xl transition-all"
                    placeholder="E.G. OBFUSCATE"
                    required
                  />
                )}
              </div>
              
              <div>
                <label className="block text-xs text-neutral-500 mb-1 tracking-wider uppercase">Translation Data</label>
                {isIrregular ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      value={baseTrans} 
                      onChange={e => setBaseTrans(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                      placeholder="V1 Trans"
                    />
                    <input 
                      type="text" 
                      value={pastTrans} 
                      onChange={e => setPastTrans(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                      placeholder="V2 Trans"
                    />
                    <input 
                      type="text" 
                      value={participleTrans} 
                      onChange={e => setParticipleTrans(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                      placeholder="V3 Trans"
                    />
                  </div>
                ) : (
                  <input 
                    type="text" 
                    value={translation} 
                    onChange={e => setTranslation(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
                    placeholder="Enter translation"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-xs text-neutral-500 mb-1 tracking-wider uppercase">Context Link</label>
                <ComboBox
                  options={contexts}
                  value={source}
                  onChange={setSource}
                  placeholder="Select or type context"
                  inputClassName="py-2.5"
                />
              </div>
              
              <div>
                <label className="block text-xs text-neutral-500 mb-1 tracking-wider uppercase">Notes Log</label>
                <textarea 
                  value={content} 
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 px-4 py-2.5 text-neutral-300 focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald focus:outline-none h-24 resize-none rounded-tl-xl rounded-br-xl transition-all"
                  placeholder="Add logs..."
                />
              </div>
              
              <div className="pt-4 border-t border-neutral-800">
                <button 
                  type="submit" 
                  disabled={isSubmitting || (!isIrregular && !word) || (isIrregular && (!baseForm || !pastForm || !participleForm))}
                  className="w-full bg-neutral-800 text-neutral-100 font-bold uppercase tracking-widest py-3 hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-neutral-800 disabled:hover:text-neutral-100 disabled:hover:scale-100 rounded-tl-2xl rounded-br-2xl border border-neutral-700 hover:border-transparent"
                >
                  {isSubmitting ? 'PROCESSING...' : 'COMMIT DATA'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
