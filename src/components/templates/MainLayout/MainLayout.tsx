import type { ReactNode } from 'react';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  header?: ReactNode;
  tabs?: ReactNode;
  children?: ReactNode;
  liveMessage?: string;
}

/**
 * Template: defines the overall page structure with slots for header and main content.
 */
export default function MainLayout({ header, tabs, children, liveMessage }: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <a href="#main-content" className={styles.skipLink}>
        Skip to content
      </a>
      {header}
      <main id="main-content" className={styles.main}>
        {tabs}
        {children}
      </main>
      <div className={styles.srOnly} aria-live="polite" aria-atomic="true" role="status">
        {liveMessage}
      </div>
    </div>
  );
}
