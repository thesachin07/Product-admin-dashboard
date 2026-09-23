import ProtectedRoute from '@/shared/components/ProtectedRoute';
import Navbar from '@/shared/components/Navbar';

export default function ProductsLayout({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </ProtectedRoute>
  );
}