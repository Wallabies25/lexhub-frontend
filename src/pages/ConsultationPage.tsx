import React, { useState } from 'react';
import { Search, Star, MapPin, Phone, Mail, Video, MessageSquare, User, Award, Calendar, Clock, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Lawyer {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  hourlyRate: string;
  availability: string;
  image: string;
  bio: string;
  languages: string[];
  freeConsultation: boolean;
}

const ConsultationPage: React.FC = () => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'inperson'>('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const { t } = useLanguage();

  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Dr. Priya Wickramasinghe',
      title: 'Senior IP Attorney',
      specialties: ['Trademarks', 'Brand Protection', 'IP Strategy'],
      rating: 4.9,
      reviews: 127,
      experience: 15,
      location: 'Colombo, Sri Lanka',
      hourlyRate: 'LKR 25,000',
      availability: 'Available this week',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Dr. Wickramasinghe is a leading IP attorney with extensive experience in trademark law and brand protection strategies for multinational corporations.',
      languages: ['English', 'Sinhala'],
      freeConsultation: true,
    },
    {
      id: '2',
      name: 'Rohan Fernando',
      title: 'Patent Attorney',
      specialties: ['Patents', 'Technology Law', 'Innovation'],
      rating: 4.8,
      reviews: 89,
      experience: 12,
      location: 'Kandy, Sri Lanka',
      hourlyRate: 'LKR 20,000',
      availability: 'Available tomorrow',
      image: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Rohan specializes in patent law with a focus on technology and innovation, helping startups and established companies protect their inventions.',
      languages: ['English', 'Sinhala', 'Tamil'],
      freeConsultation: true,
    },
    {
      id: '3',
      name: 'Kamala Rajapakse',
      title: 'Copyright Specialist',
      specialties: ['Copyrights', 'Media Law', 'Creative Industries'],
      rating: 4.7,
      reviews: 156,
      experience: 10,
      location: 'Galle, Sri Lanka',
      hourlyRate: 'LKR 18,000',
      availability: 'Available today',
      image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Kamala focuses on copyright law and media rights, working with artists, publishers, and creative industry professionals.',
      languages: ['English', 'Sinhala'],
      freeConsultation: false,
    },
  ];

  const specialties = ['all', 'Trademarks', 'Patents', 'Copyrights', 'Industrial Designs', 'IP Strategy'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lawyer.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || lawyer.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBookConsultation = () => {
    if (selectedLawyer && selectedDate && selectedTime) {
      alert(`Consultation booked with ${selectedLawyer.name} on ${selectedDate} at ${selectedTime}`);
      setSelectedLawyer(null);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedLawyer ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Consultation</h1>
              <p className="text-gray-600">Connect with verified IP lawyers for professional legal advice</p>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lawyers by name or specialty..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search lawyers"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by specialty"
                  >
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty === 'all' ? 'All Specialties' : specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Free Consultation Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Free First Consultation Available!</h2>
                  <p className="text-emerald-100">Many of our lawyers offer a complimentary initial consultation to discuss your IP needs.</p>
                </div>
                <div className="text-4xl">🎯</div>
              </div>
            </div>

            {/* Lawyer Directory */}
            <div className="space-y-6">
              {filteredLawyers.map((lawyer) => (
                <div key={lawyer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                    <img 
                      src={lawyer.image} 
                      alt={lawyer.name}
                      className="w-24 h-24 rounded-full object-cover mx-auto lg:mx-0"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                        <div className="mb-4 lg:mb-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                            {lawyer.freeConsultation && (
                              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full">
                                Free Consultation
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600 font-medium mb-2">{lawyer.title}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4" />
                              <span>{lawyer.experience} years experience</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{lawyer.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Languages: {lawyer.languages.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-2xl font-bold text-gray-900">{lawyer.hourlyRate}</div>
                          <div className="text-sm text-gray-600">per hour</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(lawyer.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">{lawyer.rating}</span>
                          <span className="text-sm text-gray-600">({lawyer.reviews} reviews)</span>
                          <span className="text-sm text-emerald-600 font-medium">{lawyer.availability}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {lawyer.specialties.map((specialty) => (
                            <span
                              key={specialty}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-gray-700 mb-4">{lawyer.bio}</p>
                        
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => setSelectedLawyer(lawyer)}
                            className="px-6 py-2 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 transition-all duration-200"
                          >
                            Book Consultation
                          </button>
                          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>Message</span>
                          </button>
                          <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLawyers.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No lawyers found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            )}
          </>
        ) : (
          /* Booking Form */
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="mb-6">
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="text-blue-600 hover:text-blue-700 mb-4"
                >
                  ← Back to lawyers
                </button>
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedLawyer.image} 
                    alt={selectedLawyer.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedLawyer.name}</h2>
                    <p className="text-blue-600">{selectedLawyer.title}</p>
                    <p className="text-gray-600">{selectedLawyer.hourlyRate} per hour</p>
                    {selectedLawyer.freeConsultation && (
                      <p className="text-emerald-600 font-medium text-sm">Free first consultation available</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Consultation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Consultation Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setConsultationType('video')}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        consultationType === 'video'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Video className="h-6 w-6" />
                      <span className="text-sm font-medium">Video Call</span>
                    </button>
                    <button
                      onClick={() => setConsultationType('phone')}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        consultationType === 'phone'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Phone className="h-6 w-6" />
                      <span className="text-sm font-medium">Phone Call</span>
                    </button>
                    <button
                      onClick={() => setConsultationType('inperson')}
                      className={`p-4 border rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                        consultationType === 'inperson'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <User className="h-6 w-6" />
                      <span className="text-sm font-medium">In Person</span>
                    </button>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Times
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 border rounded-lg text-center transition-colors ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legal Issue Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Brief Description of Legal Issue
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Please provide a brief overview of your IP matter..."
                  />
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+94 77 123 4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Booking Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Consultation Summary</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>Lawyer: {selectedLawyer.name}</p>
                      <p>Type: {consultationType === 'video' ? 'Video Call' : consultationType === 'phone' ? 'Phone Call' : 'In Person'}</p>
                      <p>Date: {selectedDate}</p>
                      <p>Time: {selectedTime}</p>
                      <p>Rate: {selectedLawyer.freeConsultation ? 'Free (First consultation)' : selectedLawyer.hourlyRate + '/hour'}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookConsultation}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-lg hover:from-blue-800 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationPage;