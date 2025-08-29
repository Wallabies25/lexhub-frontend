import React from 'react';
import { Briefcase, Search } from 'lucide-react';

const dummyBlogs = [
  {
    id: 1,
    title: 'Navigating Intellectual Property Law: My Journey as an IP Lawyer',
    author: 'Ayesha Perera',
    date: '2025-08-10',
    tags: ['Intellectual Property', 'Career'],
    excerpt: 'From my first case to my latest courtroom battle, here are the lessons I learned about protecting ideas in Sri Lanka.',
    content: `From my first case to my latest courtroom battle, here are the lessons I learned about protecting ideas in Sri Lanka. Intellectual property, though often perceived as an abstract legal doctrine, is in fact the very foundation of our modern economy. When I first entered practice, I was struck by how few clients truly understood the reach of intellectual property law. Many equated it solely with patents, without realizing that copyrights, trademarks, industrial designs, and even confidential information fall under its protective umbrella. My early cases involved small business owners who had invested years of labor into their creations, only to find themselves unprepared for competitors who copied, exploited, or misrepresented their work. It was through those initial experiences that I recognized the urgent need for education as much as litigation in this area of law.

As my career progressed, I came to see that protecting ideas is not merely about legal enforcement—it is about strategy. In Sri Lanka, the Intellectual Property Act No. 36 of 2003 provides the framework for protection, but the law on paper is only as strong as the foresight of those who wield it. Too often, entrepreneurs wait until a dispute arises before seeking advice, by which time valuable rights may have already been diluted or lost. One of my most significant cases involved a start-up that failed to register its trademark early, resulting in a prolonged battle with a foreign company that had entered the market under a confusingly similar name. Though we ultimately secured justice, the ordeal highlighted the importance of proactive legal planning. My role as a lawyer, I came to realize, extends beyond the courtroom into boardrooms, workshops, and even classrooms.

The courtroom itself, however, is a crucible where principles are tested against the realities of commerce and competition. Over the years, I have seen how judges in Sri Lanka increasingly appreciate the global nature of intellectual property disputes. In one notable case, we had to address how international treaties like the Paris Convention and TRIPS Agreement apply within our jurisdiction. These proceedings underscored the fact that Sri Lanka does not operate in isolation—our economy, our creative industries, and our legal standards are deeply intertwined with the international order. Protecting ideas, therefore, is not just about defending individual rights, but about ensuring that Sri Lanka remains a credible participant in global trade and innovation.

Yet, not all lessons have been about statutes and precedents. Some of the most profound insights have come from observing the human dimension of intellectual property disputes. For an author whose manuscript was plagiarized, or an inventor whose design was stolen, the harm goes beyond financial loss. It strikes at the very heart of their identity and dignity. In advocating for such clients, I have had to balance the rigors of legal argument with the empathy and sensitivity required to restore their trust in justice. This dimension of practice constantly reminds me that the law exists not in the abstract, but in the lives of people who depend on it for fairness and recognition.

Today, as I reflect on the path from my first case to the present, I see intellectual property law in Sri Lanka as a field still in evolution. We face challenges such as digital piracy, counterfeit goods, and the need for stronger enforcement mechanisms, but we also stand at the threshold of opportunity. With the growth of our creative industries, the rise of local start-ups, and the push toward a knowledge-based economy, protecting ideas has never been more vital. My journey as a lawyer has taught me that vigilance, foresight, and education are as important as litigation. Ultimately, the protection of ideas is not just about law—it is about fostering a culture of respect for creativity, innovation, and integrity within our society.`,
    photo: '/assets/photos/Kiyara1.jpg',
  },
  {
    id: 2,
    title: 'Balancing Justice and Compassion: Stories from Family Law',
    author: 'Ruwan Jayasuriya',
    date: '2025-07-28',
    tags: ['Family Law', 'Experience'],
    excerpt: 'Family law is more than paperwork—it’s about people. Here are some of the most memorable moments from my practice.',
    content: `Family law is a unique branch of legal practice, one that constantly reminds me that behind every case file is a family in crisis. My journey began with a pro bono custody case, where I witnessed firsthand the emotional toll that legal battles can take on children and parents alike. It was in those early days that I learned the importance of compassion, patience, and clear communication.

Over the years, I have handled cases involving divorce, adoption, domestic violence, and inheritance disputes. Each case is different, but the common thread is the need to balance justice with empathy. In one memorable case, I represented a mother seeking to regain custody of her children after overcoming significant personal challenges. The legal process was arduous, but her determination and love for her children inspired everyone involved. When the court finally ruled in her favor, it was a victory not just for her, but for the principle that people can change and deserve second chances.

Family law also requires a deep understanding of cultural and social dynamics. In Sri Lanka, extended families often play a significant role in legal disputes, and navigating these relationships can be as challenging as interpreting statutes. I have learned to listen carefully, mediate conflicts, and seek solutions that prioritize the well-being of all parties, especially children.

Perhaps the most rewarding aspect of my work is seeing families heal and move forward. While the law provides the framework for resolving disputes, it is the human element—trust, forgiveness, and hope—that ultimately leads to lasting resolutions. As I continue my practice, I remain committed to advocating for families with both skill and heart.`,
    photo: '/assets/photos/Sandaru1.jpg',
    readTime: '10 min read',
  },
  {
    id: 3,
    title: 'Defending the Defenseless: Reflections from a Criminal Lawyer',
    author: 'Nadeesha Fernando',
    date: '2025-07-15',
    tags: ['Criminal Law', 'Justice'],
    excerpt: 'Every case is a story. These are the stories that shaped my career and my view of justice.',
    content: `Criminal law is a field where the stakes are always high. My career has been defined by cases that test the boundaries of justice, mercy, and truth. I remember my first trial vividly—a young man accused of theft, facing a system that seemed stacked against him. Through diligent investigation and cross-examination, we uncovered evidence that led to his acquittal. That case taught me the power of perseverance and the importance of believing in my clients.

Over the years, I have defended individuals accused of a wide range of offenses, from minor infractions to serious felonies. Each case is a puzzle, requiring careful analysis of facts, law, and human behavior. In one particularly challenging case, I represented a client accused of a crime he did not commit. The process was long and emotionally draining, but the eventual verdict of not guilty reaffirmed my faith in the legal system.

Criminal defense is not about condoning wrongdoing; it is about ensuring that every person receives a fair trial and that justice is served. I have seen how the law can be both a shield and a sword, and I strive to use my skills to protect the rights of the vulnerable. The most rewarding moments are those when I can help clients rebuild their lives after a difficult chapter.

As I reflect on my journey, I am grateful for the trust placed in me by my clients and the lessons I have learned from each case. Criminal law is demanding, but it is also deeply fulfilling. I remain committed to defending the defenseless and upholding the principles of justice.`,
    photo: '/assets/photos/Yashoda2.jpg',
    readTime: '10 min read',
  },
  {
    id: 4,
    title: 'Corporate Law in a Changing World: Lessons from the Boardroom',
    author: 'Ishara Gunasekara',
    date: '2025-06-30',
    tags: ['Corporate Law', 'Business'],
    excerpt: 'Advising companies through mergers, acquisitions, and crises has taught me the value of adaptability and ethics.',
    content: `Corporate law is a dynamic and ever-evolving field. My work has taken me from boardrooms to courtrooms, advising companies on mergers, acquisitions, compliance, and crisis management. One of the most challenging cases I handled involved a cross-border merger that required navigating complex regulatory frameworks in multiple jurisdictions. The process demanded not only legal expertise but also cultural sensitivity and strategic thinking.

I have also witnessed the impact of corporate scandals and the importance of ethical leadership. In one case, I advised a company facing allegations of financial misconduct. Through transparent communication and rigorous internal investigations, we were able to restore stakeholder confidence and implement reforms that strengthened the company’s governance.

Corporate law is not just about contracts and regulations; it is about building relationships and fostering trust. I take pride in helping businesses grow while upholding the highest standards of integrity. As the business landscape continues to change, I am committed to staying ahead of the curve and guiding my clients through both challenges and opportunities.`,
    photo: '/assets/photos/Sineth1.jpg',
    readTime: '8 min read',
  },
  {
    id: 5,
    title: 'Environmental Law: Protecting Nature, One Case at a Time',
    author: 'Tharushi Silva',
    date: '2025-06-10',
    tags: ['Environmental Law', 'Advocacy'],
    excerpt: 'Fighting for the environment is a calling. Here’s how I’ve used the law to make a difference in Sri Lanka’s natural heritage.',
    content: `Environmental law is a passion as much as a profession. My journey began with a case involving illegal logging in a protected forest. The legal battle was intense, but the outcome set a precedent for future conservation efforts. Since then, I have worked on cases related to pollution, wildlife protection, and sustainable development.

One of the most rewarding experiences was collaborating with local communities to develop eco-friendly policies that balance economic growth with environmental stewardship. I have learned that effective advocacy requires not only legal knowledge but also the ability to build coalitions and engage with diverse stakeholders.

Environmental law is about safeguarding our natural heritage for future generations. Every victory, no matter how small, is a step toward a more sustainable and just world. I am proud to be part of this important work and remain committed to protecting nature, one case at a time.`,
    photo: '/assets/photos/Kiyara1.jpg',
    readTime: '10 min read',
  },
  {
    id: 6,
    title: 'Labour Law: Standing Up for Workers’ Rights',
    author: 'Dinesh Abeywickrama',
    date: '2025-05-22',
    tags: ['Labour Law', 'Rights'],
    excerpt: 'Representing workers has been both challenging and rewarding. These are the stories that fuel my passion for justice.',
    content: `Labour law is about people—their livelihoods, their dignity, and their future. I have represented workers in disputes ranging from unfair dismissals to wage theft. One case that stands out involved a group of factory workers who were denied overtime pay. Through persistence and teamwork, we secured a fair settlement.

The fight for workers’ rights is ongoing, but every victory is a step toward a more just society. I have also worked with unions and employers to develop fair workplace policies and resolve conflicts through negotiation and mediation. My goal is always to achieve outcomes that respect the rights and dignity of all parties involved.

Labour law is challenging, but it is also deeply rewarding. I am grateful for the opportunity to make a positive impact in the lives of workers and their families.`,
    photo: '/assets/photos/Sandaru1.jpg',
    readTime: '8 min read',
  },
  {
    id: 7,
    title: 'Human Rights Law: Giving a Voice to the Voiceless',
    author: 'Shanika Wijeratne',
    date: '2025-05-10',
    tags: ['Human Rights', 'Advocacy'],
    excerpt: 'Human rights law is about courage and compassion. Here are the cases that changed my perspective—and my life.',
    content: `Human rights law is a calling that demands both courage and compassion. My work has brought me face to face with some of the most vulnerable members of our society—refugees, minorities, and victims of abuse. One case that left a lasting impression involved advocating for a young woman who faced discrimination at work. The legal battle was long and difficult, but her resilience inspired me to keep fighting for justice.

I have also worked on cases involving freedom of expression, access to education, and protection from violence. Each case is a reminder that the law can be a powerful tool for social change. I am proud to stand with those who have no voice and to use my skills to advance the cause of human rights.

As I look to the future, I am hopeful that our society will continue to move toward greater equality and justice for all. Human rights law is not easy, but it is essential. I am honored to be part of this important work.`,
    photo: '/assets/photos/Yashoda2.jpg',
    readTime: '10 min read',
  },
  {
    id: 8,
    title: 'Tax Law: The Art and Science of Compliance',
    author: 'Kasun Perera',
    date: '2025-04-28',
    tags: ['Tax Law', 'Finance'],
    excerpt: 'Tax law is complex, but it’s also fascinating. Here’s how I help clients navigate the maze of regulations.',
    content: `Tax law is often seen as dry, but I find it intellectually stimulating. My job is to help clients comply with the law while optimizing their financial outcomes. From startups to large corporations, every client brings a new challenge. I enjoy unraveling complex tax codes and finding creative solutions.

One of the most interesting cases I handled involved helping a small business navigate a tax audit. Through careful preparation and negotiation, we were able to resolve the issues without penalties. I have also advised clients on international tax matters, mergers, and acquisitions, and compliance with evolving regulations.

The world of tax law is always changing, and I am committed to staying ahead of the curve. I take pride in helping clients achieve their goals while maintaining the highest standards of integrity.`,
    photo: '/assets/photos/Sineth1.jpg',
    readTime: '8 min read',
  },
];

const allTags = Array.from(
  new Set(dummyBlogs.flatMap(blog => blog.tags))
);

const BlogsPage: React.FC = () => {
  const [expandedBlog, setExpandedBlog] = React.useState<number | null>(null);
  const [selectedTag, setSelectedTag] = React.useState<string>('All');
  const [search, setSearch] = React.useState('');
  const [showNewBlogForm, setShowNewBlogForm] = React.useState(false);
  const [newBlog, setNewBlog] = React.useState({
    title: '',
    tag: allTags[0] || '',
    content: '',
  });

  const handleNewBlogChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleNewBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add blog post logic here
    setShowNewBlogForm(false);
    setNewBlog({ title: '', tag: allTags[0] || '', content: '' });
  };

  const filteredBlogs = dummyBlogs.filter(blog => {
    const matchesTag = selectedTag === 'All' || blog.tags.includes(selectedTag);
    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.author.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (blog.content && blog.content.toLowerCase().includes(search.toLowerCase()));
    return matchesTag && matchesSearch;
  });
  return (
    <div className="w-full py-10 px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-emerald-500" />
            Lawyer Blogs
          </h2>
          <p className="text-gray-600 mb-0">Insights, stories, and experiences from Sri Lanka’s legal professionals.</p>
        </div>
        <button
          onClick={() => setShowNewBlogForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200"
        >
          <span>+ New Blog</span>
        </button>
      </div>
      {showNewBlogForm && (
        <form onSubmit={handleNewBlogPost} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Blog</h3>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Blog title..."
              required
            />
            <select
              name="tag"
              value={newBlog.tag}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              required
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            <textarea
              name="content"
              value={newBlog.content}
              onChange={handleNewBlogChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-2 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
              placeholder="Write your blog content..."
              rows={5}
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
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <label htmlFor="tag-filter" className="text-sm font-medium text-gray-700">Category:</label>
          <select
            id="tag-filter"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
              className="w-full border border-gray-300 rounded pl-9 pr-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Search blogs by keyword, author, or title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="space-y-8">
        {filteredBlogs.length === 0 && (
          <div className="text-center text-gray-500 py-10">No blogs found for your search or filter.</div>
        )}
        {filteredBlogs.map(blog => (
          <div
            key={blog.id}
            className={`w-full ${expandedBlog === blog.id ? 'bg-white border-2 border-emerald-400 rounded-xl shadow-2xl p-8 md:p-12 z-10' : 'flex bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm hover:shadow-lg transition-shadow p-4 md:p-6 items-center relative min-h-[180px]'} transition-all duration-300`}
            style={expandedBlog === blog.id ? { position: 'relative', minHeight: '350px', display: 'block' } : {}}
          >
            {/* Blog content and header */}
            {expandedBlog === blog.id ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-blue-900 mb-1">{blog.title}</h3>
                    <div className="flex items-center text-xs text-gray-500 mb-2 flex-wrap gap-2">
                      <span>{blog.date}</span>
                      {blog.readTime && <><span className="mx-1">•</span><span>{blog.readTime}</span></>}
                      <span className="mx-1">•</span>
                      {blog.tags.map(tag => (
                        <span key={tag} className="bg-emerald-50 text-emerald-700 rounded px-2 py-0.5 ml-1">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center min-w-[110px] w-[110px] ml-auto">
                    <img
                      src={blog.photo}
                      alt={blog.author}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md mb-2"
                    />
                    <span className="text-sm font-medium text-gray-800 text-center mt-1">{blog.author}</span>
                  </div>
                </div>
                <div className="prose max-w-none text-gray-800 whitespace-pre-line mb-6">
                  {blog.content}
                </div>
                <button
                  className="text-emerald-700 hover:underline text-sm font-medium mt-2"
                  onClick={() => setExpandedBlog(null)}
                >
                  Show Less
                </button>
              </>
            ) : (
              <div className="flex-1 min-w-0 pr-4 md:pr-8 flex">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-blue-900 mb-1">{blog.title}</h3>
                  <div className="flex items-center text-xs text-gray-500 mb-2 flex-wrap gap-2">
                    <span>{blog.date}</span>
                    {blog.readTime && <><span className="mx-1">•</span><span>{blog.readTime}</span></>}
                    <span className="mx-1">•</span>
                    {blog.tags.map(tag => (
                      <span key={tag} className="bg-emerald-50 text-emerald-700 rounded px-2 py-0.5 ml-1">{tag}</span>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-2 line-clamp-3">{blog.excerpt}</p>
                  <button
                    className="text-emerald-700 hover:underline text-sm font-medium mt-2"
                    onClick={() => setExpandedBlog(blog.id)}
                  >
                    Read More
                  </button>
                </div>
                {/* Lawyer photo and name right (preview mode) */}
                <div className="flex flex-col items-center justify-center min-w-[110px] w-[110px] ml-4">
                  <img
                    src={blog.photo}
                    alt={blog.author}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md mb-2"
                  />
                  <span className="text-sm font-medium text-gray-800 text-center mt-1">{blog.author}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogsPage;
