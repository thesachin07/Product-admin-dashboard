'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useAuthContext } from '@/features/auth/state/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuthContext();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/products" className="font-semibold text-gray-900">
          Product Admin
        </Link>

        {user && (
          <div ref={ref} className="relative">
            <button
              onClick={() => setOpen((p) => !p)}
              className="text-sm text-gray-700 hover:text-gray-900"
            >
              {user.firstName || user.username}
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-md py-2">
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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