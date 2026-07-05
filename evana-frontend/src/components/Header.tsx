import React from 'react';
import { Music, Calendar } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-festava-dark text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="w-6 h-6 text-festava-secondary" />
            <span className="font-bold text-xl">EVANA</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <Calendar className="w-4 h-4" />
              <span>2026</span>
            </div>

            {/* <AuthButton /> déconnexion */}
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;