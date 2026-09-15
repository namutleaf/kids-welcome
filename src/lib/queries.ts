import { getDb } from "./db";
import { NEIGHBORHOODS } from "./neighborhoods";
import { Neighborhood, Place, PlaceWithStats, Review } from "./types";

interface PlaceRow {
  id: number;
  neighborhood_id: string;
  name: string;
  category: string;
  address: string;
  description: string;
  kids_chair: string;
  atmosphere: string;
  no_kids_zone: number;
  activities: string;
  kids_food: string;
  kids_food_note: string;
  kids_fun_level: string;
  parking: string;
  parking_note: string;
  submitted_by: string;
  created_at: string;
}

function mapPlace(row: PlaceRow): Place {
  return {
    id: row.id,
    neighborhoodId: row.neighborhood_id,
    name: row.name,
    category: row.category,
    address: row.address,
    description: row.description,
    kidsChair: row.kids_chair as Place["kidsChair"],
    atmosphere: row.atmosphere as Place["atmosphere"],
    noKidsZone: row.no_kids_zone ? 1 : 0,
    activities: row.activities,
    kidsFood: row.kids_food as Place["kidsFood"],
    kidsFoodNote: row.kids_food_note,
    kidsFunLevel: row.kids_fun_level as Place["kidsFunLevel"],
    parking: row.parking as Place["parking"],
    parkingNote: row.parking_note,
    submittedBy: row.submitted_by,
    createdAt: row.created_at,
  };
}

interface ReviewRow {
  id: number;
  place_id: number;
  author_name: string;
  rating: number;
  child_age: string;
  content: string;
  created_at: string;
}

function mapReview(row: ReviewRow): Review {
  return {
    id: row.id,
    placeId: row.place_id,
    authorName: row.author_name,
    rating: row.rating,
    childAge: row.child_age,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function getNeighborhoods(): Neighborhood[] {
  return [...NEIGHBORHOODS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getNeighborhoodPlaceCounts(): Record<string, number> {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT neighborhood_id as neighborhoodId, COUNT(*) as count FROM places GROUP BY neighborhood_id`
    )
    .all() as { neighborhoodId: string; count: number }[];
  const map: Record<string, number> = {};
  for (const row of rows) map[row.neighborhoodId] = row.count;
  return map;
}

export interface PlaceFilters {
  kidsChair?: boolean;
  excludeNoKidsZone?: boolean;
  kidsFood?: boolean;
  goodParking?: boolean;
}

export function getPlacesByNeighborhood(
  neighborhoodId: string,
  filters: PlaceFilters = {}
): PlaceWithStats[] {
  const db = getDb();
  const conditions: string[] = ["p.neighborhood_id = @neighborhoodId"];
  const params: Record<string, unknown> = { neighborhoodId };

  if (filters.kidsChair) {
    conditions.push("p.kids_chair = 'yes'");
  }
  if (filters.excludeNoKidsZone) {
    conditions.push("p.no_kids_zone = 0");
  }
  if (filters.kidsFood) {
    conditions.push("p.kids_food = 'yes'");
  }
  if (filters.goodParking) {
    conditions.push("p.parking IN ('good', 'ok')");
  }

  const rows = db
    .prepare(
      `
      SELECT p.*,
        COUNT(r.id) as review_count,
        AVG(r.rating) as avg_rating
      FROM places p
      LEFT JOIN reviews r ON r.place_id = p.id
      WHERE ${conditions.join(" AND ")}
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `
    )
    .all(params) as (PlaceRow & { review_count: number; avg_rating: number | null })[];

  return rows.map((row) => ({
    ...mapPlace(row),
    reviewCount: row.review_count,
    avgRating: row.avg_rating,
  }));
}

export function getPlaceById(id: number): PlaceWithStats | undefined {
  const db = getDb();
  const row = db
    .prepare(
      `
      SELECT p.*,
        COUNT(r.id) as review_count,
        AVG(r.rating) as avg_rating
      FROM places p
      LEFT JOIN reviews r ON r.place_id = p.id
      WHERE p.id = @id
      GROUP BY p.id
      `
    )
    .get({ id }) as (PlaceRow & { review_count: number; avg_rating: number | null }) | undefined;

  if (!row) return undefined;

  return {
    ...mapPlace(row),
    reviewCount: row.review_count,
    avgRating: row.avg_rating,
  };
}

export function getReviewsByPlace(placeId: number): Review[] {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM reviews WHERE place_id = @placeId ORDER BY created_at DESC`)
    .all({ placeId }) as ReviewRow[];
  return rows.map(mapReview);
}

export function getRecentPlaces(limit = 6): PlaceWithStats[] {
  const db = getDb();
  const rows = db
    .prepare(
      `
      SELECT p.*,
        COUNT(r.id) as review_count,
        AVG(r.rating) as avg_rating
      FROM places p
      LEFT JOIN reviews r ON r.place_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT @limit
      `
    )
    .all({ limit }) as (PlaceRow & { review_count: number; avg_rating: number | null })[];

  return rows.map((row) => ({
    ...mapPlace(row),
    reviewCount: row.review_count,
    avgRating: row.avg_rating,
  }));
}
