# My Blog

개인 블로그 프로젝트입니다. Astro 기반의 SSG로 글은 Content Collections를 통해 관리합니다.

## 개발/실행

```bash
pnpm install
pnpm dev
```

## 빌드/프리뷰

```bash
pnpm build
pnpm preview
```

## 글 작성

- 새 글 추가: `src/content/blogs/` 아래에 `*.md` 파일 추가
- 메타데이터(frontmatter): `src/content.config.ts` 스키마를 따름

## 주요 설정 파일

- 사이트 설정(제목/설명/네비 등): `src/site.config.ts`
- Astro 설정(사이트 URL 등): `astro.config.mjs`

## 프로젝트 구조(요약)

```text
public/                정적 파일
src/content/blogs/      블로그 글(마크다운)
src/pages/              라우팅(페이지)
src/components/         UI 컴포넌트
src/layouts/            레이아웃
src/styles/             전역 스타일
```

## 출처

이 프로젝트는 Astro 테마인 **Space Ahead**를 기반으로 시작했습니다: `https://github.com/djsiddz/space-ahead`

## 라이선스

`LICENSE` 참고 (GNU GPL v3).
