import { withBase } from "./utils/helpers";

export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
};

export type Hero = {
  eyebrowText?: string;
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};

export type About = {
  title?: string;
  text?: string;
};

export type Blog = {
  description?: string;
};

export type ContactInfo = {
  title?: string;
  text?: string;
  email?: {
    text?: string;
    href?: string;
    email?: string;
  };
  socialProfiles?: {
    text?: string;
    href?: string;
  }[];
};

export type SiteConfig = {
  website: string;
  logo?: Image;
  title: string;
  description: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  about?: About;
  contactInfo?: ContactInfo;
  blog?: Blog;
  postsPerPage?: number;
  recentPostLimit: number;
  projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
  website: "https://iamb0ttle.github.io/my-blog/",
  title: "Byeonghyun Na's Blog",
  description: "나병현의 개인 블로그",
  headerNavLinks: [
    { text: "Home", href: withBase("/") },
    { text: "Blog", href: withBase("/blog") },
    { text: "Tags", href: withBase("/tags") },
    { text: "About", href: withBase("/about") },
    { text: "Contact", href: withBase("/contact") },
  ],
  footerNavLinks: [
    { text: "About", href: withBase("/about") },
    { text: "Contact", href: withBase("/contact") },
    { text: "Sitemap", href: withBase("/sitemap-index.xml") },
  ],
  socialLinks: [
    { text: "GitHub", href: "https://github.com/iamb0ttle" },
    { text: "LinkedIn", href: "https://www.linkedin.com/in/byeonghyeon-na/" },
  ],
  hero: {
    eyebrowText: "나병현의 생각을 들여다 보기 👀",
    title: "Welcome!",
    text: "나병현의 블로그에 오신걸 \n 환영합니다. 자유롭게 살펴보세요 🥳",
    image: {
      src: withBase("/images/hero/hero.jpg"),
      alt: "Home hero image",
    },
    actions: [
      {
        text: "Read",
        href: withBase("/blog"),
      },
    ],
  },
  about: {
    title: "About",
    text: "안녕하세요! 저는 문제를 해결하고, 사람들이 겪는 불편 속에서 의미 있는 기회를 발견하는 것을 좋아하는 사람입니다. 아이디어를 빠르게 실행으로 옮기고, 실제 사용자와의 경험을 통해 끊임없이 개선해 나가는 과정에서 보람을 느낍니다. 나아가 이러한 작은 해결들이 모여 공동체의 성장에 기여하고, 더 나은 세상과 평화로 이어지기를 바랍니다.\n\n저는 문제를 해결하기 위해 필요한 일이라면 무엇이든 하는 것을 좋아합니다. 그것이 개발이든, 공학이든, 과학이든, 마케팅이든 상관없이 본질적인 문제 해결에 가까워질 수 있다면 기꺼이 도전합니다. 앞으로의 제 행보를 기대해주세요!",
  },
  contactInfo: {
    title: "Contact",
    text: "저는 새로운 사람과 연결되는 걸 좋아해요. \n 언제든 편하게 연락 주세요 ☕",
    email: {
      text: "이메일",
      href: "mailto:bhyun08@dsm.hs.kr",
      email: "bhyun08@dsm.hs.kr",
    },
    socialProfiles: [
      { text: "GitHub", href: "https://github.com/iamb0ttle" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/byeonghyeon-na/" },
    ],
  },
  blog: {
    description: "전체 글 목록입니다.",
  },
  postsPerPage: 5,
  recentPostLimit: 3,
};

export default siteConfig;
