import PropTypes from 'prop-types';
import styles from './MainLayout.module.css';

/**
 * Template: defines the overall page structure with slots for header and main content.
 * Includes an aria-live region for announcing dynamic changes to screen readers.
 *
 * @param {{ header: ReactNode, tabs: ReactNode, children: ReactNode, liveMessage: string }}
 */
export default function MainLayout({ header, tabs, children, liveMessage }) {
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

MainLayout.propTypes = {
  header: PropTypes.node,
  tabs: PropTypes.node,
  children: PropTypes.node,
  liveMessage: PropTypes.string,
};
