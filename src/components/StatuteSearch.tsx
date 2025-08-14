import React, { useState } from 'react';
import { Search, Filter, BookOpen, ExternalLink, Calendar, Tag } from 'lucide-react';

interface Statute {
  id: string;
  title: string;
  section: string;
  jurisdiction: string;
  category: string;
  summary: string;
  lastUpdated: string;
  relevance: number;
}

const StatuteSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedJurisdiction, setSelectedJurisdiction] = useState('all');
  const [results, setResults] = useState<Statute[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mockStatutes: Statute[] = [
    {
      id: '1',
      title: 'Contract Formation Requirements',
      section: '§ 123.45',
      jurisdiction: 'Federal',
      category: 'Contract Law',
      summary: 'Defines the essential elements required for valid contract formation, including offer, acceptance, consideration, and mutual assent.',
      lastUpdated: '2024-01-15',
      relevance: 95,
    },
    {
      id: '2',
      title: 'Negligence Standards in Personal Injury',
      section: '§ 456.78',
      jurisdiction: 'State',
      category: 'Tort Law',
      summary: 'Establishes the duty of care standards and breach criteria for negligence claims in personal injury cases.',
      lastUpdated: '2024-02-10',
      relevance: 88,
    },
    {
      id: '3',
      title: 'Corporate Liability Limitations',
      section: '§ 789.01',
      jurisdiction: 'Federal',
      category: 'Corporate Law',
      summary: 'Outlines circumstances under which corporate officers and directors may be held personally liable for corporate actions.',
      lastUpdated: '2023-12-20',
      relevance: 82,
    },
    {
      id: '4',
      title: 'Employment Discrimination Protections',
      section: '§ 234.56',
      jurisdiction: 'Federal',
      category: 'Employment Law',
      summary: 'Comprehensive protection against workplace discrimination based on protected characteristics and status.',
      lastUpdated: '2024-01-30',
      relevance: 90,
    },
  ];

  const categories = ['all', 'Contract Law', 'Tort Law', 'Corporate Law', 'Employment Law', 'Criminal Law'];
  const jurisdictions = ['all', 'Federal', 'State', 'Local'];

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredResults = mockStatutes.filter(statute => 
        statute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        statute.summary.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (selectedCategory !== 'all') {
        filteredResults = filteredResults.filter(statute => statute.category === selectedCategory);
      }

      if (selectedJurisdiction !== 'all') {
        filteredResults = filteredResults.filter(statute => statute.jurisdiction === selectedJurisdiction);
      }

      setResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Statute Search</h1>
          <p className="text-gray-600">Search through comprehensive legal statutes and regulations</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search statutes by title, section, or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isSearching}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Search className="h-5 w-5" />
                <span>{isSearching ? 'Searching...' : 'Search'}</span>
              </button>
            </div>

            {/* Filters */}
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedJurisdiction}
                  onChange={(e) => setSelectedJurisdiction(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction} value={jurisdiction}>
                      {jurisdiction === 'all' ? 'All Jurisdictions' : jurisdiction}
                    </option>
                  ))}
                </select>
              </div>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">Found {results.length} statute{results.length !== 1 ? 's' : ''}</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Sort by Relevance</button>
            </div>
            
            {results.map((statute) => (
              <div key={statute.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
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
                        <span>{statute.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{statute.jurisdiction}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Updated {statute.lastUpdated}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{statute.summary}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Relevance</div>
                      <div className="text-lg font-semibold text-green-600">{statute.relevance}%</div>
                    </div>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <ExternalLink className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View Full Text</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">Save to Research</button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">Cite</button>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 ml-6 max-w-24">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${statute.relevance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery && !isSearching ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No statutes found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default StatuteSearch;