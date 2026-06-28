import express from "express";
import path from "path";
import fs from "fs";
import cors from "cors";
import matter from "gray-matter";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Settings Management
const SETTINGS_FILE = path.join(process.cwd(), "app-settings.json");
const MOCK_VAULT_PATH = path.join(process.cwd(), "mock_vault");

const defaultSettings = {
  vaultPath: MOCK_VAULT_PATH,
  dictionaryFolder: "20_English_hub/01_Dictionary",
  contextsFolder: "10_Passions/Games" // or just a root folder to scan
};

function getSettings() {
  if (fs.existsSync(SETTINGS_FILE)) {
    try {
      const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (e) {
      console.error("Error reading settings", e);
    }
  }
  return defaultSettings;
}

function saveSettings(newSettings: any) {
  const current = getSettings();
  const updated = { ...current, ...newSettings };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2));
  return updated;
}

// Initialize mock vault if needed
function initMockVault() {
  const settings = getSettings();
  const dictPath = path.join(settings.vaultPath, settings.dictionaryFolder);
  const contextsPath = path.join(settings.vaultPath, settings.contextsFolder);

  if (!fs.existsSync(dictPath)) {
    fs.mkdirSync(dictPath, { recursive: true });
    const initialWord = `---
type: vocabulary
word: Went
translation: Идти (прошедшее от Go)
register: general
status: inbox
source: "[[Beastro]]"
module: english-experience
created: 2026-06-27 18:35
---
Думал что это форма Want, оказалось от Go, берд какой-то)
`;
    fs.writeFileSync(path.join(dictPath, "Went.md"), initialWord);
  }

  if (!fs.existsSync(contextsPath)) {
    fs.mkdirSync(contextsPath, { recursive: true });
    fs.writeFileSync(
      path.join(contextsPath, "Beastro.md"),
      `---
type: game
genre: ""
status: playing
banner_y: "27"
banner: 10_Passions/attachment/beastro_banner.jpg
---
`
    );
  }
}

initMockVault();

// Helper to get full paths
function getDictPath() {
  const s = getSettings();
  return path.join(s.vaultPath, s.dictionaryFolder);
}

function getContextsPath() {
  const s = getSettings();
  return path.join(s.vaultPath, s.contextsFolder);
}

// --- API ROUTES ---

// Settings
app.get("/api/settings", (req, res) => {
  res.json(getSettings());
});

app.post("/api/settings", (req, res) => {
  const updated = saveSettings(req.body);
  res.json(updated);
});

// Words
app.get("/api/words", (req, res) => {
  try {
    const dictPath = getDictPath();
    if (!fs.existsSync(dictPath)) {
      return res.json([]);
    }

    const files = fs.readdirSync(dictPath).filter(f => f.endsWith(".md"));
    const words = files.map(file => {
      const filePath = path.join(dictPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(content);
      return {
        id: file,
        filename: file,
        ...parsed.data,
        content: parsed.content,
      };
    });

    res.json(words);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load words" });
  }
});

app.post("/api/words", (req, res) => {
  try {
    const { word, translation, status = "inbox", source = "", content = "", isIrregularVerb } = req.body;
    if (!word) return res.status(400).json({ error: "Word is required" });

    const dictPath = getDictPath();
    if (!fs.existsSync(dictPath)) fs.mkdirSync(dictPath, { recursive: true });

    // Sanitize filename
    const filename = `${word.replace(/[^a-z0-9а-яё\-]/gi, '_')}.md`;
    const filePath = path.join(dictPath, filename);

    const now = new Date();
    const createdStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let finalSource = source ? source.trim() : "";
    if (finalSource) {
      finalSource = `[[${finalSource.replace(/^\[\[(.*)\]\]$/, '$1')}]]`;
    }

    const frontmatterData: any = {
      type: "vocabulary",
      word,
      translation,
      register: "general",
      status,
      source: finalSource,
      module: "english-experience",
      created: createdStr
    };
    if (isIrregularVerb) frontmatterData.isIrregularVerb = true;

    const fileContent = matter.stringify(content, frontmatterData);

    fs.writeFileSync(filePath, fileContent);
    res.json({ success: true, filename, word, translation, status, source });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save word" });
  }
});

app.put("/api/words/:id", (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const dictPath = getDictPath();
    const filePath = path.join(dictPath, id);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const parsed = matter(fileContent);

    if (updates.data.source !== undefined) {
      let finalSource = updates.data.source.trim();
      if (finalSource) {
        finalSource = `[[${finalSource.replace(/^\[\[(.*)\]\]$/, '$1')}]]`;
      }
      updates.data.source = finalSource;
    }

    // Update frontmatter
    parsed.data = { ...parsed.data, ...updates.data };
    
    // Update content if provided
    const newContent = updates.content !== undefined ? updates.content : parsed.content;

    const newFileStr = matter.stringify(newContent, parsed.data);
    fs.writeFileSync(filePath, newFileStr);
    
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update word" });
  }
});

app.delete("/api/words/:id", (req, res) => {
  try {
    const { id } = req.params;
    const dictPath = getDictPath();
    const filePath = path.join(dictPath, id);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    fs.unlinkSync(filePath);
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete word" });
  }
});

// Contexts (Games etc)
app.get("/api/contexts", (req, res) => {
  try {
    const contextsPath = getContextsPath();
    if (!fs.existsSync(contextsPath)) {
      return res.json([]);
    }

    const files = fs.readdirSync(contextsPath).filter(f => f.endsWith(".md"));
    const contexts = files.map(file => file.replace(".md", ""));
    res.json(contexts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load contexts" });
  }
});

// Anki Export (CSV)
app.get("/api/export/anki", (req, res) => {
  try {
    const dictPath = getDictPath();
    if (!fs.existsSync(dictPath)) return res.status(404).send("No dictionary found");

    const files = fs.readdirSync(dictPath).filter(f => f.endsWith(".md"));
    let csv = "";
    
    files.forEach(file => {
      const filePath = path.join(dictPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const parsed = matter(content);
      // Basic Anki format: Front (Word), Back (Translation + Context + Notes)
      if (parsed.data.status === "mastering" || parsed.data.status === "learning") {
         const front = (parsed.data.word || "").replace(/"/g, '""');
         const translation = (parsed.data.translation || "").replace(/"/g, '""');
         const source = (parsed.data.source || "").replace(/"/g, '""');
         const back = `${translation}<br><br><i>${source}</i><br>${parsed.content.trim().replace(/\n/g, '<br>')}`;
         csv += `"${front}","${back}"\n`;
      }
    });

    res.header("Content-Type", "text/csv");
    res.attachment("anki_export.csv");
    return res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to export" });
  }
});


// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
