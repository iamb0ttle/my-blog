'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { Sidebar } from '@/components/Sidebar';
import { Locale } from '@/lib/i18n';
import { Post } from '@/lib/posts';

interface HomePageClientProps {
  locale: Locale;
  posts: Post[];
}

export function HomePageClient({ locale, posts }: HomePageClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      <div className="flex h-full">
        <Sidebar 
          locale={locale} 
          posts={posts} 
          onMobileToggle={setIsMobileSidebarOpen}
        />
        <main className="flex-1 flex flex-col overflow-hidden min-w-0 md:relative home-main-content">
          <ChatInterface locale={locale} posts={posts} />
        </main>
      </div>
    </div>
  );
}