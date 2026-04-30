const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './data/leaderboard.db';

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trainer_name TEXT NOT NULL,
    scenario TEXT NOT NULL,
    archetype TEXT NOT NULL,
    mode TEXT NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    percentage REAL NOT NULL,
    grade TEXT NOT NULL,
    walked_out INTEGER NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_trainer ON attempts(trainer_name);
  CREATE INDEX IF NOT EXISTS idx_created ON attempts(created_at);
  CREATE INDEX IF NOT EXISTS idx_scenario ON attempts(scenario);
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'THE UPGRADE GYM',
    timestamp: new Date().toISOString(),
    db: 'connected'
  });
});

function computeGrade(percentage) {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
}

// POST /api/attempts
app.post('/api/attempts', (req, res) => {
  const { trainer_name, scenario, archetype, mode, score, max_score, walked_out } = req.body;
  if (!trainer_name || !scenario || !archetype || !mode || score == null || !max_score) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const percentage = Math.round((score / max_score) * 1000) / 10;
  const grade = walked_out ? 'D' : computeGrade(percentage);

  const stmt = db.prepare(`
    INSERT INTO attempts (trainer_name, scenario, archetype, mode, score, max_score, percentage, grade, walked_out)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(trainer_name, scenario, archetype, mode, score, max_score, percentage, grade, walked_out ? 1 : 0);
  res.status(201).json({ id: info.lastInsertRowid, percentage, grade });
});

// GET /api/leaderboard/weekly
app.get('/api/leaderboard/weekly', (req, res) => {
  const { scenario } = req.query;
  const filter = scenario ? 'AND scenario = ?' : '';
  const params = scenario ? [scenario] : [];

  const rows = db.prepare(`
    SELECT trainer_name,
           ROUND(AVG(percentage), 1) AS avg_pct,
           COUNT(*) AS attempts,
           MAX(grade) AS best_grade,
           MAX(created_at) AS last_active
    FROM attempts
    WHERE created_at >= datetime('now', '-7 days') ${filter}
    GROUP BY trainer_name
    HAVING attempts >= 3
    ORDER BY avg_pct DESC
    LIMIT 20
  `).all(...params);

  res.json(rows);
});

// GET /api/leaderboard/all_time
app.get('/api/leaderboard/all_time', (req, res) => {
  const { scenario } = req.query;
  const filter = scenario ? 'AND scenario = ?' : '';
  const params = scenario ? [scenario] : [];

  const rows = db.prepare(`
    SELECT trainer_name,
           ROUND(AVG(percentage), 1) AS avg_pct,
           COUNT(*) AS attempts,
           MAX(grade) AS best_grade,
           MAX(created_at) AS last_active
    FROM attempts
    WHERE 1=1 ${filter}
    GROUP BY trainer_name
    HAVING attempts >= 5
    ORDER BY avg_pct DESC
    LIMIT 20
  `).all(...params);

  res.json(rows);
});

// GET /api/leaderboard/me
app.get('/api/leaderboard/me', (req, res) => {
  const { trainer_name } = req.query;
  if (!trainer_name) return res.status(400).json({ error: 'trainer_name required' });

  const stats = db.prepare(`
    SELECT COUNT(*) AS attempts,
           ROUND(AVG(percentage), 1) AS avg_pct,
           MAX(percentage) AS best_pct,
           MAX(grade) AS best_grade
    FROM attempts WHERE trainer_name = ?
  `).get(trainer_name);

  const history = db.prepare(`
    SELECT scenario, archetype, mode, score, max_score, percentage, grade, walked_out, created_at
    FROM attempts WHERE trainer_name = ?
    ORDER BY created_at DESC LIMIT 50
  `).all(trainer_name);

  res.json({ stats, history });
});

app.listen(PORT, () => {
  console.log(`THE UPGRADE GYM backend running on port ${PORT}`);
});
