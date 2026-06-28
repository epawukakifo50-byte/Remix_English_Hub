export interface Word {
  id: string;
  filename: string;
  type: string;
  word: string;
  translation: string;
  register: string;
  status: "inbox" | "learning" | "mastering";
  source: string;
  module: string;
  created: string;
  content: string;
  isIrregularVerb?: boolean;
  nextReview?: string;
  interval?: number;
  ease?: number;
}

export interface Settings {
  vaultPath: string;
  dictionaryFolder: string;
  contextsFolder: string;
}
