import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface Props {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function ComboBox({ options, value, onChange, placeholder, className, inputClassName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={cn("relative", className)} ref={wrapperRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={cn("w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neutral-300 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber focus:outline-none rounded-tl-xl rounded-br-xl transition-all uppercase", inputClassName)}
          placeholder={placeholder || "Select or type..."}
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-neutral-500 hover:text-neutral-300 focus:outline-none"
        >
          <ChevronDown size={20} className={cn("transition-transform", isOpen && "rotate-180")} />
        </button>
      </div>
      {isOpen && (filteredOptions.length > 0 || options.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-neutral-900 border border-neutral-800 rounded-xl shadow-lg max-h-60 overflow-y-auto font-mono">
          {(filteredOptions.length > 0 ? filteredOptions : options).map((opt) => (
            <div
              key={opt}
              className="px-4 py-3 hover:bg-neutral-800 cursor-pointer text-neutral-300 uppercase text-sm border-b border-neutral-800/50 last:border-none"
              onClick={() => {
                setInputValue(opt);
                onChange(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
