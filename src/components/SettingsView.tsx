import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { fetchSettings, saveSettings } from '../api';

export function SettingsView() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings().then(setSettings);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    try {
      await saveSettings(settings);
      alert("Settings saved. Note: changes might require backend restart to fully apply in development.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return null;

  return (
    <div className="max-w-2xl mx-auto font-mono">
      <h1 className="text-3xl font-bold text-neon tracking-widest uppercase mb-6 border-b border-neutral-800 pb-4">SYS.CONFIG // VAULT</h1>
      
      <div className="bg-neutral-900/80 border border-neutral-800 p-8 relative rounded-tl-3xl rounded-br-3xl overflow-hidden shadow-lg">
        <div className="absolute top-0 left-0 w-16 h-1 bg-gradient-to-r from-neon to-transparent"></div>
        <form onSubmit={handleSave} className="space-y-8">
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">
              Absolute_Vault_Path
            </label>
            <input 
              type="text" 
              value={settings.vaultPath} 
              onChange={e => setSettings({...settings, vaultPath: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-neon font-mono text-sm focus:border-neon focus:ring-1 focus:ring-neon focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
              placeholder="C:\Users\Name\Documents\ObsidianVault"
            />
            <p className="text-xs text-neutral-500 mt-2">
              When running locally, set this to your actual Obsidian vault path. 
              In the cloud preview, this points to a mock folder.
            </p>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">
              Dictionary_Folder
            </label>
            <input 
              type="text" 
              value={settings.dictionaryFolder} 
              onChange={e => setSettings({...settings, dictionaryFolder: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-accent-amber font-mono text-sm focus:border-accent-amber focus:ring-1 focus:ring-accent-amber focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-2 uppercase tracking-widest">
              Context_Folder
            </label>
            <input 
              type="text" 
              value={settings.contextsFolder} 
              onChange={e => setSettings({...settings, contextsFolder: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-accent-blue font-mono text-sm focus:border-accent-blue focus:ring-1 focus:ring-accent-blue focus:outline-none rounded-tl-xl rounded-br-xl transition-all"
            />
          </div>

          <div className="pt-6 border-t border-neutral-800">
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-neutral-800 text-neutral-200 px-8 py-3 font-bold tracking-widest uppercase hover:bg-neon hover:text-black border border-neutral-700 hover:border-transparent transition-all rounded-tl-xl rounded-br-xl disabled:opacity-50 hover:scale-[1.02] active:scale-95 shadow-md"
            >
              {isSaving ? 'UPDATING...' : 'APPLY_CONFIG'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
