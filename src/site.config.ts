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
    website: 'https://example.com',
    title: 'My Blog',
    description: '개인 블로그',
    headerNavLinks: [
        {
            text: 'Home',
            href: withBase('/')
        },
        {
            text: 'Blog',
            href: withBase('/blog')
        },
        {
            text: 'Tags',
            href: withBase('/tags')
        },
        {
            text: 'About',
            href: withBase('/about')
        },
        {
            text: 'Contact',
            href: withBase('/contact')
        }
    ],
    footerNavLinks: [
        {
            text: 'About',
            href: withBase('/about')
        },
        {
            text: 'Contact',
            href: withBase('/contact')
        },
        {
            text: 'Sitemap',
            href: withBase('/sitemap-index.xml')
        }
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/'
        },
        {
            text: 'X',
            href: 'https://x.com/'
        }
    ],
    hero: {
        eyebrowText: '',
        title: 'My Blog',
        text: "기록을 정리하는 공간입니다.",
        actions: [
            {
                text: 'Read',
                href: withBase('/blog')
            }
        ]
    },
    about: {
        title: 'About',
        text: '소개 글을 여기에 작성하세요.',
    },
    contactInfo: {
        title: 'Contact',
        text: "연락이 필요하면 아래 정보를 사용하세요.",
        email: {
            text: "이메일",
            href: "mailto:example@example.com",
            email: "example@example.com"
        },
        socialProfiles: [
            {
                text: "GitHub",
                href: "https://github.com/"
            },
            {
                text: "X",
                href: "https://x.com/"
            }
        ]
    },
    blog: {
        description: "전체 글 목록입니다."
    },
    postsPerPage: 2,
    recentPostLimit: 3
};

export default siteConfig;
