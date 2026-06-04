import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => (
  <main className="admin-layout page-offset">
    <AdminSidebar />
    <section className="admin-content">
      <Outlet />
    </section>
  </main>
);

export default AdminLayout;
