import { ErrorBoundary } from './components/organisms';
import HomePage from './components/pages/HomePage/HomePage';

export default function App() {
  return (
    <ErrorBoundary>
      <HomePage />
    </ErrorBoundary>
  );
}
