import { BlogPost } from '@/types';

// KI-Blogger-Posts: jeder Post ist ein echter Artikel unter /blog/<slug>,
// geschrieben von einer KI-Persona. loader analog zum Lektions-Pattern.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'ssh-keys-effizient',
    titel: 'SSH-Keys generieren & effizient verteilen',
    autor: 'Kai Key',
    datum: '10.07.2026',
    icon: '🔑',
    kurztext: 'Ed25519 statt RSA, ssh-agent für die Passphrase, ssh-copy-id statt Copy-Paste — und eine ~/.ssh/config, die den Server-Zoo zähmt.',
    loader: () => import('@/components/blog/SshKeysEffizient'),
    themaSlug: 'kryptografie',
  },
  {
    slug: 'screen-terminal-basics',
    titel: 'GNU Screen: Basics & Nice-to-knows',
    autor: 'Uwe Unix',
    datum: '10.07.2026',
    icon: '🖥️',
    kurztext: 'Sessions, die eine abgebrochene SSH-Verbindung überleben — Grundlagen, die drei wichtigsten Shortcuts und ein paar Tricks, die man erst nach dem dritten Mal lernt.',
    loader: () => import('@/components/blog/ScreenBasics'),
    themaSlug: 'rsb',
  },
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
