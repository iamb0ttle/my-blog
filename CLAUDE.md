📘 프로젝트 사양서: My-Blog (Next.js 버전)
🧾 프로젝트 개요
프로젝트명: My-Blog

목표: ChatBot 스타일 인터페이스를 갖춘 개인형 블로그 정적 웹사이트 개발

설명: 사용자가 챗봇 UI처럼 게시글을 탐색하거나 검색할 수 있는 정적 블로그.
게시글은 실제 채팅 메시지처럼 구성되며, 처음 메시지는 사용자 발화, 이후는 챗봇 응답처럼 표현.

🛠 기술 스택
항목	스택
Framework	Next.js 14+ (App Router)
언어	TypeScript
스타일링	Tailwind CSS
i18n	next-intl or next-i18next
다크/라이트 모드	Tailwind 기반 dark: 클래스 or Headless UI
댓글 시스템	Giscus
정적 게시글	MDX 기반 (/content/{lang}/{slug}.mdx)
배포	Vercel 또는 Static Export (next export)

🧱 주요 기능 구성
✅ 메인 페이지 (/)
챗봇 형태의 중앙 입력 UI → 실제는 검색창

Sidebar (오른쪽):

Chats (연도별 게시글 리스트, 제목 + 날짜)

상단 고정 버튼:

About, GitHub, LinkedIn, Email

Toggle ON/OFF 가능 (Drawer)

✅ 게시글 페이지 (/[lang]/post/[slug])
게시글 내용은 <h1> 태그 기준으로 채팅 버블 분리

처음은 사용자 발화 형태 (user 버블)

이후는 챗봇 응답 (bot 버블)

Giscus 댓글 컴포넌트 하단 삽입

다국어 URL 구조 예:

/ko/post/motivation

/en/post/motivation

🎨 디자인 및 UI 원칙
색상: black, gray, white 계열의 단색 + dark/light 지원

레이아웃: 모바일/데스크탑 반응형, Tailwind flex, grid 기반

Sidebar: fixed 혹은 drawer 형태

애니메이션: Framer Motion 사용 가능

📁 프로젝트 구조 예시
bash
Copy
Edit
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # 메인 페이지
│   ├── [lang]/
│   │   ├── layout.tsx         # i18n 처리용
│   │   └── post/
│   │       └── [slug]/page.tsx  # 게시글
├── components/
│   ├── ChatInput.tsx
│   ├── ChatBubble.tsx
│   ├── Sidebar.tsx
│   └── ThemeToggle.tsx
├── content/
│   ├── en/
│   │   └── motivation.mdx
│   └── ko/
│       └── motivation.mdx
├── lib/
│   └── i18n.ts
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
💬 i18n 예시 설정 (next-intl 기준)
ts
Copy
Edit
// middleware.ts
import { createI18nMiddleware } from 'next-intl/middleware'

export default createI18nMiddleware({
  locales: ['en', 'ko'],
  defaultLocale: 'ko'
})
🔧 주요 기능 모듈
✅ 다국어 전환 (/ko, /en)

✅ 다크/라이트 모드 전환 (localStorage + dark: 클래스)

✅ 게시글 MDX 렌더링 + 채팅 UI 형식 렌더링

✅ Giscus 댓글 연동

✅ Link Preview (og: 메타 기반, 또는 OpenGraph API 연동)

❌ 금지사항
CSS-in-JS 사용 금지 (Emotion, Styled-Components 등)

복잡한 애니메이션/인터랙션 남발 금지

명확한 폴더 구조 없이 라우팅 구성 금지

번역 없는 콘텐츠 merge 금지

📚 참고자료
next.js 공식 문서: https://nextjs.org/docs

next-intl 다국어 플러그인: https://github.com/amannn/next-intl

giscus: https://giscus.app

MDX 처리: @next/mdx + next-mdx-remote 가능
