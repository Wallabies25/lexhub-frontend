import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Heart } from 'lucide-react';
import { api } from '../utils/api';
import { useUser } from '../contexts/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Blog {
  id: number;
  lawyer_id: number;
  title: string;
  author_name: string;
  author_photo?: string;
  created_at: string;
  tags?: string;
  excerpt?: string;
  content: string;
  likes_count: number;
  has_liked: boolean;
}

const allTags = [
  'Intellectual Property',
  'Family Law',
  'Criminal Law',
  'Corporate Law',
  'Environmental Law',
  'Labour Law',
  'Human Rights',
  'Tax Law',
  'General',
];

const BlogsPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [expandedBlog, setExpandedBlog] = useState<number | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showNewBlogForm, setShowNewBlogForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoggedIn } = useUser();

  const [newBlog, setNewBlog] = useState({
    title: '',
    tag: allTags[0] || '',
    excerpt: '',
    content: '',
  });

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      // If logged in, provide token to get personalized has_liked status.
      // Assuming api.get sends auth automatically if configured.
      const response = await api.get('/blogs/');
      setBlogs(response);
    } catch (error) {
      toast.error('Failed to load blogs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleNewBlogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleNewBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!isLoggedIn || user?.user_type !== 'lawyer') {
        toast.error("Only lawyers can publish blogs.");
        return;
      }
      
      await api.post('/blogs/', {
        title: newBlog.title,
        tags: newBlog.tag,
        excerpt: newBlog.excerpt,
        content: newBlog.content
      });
      
      toast.success("Blog published successfully!");
      setShowNewBlogForm(false);
      setNewBlog({ title: '', tag: allTags[0] || '', excerpt: '', content: '' });
      fetchBlogs(); // reload blogs
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to publish blog.");
    }
  };

  const handleLike = async (e: React.MouseEvent, blogId: number) => {
    e.stopPropagation(); // Prevent opening the blog if clicked on the heart
    if (!isLoggedIn) {
      toast.info("Please log in to react to blogs.");
      return;
    }
    
    // Optimistic UI update
    setBlogs(prevBlogs => prevBlogs.map(blog => {
      if (blog.id === blogId) {
        return {
          ...blog,
          has_liked: !blog.has_liked,
          likes_count: blog.has_liked ? blog.likes_count - 1 : blog.likes_count + 1
        };
      }
      return blog;
    }));

    try {
      await api.post(`/blogs/${blogId}/like`, {});
    } catch (error) {
      // Revert optimism on error
      toast.error("Action failed");
      fetchBlogs(); 
    }
  };

  // Safe checks for empty or undefined arrays/strings
  const filteredBlogs = blogs.filter(blog => {
    const blogTags = blog.tags ? blog.tags.split(',').map(t => t.trim()) : [];
    const matchesTag = selectedTag === 'All' || blogTags.includes(selectedTag) || (!blog.tags && selectedTag === 'General');
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.author_name.toLowerCase().includes(search.toLowerCase()) ||
      (blog.excerpt && blog.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      (blog.content && blog.content.toLowerCase().includes(search.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="w-full py-10 px-6 min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-emerald-500" />
            Lawyer Blogs
          </h2>
          <p className="text-gray-600 mb-0">Insights, stories, and experiences from Sri Lanka’s legal professionals.</p>
        </div>
        
        {/* Only show New Blog to lawyers */}
        {isLoggedIn && user?.user_type === 'lawyer' && (
          <button
            onClick={() => setShowNewBlogForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200 shadow-md"
          >
            <span>+ New Blog</span>
          </button>
        )}
      </div>

      {showNewBlogForm && (
        <form onSubmit={handleNewBlogPost} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 relative">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Blog</h3>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Blog title..."
              required
            />
            <select
              name="tag"
              value={newBlog.tag}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              required
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <input
              type="text"
              name="excerpt"
              value={newBlog.excerpt}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Short excerpt or description..."
              required
            />
            <textarea
              name="content"
              value={newBlog.content}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Write your blog content..."
              rows={8}
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
            >
              Post
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setShowNewBlogForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2">
          <label htmlFor="tag-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">Category:</label>
          <select
            id="tag-filter"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50 min-w-[150px]"
            value={selectedTag}
            onChange={e => setSelectedTag(e.target.value)}
          >
            <option value="All">All</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <label htmlFor="blog-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <input
              id="blog-search"
              type="text"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-gray-50"
              placeholder="Search blogs by keyword, author, or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center text-gray-500 py-10 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            <span className="ml-3">Loading blogs...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center text-gray-500 py-10 bg-white rounded-xl shadow-sm border border-gray-100">
             No blogs found for your search or filter.
          </div>
        ) : (
          filteredBlogs.map(blog => {
            const isExpanded = expandedBlog === blog.id;
            const blogTags = blog.tags ? blog.tags.split(',').map(t => t.trim()) : [];
            
            return (
              <div
                key={blog.id}
                className={`w-full ${isExpanded ? 'bg-white border-2 border-emerald-400 rounded-xl shadow-2xl p-6 md:p-10 z-10' : 'bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 md:p-6 relative'} transition-all duration-300`}
              >
                {/* Like Button Positioned Top Right */}
                <button 
                  onClick={(e) => handleLike(e, blog.id)}
                  className={`absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${blog.has_liked ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                >
                  <Heart className={`w-4 h-4 ${blog.has_liked ? 'fill-current' : ''}`} />
                  <span className="font-semibold text-sm">{blog.likes_count}</span>
                </button>

                {isExpanded ? (
                  <>
                    <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6 mt-4">
                      <div className="flex-1 min-w-0 pr-16">
                        <h3 className="text-2xl font-bold text-blue-900 mb-2 leading-tight">{blog.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 flex-wrap gap-2">
                          <span>{formatDate(blog.created_at)}</span>
                          <span className="mx-1">•</span>
                          {blogTags.map(tag => (
                            <span key={tag} className="bg-emerald-50 text-emerald-700 rounded-full px-3 py-0.5 text-xs font-medium border border-emerald-100">{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center min-w-[120px] w-[120px] ml-auto">
                        <img
                          src={blog.author_photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(blog.author_name)}
                          alt={blog.author_name}
                          className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm mb-2"
                        />
                        <span className="text-sm font-semibold text-gray-800 text-center">{blog.author_name}</span>
                        <span className="text-xs text-blue-600 font-medium">Author</span>
                      </div>
                    </div>
                    
                    {blog.excerpt && (
                      <div className="text-gray-600 text-lg italic border-l-4 border-emerald-400 pl-4 mb-6">
                        {blog.excerpt}
                      </div>
                    )}
                    
                    <div className="prose max-w-none text-gray-800 whitespace-pre-wrap leading-relaxed mb-6 font-serif">
                      {blog.content}
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                      <button
                        className="text-gray-500 hover:text-blue-900 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        onClick={() => setExpandedBlog(null)}
                      >
                        Collapse Article
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col md:flex-row gap-5 pr-20 cursor-pointer" onClick={() => setExpandedBlog(blog.id)}>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-700 transition-colors mb-2 leading-tight pr-4">{blog.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mb-3 flex-wrap gap-2">
                        <span className="font-medium text-gray-700">By {blog.author_name}</span>
                        <span className="mx-1">•</span>
                        <span>{formatDate(blog.created_at)}</span>
                        {blogTags.length > 0 && <span className="mx-1">•</span>}
                        {blogTags.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-emerald-50 text-emerald-700 rounded-md px-2 py-0.5 font-medium border border-emerald-100">{tag}</span>
                        ))}
                      </div>
                      <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed">
                        {blog.excerpt || blog.content.substring(0, 150) + "..."}
                      </p>
                      <button className="text-emerald-600 hover:text-emerald-700 text-sm font-bold mt-3 text-left w-fit">
                        Read Full Article →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
