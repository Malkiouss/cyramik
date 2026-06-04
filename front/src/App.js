import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
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

const App = () => (
  <BrowserRouter>
    <Navbar />
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
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminDashboard type="products" />} />
        <Route path="workshops" element={<AdminDashboard type="workshops" />} />
        <Route path="bookings" element={<AdminDashboard type="bookings" />} />
        <Route path="blog" element={<AdminDashboard type="blog" />} />
        <Route path="messages" element={<AdminDashboard type="messages" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
