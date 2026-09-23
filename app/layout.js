import './globals.css';
import { AuthProvider } from '@/features/auth/state/AuthContext';

export const metadata = {
  title: 'Product Admin Dashboard',
  description: 'Admin dashboard to manage products via DummyJSON API',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}