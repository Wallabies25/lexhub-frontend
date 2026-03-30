import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, Flag, Trash2, Search, Plus, ThumbsUp, Reply, Send, MessageCircle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../utils/api';
import { useUser } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';

interface ForumReply {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  created_at: string;
  author_name: string;
  author_photo?: string;
}

interface ForumPost {
  id: number;
  title: string;
  content: string;
  user_id: number;
  author_name: string;
  author_photo?: string;
  created_at: string;
  category: string;
  replies_count: number;
  likes_count: number;
  has_liked: boolean;
  replies: ForumReply[];
}

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'IP Law Q&A' });
  const [replyContent, setReplyContent] = useState('');
  
  const { isLoggedIn, user } = useUser();
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

  const fetchPosts = async () => {
    try {
      const data = await api.get('/forum/');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Could not load forum posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    if (!isLoggedIn) {
      toast.warning('Please login to like posts');
      return;
    }
    try {
      const result = await api.post(`/forum/${postId}/like`);
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              has_liked: result.liked,
              likes_count: result.liked ? post.likes_count + 1 : post.likes_count - 1
            }
          : post
      ));
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleCreatePost = async () => {
    if (!isLoggedIn) {
      toast.error('Please login to create a post');
      return;
    }
    if (!newPost.title || !newPost.content) {
      toast.error('Please fill in both title and content');
      return;
    }
    try {
      await api.post('/forum/', newPost);
      toast.success('Post created successfully!');
      setNewPost({ title: '', content: '', category: 'IP Law Q&A' });
      setShowNewPostForm(false);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleCreateReply = async (postId: number) => {
    if (!isLoggedIn) {
      toast.error('Please login to reply');
      return;
    }
    if (!replyContent.trim()) return;

    try {
      const result = await api.post(`/forum/${postId}/reply`, { content: replyContent });
      setPosts(posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              replies_count: post.replies_count + 1,
              replies: [...post.replies, result]
            }
          : post
      ));
      setReplyContent('');
      toast.success('Reply added!');
    } catch (error) {
      toast.error('Failed to add reply');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const telegramLink = "https://t.me/+oonCzFywCS1iNWFl";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <ToastContainer />
      <div className="w-full px-6 py-8">
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
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <h3 className="font-semibold mb-3 text-gray-900">Join Our Community</h3>
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full space-x-2 px-4 py-3 bg-[#0088cc] text-white rounded-lg hover:bg-[#0099dd] transition-all duration-200"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-medium">Telegram Group</span>
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">Chat informally with friends about IP law issues</p>
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
              <div className="flex items-center gap-3">
                <a
                  href={telegramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#0099dd] transition-all duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Our Telegram Group</span>
                </a>
                <button
                  onClick={() => setShowNewPostForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </button>
              </div>
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Create New Post</h3>
                  <button onClick={() => setShowNewPostForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="Post title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select 
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <textarea
                    rows={4}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Write your post content..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleCreatePost}
                      className="px-6 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200"
                    >
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
              {isLoading ? (
                 <div className="text-center py-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
                   <p className="mt-4 text-gray-600">Loading forum activity...</p>
                 </div>
              ) : filteredPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.author_photo || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                      alt={post.author_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 
                            onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                          >
                            {post.title}
                          </h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="font-medium text-blue-900">{post.author_name}</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(post.created_at).toLocaleString()}</span>
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
                          {user?.id === post.user_id && (
                            <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{post.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                              post.has_liked
                                ? 'bg-blue-100 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <ThumbsUp className={`h-4 w-4 ${post.has_liked ? 'fill-current' : ''}`} />
                            <span>{post.likes_count}</span>
                          </button>
                          <button 
                            onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
                              expandedPostId === post.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>{post.replies_count} replies</span>
                          </button>
                        </div>
                        <button 
                          onClick={() => setExpandedPostId(expandedPostId === post.id ? null : post.id)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          {expandedPostId === post.id ? 'Hide Discussion' : 'View Discussion'}
                        </button>
                      </div>

                      {/* Replies Section */}
                      {expandedPostId === post.id && (
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {post.replies.length === 0 ? (
                               <p className="text-sm text-gray-500 text-center py-4">No replies yet. Be the first to reply!</p>
                            ) : post.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3 bg-gray-50 p-3 rounded-lg">
                                <img
                                  src={reply.author_photo || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                                  alt={reply.author_name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-sm font-semibold text-gray-900">{reply.author_name}</span>
                                    <span className="text-xs text-gray-500">{new Date(reply.created_at).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Reply Input */}
                          <div className="flex items-center space-x-3 mt-4">
                            <div className="flex-1 relative">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCreateReply(post.id)}
                                placeholder="Type your reply..."
                                className="w-full pl-4 pr-10 py-2 bg-white border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              />
                              <button 
                                onClick={() => handleCreateReply(post.id)}
                                disabled={!replyContent.trim()}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-300"
                              >
                                <Send className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && !isLoading && (
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