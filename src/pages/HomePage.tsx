import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight, FileText, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import ChatbotWidget from '../components/ChatbotWidget';

// AnimatedCounter component for statistics animation
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Start animation immediately
    let timeoutId: number | null = null;
    
    // Simple animation logic with setInterval for better browser compatibility
    const startValue = 0;
    const increment = Math.ceil(end / 50); // Divide animation into ~50 steps
    const stepDuration = Math.floor(duration / 50);
    
    let currentValue = startValue;
    
    // Start the counter animation
    const intervalId = setInterval(() => {
      currentValue += increment;
      
      // Make sure we don't exceed the target value
      if (currentValue >= end) {
        currentValue = end;
        clearInterval(intervalId);
      }
      
      setCount(currentValue);
    }, stepDuration);
    
    // Cleanup function
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [end, duration]);

  return <span className="transition-all duration-100">{count}{suffix}</span>;
};

const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { t } = useLanguage();
  const { isLoggedIn } = useUser();
  // State to trigger counter animations
  const [animateStats, setAnimateStats] = useState(false);
  
  // Trigger animations after a small delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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
        <>          {/* Stats Section with Animated Counters */}
          <section className="py-16 bg-gradient-to-r from-blue-900 to-emerald-700 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white"></div>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                    <FileText className="h-8 w-8" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {animateStats && <AnimatedCounter end={500} duration={2500} suffix="+" />}
                    {!animateStats && <span>0+</span>}
                  </div>
                  <div className="text-sm font-medium tracking-wider uppercase">Legal Documents</div>
                </div>
                
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {animateStats && <AnimatedCounter end={50} duration={1800} suffix="+" />}
                    {!animateStats && <span>0+</span>}
                  </div>
                  <div className="text-sm font-medium tracking-wider uppercase">Verified Lawyers</div>
                </div>
                
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                    <Layers className="h-8 w-8" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {animateStats && <AnimatedCounter end={1000} duration={3000} suffix="+" />}
                    {!animateStats && <span>0+</span>}
                  </div>
                  <div className="text-sm font-medium tracking-wider uppercase">Users Helped</div>
                </div>
                
                <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                  <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                    <Search className="h-8 w-8" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {animateStats && <span className="animate-pulse">24/7</span>}
                    {!animateStats && <span>24/7</span>}
                  </div>
                  <div className="text-sm font-medium tracking-wider uppercase">AI Support</div>
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