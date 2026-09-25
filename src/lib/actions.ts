"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "./db";
import { NEIGHBORHOODS } from "./neighborhoods";
import { findSimilarPlaces } from "./queries";
import { normalizePlaceName } from "./similarity";

const neighborhoodIds = NEIGHBORHOODS.map((n) => n.id) as [string, ...string[]];

export interface SimilarPlace {
  id: number;
  name: string;
  category: string;
  address: string;
  reviewCount: number;
}

const similarQuerySchema = z.object({
  neighborhoodId: z.enum(neighborhoodIds),
  name: z.string().trim().min(1).max(80),
});

export async function checkSimilarPlaces(
  neighborhoodId: string,
  name: string
): Promise<SimilarPlace[]> {
  const parsed = similarQuerySchema.safeParse({ neighborhoodId, name });
  if (!parsed.success) return [];

  return findSimilarPlaces(parsed.data.neighborhoodId, parsed.data.name)
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      address: p.address,
      reviewCount: p.reviewCount,
    }));
}

const placeSchema = z.object({
  neighborhoodId: z.enum(neighborhoodIds, {
    message: "지역을 선택해주세요.",
  }),
  name: z.string().trim().min(1, "장소 이름을 입력해주세요.").max(80),
  category: z.string().trim().min(1, "카테고리를 입력해주세요.").max(40),
  address: z.string().trim().max(200).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
  kidsChair: z.enum(["yes", "no", "unknown"]).default("unknown"),
  atmosphere: z.enum(["welcoming", "neutral", "awkward"]).default("neutral"),
  activities: z.string().trim().max(500).optional().default(""),
  kidsFood: z.enum(["yes", "no", "unknown"]).default("unknown"),
  kidsFoodNote: z.string().trim().max(300).optional().default(""),
  kidsFunLevel: z.enum(["fun", "okay", "boring"]).default("okay"),
  parking: z.enum(["good", "ok", "none", "unknown"]).default("unknown"),
  parkingNote: z.string().trim().max(300).optional().default(""),
  submittedBy: z.string().trim().max(40).optional().default(""),
});

export interface PlaceFormState {
  error?: string;
  duplicatePlaceId?: number;
}

export async function createPlace(
  _prevState: PlaceFormState,
  formData: FormData
): Promise<PlaceFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = placeSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const data = parsed.data;
  const db = getDb();

  const normalized = normalizePlaceName(data.name);
  const exactDuplicate = findSimilarPlaces(data.neighborhoodId, data.name).find(
    (p) => normalizePlaceName(p.name) === normalized
  );
  if (exactDuplicate) {
    return {
      error: `이 동네에 '${exactDuplicate.name}'이(가) 이미 등록돼 있어요. 다른 곳이라면 지점명 등으로 이름을 구분해주세요.`,
      duplicatePlaceId: exactDuplicate.id,
    };
  }

  const info = db
    .prepare(
      `
      INSERT INTO places (
        neighborhood_id, name, category, address, description,
        kids_chair, atmosphere, activities,
        kids_food, kids_food_note, kids_fun_level, parking, parking_note,
        submitted_by, created_at
      ) VALUES (
        @neighborhoodId, @name, @category, @address, @description,
        @kidsChair, @atmosphere, @activities,
        @kidsFood, @kidsFoodNote, @kidsFunLevel, @parking, @parkingNote,
        @submittedBy, @createdAt
      )
      `
    )
    .run({
      neighborhoodId: data.neighborhoodId,
      name: data.name,
      category: data.category,
      address: data.address ?? "",
      description: data.description ?? "",
      kidsChair: data.kidsChair,
      atmosphere: data.atmosphere,
      activities: data.activities ?? "",
      kidsFood: data.kidsFood,
      kidsFoodNote: data.kidsFoodNote ?? "",
      kidsFunLevel: data.kidsFunLevel,
      parking: data.parking,
      parkingNote: data.parkingNote ?? "",
      submittedBy: data.submittedBy?.trim() || "익명 제보자",
      createdAt: new Date().toISOString(),
    });

  const placeId = info.lastInsertRowid as number;

  revalidatePath(`/neighborhoods/${data.neighborhoodId}`);
  revalidatePath("/");
  redirect(`/places/${placeId}`);
}

const reviewSchema = z.object({
  placeId: z.coerce.number().int().positive(),
  authorName: z.string().trim().max(40).optional().default(""),
  rating: z.coerce.number().int().min(1, "별점을 선택해주세요.").max(5),
  childAge: z.string().trim().max(30).optional().default(""),
  content: z.string().trim().min(2, "내용을 조금 더 적어주세요.").max(1000),
});

export interface ReviewFormState {
  error?: string;
}

export async function createReview(
  _prevState: ReviewFormState,
  formData: FormData
): Promise<ReviewFormState> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = reviewSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const data = parsed.data;
  const db = getDb();

  const place = db.prepare(`SELECT id FROM places WHERE id = @id`).get({ id: data.placeId });
  if (!place) {
    return { error: "존재하지 않는 장소예요." };
  }

  db.prepare(
    `
    INSERT INTO reviews (place_id, author_name, rating, child_age, content, created_at)
    VALUES (@placeId, @authorName, @rating, @childAge, @content, @createdAt)
    `
  ).run({
    placeId: data.placeId,
    authorName: data.authorName?.trim() || "익명",
    rating: data.rating,
    childAge: data.childAge ?? "",
    content: data.content,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/places/${data.placeId}`);
  redirect(`/places/${data.placeId}`);
}

export interface MergeFormState {
  error?: string;
}

const mergeSchema = z
  .object({
    keepId: z.coerce.number().int().positive(),
    removeId: z.coerce.number().int().positive(),
    password: z.string(),
  })
  .refine((d) => d.keepId !== d.removeId, { message: "서로 다른 두 장소를 골라주세요." });

function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

interface MergeRow {
  id: number;
  neighborhood_id: string;
  address: string;
  description: string;
  activities: string;
  kids_chair: string;
  kids_food: string;
  kids_food_note: string;
  parking: string;
  parking_note: string;
}

export async function mergePlaces(
  _prevState: MergeFormState,
  formData: FormData
): Promise<MergeFormState> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { error: "서버에 ADMIN_PASSWORD가 설정돼 있지 않아 병합할 수 없어요." };
  }

  const parsed = mergeSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }
  const { keepId, removeId, password } = parsed.data;

  if (!passwordMatches(password, adminPassword)) {
    return { error: "관리자 비밀번호가 맞지 않아요." };
  }

  const db = getDb();
  const select = db.prepare(`SELECT * FROM places WHERE id = @id`);
  const keep = select.get({ id: keepId }) as MergeRow | undefined;
  const remove = select.get({ id: removeId }) as MergeRow | undefined;
  if (!keep || !remove) {
    return { error: "존재하지 않는 장소가 있어요." };
  }

  const fillText = (a: string, b: string) => (a.trim() ? a : b);
  const fillUnknown = (a: string, b: string) => (a === "unknown" ? b : a);

  db.transaction(() => {
    db.prepare(`UPDATE reviews SET place_id = @keepId WHERE place_id = @removeId`).run({
      keepId,
      removeId,
    });
    db.prepare(
      `
      UPDATE places SET
        address = @address, description = @description, activities = @activities,
        kids_chair = @kidsChair, kids_food = @kidsFood, kids_food_note = @kidsFoodNote,
        parking = @parking, parking_note = @parkingNote
      WHERE id = @id
      `
    ).run({
      id: keepId,
      address: fillText(keep.address, remove.address),
      description: fillText(keep.description, remove.description),
      activities: fillText(keep.activities, remove.activities),
      kidsChair: fillUnknown(keep.kids_chair, remove.kids_chair),
      kidsFood: fillUnknown(keep.kids_food, remove.kids_food),
      kidsFoodNote: fillText(keep.kids_food_note, remove.kids_food_note),
      parking: fillUnknown(keep.parking, remove.parking),
      parkingNote: fillText(keep.parking_note, remove.parking_note),
    });
    db.prepare(`DELETE FROM places WHERE id = @id`).run({ id: removeId });
  })();

  revalidatePath("/", "layout");
  redirect(`/admin/duplicates?merged=${keepId}`);
}
