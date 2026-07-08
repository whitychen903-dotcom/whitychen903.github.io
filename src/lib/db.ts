import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const db = new Database(dbPath);

// 启用 WAL 模式提高性能
db.pragma("journal_mode = WAL");

// 创建表
db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    emailVerified TEXT,
    image TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS saved_event (
    id TEXT PRIMARY KEY,
    userId TEXT NOT NULL,
    eventId TEXT NOT NULL,
    eventType TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    date TEXT,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE(userId, eventId)
  );
`);

// 用户相关
export function createUser(data: {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}) {
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO user (id, name, email, image) VALUES (?, ?, ?, ?)"
  );
  stmt.run(data.id, data.name || null, data.email || null, data.image || null);
}

export function getUserByEmail(email: string) {
  return db.prepare("SELECT * FROM user WHERE email = ?").get(email) as
    | UserRow
    | undefined;
}

export function getUserById(id: string) {
  return db.prepare("SELECT * FROM user WHERE id = ?").get(id) as
    | UserRow
    | undefined;
}

// 收藏事件相关
export function getSavedEvents(userId: string) {
  return db
    .prepare(
      "SELECT * FROM saved_event WHERE userId = ? ORDER BY createdAt DESC"
    )
    .all(userId) as SavedEventRow[];
}

export function addSavedEvent(data: {
  id: string;
  userId: string;
  eventId: string;
  eventType: string;
  title: string;
  artist: string;
  date?: string;
}) {
  const stmt = db.prepare(
    "INSERT OR IGNORE INTO saved_event (id, userId, eventId, eventType, title, artist, date) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run(
    data.id,
    data.userId,
    data.eventId,
    data.eventType,
    data.title,
    data.artist,
    data.date || null
  );
}

export function removeSavedEvent(userId: string, eventId: string) {
  db.prepare("DELETE FROM saved_event WHERE userId = ? AND eventId = ?").run(
    userId,
    eventId
  );
}

export function isEventSaved(userId: string, eventId: string) {
  const row = db
    .prepare("SELECT 1 FROM saved_event WHERE userId = ? AND eventId = ?")
    .get(userId, eventId);
  return !!row;
}

// 类型定义
export interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedEventRow {
  id: string;
  userId: string;
  eventId: string;
  eventType: string;
  title: string;
  artist: string;
  date: string | null;
  createdAt: string;
}

export default db;
