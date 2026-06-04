import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import './App.css';

const AppShell = () => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin') || pathname === '/login';

  return (
    <>
      {!isAdmin && <Navbar />}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cafe" element={<Cafe />} />
      <Route path="/ceramique" element={<Ceramique />} />
      <Route path="/boutique" element={<Boutique />} />
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
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

export default App;
