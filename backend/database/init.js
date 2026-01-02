import db from "./db.js";

await db.exec(`
  -- Drop old tables (DEV ONLY)
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS chat_logs;
  DROP TABLE IF EXISTS image_logs;

  -- Users table
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Chat history
  CREATE TABLE chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Image analysis logs
  CREATE TABLE image_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    risk_level TEXT NOT NULL,
    flags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  -- Misinformation checks
  CREATE TABLE IF NOT EXISTS misinformation_checks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    claim TEXT,
    source_url TEXT,
    risk_level TEXT,
    flags TEXT,
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

`);

console.log("✅ SQLite tables initialized (fresh & upgraded)");
process.exit(0);
