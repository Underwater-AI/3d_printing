import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
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

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      color: 'var(--color-text-secondary)',
      fontFamily: 'var(--font-label)',
      fontSize: '0.875rem',
      letterSpacing: '0.05em',
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '2px solid var(--color-accent-cyan)',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginRight: 12,
      }} />
      LOADING…
    </div>
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
          },
        }}
      />
      <Navbar />
      <main style={{ minHeight: '100vh' }}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/order" element={<Order />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/track" element={<Track />} />
            <Route path="/about" element={<About />} />
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
      </main>
      <Footer />
    </BrowserRouter>
  );
}
