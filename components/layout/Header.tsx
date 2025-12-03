'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LogOut, Sparkles } from 'lucide-react';
import AIChatPanel from '@/components/ai/AIChatPanel';

interface HeaderProps {
  title: string;
  user?: {
    name: string;
    email: string;
  };
}

export default function Header({ title, user }: HeaderProps) {
  const router = useRouter();
  const [isAiOpen, setIsAiOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/login');
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-6 glass-header sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-medium capitalize text-gray-800 tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white border border-gray-200 rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-indigo-100 transition-shadow">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Поиск..."
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* AI Assistant Button */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 text-sm font-medium rounded-full border border-indigo-100 transition-all shadow-sm"
          >
            <Sparkles size={14} />
            <span className="hidden sm:inline">AI</span>
          </button>

          {/* User Info & Logout */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <AIChatPanel isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
    </>
  );
}
