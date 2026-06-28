import { Word, Settings } from './types';

export const API_BASE = '/api';

export async function fetchWords(): Promise<Word[]> {
  const res = await fetch(`${API_BASE}/words`);
  if (!res.ok) throw new Error('Failed to fetch words');
  return res.json();
}

export async function addWord(wordData: Partial<Word>): Promise<Word> {
  const res = await fetch(`${API_BASE}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wordData)
  });
  if (!res.ok) throw new Error('Failed to add word');
  return res.json();
}

export async function updateWordStatus(id: string, status: string): Promise<void> {
  const res = await fetch(`${API_BASE}/words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { status } })
  });
  if (!res.ok) throw new Error('Failed to update word');
}

export async function updateWordFull(id: string, updates: any): Promise<void> {
  const res = await fetch(`${API_BASE}/words/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Failed to update word');
}

export async function deleteWord(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/words/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete word');
}

export async function fetchContexts(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/contexts`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSettings(): Promise<Settings> {
  const res = await fetch(`${API_BASE}/settings`);
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function saveSettings(settings: Partial<Settings>): Promise<Settings> {
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) throw new Error('Failed to save settings');
  return res.json();
}
