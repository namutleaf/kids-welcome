import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { NEIGHBORHOODS } from "./neighborhoods";
import { SEED_PLACES } from "./seed-data";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "kids-welcome.db");

declare global {
  var __kidsWelcomeDb: Database.Database | undefined;
}

function createConnection(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS neighborhoods (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      sort_order INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS places (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      neighborhood_id TEXT NOT NULL REFERENCES neighborhoods(id),
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      kids_chair TEXT NOT NULL DEFAULT 'unknown',
      atmosphere TEXT NOT NULL DEFAULT 'neutral',
      no_kids_zone INTEGER NOT NULL DEFAULT 0,
      activities TEXT NOT NULL DEFAULT '',
      kids_food TEXT NOT NULL DEFAULT 'unknown',
      kids_food_note TEXT NOT NULL DEFAULT '',
      kids_fun_level TEXT NOT NULL DEFAULT 'okay',
      parking TEXT NOT NULL DEFAULT 'unknown',
      parking_note TEXT NOT NULL DEFAULT '',
      submitted_by TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_places_neighborhood ON places(neighborhood_id);

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
      author_name TEXT NOT NULL DEFAULT '익명',
      rating INTEGER NOT NULL,
      child_age TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);
  `);

  seedIfEmpty(db);

  return db;
}

function seedIfEmpty(db: Database.Database) {
  const neighborhoodCount = (
    db.prepare("SELECT COUNT(*) as c FROM neighborhoods").get() as { c: number }
  ).c;

  if (neighborhoodCount === 0) {
    const insertNeighborhood = db.prepare(
      `INSERT INTO neighborhoods (id, name, tagline, sort_order) VALUES (@id, @name, @tagline, @sortOrder)`
    );
    const insertMany = db.transaction((rows: typeof NEIGHBORHOODS) => {
      for (const n of rows) insertNeighborhood.run(n);
    });
    insertMany(NEIGHBORHOODS);
  }

  const placeCount = (
    db.prepare("SELECT COUNT(*) as c FROM places").get() as { c: number }
  ).c;

  if (placeCount === 0) {
    const insertPlace = db.prepare(`
      INSERT INTO places (
        neighborhood_id, name, category, address, description,
        kids_chair, atmosphere, no_kids_zone, activities,
        kids_food, kids_food_note, kids_fun_level, parking, parking_note,
        submitted_by, created_at
      ) VALUES (
        @neighborhoodId, @name, @category, @address, @description,
        @kidsChair, @atmosphere, @noKidsZone, @activities,
        @kidsFood, @kidsFoodNote, @kidsFunLevel, @parking, @parkingNote,
        @submittedBy, @createdAt
      )
    `);
    const insertReview = db.prepare(`
      INSERT INTO reviews (place_id, author_name, rating, child_age, content, created_at)
      VALUES (@placeId, @authorName, @rating, @childAge, @content, @createdAt)
    `);

    const insertAll = db.transaction(() => {
      let offsetMinutes = 0;
      for (const seed of SEED_PLACES) {
        const createdAt = new Date(Date.now() - offsetMinutes * 60_000).toISOString();
        offsetMinutes += 37;
        const info = insertPlace.run({
          neighborhoodId: seed.neighborhoodId,
          name: seed.name,
          category: seed.category,
          address: seed.address,
          description: seed.description,
          kidsChair: seed.kidsChair,
          atmosphere: seed.atmosphere,
          noKidsZone: seed.noKidsZone,
          activities: seed.activities,
          kidsFood: seed.kidsFood,
          kidsFoodNote: seed.kidsFoodNote,
          kidsFunLevel: seed.kidsFunLevel,
          parking: seed.parking,
          parkingNote: seed.parkingNote,
          submittedBy: "운영자 (예시 데이터)",
          createdAt,
        });

        const placeId = info.lastInsertRowid as number;
        for (const review of seed.reviews ?? []) {
          offsetMinutes += 5;
          insertReview.run({
            placeId,
            authorName: review.authorName,
            rating: review.rating,
            childAge: review.childAge,
            content: review.content,
            createdAt: new Date(Date.now() - offsetMinutes * 60_000).toISOString(),
          });
        }
      }
    });
    insertAll();
  }
}

export function getDb(): Database.Database {
  if (!global.__kidsWelcomeDb) {
    global.__kidsWelcomeDb = createConnection();
  }
  return global.__kidsWelcomeDb;
}
