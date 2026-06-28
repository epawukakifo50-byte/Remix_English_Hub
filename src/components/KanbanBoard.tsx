import React from 'react';
import { Word } from '../types';
import { Inbox, Cpu, CheckSquare, Pencil } from 'lucide-react';
import { cn } from '../lib/utils';
import { updateWordStatus } from '../api';

interface Props {
  words: Word[];
  onRefresh: () => void;
  onEditWord: (word: Word) => void;
}

export function KanbanBoard({ words, onRefresh, onEditWord }: Props) {
  const columns = [
    { id: 'inbox', title: 'INBOX_QUEUE', icon: Inbox, color: 'text-accent-blue', borderColor: 'border-accent-blue', hoverColor: 'group-hover:border-accent-blue' },
    { id: 'learning', title: 'LEARNING_ACTIVE', icon: Cpu, color: 'text-accent-amber', borderColor: 'border-accent-amber', hoverColor: 'group-hover:border-accent-amber' },
    { id: 'mastering', title: 'MASTERED_SYNC', icon: CheckSquare, color: 'text-accent-emerald', borderColor: 'border-accent-emerald', hoverColor: 'group-hover:border-accent-emerald' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('wordId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('wordId');
    if (!id) return;
    
    // Optimistic update could go here
    try {
      await updateWordStatus(id, newStatus);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center gap-4 h-full overflow-x-auto pb-4 font-mono w-full px-2">
      {columns.map(col => {
        const colWords = words.filter(w => w.status === col.id);
        const Icon = col.icon;
        return (
          <div 
            key={col.id} 
            className="flex-1 min-w-[280px] max-w-[340px] bg-neutral-900/80 border border-neutral-800 flex flex-col relative group rounded-tl-2xl rounded-br-2xl overflow-hidden transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className={cn("absolute top-0 left-0 w-8 h-1 transition-all duration-300", col.borderColor, "bg-current opacity-50 group-hover:opacity-100 group-hover:w-full")}></div>
            
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
              <div className="flex items-center gap-2">
                <Icon size={16} className={col.color} />
                <h3 className="font-bold text-xs tracking-widest text-neutral-300 uppercase">{col.title}</h3>
              </div>
              <span className={cn("text-xs font-bold font-mono", col.color)}>
                [ {colWords.length.toString().padStart(2, '0')} ]
              </span>
            </div>
            
            <div className="flex-1 p-3 space-y-3 overflow-y-auto">
              {colWords.map(word => (
                <div 
                  key={word.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, word.id)}
                  onClick={() => onEditWord(word)}
                  className="bg-neutral-950 border border-neutral-800 p-4 cursor-grab active:cursor-grabbing hover:scale-[1.02] active:scale-95 transition-all group/card relative rounded-tl-xl rounded-br-xl shadow-sm"
                >
                  <div className={cn("absolute right-0 bottom-0 w-0 h-0 border-l-[12px] border-l-transparent border-b-[12px] border-b-neutral-800 transition-colors", col.hoverColor)}></div>
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className={cn("font-bold text-sm uppercase tracking-wide w-full", col.color)}>
                      {word.isIrregularVerb ? (
                        <div className="flex flex-col gap-1.5 text-[10px] w-full pr-4">
                          <div className="flex items-center justify-between w-full border-b border-neutral-800/50 pb-1">
                            <div className="flex items-center gap-2 w-full group-hover/card:w-1/2 group-hover/card:pr-2 border-r border-transparent group-hover/card:border-neutral-800/50 transition-all duration-300">
                              <span className="text-neutral-500 font-normal min-w-[14px]">V1</span> 
                              <span className="truncate">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[0] || ''}</span>
                            </div>
                            <div className="w-0 overflow-hidden group-hover/card:w-1/2 group-hover/card:pl-2 text-neutral-400 font-normal truncate opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                              {(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[0] || '-'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full border-b border-neutral-800/50 pb-1">
                            <div className="flex items-center gap-2 w-full group-hover/card:w-1/2 group-hover/card:pr-2 border-r border-transparent group-hover/card:border-neutral-800/50 transition-all duration-300">
                              <span className="text-neutral-500 font-normal min-w-[14px]">V2</span> 
                              <span className="truncate">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[1] || ''}</span>
                            </div>
                            <div className="w-0 overflow-hidden group-hover/card:w-1/2 group-hover/card:pl-2 text-neutral-400 font-normal truncate opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                              {(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[1] || '-'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 w-full group-hover/card:w-1/2 group-hover/card:pr-2 border-r border-transparent group-hover/card:border-neutral-800/50 transition-all duration-300">
                              <span className="text-neutral-500 font-normal min-w-[14px]">V3</span> 
                              <span className="truncate">{(word.word.split(' | ').length > 1 ? word.word.split(' | ') : word.word.split(' - '))[2] || ''}</span>
                            </div>
                            <div className="w-0 overflow-hidden group-hover/card:w-1/2 group-hover/card:pl-2 text-neutral-400 font-normal truncate opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                              {(word.translation?.split(' | ').length > 1 ? word.translation.split(' | ') : word.translation?.split(' - ') || [])[2] || '-'}
                            </div>
                          </div>
                        </div>
                      ) : (
                        word.word
                      )}
                    </div>
                    <button className={cn("text-neutral-600 transition-colors opacity-0 group-hover/card:opacity-100 absolute right-4 top-4 bg-neutral-950/80 rounded p-1", col.color.replace('text-', 'hover:text-'))}>
                      <Pencil size={12} />
                    </button>
                  </div>
                  <div className="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] transition-all duration-300 ease-in-out">
                    <div className="overflow-hidden">
                      <div className="flex flex-col gap-2 items-start opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pt-2">
                        {!word.isIrregularVerb && (
                          <div className="text-neutral-400 text-xs truncate w-full">
                            {word.translation}
                          </div>
                        )}
                        {word.source && (
                          <div className={cn("text-[10px] text-black inline-block px-2 py-0.5 font-mono uppercase font-bold truncate max-w-full rounded", col.color.replace('text-', 'bg-'))}>
                            {word.source}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {colWords.length === 0 && (
                <div className="text-center py-8 text-neutral-600 text-xs border border-dashed border-neutral-800 uppercase tracking-widest rounded-tl-xl rounded-br-xl">
                  NO_DATA
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
