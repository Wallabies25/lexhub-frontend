import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Bookmark, ExternalLink, Calendar, Tag, Star } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Statute {
  id: string;
  title: string;
  section: string;
  category: string;
  summary: string;
  lastUpdated: string;
  relevance: number;
  isBookmarked: boolean;
  fullText: string;
}

const StatutePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState<Statute[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedStatute, setExpandedStatute] = useState<string | null>(null);
  const [bookmarkedStatutes, setBookmarkedStatutes] = useState<Set<string>>(new Set());
  const { t } = useLanguage();

  const mockStatutes: Statute[] = [
    {
      id: '1',
      title: 'Intellectual Property Act No. 36 of 2003 - Trademark Registration',
      section: 'Section 15-25',
      category: 'trademarks',
      summary: 'Defines the requirements and procedures for trademark registration in Sri Lanka, including application process, examination criteria, and registration validity.',
      lastUpdated: '2024-01-15',
      relevance: 95,
      isBookmarked: false,
      fullText: 'A trademark may be registered under this Act if it is capable of being represented graphically and is capable of distinguishing goods or services of one undertaking from those of other undertakings...',
    },
    {
      id: '2',
      title: 'Copyright and Related Rights Act No. 15 of 2022',
      section: 'Section 8-12',
      category: 'copyrights',
      summary: 'Establishes copyright protection for original works of authorship, including duration of protection and exclusive rights of copyright owners.',
      lastUpdated: '2024-02-10',
      relevance: 92,
      isBookmarked: false,
      fullText: 'Copyright shall subsist in original literary, dramatic, musical and artistic works, sound recordings, broadcasts and published editions...',
    },
    {
      id: '3',
      title: 'Patents Act No. 13 of 2018 - Patentability Criteria',
      section: 'Section 5-10',
      category: 'patents',
      summary: 'Outlines the criteria for patentability including novelty, inventive step, and industrial applicability requirements for patent applications.',
      lastUpdated: '2023-12-20',
      relevance: 88,
      isBookmarked: false,
      fullText: 'An invention is patentable if it is new, involves an inventive step and is industrially applicable...',
    },
    {
      id: '4',
      title: 'Industrial Designs Act No. 17 of 2021',
      section: 'Section 3-8',
      category: 'designs',
      summary: 'Provides protection for industrial designs that are new and have individual character, covering aesthetic aspects of products.',
      lastUpdated: '2024-01-30',
      relevance: 85,
      isBookmarked: false,
      fullText: 'A design shall be protected if it is new and has individual character. A design is considered to be new if no identical design has been made available to the public...',
    },
  ];

  const categories = [
    { value: 'all', label: t('filter.all') },
    { value: 'trademarks', label: t('filter.trademarks') },
    { value: 'copyrights', label: t('filter.copyrights') },
    { value: 'patents', label: t('filter.patents') },
    { value: 'designs', label: t('filter.designs') },
  ];

  useEffect(() => {
    // Check URL parameters for initial search
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const filter = urlParams.get('filter');
    
    if (query) {
      setSearchQuery(query);
      if (filter && filter !== 'all') {
        setSelectedCategory(filter);
      }
      handleSearch(query, filter || 'all');
    }
  }, []);

  const handleSearch = (query?: string, category?: string) => {
    const searchTerm = query || searchQuery;
    const filterCategory = category || selectedCategory;
    
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredResults = mockStatutes.filter(statute => 
        statute.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        statute.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filterCategory !== 'all') {
        filteredResults = filteredResults.filter(statute => statute.category === filterCategory);
      }

      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const toggleBookmark = (statuteId: string) => {
    const newBookmarks = new Set(bookmarkedStatutes);
    if (newBookmarks.has(statuteId)) {
      newBookmarks.delete(statuteId);
    } else {
      newBookmarks.add(statuteId);
    }
    setBookmarkedStatutes(newBookmarks);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Statute Database</h1>
          <p className="text-gray-600">Search comprehensive Sri Lankan intellectual property laws and regulations</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search statutes"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Filter by category"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isSearching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Searching statutes...</span>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Found {results.length} statute{results.length !== 1 ? 's' : ''}</p>
              <div className="flex items-center space-x-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Sort by Relevance</button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 text-sm font-medium">
                  <Bookmark className="h-4 w-4" />
                  <span>View Bookmarks ({bookmarkedStatutes.size})</span>
                </button>
              </div>
            </div>
            
            {results.map((statute) => (
              <div key={statute.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{statute.title}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {statute.section}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Tag className="h-4 w-4" />
                          <span className="capitalize">{statute.category}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Updated {statute.lastUpdated}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{statute.relevance}% relevance</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{statute.summary}</p>
                    </div>
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => toggleBookmark(statute.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          bookmarkedStatutes.has(statute.id)
                            ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100'
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        aria-label={bookmarkedStatutes.has(statute.id) ? 'Remove bookmark' : 'Add bookmark'}
                      >
                        <Bookmark className={`h-5 w-5 ${bookmarkedStatutes.has(statute.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ExternalLink className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setExpandedStatute(expandedStatute === statute.id ? null : statute.id)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {expandedStatute === statute.id ? 'Hide Full Text' : 'View Full Text'}
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Cite
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        Share
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${statute.relevance}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{statute.relevance}%</span>
                    </div>
                  </div>
                </div>
                
                {expandedStatute === statute.id && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Full Text:</h4>
                      <p className="text-gray-700 leading-relaxed">{statute.fullText}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No statutes found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search IP Statutes</h3>
            <p className="text-gray-600">Enter keywords to search through Sri Lankan intellectual property laws</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatutePage;