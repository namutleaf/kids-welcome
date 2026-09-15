import { Neighborhood } from "./types";

// 행정동 대신, 사람들이 실제로 부르는 '핫플' 지명 기준으로 지역을 나눈다.
export const NEIGHBORHOODS: Neighborhood[] = [
  { id: "seochon", name: "서촌", tagline: "경복궁 옆 골목, 한옥 카페와 갤러리", sortOrder: 1 },
  { id: "seosullagil", name: "서순라길", tagline: "종묘 돌담길을 따라 걷는 조용한 산책로", sortOrder: 2 },
  { id: "haebangchon", name: "해방촌", tagline: "언덕 위 이국적인 골목과 루프탑", sortOrder: 3 },
  { id: "seongsu", name: "성수/서울숲", tagline: "공장 개조 카페와 넓은 숲, 아이랑 걷기 좋은 곳", sortOrder: 4 },
  { id: "magok", name: "마곡", tagline: "신도시 대형 몰과 식물원이 있는 동네", sortOrder: 5 },
  { id: "yeonnam", name: "연남동", tagline: "경의선숲길 따라 이어지는 카페 거리", sortOrder: 6 },
  { id: "mangwon", name: "망원동", tagline: "한강 가깝고 골목 상권이 발달한 동네", sortOrder: 7 },
  { id: "euljiro", name: "을지로", tagline: "레트로 골목과 힙한 바가 섞인 도심", sortOrder: 8 },
  { id: "ikseondong", name: "익선동", tagline: "한옥 개조 카페가 밀집한 좁은 골목", sortOrder: 9 },
  { id: "mullae", name: "문래동", tagline: "철공소 골목 사이 예술 공간과 카페", sortOrder: 10 },
  { id: "hannam", name: "한남동", tagline: "고급스러운 카페와 갤러리가 많은 동네", sortOrder: 11 },
  { id: "hapjeong", name: "합정/상수", tagline: "한강진입로 근처, 개성있는 카페와 공방", sortOrder: 12 },
  { id: "songridangil", name: "송리단길", tagline: "석촌호수 옆, 잠실 인근 카페 거리", sortOrder: 13 },
  { id: "garosugil", name: "가로수길/신사", tagline: "쇼핑과 브런치 카페가 모인 번화가", sortOrder: 14 },
];

export function getNeighborhoodById(id: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.id === id);
}
