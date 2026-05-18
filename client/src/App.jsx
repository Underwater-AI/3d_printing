import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import PageTransition from './components/ui/PageTransition.jsx';
import ErrorBoundary from './components/ui/ErrorBoundary.jsx';
import { useAuthStore } from './lib/store.js';

const Home = lazy(() => import('./pages/Home.jsx'));
const Order = lazy(() => import('./pages/Order.jsx'));
const Gallery = lazy(() => import('./pages/Gallery.jsx'));
const Pricing = lazy(() => import('./pages/Pricing.jsx'));
const Track = lazy(() => import('./pages/Track.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const FreeAssets = lazy(() => import('./pages/FreeAssets.jsx'));

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      gap: 16,
    }}>
      <div style={{
        width: 40,
        height: 40,
        border: '2px solid rgba(143, 174, 126, 0.15)',
        borderTopColor: 'var(--color-accent-sage)',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        Loading
      </span>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/order" element={<Order />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/track" element={<Track />} />
              <Route path="/about" element={<About />} />
              <Route path="/assets" element={<FreeAssets />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </PageTransition>
    </AnimatePresence>
  );
}

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-bg-elevated)',
            color: 'var(--color-text-primary)',
            border: 'var(--border-subtle)',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-elevated)',
          },
          success: {
            iconTheme: { primary: 'var(--color-accent-sage)', secondary: 'var(--color-bg-elevated)' },
          },
          error: {
            iconTheme: { primary: 'var(--color-error)', secondary: 'var(--color-bg-elevated)' },
          },
        }}
      />
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <AnimatedRoutes />
      </main>
      <Footer />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </BrowserRouter>
  );
}
