'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-2">InsightBoard</h1>
        <p className="text-xl text-slate-300 mb-2">YouTube Video Stats Analyzer</p>
        <p className="text-slate-400 mb-8">Analyze video statistics and save your favorites</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Sign Up
          </Link>
          <Link
            href="/analyzer"
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
          >
            Try Analyzer
          </Link>
        </div>
      </div>
    </main>
  );
}