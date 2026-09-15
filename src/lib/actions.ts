"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "./db";
import { NEIGHBORHOODS } from "./neighborhoods";

const neighborhoodIds = NEIGHBORHOODS.map((n) => n.id) as [string, ...string[]];

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
