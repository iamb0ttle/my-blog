import { Post } from './posts';
import { Locale } from './i18n';

export interface SearchResult extends Post {
  relevance: number;
  matchType: 'title' | 'content' | 'excerpt' | 'tag';
}

export function searchPosts(posts: Post[], query: string): SearchResult[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  posts.forEach(post => {
    let relevance = 0;
    let matchType: SearchResult['matchType'] = 'content';

    // Title match (highest priority)
    if (post.title.toLowerCase().includes(normalizedQuery)) {
      relevance += 10;
      matchType = 'title';
    }

    // Excerpt match (high priority)
    if (post.excerpt?.toLowerCase().includes(normalizedQuery)) {
      relevance += 7;
      if (matchType === 'content') matchType = 'excerpt';
    }

    // Tag match (medium priority)
    if (post.tags?.some(tag => tag.toLowerCase().includes(normalizedQuery))) {
      relevance += 5;
      if (matchType === 'content') matchType = 'tag';
    }

    // Content match (lower priority)
    if (post.content.toLowerCase().includes(normalizedQuery)) {
      relevance += 2;
    }

    // Boost relevance for exact matches
    if (post.title.toLowerCase() === normalizedQuery) {
      relevance += 20;
    }

    if (relevance > 0) {
      results.push({
        ...post,
        relevance,
        matchType
      });
    }
  });

  // Sort by relevance (highest first)
  return results.sort((a, b) => b.relevance - a.relevance);
}

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
}

export function getSearchSnippet(content: string, query: string, maxLength: number = 150): string {
  if (!query.trim()) return content.substring(0, maxLength) + '...';
  
  const normalizedQuery = query.toLowerCase();
  const normalizedContent = content.toLowerCase();
  const index = normalizedContent.indexOf(normalizedQuery);
  
  if (index === -1) {
    return content.substring(0, maxLength) + '...';
  }
  
  const start = Math.max(0, index - 50);
  const end = Math.min(content.length, index + query.length + 50);
  const snippet = content.substring(start, end);
  
  return (start > 0 ? '...' : '') + snippet + (end < content.length ? '...' : '');
}