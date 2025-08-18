import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, Globe, UserCircle, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  // Filter navigation items based on authentication
  const getNavItems = () => {
    if (isAuthenticated) {
      // For authenticated users, show only chatbot, statutes, forum, consultation
      return [
        { path: '/chatbot', label: t('nav.chatbot') },
        { path: '/statutes', label: t('nav.statutes') },
        { path: '/forum', label: t('nav.forum') },
        { path: '/consultation', label: t('nav.consultation') },
      ];
    } else {
      // For non-authenticated users, show all items
      return [
        { path: '/', label: t('nav.home') },
        { path: '/chatbot', label: t('nav.chatbot') },
        { path: '/statutes', label: t('nav.statutes') },
        { path: '/forum', label: t('nav.forum') },
        { path: '/consultation', label: t('nav.consultation') },
        { path: '/about', label: t('nav.about') },
      ];
    }
  };

  const navItems = getNavItems();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">LexHub IP</h1>
              <p className="text-xs text-gray-600">Sri Lanka</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-blue-900 ${
                  location.pathname === item.path
                    ? 'text-blue-900 border-b-2 border-emerald-500 pb-1'
                    : 'text-gray-600'
                }`}
                aria-label={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side content */}
          <div className="flex items-center space-x-4">
            {/* Language Selector - only show for non-authenticated users */}
            {!isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-900 transition-colors"
                  aria-label="Select language"
                  aria-expanded={isLanguageOpen}
                  aria-haspopup="true"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {languages.find(lang => lang.code === language)?.name}
                  </span>
                </button>
                
                {isLanguageOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as 'en' | 'si' | 'ta');
                          setIsLanguageOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-3 ${
                          language === lang.code ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Auth Section */}
            {isAuthenticated ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  aria-label="User menu"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <Link
                to="/auth"
                className="hidden md:inline-flex px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
              >
                {t('nav.login')}
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-900 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-blue-900 ${
                    location.pathname === item.path
                      ? 'text-blue-900'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-700 hover:text-blue-900"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2 py-2 text-sm text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium w-fit"
                >
                  {t('nav.login')}
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;