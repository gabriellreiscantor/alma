import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Waves } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center">
              <Waves className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white font-display">almmar</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to="/login"
              className="px-6 py-2 rounded-full text-white border-2 border-white/20 hover:bg-white/10 backdrop-blur-lg transition-all duration-200"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 rounded-full bg-white text-purple-600 hover:bg-white/90 transition-all duration-200 font-medium"
            >
              Começar agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden mt-4 py-4 px-2 bg-white/10 backdrop-blur-lg rounded-xl">
            <div className="flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full px-4 py-2 text-center text-white hover:bg-white/10 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-2 text-center bg-white text-purple-600 rounded-lg hover:bg-white/90 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Começar agora
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}