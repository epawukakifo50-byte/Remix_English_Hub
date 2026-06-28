import React, { useState, useEffect } from 'react';
import { Word } from '../types';
import { X, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { addWord, updateWordFull, fetchContexts, deleteWord } from '../api';
import { ComboBox } from './ComboBox';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editingWord?: Word | null;
}

export function WordModal({ isOpen, onClose, onSaved, editingWord }: Props) {
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchContexts().then(setContexts);
      if (editingWord) {
        setIsIrregular(!!editingWord.isIrregularVerb);
        if (editingWord.isIrregularVerb) {
          const parts = (editingWord.word || '').split(' | ');
          if (parts.length === 1 && editingWord.word?.includes(' - ')) {
            const oldParts = (editingWord.word || '').split(' - ');
            setBaseForm(oldParts[0] || '');
            setPastForm(oldParts[1] || '');
            setParticipleForm(oldParts[2] || '');
          } else {
            setBaseForm(parts[0] || '');
            setPastForm(parts[1] || '');
            setParticipleForm(parts[2] || '');
          }
          
          const transParts = (editingWord.translation || '').split(' | ');
          if (transParts.length === 1 && editingWord.translation?.includes(' - ')) {
            const oldTransParts = (editingWord.translation || '').split(' - ');
            setBaseTrans(oldTransParts[0] || '');
            setPastTrans(oldTransParts[1] || '');
            setParticipleTrans(oldTransParts[2] || '');
          } else {
            setBaseTrans(transParts[0] || '');
            setPastTrans(transParts[1] || '');
            setParticipleTrans(transParts[2] || '');
          }
          
          setWord('');
          setTranslation('');
        } else {
          setWord(editingWord.word || '');
          setBaseForm('');
          setPastForm('');
          setParticipleForm('');
          setTranslation(editingWord.translation || '');
          setBaseTrans('');
          setPastTrans('');
          setParticipleTrans('');
        }
        setSource(editingWord.source ? editingWord.source.replace(/^\[\[(.*)\]\]$/, '$1') : '');
        setContent(editingWord.content || '');
      } else {
        setWord('');
        setIsIrregular(false);
        setBaseForm('');
        setPastForm('');
        setParticipleForm('');
        setTranslation('');
        setBaseTrans('');
        setPastTrans('');
        setParticipleTrans('');
        setSource('');
        setContent('');
      }
    }
  }, [isOpen, editingWord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalWord = isIrregular ? [baseForm, pastForm, participleForm].map(s => s.trim()).filter(Boolean).join(' | ') : word;
    const finalTrans = isIrregular ? [baseTrans, pastTrans, participleTrans].map(s => s.trim()).join(' | ') : translation;
    const formattedSource = source.trim() ? (source.trim().startsWith('[[') ? source.trim() : `[[${source.trim()}]]`) : "";
    if (!finalWord) return;
    
    setIsSubmitting(true);
    try {
      if (editingWord) {
        await updateWordFull(editingWord.id, {
          data: { word: finalWord, translation: finalTrans, source: formattedSource, isIrregularVerb: isIrregular },
          content
        });
      } else {
        await addWord({ word: finalWord, translation: finalTrans, source: formattedSource, content, status: 'inbox', isIrregularVerb: isIrregular });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editingWord) return;
    setIsSubmitting(true);
    try {
      await deleteWord(editingWord.id);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-mono backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-neutral-900 border border-neutral-700 p-6 w-full max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-tl-3xl rounded-br-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon via-accent-blue to-accent-emerald"></div>

        <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
          <h2 className="text-xl font-bold text-neutral-100 uppercase tracking-widest">{editingWord ? 'Edit Data' : 'Init Capture'}</h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neon hover:scale-110 transition p-1">
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
          <div className="pt-4 border-t border-neutral-800 flex gap-3">
            {showDeleteConfirm ? (
              <>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 bg-red-500 text-white font-bold uppercase tracking-widest py-3 hover:bg-red-600 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 rounded-tl-2xl rounded-br-2xl"
                >
                  CONFIRM DELETE
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-neutral-800 text-white font-bold uppercase tracking-widest py-3 hover:bg-neutral-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 rounded-tl-2xl rounded-br-2xl border border-neutral-700"
                >
                  CANCEL
                </button>
              </>
            ) : (
              <>
                {editingWord && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                    className="bg-neutral-950 text-red-500 font-bold uppercase tracking-widest px-4 py-3 hover:bg-red-500 hover:text-white hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 rounded-tl-2xl rounded-br-2xl border border-neutral-800 hover:border-transparent flex items-center justify-center"
                    title="Delete Word"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                <button 
                   type="submit" 
                   disabled={isSubmitting || (!isIrregular && !word) || (isIrregular && (!baseForm || !pastForm || !participleForm))}
                   className="flex-1 bg-neutral-800 text-neutral-100 font-bold uppercase tracking-widest py-3 hover:bg-neon hover:text-black hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:bg-neutral-800 disabled:hover:text-neutral-100 disabled:hover:scale-100 rounded-tl-2xl rounded-br-2xl border border-neutral-700 hover:border-transparent"
                >
                  {isSubmitting ? 'PROCESSING...' : (editingWord ? 'COMMIT CHANGES' : 'COMMIT DATA')}
                </button>
              </>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
