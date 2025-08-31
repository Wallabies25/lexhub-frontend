import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Calendar, FileText, BookOpen, MessageSquare, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import ChatbotWidget from '../components/ChatbotWidget';

const Homepage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { t } = useLanguage();
  const { isLoggedIn, user, role } = useUser();

  // Mock data for dashboard
  const recentActivities = [
    { id: 1, activity: 'You searched for "Patent registration process"', time: '2 hours ago', icon: 'search' },
    { id: 2, activity: 'You viewed the Trademarks Act', time: '1 day ago', icon: 'document' },
    { id: 3, activity: 'You updated your profile information', time: '3 days ago', icon: 'profile' }
  ];

  const communityReplies = [
    { id: 1, question: 'What is the timeline for trademark registration?', replies: 3, time: '5 hours ago' },
    { id: 2, question: 'How do I file a copyright infringement case?', replies: 7, time: '2 days ago' },
    { id: 3, question: 'Requirements for patent application in Sri Lanka', replies: 5, time: '3 days ago' }
  ];

  const appointments = [
    { id: 1, lawyer: 'Kushan Perera', date: '15 June 2024', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, lawyer: 'Amali Fernando', date: '22 June 2024', time: '2:30 PM', status: 'Pending' }
  ];

  const lawCases = [
    { id: 1, caseTitle: 'Sumith Enterprises v. Global Tech Ltd', caseType: 'Trademark Infringement', date: '12 May 2024', status: 'Ongoing' },
    { id: 2, caseTitle: 'Creative Works Inc. v. Media Solutions', caseType: 'Copyright Dispute', date: '3 April 2024', status: 'Resolved' },
    { id: 3, caseTitle: 'Innovate Lanka v. TechVision Global', caseType: 'Patent Dispute', date: '28 June 2024', status: 'Scheduled' }
  ];

  const recentStatutes = [
    { id: 1, title: 'Intellectual Property Act No. 36 of 2003', category: 'IP Law', lastViewed: '2 days ago' },
    { id: 2, title: 'Code of Intellectual Property Act No. 52 of 1979', category: 'IP Law', lastViewed: '1 week ago' },
    { id: 3, title: 'Electronic Transactions Act No. 19 of 2006', category: 'Tech Law', lastViewed: 'New' }
  ];

  const blogStats = [
    { id: 1, title: 'IP Law Updates 2024', views: 1254, comments: 32 },
    { id: 2, title: 'Navigating Patent Applications', views: 876, comments: 18 },
    { id: 3, title: 'Copyright Protection in Digital Age', views: 1102, comments: 27 }
  ];

  const lawyerStats = [
    { id: 1, metric: 'Consultations', value: 28, change: '+12%' },
    { id: 2, metric: 'Active Clients', value: 15, change: '+5%' },
    { id: 3, metric: 'Satisfaction', value: '4.8/5', change: '+0.2' }
  ];

  const adminStats = [
    { id: 1, metric: 'Active Users', value: 1245, change: '+8%' },
    { id: 2, metric: 'Total Lawyers', value: 48, change: '+3' },
    { id: 3, metric: 'Consultations', value: 256, change: '+15%' },
    { id: 4, metric: 'Revenue', value: 'LKR 458,000', change: '+12%' }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/statutes?q=${encodeURIComponent(searchQuery)}&filter=${selectedFilter}`;
    }
  };

  // Helper function to determine membership tier badge
  const getMembershipTier = () => {
    // This would normally be based on user data from backend
    return {
      tier: 'Silver',
      color: 'text-gray-400',
      benefits: ['Access to basic IP resources', 'Community participation', 'Limited AI searches']
    };
  };

  const membershipTier = getMembershipTier();
  
  // Helper function to render the appropriate icon for activities
  const getActivityIcon = (iconType: string) => {
    switch(iconType) {
      case 'search':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'profile':
        return <BookOpen className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-600 text-white py-16 lg:py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-full mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              {isLoggedIn 
                ? `Welcome back, ${user?.displayName || 'User'}!` 
                : t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto">
              {isLoggedIn
                ? `Your personalized IP law dashboard`
                : t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="max-w-5xl mx-auto">
              <form onSubmit={handleSearch} className="bg-white rounded-xl p-3 shadow-2xl">
                <div className="flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search IP statutes, cases, or legal topics..."
                      className="w-full pl-14 pr-4 py-4 text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 text-lg"
                      aria-label="Search legal database"
                    />
                  </div>
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="mx-3 px-5 py-3 text-gray-900 rounded-lg border-0 focus:ring-1 focus:ring-blue-500 bg-gray-50 text-base"
                    aria-label="Filter by category"
                  >
                    <option value="all">All Categories</option>
                    <option value="trademarks">Trademarks</option>
                    <option value="copyrights">Copyrights</option>
                    <option value="patents">Patents</option>
                    <option value="designs">Industrial Designs</option>
                  </select>
                  <button
                    type="submit"
                    className="px-8 py-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center text-base"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>      {!isLoggedIn ? (
        // Show original homepage for non-logged in users
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
      ) : (
        // Dashboard for logged-in users
        <section className="py-10">
          <div className="max-w-full mx-auto px-6 sm:px-10 lg:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Left column (3/4 width) - Main content */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Recent Activities */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-5">
                      <h2 className="text-2xl font-bold text-blue-900">Recent Activities</h2>
                      <Link to="/activities" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                        View all
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {recentActivities.map(activity => (
                        <div key={activity.id} className="flex items-start p-3 border-b border-gray-100">
                          <div className="bg-blue-100 rounded-full p-2 mr-4 flex-shrink-0">
                            {getActivityIcon(activity.icon)}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-lg">{activity.activity}</p>
                            <p className="text-base text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User-specific content */}
                  {role === 'user' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-bold text-blue-900">My Appointments</h2>
                        <Link to="/appointments" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                          Schedule New
                        </Link>
                      </div>
                      {appointments.length > 0 ? (
                        <div className="space-y-4">
                          {appointments.map(appointment => (
                            <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div>
                                <p className="font-semibold text-gray-800 text-lg">{appointment.lawyer}</p>
                                <p className="text-base text-gray-600">{appointment.date} at {appointment.time}</p>
                              </div>
                              <div className={`px-4 py-2 rounded-full text-base font-medium ${
                                appointment.status === 'Confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {appointment.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4 text-lg">No upcoming appointments</p>
                      )}
                    </div>
                  )}

                  {/* Lawyer-specific content - replace user appointment section */}
                  {role === 'lawyer' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-bold text-blue-900">Upcoming Consultations</h2>
                        <Link to="/lawyer-schedule" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                          Manage Schedule
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {appointments.map(appointment => (
                          <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">Client Consultation</p>
                              <p className="text-base text-gray-600">{appointment.date} at {appointment.time}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full text-base font-medium ${
                              appointment.status === 'Confirmed' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {appointment.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
                
                {/* Second row of content - Full width */}                {role === 'user' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-2xl font-bold text-blue-900">Community Replies</h2>
                          <Link to="/community" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                            Browse Community
                          </Link>
                        </div>
                        {communityReplies.length > 0 ? (
                          <div className="space-y-4">
                            {communityReplies.map(item => (
                              <div key={item.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                <p className="font-medium text-gray-800 text-lg">{item.question}</p>
                                <div className="flex justify-between mt-3 text-base">
                                  <p className="text-gray-600">{item.replies} replies</p>
                                  <p className="text-gray-500">{item.time}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-center py-4 text-lg">No recent community activity</p>
                        )}
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-2xl font-bold text-blue-900">Recent Statutes</h2>
                          <Link to="/statutes" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                            View All Statutes
                          </Link>
                        </div>
                        <div className="space-y-4">
                          {recentStatutes.map(statute => (
                            <div key={statute.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                              <p className="font-medium text-gray-800 text-lg">{statute.title}</p>
                              <div className="flex justify-between mt-3 text-base">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {statute.category}
                                </span>
                                <p className="text-gray-500">Last viewed: {statute.lastViewed}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* New row for Past Cases and Lawyer Consultation boxes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Your Past Cases Box */}
                      <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6">
                          <h2 className="text-2xl font-bold text-white mb-1">Your Past Cases</h2>
                          <p className="text-blue-100">Track your previous legal matters</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            {lawCases.slice(0, 2).map(caseItem => (
                              <div key={caseItem.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-800 text-lg">{caseItem.caseTitle}</p>
                                    <p className="text-gray-500 mt-1 text-sm">Date: {caseItem.date}</p>
                                  </div>
                                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    caseItem.status === 'Ongoing' 
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : caseItem.status === 'Resolved'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {caseItem.status}
                                  </div>
                                </div>
                                <div className="mt-3">
                                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                    {caseItem.caseType}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 text-center">
                            <Link to="/cases/history" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                              View All Your Cases
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {/* Consult a Lawyer Box with Cartoon */}
                      <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6">
                          <h2 className="text-2xl font-bold text-white mb-1">Need Legal Help?</h2>
                          <p className="text-emerald-100">Connect with experienced IP lawyers</p>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                          <div className="mb-4 rounded-xl overflow-hidden w-48 h-48 mx-auto">
                            <img 
                              src="/Consult1.png" 
                              alt="Lawyer Consultation" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">Consult a Lawyer</h3>
                          <p className="text-gray-600 text-center mb-6">
                            Get professional advice on trademark, copyright, patent and other IP matters
                          </p>
                          <Link 
                            to="/consultation" 
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition text-center"
                          >
                            Book Consultation Now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}{/* Lawyer-specific content */}
                {role === 'lawyer' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-bold text-blue-900">Your Blog Posts</h2>
                        <Link to="/create-blog" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                          Write New Post
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {blogStats.map(blog => (
                          <div key={blog.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <p className="font-medium text-gray-800 text-lg">{blog.title}</p>
                            <div className="flex justify-between mt-3 text-base">
                              <p className="text-gray-600">{blog.views} views</p>
                              <p className="text-gray-500">{blog.comments} comments</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex justify-between items-center mb-5">
                        <h2 className="text-2xl font-bold text-blue-900">Case Management</h2>
                        <Link to="/case-manager" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                          New Case
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {lawCases.map(caseItem => (
                          <div key={caseItem.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                            <p className="font-medium text-gray-800 text-lg">{caseItem.caseTitle}</p>
                            <div className="flex justify-between mt-3">
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {caseItem.caseType}
                              </span>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                caseItem.status === 'Ongoing' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : caseItem.status === 'Resolved'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}>
                                {caseItem.status}
                              </div>
                            </div>
                            <p className="text-gray-500 mt-2">Date: {caseItem.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                  {/* Additional lawyer stats row */}
                {role === 'lawyer' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      {lawyerStats.map(stat => (
                        <div key={stat.id} className="bg-white rounded-xl shadow-md p-6">
                          <h3 className="text-gray-600 text-base font-medium mb-2">{stat.metric}</h3>
                          <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                          <p className="text-emerald-600 mt-1 text-base">{stat.change} from last month</p>
                        </div>
                      ))}
                    </div>

                    {/* New row for Winning Cases and Consultation Management */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Your Winning Cases Box */}
                      <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-800 to-blue-900 p-6">
                          <h2 className="text-2xl font-bold text-white mb-1">Your Winning Cases</h2>
                          <p className="text-blue-100">Showcasing your legal expertise</p>
                        </div>
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800 text-lg">Creative Works Inc. v. Media Solutions</p>
                                  <p className="text-gray-500 mt-1 text-sm">Date: March 15, 2025</p>
                                </div>
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  Won
                                </div>
                              </div>
                              <div className="mt-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  Copyright Dispute
                                </span>
                              </div>
                            </div>
                            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium text-gray-800 text-lg">Lanka Tech v. Global Software Ltd</p>
                                  <p className="text-gray-500 mt-1 text-sm">Date: January 28, 2025</p>
                                </div>
                                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  Won
                                </div>
                              </div>
                              <div className="mt-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  Patent Infringement
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 text-center">
                            <Link to="/lawyer/cases/won" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                              View All Winning Cases
                            </Link>
                          </div>
                        </div>
                      </div>
                      
                      {/* Consultation Management with Cartoon */}
                      <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6">
                          <h2 className="text-2xl font-bold text-white mb-1">Consultation Management</h2>
                          <p className="text-emerald-100">Organize your client appointments</p>
                        </div>
                        <div className="p-6 flex flex-col items-center">
                          <div className="mb-4 rounded-xl overflow-hidden w-48 h-48 mx-auto">
                            <img 
                              src="/Consult2.png" 
                              alt="Consultation Management" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-3">Manage Your Consultations</h3>
                          <p className="text-gray-600 text-center mb-6">
                            Schedule, organize, and conduct virtual or in-person consultations with clients
                          </p>
                          <Link 
                            to="/lawyer/consultations" 
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-lg font-medium rounded-lg hover:from-blue-700 hover:to-emerald-700 transition text-center"
                          >
                            Manage Appointments
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Admin-specific content */}
                {role === 'admin' && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      {adminStats.map(stat => (
                        <div key={stat.id} className="bg-white rounded-xl shadow-md p-6">
                          <h3 className="text-gray-600 text-base font-medium mb-2">{stat.metric}</h3>
                          <p className="text-3xl font-bold text-blue-900">{stat.value}</p>
                          <p className="text-emerald-600 mt-1 text-base">{stat.change} from last month</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-2xl font-bold text-blue-900">Platform Management</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Link to="/admin/users" className="p-6 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <span className="font-semibold text-gray-800 text-lg">User Management</span>
                          </Link>
                          <Link to="/admin/content" className="p-6 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                              <line x1="16" y1="13" x2="8" y2="13"></line>
                              <line x1="16" y1="17" x2="8" y2="17"></line>
                              <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                            <span className="font-semibold text-gray-800 text-lg">Content Management</span>
                          </Link>
                          <Link to="/admin/lawyers" className="p-6 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                            </svg>
                            <span className="font-semibold text-gray-800 text-lg">Lawyer Verification</span>
                          </Link>
                          <Link to="/admin/reports" className="p-6 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center hover:bg-blue-50 transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="20" x2="18" y2="10"></line>
                              <line x1="12" y1="20" x2="12" y2="4"></line>
                              <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                            <span className="font-semibold text-gray-800 text-lg">Analytics & Reports</span>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-center mb-5">
                          <h2 className="text-2xl font-bold text-blue-900">Recent Legal Cases</h2>
                          <Link to="/admin/cases" className="text-emerald-600 hover:text-emerald-800 text-base font-medium">
                            View All Cases
                          </Link>
                        </div>
                        <div className="space-y-4">
                          {lawCases.map(caseItem => (
                            <div key={caseItem.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                              <p className="font-medium text-gray-800 text-lg">{caseItem.caseTitle}</p>
                              <div className="flex justify-between mt-3">
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                  {caseItem.caseType}
                                </span>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  caseItem.status === 'Ongoing' 
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : caseItem.status === 'Resolved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {caseItem.status}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Sidebar - Common for all logged-in users */}
              <div className="lg:col-span-1">
                {/* User Profile Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <div className="flex flex-col items-center text-center">
                    <img 
                      src={user?.photo || "/default-avatar.png"} 
                      alt="Profile" 
                      className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md" 
                    />
                    <h3 className="mt-5 text-2xl font-bold text-blue-900">{user?.displayName || "Sineth Nimhan"}</h3>
                    <p className="text-gray-600 mt-1 text-base">{user?.email || "rdsnimhan@gmail.com"}</p>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-base font-medium ${
                        role === 'admin' ? 'bg-red-100 text-red-800' : 
                        role === 'lawyer' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {role === 'admin' ? 'Administrator' : role === 'lawyer' ? 'Legal Professional' : 'User'}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-4 text-base">{user?.bio || "LexHub IP user"}</p>
                    <Link 
                      to="/profile" 
                      className="mt-5 text-white bg-emerald-600 hover:bg-emerald-700 transition py-2 px-6 rounded-lg text-base font-medium"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>

                {/* Membership Card - For regular users */}
                {role === 'user' && (
                  <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
                    <div className="flex justify-between items-center mb-5">
                      <h3 className="text-2xl font-bold text-blue-900">Your Membership</h3>
                      <span className="text-2xl font-bold text-gray-400">
                        Silver
                      </span>
                    </div>
                    <div className="space-y-3 mb-6">
                      {membershipTier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                          <span className="text-base text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Link 
                      to="/upgrade-membership" 
                      className="block w-full py-3 px-4 text-center text-base font-medium text-white bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-colors shadow-sm"
                    >
                      Upgrade to Platinum
                    </Link>
                  </div>
                )}

                {/* Quick Links Card */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h3 className="text-2xl font-bold text-blue-900 mb-5">Quick Links</h3>
                  <div className="space-y-4">
                    <Link to="/statutes" className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-gray-800 text-lg">IP Statutes</span>
                    </Link>
                    <Link to="/cases" className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-gray-800 text-lg">Case Law</span>
                    </Link>
                    <Link to="/community" className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <MessageSquare className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-gray-800 text-lg">Community</span>
                    </Link>
                    <Link to="/consultation" className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-gray-800 text-lg">Consultations</span>
                    </Link>
                    <Link to="/blog" className="flex items-center p-3 hover:bg-blue-50 rounded-lg transition-colors">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-gray-800 text-lg">Latest Blogs</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}      {/* Floating Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
};

export default Homepage;