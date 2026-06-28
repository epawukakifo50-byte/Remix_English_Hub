import React, { useState } from 'react';
import { Word } from '../types';
import { Crosshair, Inbox, Cpu, CheckSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  words: Word[];
  onEditWord: (w: Word) => void;
}

export function Dashboard({ words, onEditWord }: Props) {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  
  const learnedThisMonth = words.filter(w => w.status === 'mastering' && w.created && w.created.startsWith(currentMonthStr)).length;
  const totalInbox = words.filter(w => w.status === 'inbox').length;
  const totalLearning = words.filter(w => w.status === 'learning').length;
  const totalMastering = words.filter(w => w.status === 'mastering').length;

  const toggleFilter = (status: string) => {
    setFilterStatus(prev => prev === status ? null : status);
  };

  const displayWords = filterStatus 
    ? words.filter(w => w.status === filterStatus) 
    : words;

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono">
      <div className="flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-neon tracking-widest uppercase mb-2">SYS.HUB // ENGLISH</h1>
          <div className="text-neutral-500 text-xs flex gap-4">
            <span>COORD: 34.0522° N, 118.2437° W</span>
            <span>FREQ: 144.00 MHz</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neon p-6 relative rounded-tl-2xl rounded-br-2xl shadow-[0_5px_20px_rgba(0,230,118,0.05)] overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-1 bg-neon opacity-50"></div>
          <div className="absolute top-0 right-0 p-3 text-neon opacity-50"><Crosshair size={16} /></div>
          <div className="text-neon mb-2 uppercase text-[10px] tracking-widest font-bold">Mastered_Log</div>
          <div className="text-4xl font-bold text-white mb-1">{learnedThisMonth.toString().padStart(2, '0')}</div>
          <div className="text-neutral-500 text-[10px] uppercase tracking-widest border-t border-neutral-800 pt-2 mt-2">Current Cycle</div>
        </div>
        
        <div 
          onClick={() => toggleFilter('inbox')}
          className={cn("p-6 cursor-pointer transition-all duration-300 relative group rounded-tl-2xl rounded-br-2xl overflow-hidden shadow-sm hover:scale-[1.02]", filterStatus === 'inbox' ? "bg-neutral-950 border-accent-blue border shadow-[0_0_15px_rgba(0,210,255,0.15)]" : "bg-neutral-900/50 border border-neutral-800 hover:border-accent-blue")}
        >
          <div className="absolute top-0 left-0 w-8 h-1 bg-accent-blue opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <div className="absolute top-0 right-0 p-3 text-neutral-600 group-hover:text-accent-blue transition-colors"><Inbox size={16} /></div>
          <div className="text-neutral-500 mb-2 uppercase text-[10px] tracking-widest group-hover:text-accent-blue transition-colors font-bold">Inbox_Queue</div>
          <div className="text-3xl font-bold text-neutral-300 mb-1 group-hover:text-white transition-colors">{totalInbox.toString().padStart(2, '0')}</div>
        </div>

        <div 
          onClick={() => toggleFilter('learning')}
          className={cn("p-6 cursor-pointer transition-all duration-300 relative group rounded-tl-2xl rounded-br-2xl overflow-hidden shadow-sm hover:scale-[1.02]", filterStatus === 'learning' ? "bg-neutral-950 border-accent-amber border shadow-[0_0_15px_rgba(255,179,0,0.15)]" : "bg-neutral-900/50 border border-neutral-800 hover:border-accent-amber")}
        >
          <div className="absolute top-0 left-0 w-8 h-1 bg-accent-amber opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <div className="absolute top-0 right-0 p-3 text-neutral-600 group-hover:text-accent-amber transition-colors"><Cpu size={16} /></div>
          <div className="text-neutral-500 mb-2 uppercase text-[10px] tracking-widest group-hover:text-accent-amber transition-colors font-bold">Learning_Active</div>
          <div className="text-3xl font-bold text-neutral-300 mb-1 group-hover:text-white transition-colors">{totalLearning.toString().padStart(2, '0')}</div>
        </div>

        <div 
          onClick={() => toggleFilter('mastering')}
          className={cn("p-6 cursor-pointer transition-all duration-300 relative group rounded-tl-2xl rounded-br-2xl overflow-hidden shadow-sm hover:scale-[1.02]", filterStatus === 'mastering' ? "bg-neutral-950 border-accent-emerald border shadow-[0_0_15px_rgba(0,230,118,0.15)]" : "bg-neutral-900/50 border border-neutral-800 hover:border-accent-emerald")}
        >
          <div className="absolute top-0 left-0 w-8 h-1 bg-accent-emerald opacity-0 group-hover:opacity-50 transition-opacity"></div>
          <div className="absolute top-0 right-0 p-3 text-neutral-600 group-hover:text-accent-emerald transition-colors"><CheckSquare size={16} /></div>
          <div className="text-neutral-500 mb-2 uppercase text-[10px] tracking-widest group-hover:text-accent-emerald transition-colors font-bold">Total_Mastered</div>
          <div className="text-3xl font-bold text-neutral-300 mb-1 group-hover:text-white transition-colors">{totalMastering.toString().padStart(2, '0')}</div>
        </div>
      </div>

      <div>
        <h2 className="text-[10px] font-bold tracking-widest text-neon uppercase mb-4 border-b border-neutral-800 pb-2">
          {filterStatus ? `[ ${filterStatus.toUpperCase()}_DATA ]` : '[ RECENT_CAPTURES ]'}
        </h2>
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-tl-2xl rounded-br-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-500 uppercase text-[10px] tracking-widest">
                <th className="py-4 px-5 font-bold border-r border-neutral-800">Target_Entity</th>
                <th className="py-4 px-5 font-bold border-r border-neutral-800">Translation</th>
                <th className="py-4 px-5 font-bold border-r border-neutral-800">Context_Source</th>
                <th className="py-4 px-5 font-bold border-r border-neutral-800">Status</th>
                <th className="py-4 px-5 font-bold w-12 text-center">OP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {displayWords.sort((a,b) => (b.created || "").localeCompare(a.created || "")).slice(0, filterStatus ? 100 : 10).map(word => (
                <tr key={word.id} className="hover:bg-neutral-800/40 transition-colors group">
                  <td className="py-3 px-5 font-bold uppercase border-r border-neutral-800">
                    {word.isIrregularVerb ? (
                      <div className="flex flex-col gap-1 text-[10px]">
                        <div className="flex items-center gap-2"><span className="text-neutral-500 font-normal">V1</span> <span className="text-neon">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[0] || ''}</span></div>
                        <div className="flex items-center gap-2"><span className="text-neutral-500 font-normal">V2</span> <span className="text-neon">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[1] || ''}</span></div>
                        <div className="flex items-center gap-2"><span className="text-neutral-500 font-normal">V3</span> <span className="text-neon">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[2] || ''}</span></div>
                      </div>
                    ) : (
                      <span className="text-neon">{word.word}</span>
                    )}
                  </td>
                  <td className="py-3 px-5 border-r border-neutral-800">
                    {word.isIrregularVerb ? (
                      <div className="flex flex-col gap-1 text-[10px] text-neutral-300">
                        <div>{(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[0] || '-'}</div>
                        <div>{(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[1] || '-'}</div>
                        <div>{(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[2] || '-'}</div>
                      </div>
                    ) : (
                      <span className="text-neutral-300">{word.translation}</span>
                    )}
                  </td>
                  <td className="py-3 px-5 border-r border-neutral-800">
                    {word.source && (
                      <span className="bg-neon text-black text-[10px] px-2 py-0.5 font-bold uppercase rounded">
                        {word.source}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-5 border-r border-neutral-800">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      [{word.status}]
                    </span>
                  </td>
                  <td className="py-3 px-5 text-center">
                    <button onClick={() => onEditWord(word)} className="text-neutral-500 hover:text-neon transition-colors hover:scale-110">
                      <Crosshair size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {displayWords.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-600 uppercase tracking-widest text-xs">NO_DATA_FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
