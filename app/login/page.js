import { redirect } from 'next/navigation';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata = {
  title: 'Login — Product Admin',
  description: 'Sign in to manage products',
};

export default function LoginPage() {
  // Note: We can't check auth here (server component + localStorage).
  // Client-side redirect if already logged in will be handled by AuthGate later.
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8">
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Product Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Sign in to manage your products
            </p>
          </header>

          <LoginForm />

          <footer className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Demo credentials: <code className="text-gray-600">emilys</code> /{' '}
              <code className="text-gray-600">emilyspass</code>
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}