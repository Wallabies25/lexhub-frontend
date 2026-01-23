import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Menu, X, Globe, User, Briefcase, Shield, Settings, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import SettingsModal from '../pages/SettingsModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { isLoggedIn, role, setRole, logout, user } = useUser();

  const navItems = [
    { path: '/home', label: t('nav.home') },
    { path: '/chatbot', label: t('nav.chatbot') },
    { path: '/statutes', label: t('nav.statutes') },
    { path: '/forum', label: t('nav.forum') },
    { path: '/blogs', label: 'Blogs' }, // New Blogs nav item
    { path: '/consultation', label: t('nav.consultation') },
    { path: '/about', label: t('nav.about') },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', name: 'தமிழ்', flag: '🇱🇰' },
  ];

  // Profile button logic
  const renderProfileButton = () => {
    if (!isLoggedIn) return null;
    let photo = user?.photo || '/default-avatar.png';
    // Use user.displayName and user.bio directly
    return (
      <div className="relative">
        <button
          className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <img src={photo} alt="Profile" className="w-7 h-7 rounded-full object-cover border-2 border-white" />
          <span className="hidden sm:inline">{user?.displayName || 'Profile'}</span>
        </button>
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-2">
              <img src={photo} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-blue-900" />
              <div>
                <div className="font-semibold text-gray-900">{user?.displayName || ''}</div>
                <div className="text-xs text-gray-500">{user?.email || ''}</div>
                {user?.bio && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">{user.bio}</div>
                )}
              </div>
            </div>
            <button
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => { setShowSettings(true); setIsProfileOpen(false); }}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </button>
            <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Activity className="h-4 w-4" />
              <span>Recent Activities</span>
            </button>
            <button
              onClick={() => { logout(); setIsProfileOpen(false); }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100 mt-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <div className="p-2 bg-blue-900 rounded-lg">
              <Scale className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">LexHub IP</h1>
              <p className="text-xs text-gray-600">Sri Lanka</p>
            </div>
          </Link>

          {/* Desktop Navigation - expanded to fill space */}
          <nav className="hidden md:flex flex-1 items-center justify-center mx-8 gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-base font-semibold transition-colors hover:text-blue-900 ${
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

          {/* Language Toggle & Profile Button */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Language Selector */}
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
            {/* Profile Sector: icon and name grouped together, with dropdown */}
            <div className="relative flex items-center bg-gray-100 rounded-full px-2 py-1 flex-grow min-w-0 max-w-xs md:max-w-none md:flex-grow md:ml-0 ml-0">
              <button
                className="flex-shrink-0 items-center justify-center w-10 h-10 rounded-full bg-blue-900 hover:bg-blue-800 transition-colors focus:outline-none flex"
                aria-label="Profile"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img src={user?.photo || '/default-avatar.png'} alt="Profile" className="w-7 h-7 rounded-full object-cover border-2 border-white" />
              </button>
              <span
                className="font-medium text-gray-800 hidden md:inline cursor-pointer flex-grow ml-2 truncate text-right select-none"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                title={user?.displayName || 'Chandramukhiee'}
              >
                {user?.displayName || 'Chandramukhiee'}
              </span>
              {isProfileOpen && (
                <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center space-x-2">
                    <img src={user?.photo || '/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-blue-900" />
                    <div>
                      <div className="font-semibold text-gray-900">{user?.displayName || 'Chandramukhiee'}</div>
                      <div className="text-xs text-gray-500">{user?.email || 'john.doe@email.com'}</div>
                      {user?.bio && (
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">{user.bio}</div>
                      )}
                    </div>
                  </div>
                  <button
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => { setShowSettings(true); setIsProfileOpen(false); }}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Activity className="h-4 w-4" />
                    <span>Recent Activities</span>
                  </button>
                  <button
                    onClick={() => { logout(); setIsProfileOpen(false); }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 border-t border-gray-100 mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
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
            </nav>
          </div>
        )}
      </div>
      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </header>
  );
};

export default Header;