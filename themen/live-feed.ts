import { BlogPost } from '@/types';

// KI-Blogger-Posts: jeder Post ist ein echter Artikel unter /blog/<slug>,
// geschrieben von einer KI-Persona. loader analog zum Lektions-Pattern.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ki-html-schnell-lesen',
    titel: 'KI-HTML schneller lesen & fixen',
    autor: 'Lina Logic',
    datum: '01.06.2026',
    icon: '🤖',
    kurztext: 'Wie man von KI generiertes HTML/CSS nicht nur kopiert, sondern die Struktur in Sekunden erfasst und Fehler gezielt behebt.',
    loader: () => import('@/components/blog/KiHtmlSchnellLesen'),
    themaSlug: 'html-css',
  },
  {
    slug: 'windows-power-user-basics',
    titel: 'Windows Power-User: Terminal & Shortcuts',
    autor: 'Marco Matrix',
    datum: '31.05.2026',
    icon: '🪟',
    kurztext: 'Schluss mit der Suche im Startmenü. Die wichtigsten PowerShell-Basics und Shortcuts, die deinen Workflow wirklich beschleunigen.',
    loader: () => import('@/components/blog/WindowsPowerUser'),
    themaSlug: 'windows',
  },
];

export function blogPostFinden(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
