import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Plans } from '../components/Plans';
import { Testimonials } from '../components/Testimonials';
import { FAQ } from '../components/FAQ';

export function LandingPage() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      localStorage.setItem('initialMessage', message);
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white relative overflow-hidden min-h-screen">
        <Navbar />
        <div className="waves"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 relative z-10">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Waves className="w-8 h-8 sm:w-10 sm:h-10 text-white wave-icon" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display">almmar</h1>
          </div>
          <p className="text-xl sm:text-2xl text-center text-white/90 max-w-2xl mx-auto mb-12">
            Seu espaço seguro de conexão e autoconhecimento
          </p>
          
          <form onSubmit={handleMessageSubmit} className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 sm:p-6">
              <input
                type="text"
                placeholder="Como você está se sentindo hoje?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 sm:p-4 rounded-lg bg-white/10 text-white placeholder-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          </form>
        </div>
      </header>

      <Plans />
      <Testimonials />
      <FAQ />

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 SAVINI COMUNICAÇÕES. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}