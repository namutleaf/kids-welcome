# 아이랑어디가

아이와 갈 만한 곳을 동네별로 찾아보는 웹 앱입니다. 행정동이 아니라 서촌, 서순라길,
해방촌, 성수/서울숲, 마곡처럼 실제로 사람들이 부르는 지명으로 지역을 나눕니다.

각 장소마다 다음 정보를 확인/제보할 수 있습니다.

- 🪑 아기의자 유무
- 😊 아이 동반 시 눈치가 보이는 분위기인지
- 🚫 노키즈존 여부
- 🎉 즐길거리
- 🍽️ 아이가 먹을 만한 메뉴
- 🎈 아이가 지겨워하지 않을지
- 🅿️ 주차 편의성

장소와 방문 후기는 모두 방문객이 직접 제보/작성하는 구조입니다.

## 시작하기

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속.

첫 실행 시 `data/kids-welcome.db` (SQLite) 파일이 자동 생성되고, 예시 장소 데이터로 채워집니다.

## 기술 스택

- Next.js (App Router) + TypeScript
- Tailwind CSS
- better-sqlite3 (파일 기반 SQLite, 별도 DB 서버 불필요)
- Server Actions로 장소 제보 / 후기 작성 처리

## 프로젝트 구조

- `src/lib/neighborhoods.ts` — 동네(지역) 목록
- `src/lib/db.ts` — SQLite 스키마 및 초기 시드
- `src/lib/queries.ts` — 조회 쿼리
- `src/lib/actions.ts` — 장소 제보 / 후기 작성 Server Actions
- `src/app` — 페이지 (홈, 동네별 목록, 장소 상세, 제보/후기 폼)
- `src/components` — UI 컴포넌트
