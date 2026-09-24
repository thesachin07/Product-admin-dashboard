'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useAuthContext } from '@/features/auth/state/AuthContext';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function handleLogout() {
    toast.success('Logged out');
    logout();
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const initials = user
    ? (user.firstName?.[0] || '') + (user.lastName?.[0] || '') ||
      user.username?.[0]?.toUpperCase() ||
      'U'
    : '';

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/products" className="font-semibold text-gray-900">
          Product Admin
        </Link>

        {user && (
          <div
            ref={ref}
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              onClick={() => setOpen((p) => !p)}
              aria-expanded={open}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition"
            >
              <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center uppercase">
                {initials}
              </span>

              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user.firstName || user.username}
              </span>

              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-400"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}