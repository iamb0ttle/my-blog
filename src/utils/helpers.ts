import { type CollectionEntry } from 'astro:content';

export function sortItemsByDateDesc(itemA: CollectionEntry<'blogs'>, itemB: CollectionEntry<'blogs'>) {
    return getPostDate(itemB).getTime() - getPostDate(itemA).getTime();
}

export function createSlugFromTitle(title: string): string {
    const normalized = title
        .normalize('NFKC')
        .toLowerCase()
        .trim()
        .replace(/[’'"]/g, '')
        .replace(/[^\p{Letter}\p{Number}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');

    return normalized || 'tag';
}

export function getAllTags(posts: CollectionEntry<'blogs'>[]) {
    const tags: string[] = [...new Set(posts.flatMap((post) => post.data.tags || []).filter(Boolean))];
    return tags
        .map((tag) => {
            return {
                name: tag,
                id: createSlugFromTitle(tag)
            };
        })
        .filter((obj, pos, arr) => {
            return arr.map((mapObj) => mapObj.id).indexOf(obj.id) === pos;
        });
}

export function getPostsByTag(posts: CollectionEntry<'blogs'>[], tagId: string) {
    const filteredPosts: CollectionEntry<'blogs'>[] = posts.filter((post) => (post.data.tags || []).map((tag) => createSlugFromTitle(tag)).includes(tagId));
    return filteredPosts;
}

export function getPostDate(post: CollectionEntry<'blogs'>) {
    const rawDate = post.data.pubDate ?? post.data.date;
    if (!rawDate) return new Date(0);
    return rawDate instanceof Date ? rawDate : new Date(rawDate);
}

export function getPostDescription(post: CollectionEntry<'blogs'>) {
    return post.data.description ?? post.data.excerpt ?? "";
}

export function getPostImage(post: CollectionEntry<'blogs'>) {
    return post.data.image ?? post.data.featuredImage ?? "";
}

export const withBase = (path: string) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${cleanPath}`;
};
