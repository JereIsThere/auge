import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import styles from './layout.module.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Auge', template: '%s · Auge' },
  description: 'Handkuratiertes Lernportal – interaktive Lektionen, mehrere Tiefen.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <a href="#haupt" className="skip-link">Zum Inhalt springen</a>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <a href="/" className={styles.logo}>
              <span className={styles.logoAuge}>Auge</span>
              <span className={styles.logoVersion}>2</span>
            </a>
          </nav>
        </header>
        <main id="haupt" className={styles.haupt}>
          {children}
        </main>
      </body>
    </html>
  );
}
