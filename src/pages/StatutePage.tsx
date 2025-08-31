import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Bookmark, ExternalLink, Calendar, Tag, Star, Download, FileText, Layers, Eye } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { downloadFile, openPdfInNewTab } from '../utils/DownloadUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

interface StatuteDocument {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  lastUpdated: string;
  size: string;
  language: string;
}

const StatutePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [documentSearchQuery, setDocumentSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [documentCategory, setDocumentCategory] = useState('all');
  const [results, setResults] = useState<Statute[]>([]);
  const [documentResults, setDocumentResults] = useState<StatuteDocument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDocSearching, setIsDocSearching] = useState(false);
  const [expandedStatute, setExpandedStatute] = useState<string | null>(null);
  const [bookmarkedStatutes, setBookmarkedStatutes] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'search' | 'documents'>('search');
  const [downloadStatus, setDownloadStatus] = useState<{[key: string]: 'idle' | 'loading' | 'success' | 'error'}>({});
  // State to trigger counter animations
  const [animateStats, setAnimateStats] = useState(false);
  const { t } = useLanguage();
  
  // Trigger animations after a small delay when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateStats(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

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

  const statuteDocuments: StatuteDocument[] = [
    {
      id: '1',
      title: 'Berne Convention',
      category: 'copyrights',
      description: 'International agreement governing copyright protection, which Sri Lanka is a signatory to.',
      fileName: 'Berne Convention.pdf',
      lastUpdated: '2022-05-15',
      size: '1.2 MB',
      language: 'English'
    },
    {
      id: '2',
      title: 'Computer Crimes Act, No. 24 of 2007',
      category: 'digital',
      description: 'Legislation addressing computer crimes and digital intellectual property violations in Sri Lanka.',
      fileName: 'Computer Crimes Act, No. 24 of 2007.pdf',
      lastUpdated: '2007-07-09',
      size: '486 KB',
      language: 'English'
    },
    {
      id: '3',
      title: 'Customs Ordinance',
      category: 'enforcement',
      description: 'Laws governing customs procedures including seizure of counterfeit goods and IP enforcement at borders.',
      fileName: 'Customs Ordinance.pdf',
      lastUpdated: '2019-11-30',
      size: '2.1 MB',
      language: 'English'
    },
    {
      id: '4',
      title: 'Electronic Transactions Act, No. 19 of 2006',
      category: 'digital',
      description: 'Legal framework for electronic transactions and digital rights in Sri Lanka.',
      fileName: 'Electronic Transactions Act, No. 19 of 2006.pdf',
      lastUpdated: '2006-10-25',
      size: '534 KB',
      language: 'English'
    },
    {
      id: '5',
      title: 'Geographical Indications Regulations',
      category: 'trademarks',
      description: 'Regulations providing protection for geographical indications in Sri Lanka.',
      fileName: 'Geographical Indications Regulations – Gazette (Extraordinary, 22 Oct 2024).pdf',
      lastUpdated: '2024-10-22',
      size: '890 KB',
      language: 'English'
    },
    {
      id: '6',
      title: 'Madrid Protocol',
      category: 'trademarks',
      description: 'International treaty for trademark registration which Sri Lanka has acceded to.',
      fileName: 'Madrid Protocol.pdf',
      lastUpdated: '2023-01-20',
      size: '1.7 MB',
      language: 'English'
    },
    {
      id: '7',
      title: 'Sri Lanka–USA Bilateral Agreement on IP',
      category: 'international',
      description: 'Bilateral agreement between Sri Lanka and the USA on the protection of intellectual property (1991).',
      fileName: 'Sri Lanka–USA Bilateral Agreement on the Protection of Intellectual Property (1991).pdf',
      lastUpdated: '1991-09-20',
      size: '724 KB',
      language: 'English'
    },
    {
      id: '8',
      title: 'Trademark Law Treaty',
      category: 'trademarks',
      description: 'International treaty aimed at standardizing national trademark registration procedures.',
      fileName: 'Trademark Law Treaty.pdf',
      lastUpdated: '2022-08-10',
      size: '1.5 MB',
      language: 'English'
    },
    {
      id: '9',
      title: 'UPOV Convention (plant variety protection)',
      category: 'patents',
      description: 'International convention for the protection of new varieties of plants.',
      fileName: 'UPOV Convention (plant variety protection).pdf',
      lastUpdated: '2020-12-05',
      size: '980 KB',
      language: 'English'
    },
    {
      id: '10',
      title: 'WTO Agreement on TRIPS',
      category: 'international',
      description: 'WTO Agreement on Trade-Related Aspects of Intellectual Property Rights, setting global IP standards.',
      fileName: 'WTO Agreement on Trade-Related Aspects of Intellectual Property Rights (TRIPS).pdf',
      lastUpdated: '2021-06-18',
      size: '2.3 MB',
      language: 'English'
    }
  ];

  const categories = [
    { value: 'all', label: t('filter.all') },
    { value: 'trademarks', label: t('filter.trademarks') },
    { value: 'copyrights', label: t('filter.copyrights') },
    { value: 'patents', label: t('filter.patents') },
    { value: 'designs', label: t('filter.designs') },
  ];

  const documentCategories = [
    { value: 'all', label: 'All Documents' },
    { value: 'trademarks', label: 'Trademark Laws' },
    { value: 'copyrights', label: 'Copyright Laws' },
    { value: 'patents', label: 'Patent Laws' },
    { value: 'digital', label: 'Digital IP Laws' },
    { value: 'international', label: 'International Agreements' },
    { value: 'enforcement', label: 'Enforcement Laws' },
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
    
    // Initialize document results with all documents
    setDocumentResults(statuteDocuments);
    
    // Initialize download status for all documents
    const initialDownloadStatus: {[key: string]: 'idle' | 'loading' | 'success' | 'error'} = {};
    statuteDocuments.forEach(doc => {
      initialDownloadStatus[doc.fileName] = 'idle';
    });
    setDownloadStatus(initialDownloadStatus);
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
  const handleDocumentSearch = () => {
    setIsDocSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      let filteredDocs = statuteDocuments.filter(doc => 
        doc.title.toLowerCase().includes(documentSearchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(documentSearchQuery.toLowerCase())
      );

      if (documentCategory !== 'all') {
        filteredDocs = filteredDocs.filter(doc => doc.category === documentCategory);
      }

      setDocumentResults(filteredDocs);
      setIsDocSearching(false);
    }, 800);
  };
    const handleDocumentDownload = async (fileName: string) => {
    try {
      // Update download status to loading
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'loading' }));
      
      await downloadFile(fileName);
      
      // Update download status to success
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'success' }));
        // Show a toast or alert with instructions on where to find the file
      toast.success(
        `${fileName} is downloading. Please check your browser's download folder or notification area.`,
        { autoClose: 5000 }
      );
      
      // Optional: Reset status after some time
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
      }, 3000);
    } catch (error) {
      console.error('Error downloading file:', error);
      
      // Update download status to error
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'error' }));
      
      toast.error(`Failed to download ${fileName}. Please check if the file exists and try again.`);
      
      // Reset error status after some time
      setTimeout(() => {
        setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
      }, 3000);
    }
  };

  // Handle opening a PDF document in a new tab for preview
  const handleDocumentPreview = async (fileName: string) => {
    try {
      // Update preview status
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'loading' }));
      
      await openPdfInNewTab(fileName);
      
      // Update status back to idle
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
    } catch (error) {
      console.error('Error previewing file:', error);
      
      // Show error toast
      toast.error(`Failed to preview ${fileName}. Please check if the file exists and try again.`);
      
      // Reset status
      setDownloadStatus(prev => ({ ...prev, [fileName]: 'idle' }));
    }
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
      if (activeTab === 'search') {
        handleSearch();
      } else {
        handleDocumentSearch();
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <div className="w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Statute Database</h1>
          <p className="text-gray-600">Search comprehensive Sri Lankan intellectual property laws and regulations</p>
        </div>
        
        {/* Statistics Section with Animated Counters */}
        <div className="bg-gradient-to-r from-blue-900 to-emerald-700 rounded-xl shadow-lg p-8 mb-8 text-white overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
            <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                <FileText className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">
                {animateStats && <AnimatedCounter end={500} duration={2500} suffix="+" />}
                {!animateStats && <span>0+</span>}
              </div>
              <div className="text-sm font-medium tracking-wider uppercase">Legal Documents</div>
            </div>
            
            <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                <BookOpen className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">
                {animateStats && <AnimatedCounter end={50} duration={1800} suffix="+" />}
                {!animateStats && <span>0+</span>}
              </div>
              <div className="text-sm font-medium tracking-wider uppercase">Verified Lawyers</div>
            </div>
            
            <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                <Layers className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">
                {animateStats && <AnimatedCounter end={1000} duration={3000} suffix="+" />}
                {!animateStats && <span>0+</span>}
              </div>
              <div className="text-sm font-medium tracking-wider uppercase">Users Helped</div>
            </div>
            
            <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
              <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4 shadow-lg">
                <Search className="h-10 w-10" />
              </div>
              <div className="text-5xl font-bold mb-2">
                {animateStats && <span className="animate-pulse">24/7</span>}
                {!animateStats && <span>24/7</span>}
              </div>
              <div className="text-sm font-medium tracking-wider uppercase">AI Support</div>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'search'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Statute Search</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-3 px-6 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Downloadable Documents</span>
            </div>
          </button>
        </div>

        {activeTab === 'search' ? (
          <>
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
          </>
        ) : (
          <>
            {/* Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Downloadable Statute Documents</h2>
                <p className="text-gray-600 mb-4">Search and download official IP statutes, treaties, and legal documents</p>
                
                {/* Document Search Bar */}
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={documentSearchQuery}
                      onChange={(e) => setDocumentSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search for statute documents, treaties, or agreements..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Search statute documents"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <select
                      value={documentCategory}
                      onChange={(e) => setDocumentCategory(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      aria-label="Filter by document category"
                    >
                      {documentCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => handleDocumentSearch()}
                    disabled={isDocSearching}
                    className="px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                    aria-label="Search documents"
                  >
                    <Search className="h-5 w-5" />
                    <span>{isDocSearching ? 'Searching...' : 'Search'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Document Results */}
            {isDocSearching ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Searching documents...</span>
                </div>
              </div>
            ) : documentResults.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-600">Found {documentResults.length} document{documentResults.length !== 1 ? 's' : ''}</p>
                  <div className="text-sm text-gray-500">Click any document to download</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documentResults.map((doc) => (
                    <div 
                      key={doc.id} 
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-5 flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-700" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{doc.description}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                        <span>Last updated: {doc.lastUpdated}</span>
                        <span>Size: {doc.size}</span>
                        <span>Language: {doc.language}</span>
                      </div>                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
                        {/* Preview Button */}
                        <button 
                          onClick={() => handleDocumentPreview(doc.fileName)}
                          disabled={downloadStatus[doc.fileName] === 'loading'}
                          className="flex items-center space-x-2 text-gray-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview PDF</span>
                        </button>
                        
                        {/* Download Button */}
                        <button 
                          onClick={() => handleDocumentDownload(doc.fileName)}
                          disabled={downloadStatus[doc.fileName] === 'loading'}
                          className={`flex items-center space-x-2 transition-colors ${
                            downloadStatus[doc.fileName] === 'error' 
                              ? 'text-red-600 hover:text-red-800' 
                              : downloadStatus[doc.fileName] === 'success'
                                ? 'text-green-600 hover:text-green-800'
                                : 'text-blue-600 hover:text-blue-800'
                          }`}
                        >
                          {downloadStatus[doc.fileName] === 'loading' ? (
                            <>
                              <span className="animate-pulse">Processing...</span>
                            </>
                          ) : downloadStatus[doc.fileName] === 'error' ? (
                            <>
                              <span>Download Failed - Retry</span>
                            </>
                          ) : downloadStatus[doc.fileName] === 'success' ? (
                            <>
                              <span>Download Complete</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span>Download PDF</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching documents found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatutePage;