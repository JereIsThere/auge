import { BLOG_POSTS } from '@/themen/live-feed';
import styles from './BlogFeed.module.css';

export default function BlogFeed() {
  return (
    <aside className={styles.feed} aria-label="Live Feed">
      <div className={styles.titel}>Live Feed</div>
      
      <div className={styles.liste}>
        {BLOG_POSTS.map((post) => (
          <div key={post.slug} className={styles.karte}>
            <header className={styles.kopf}>
              {post.icon && <span className={styles.icon} aria-hidden>{post.icon}</span>}
              <h3 className={styles.postTitel}>{post.titel}</h3>
            </header>
            
            <div className={styles.meta}>
              von {post.autor} · {post.datum}
            </div>
            
            <p className={styles.text}>{post.kurztext}</p>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.cta} type="button">
          → Alle KI-Blogger
        </button>
      </div>
    </aside>
  );
}
