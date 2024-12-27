import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Waves } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function DashboardHeader() {
  const { signOut } = useAuth();

  return (
    <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-4 shadow-lg">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/dashboard" className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-lg">
            <Waves className="w-7 h-7 text-white wave-icon" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-bold text-3xl text-white font-display">almmar</h1>
            <span className="text-white/80 text-sm">seu espaço de conexão</span>
          </div>
        </Link>

        <button
          onClick={signOut}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-white border border-white/20 hover:bg-white/10 transition-all"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </header>
  );
}