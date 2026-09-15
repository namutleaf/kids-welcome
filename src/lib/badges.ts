import {
  ATMOSPHERE_LABEL,
  FUN_LEVEL_LABEL,
  PARKING_LABEL,
  Place,
  TRI_STATE_LABEL,
} from "./types";

export interface BadgeInfo {
  label: string;
  tone: "good" | "warn" | "bad" | "neutral";
  icon: string;
}

export function kidsChairBadge(place: Pick<Place, "kidsChair">): BadgeInfo {
  return {
    label: `아기의자 ${TRI_STATE_LABEL[place.kidsChair]}`,
    tone: place.kidsChair === "yes" ? "good" : place.kidsChair === "no" ? "bad" : "neutral",
    icon: "🪑",
  };
}

export function atmosphereBadge(place: Pick<Place, "atmosphere">): BadgeInfo {
  return {
    label: ATMOSPHERE_LABEL[place.atmosphere],
    tone:
      place.atmosphere === "welcoming"
        ? "good"
        : place.atmosphere === "awkward"
          ? "bad"
          : "neutral",
    icon: "😊",
  };
}

export function noKidsZoneBadge(place: Pick<Place, "noKidsZone">): BadgeInfo | null {
  if (!place.noKidsZone) return null;
  return { label: "노키즈존", tone: "bad", icon: "🚫" };
}

export function kidsFoodBadge(place: Pick<Place, "kidsFood">): BadgeInfo {
  return {
    label: `아이 먹거리 ${TRI_STATE_LABEL[place.kidsFood]}`,
    tone: place.kidsFood === "yes" ? "good" : place.kidsFood === "no" ? "bad" : "neutral",
    icon: "🍽️",
  };
}

export function kidsFunBadge(place: Pick<Place, "kidsFunLevel">): BadgeInfo {
  return {
    label: FUN_LEVEL_LABEL[place.kidsFunLevel],
    tone:
      place.kidsFunLevel === "fun" ? "good" : place.kidsFunLevel === "boring" ? "bad" : "neutral",
    icon: "🎉",
  };
}

export function parkingBadge(place: Pick<Place, "parking">): BadgeInfo {
  return {
    label: PARKING_LABEL[place.parking],
    tone:
      place.parking === "good"
        ? "good"
        : place.parking === "ok"
          ? "neutral"
          : place.parking === "none"
            ? "bad"
            : "neutral",
    icon: "🅿️",
  };
}

export function getAllBadges(place: Place): BadgeInfo[] {
  const badges = [
    kidsChairBadge(place),
    atmosphereBadge(place),
    noKidsZoneBadge(place),
    kidsFoodBadge(place),
    kidsFunBadge(place),
    parkingBadge(place),
  ];
  return badges.filter((b): b is BadgeInfo => b !== null);
}
