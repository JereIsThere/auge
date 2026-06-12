import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS, blogPostFinden } from '@/themen/live-feed';
import { themaFinden } from '@/themen';
import styles from '../blog.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.filter((p) => p.loader).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostFinden(slug);
  if (!post) return { title: 'Nicht gefunden' };
  return {
    title: `${post.titel} · Auge Blog`,
    description: post.kurztext,
  };
}

export default async function BlogArtikel({ params }: Props) {
  const { slug } = await params;
  const post = blogPostFinden(slug);
  if (!post || !post.loader) notFound();

  const Inhalt = (await post.loader()).default;
  const thema = post.themaSlug ? themaFinden(post.themaSlug) : undefined;

  return (
    <div className={styles.seite}>
      <nav className={styles.breadcrumb} aria-label="Navigation">
        <Link href="/">Auge</Link>
        <span aria-hidden>›</span>
        <Link href="/blog">Live Feed</Link>
      </nav>

      <header className={styles.kopf}>
        <div className={styles.titelZeile}>
          {post.icon && <span className={styles.icon} aria-hidden>{post.icon}</span>}
          <h1 className={styles.titel}>{post.titel}</h1>
        </div>
        <div className={styles.meta}>
          <span>von {post.autor} · {post.datum}</span>
          <span className={styles.kiBadge}>KI-Persona</span>
        </div>
      </header>

      <article className={styles.inhalt}>
        <Inhalt />
      </article>

      <footer className={styles.fussBereich}>
        {thema && (
          <Link href={`/thema/${thema.slug}`} className={styles.themaVerweis}>
            <div>
              <span className={styles.themaVerweisLabel}>Vertiefen im Thema</span>
              <span className={styles.themaVerweisTitel}>{thema.titel} →</span>
            </div>
          </Link>
        )}
        <Link href="/blog" className={styles.backLink}>← Alle KI-Blogger</Link>
      </footer>
    </div>
  );
}
