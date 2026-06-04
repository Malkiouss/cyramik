import { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminLayout from './components/AdminLayout';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Blog from './pages/Blog';
import Boutique from './pages/Boutique';
import Cafe from './pages/Cafe';
import Ceramique from './pages/Ceramique';
import ClientSpace from './pages/ClientSpace';
import Contact from './pages/Contact';
import Engagements from './pages/Engagements';
import Evenements from './pages/Evenements';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import './App.css';

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname, search]);

  return null;
};

const PageTransition = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.main
      className="page-transition"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  );
};

const AppShell = () => {
  const location = useLocation();
  const { pathname } = location;
  const isAdmin = pathname.startsWith('/admin') || pathname === '/login';

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <PageTransition key={location.pathname}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cafe" element={<Cafe />} />
            <Route path="/ceramique" element={<Ceramique />} />
            <Route path="/ceramique/:id" element={<ProductDetail />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/boutique/:id" element={<ProductDetail />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<Blog />} />
            <Route path="/engagements" element={<Engagements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/client" element={<ClientSpace />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="commandes" element={<AdminDashboard type="commandes" />} />
              <Route path="paiements-square" element={<AdminDashboard type="paiements-square" />} />
              <Route path="ceramique" element={<AdminDashboard type="ceramique" />} />
              <Route path="goodies" element={<AdminDashboard type="goodies" />} />
              <Route path="ateliers" element={<AdminDashboard type="ateliers" />} />
              <Route path="iftar" element={<AdminDashboard type="iftar" />} />
              <Route path="calendrier" element={<AdminDashboard type="calendrier" />} />
              <Route path="cartes-cadeaux" element={<AdminDashboard type="cartes-cadeaux" />} />
              <Route path="frais-de-livraison" element={<AdminDashboard type="frais-de-livraison" />} />
              <Route path="blogs" element={<AdminDashboard type="blogs" />} />
              <Route path="utilisateurs" element={<AdminDashboard type="utilisateurs" />} />
              <Route path="messages" element={<AdminDashboard type="messages" />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
