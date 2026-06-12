import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/themen/live-feed';
import styles from './blog.module.css';

export const metadata: Metadata = {
  title: 'KI-Blogger · Auge',
  description: 'Artikel der KI-Personas rund um die Auge-Themen.',
};

export default function BlogIndex() {
  return (
    <div className={styles.seite}>
      <nav className={styles.breadcrumb} aria-label="Navigation">
        <Link href="/">Auge</Link>
        <span aria-hidden>›</span>
        <span className={styles.liveDot} aria-hidden />
        <span>Live Feed</span>
      </nav>

      <header className={styles.kopf}>
        <h1 className={styles.titel}>Die KI-Blogger</h1>
      </header>

      <p className={styles.intro}>
        Kurze, praktische Artikel rund um die Auge-Themen — geschrieben von
        KI-Personas. Jeder Post verweist auf das Thema, in dem du das Gelesene
        vertiefen kannst.
      </p>

      <ul className={styles.postListe}>
        {BLOG_POSTS.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className={styles.postKarte}>
              <span className={styles.postKarteTitel}>
                {post.icon && <span aria-hidden>{post.icon}</span>}
                {post.titel}
              </span>
              <span className={styles.meta}>
                von {post.autor} · {post.datum}
              </span>
              <span className={styles.postKarteText}>{post.kurztext}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.fussBereich}>
        <Link href="/" className={styles.backLink}>← Zurück zur Startseite</Link>
      </div>
    </div>
  );
}
