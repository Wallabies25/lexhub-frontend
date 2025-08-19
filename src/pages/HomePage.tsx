import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Users, BookOpen, ArrowRight, Shield, Globe, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import ChatbotWidget from '../components/ChatbotWidget';

const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { t } = useLanguage();
  const { isLoggedIn } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/statutes?q=${encodeURIComponent(searchQuery)}&filter=${selectedFilter}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-600 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-12">
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-4 shadow-2xl">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search.placeholder')}
                      className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-lg"
                      aria-label="Search legal database"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-4 py-4 text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    aria-label="Filter by category"
                  >
                    <option value="all">{t('filter.all')}</option>
                    <option value="trademarks">{t('filter.trademarks')}</option>
                    <option value="copyrights">{t('filter.copyrights')}</option>
                    <option value="patents">{t('filter.patents')}</option>
                    <option value="designs">{t('filter.designs')}</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth"
                className="inline-flex items-center px-8 py-4 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors font-semibold text-lg"
              >
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/consultation"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-900 transition-colors font-semibold text-lg"
              >
                {t('consultation.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Only show the rest of the homepage if not logged in */}
      {!isLoggedIn && (
        <>
          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    500+
                  </div>
                  <div className="text-gray-600 font-medium">Legal Documents</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    50+
                  </div>
                  <div className="text-gray-600 font-medium">Verified Lawyers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    1000+
                  </div>
                  <div className="text-gray-600 font-medium">Users Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-600 font-medium">AI Support</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Comprehensive IP Law Platform
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to understand, research, and navigate intellectual property law in Sri Lanka
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Floating Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default Homepage;