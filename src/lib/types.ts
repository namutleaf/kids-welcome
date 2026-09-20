export type TriState = "yes" | "no" | "unknown";
export type Atmosphere = "welcoming" | "neutral" | "awkward";
export type ParkingLevel = "good" | "ok" | "none" | "unknown";
export type FunLevel = "fun" | "okay" | "boring";

export const TRI_STATE_LABEL: Record<TriState, string> = {
  yes: "있어요",
  no: "없어요",
  unknown: "잘 모르겠어요",
};

export const ATMOSPHERE_LABEL: Record<Atmosphere, string> = {
  welcoming: "아이 반겨줘요",
  neutral: "무난해요",
  awkward: "눈치 보여요",
};

export const PARKING_LABEL: Record<ParkingLevel, string> = {
  good: "주차 편해요",
  ok: "주차 가능해요",
  none: "주차 어려워요",
  unknown: "잘 모르겠어요",
};

export const FUN_LEVEL_LABEL: Record<FunLevel, string> = {
  fun: "아이도 즐거워해요",
  okay: "그럭저럭 괜찮아요",
  boring: "아이는 지루할 수 있어요",
};

export interface Neighborhood {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  sortOrder: number;
}

export interface Place {
  id: number;
  neighborhoodId: string;
  name: string;
  category: string;
  address: string;
  description: string;
  kidsChair: TriState;
  atmosphere: Atmosphere;
  noKidsZone: 0 | 1;
  activities: string;
  kidsFood: TriState;
  kidsFoodNote: string;
  kidsFunLevel: FunLevel;
  parking: ParkingLevel;
  parkingNote: string;
  submittedBy: string;
  createdAt: string;
}

export interface Review {
  id: number;
  placeId: number;
  authorName: string;
  rating: number;
  childAge: string;
  content: string;
  createdAt: string;
}

export interface PlaceWithStats extends Place {
  reviewCount: number;
  avgRating: number | null;
}
