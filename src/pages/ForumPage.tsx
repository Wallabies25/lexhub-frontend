import React, { useState } from 'react';
import { MessageSquare, User, Clock, Flag, Trash2, Search, Plus, ThumbsUp, Reply } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  avatar: string;
  timestamp: Date;
  category: string;
  replies: number;
  likes: number;
  isLiked: boolean;
}

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'How to register a trademark for a tech startup?',
      content: 'I\'m starting a tech company and need guidance on trademark registration process in Sri Lanka. What are the key steps and requirements?',
      author: 'TechFounder2024',
      avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=100',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      category: 'Trademarks',
      replies: 5,
      likes: 12,
      isLiked: false,
    },
    {
      id: '2',
      title: 'Copyright protection for software code',
      content: 'Does copyright automatically protect software code in Sri Lanka? Do I need to register it separately?',
      author: 'DevLawyer',
      avatar: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=100',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      category: 'Copyrights',
      replies: 8,
      likes: 18,
      isLiked: true,
    },
    {
      id: '3',
      title: 'Patent filing costs and timeline in Sri Lanka',
      content: 'Can someone share recent experience with patent filing costs and expected timeline through NIPO?',
      author: 'Inventor123',
      avatar: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=100',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      category: 'Patents',
      replies: 3,
      likes: 7,
      isLiked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const { t } = useLanguage();

  const categories = [
    'all',
    'IP Law Q&A',
    'Trademarks',
    'Copyrights',
    'Patents',
    'Industrial Designs',
    'General Discussion',
    'Legal Updates',
  ];

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-gradient-to-r from-blue-900 to-emerald-600 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-2">Community Guidelines</h3>
              <ul className="text-sm text-blue-100 space-y-1">
                <li>• Be respectful and professional</li>
                <li>• Provide accurate legal information</li>
                <li>• No spam or self-promotion</li>
                <li>• Seek professional advice for specific cases</li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
                <p className="text-gray-600">Discuss IP law topics with legal professionals and peers</p>
              </div>
              <button
                onClick={() => setShowNewPostForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search forum posts..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="Search forum posts"
                />
              </div>
            </div>

            {/* New Post Form */}
            {showNewPostForm && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Post</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Post title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <textarea
                    rows={4}
                    placeholder="Write your post content..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex space-x-3">
                    <button className="px-6 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200">
                      Post
                    </button>
                    <button
                      onClick={() => setShowNewPostForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Forum Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {post.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="font-medium">{post.author}</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{post.timestamp.toLocaleString()}</span>
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Flag className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                              post.isLiked
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                          <button className="flex items-center space-x-2 px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Reply className="h-4 w-4" />
                            <span>{post.replies} replies</span>
                          </button>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          View Discussion
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumPage;