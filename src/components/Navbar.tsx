'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/useAuth';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">InsightBoard</h1>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/analyzer"
              className="text-slate-300 hover:text-white transition"
            >
              Analyzer
            </Link>

            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white transition"
            >
              Dashboard
            </Link>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-slate-300">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}