import React, { useState } from 'react';
import { Scale, Users, Target, Handshake, Mail, Phone, MapPin, Send, Award, Globe, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';



const AboutPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const teamMembers = [
    {
      name: 'Dr. Yashoda de Silva',
      role: 'Founder & Chief Legal Officer',
      image: '/assets/photos/Yashoda2.jpg',
      bio: 'Leading IP attorney with 20+ years experience in Sri Lankan intellectual property law.',
    },
    {
      name: 'Rev.Sandaru Sathsara',
      role: 'Technology Director',
      image: '/assets/photos/Sandaru1.jpg',
      bio: 'Expert in legal technology and AI systems, former software engineer turned legal tech innovator.',
    },
    {
      name: 'Sis.Kiyara Amarathunga',
      role: 'Community Manager',
      image: '/assets/photos/Kiyara1.jpg',
      bio: 'Passionate about legal education and community building, connecting legal professionals across Sri Lanka.',
    },
    {
      name: 'Dr.Sineth Nimhan',
      role: 'Marketing Manager',
      image: '/assets/photos/Sineth1.jpg',
      bio: 'Dedicated to advancing legal education and fostering a strong network of legal professionals throughout Sri Lanka..',
    },
  ];

  const collaborations = [
    {
      name: 'National Intellectual Property Office (NIPO)',
      description: 'Official partnership for accurate and up-to-date IP law information',
      logo: '🏛️',
    },
    {
      name: 'Bar Association of Sri Lanka',
      description: 'Collaboration for lawyer verification and professional standards',
      logo: '⚖️',
    },
    {
      name: 'University of Colombo Faculty of Law',
      description: 'Academic partnership for legal research and student programs',
      logo: '🎓',
    },
    {
      name: 'Sri Lanka Association of Software and Service Companies',
      description: 'Supporting tech industry IP protection and awareness',
      logo: '💻',
    },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize access to intellectual property law knowledge and legal services in Sri Lanka, empowering individuals and businesses to protect their innovations and creative works.',
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making legal information available in English, Sinhala, and Tamil to serve all communities in Sri Lanka with equal access to justice.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Maintaining the highest standards of data protection and legal accuracy through verified content and secure platform infrastructure.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to providing world-class legal technology solutions while respecting local legal traditions and practices.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Scale className="h-12 w-12 text-emerald-400" />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">LexHub IP Sri Lanka</h1>
              <p className="text-blue-100 text-lg">Empowering Sri Lanka with IP Law Knowledge</p>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            We are dedicated to making intellectual property law accessible, understandable, and actionable for everyone in Sri Lanka.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building a more informed and legally empowered Sri Lanka through innovative technology and expert knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-900 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced legal professionals and technology experts working together to serve Sri Lanka
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-6"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collaborations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Collaborations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Working with leading institutions to ensure accuracy, credibility, and comprehensive coverage
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {collaborations.map((collab, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{collab.logo}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{collab.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{collab.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@lexhubip.lk</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+94 11 234 5678</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">Colombo 03, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-900 to-emerald-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                <div className="space-y-2 text-blue-100">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
                <p className="mt-4 text-sm text-blue-200">
                  Our AI assistant is available 24/7 for immediate support
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your full name"
                    required
                    aria-label="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                    required
                    aria-label="Your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    aria-label="Message subject"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                    <option value="support">Technical Support</option>
                    <option value="legal">Legal Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us how we can help you..."
                    required
                    aria-label="Your message"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Explore IP Law?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who trust LexHub IP for their intellectual property needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-blue-900 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg">
              Get Started Free
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-900 transition-colors font-semibold text-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;