import { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorBoundary.module.css';

/**
 * Catches rendering errors in child components and displays
 * a fallback UI instead of a white screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1 className={styles.heading}>Something went wrong</h1>
          <p className={styles.message}>
            The application encountered an unexpected error. Try refreshing the page.
          </p>
          <pre className={styles.errorBox}>{this.state.error?.message}</pre>
          <button className={styles.reloadBtn} onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};
