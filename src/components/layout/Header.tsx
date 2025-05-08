import React, { useState } from 'react';
import { FilmIcon, Menu, X, UserCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const { state, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Watchlist', path: '/watchlist' },
    { name: 'Watched', path: '/watched' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="bg-amber-500 p-1.5 rounded-full">
              <FilmIcon size={20} className="text-gray-900" />
            </div>
            <span className="font-bold text-lg">Movie Memo Pad</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`hover:text-amber-400 transition-colors duration-200 ${
                  isActive(item.path) ? 'text-amber-500 font-medium' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <UserCircle size={22} />
              <span>{state.user?.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-sm text-gray-300 hover:text-white"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col space-y-3 pb-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`py-2 px-3 rounded ${
                    isActive(item.path)
                      ? 'bg-gray-700 text-amber-500'
                      : 'hover:bg-gray-700'
                  }`}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2 py-2 px-3">
                  <UserCircle size={20} />
                  <span>{state.user?.username}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 py-2 px-3 text-red-400 hover:bg-gray-700 w-full rounded text-left"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;