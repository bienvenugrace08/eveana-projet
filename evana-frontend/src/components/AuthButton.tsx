import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthButton: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, username, logout, role } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      logout();
    } else {
      navigate('/login');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center space-x-2 bg-white text-festava-dark px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
    >
      {isAuthenticated ? (
        <>
          <User className="w-4 h-4" />
          <span>{username} ({role})</span>
          <LogOut className="w-4 h-4" />
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          <span>Connexion</span>
        </>
      )}
    </button>
  );
};

export default AuthButton;