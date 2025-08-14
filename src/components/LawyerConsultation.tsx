import React, { useState } from 'react';
import { Calendar, Clock, Star, MapPin, Phone, Mail, Video, MessageSquare, User, Award } from 'lucide-react';

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
}

const LawyerConsultation: React.FC = () => {
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [consultationType, setConsultationType] = useState<'video' | 'phone' | 'inperson'>('video');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const lawyers: Lawyer[] = [
    {
      id: '1',
      name: 'Sarah Thompson',
      title: 'Senior Partner',
      specialties: ['Corporate Law', 'Mergers & Acquisitions', 'Securities'],
      rating: 4.9,
      reviews: 127,
      experience: 15,
      location: 'New York, NY',
      hourlyRate: '$450',
      availability: 'Available this week',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Sarah is a highly experienced corporate attorney with expertise in complex business transactions and regulatory compliance.',
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: 'Partner',
      specialties: ['Criminal Defense', 'DUI/DWI', 'White Collar Crime'],
      rating: 4.8,
      reviews: 89,
      experience: 12,
      location: 'Los Angeles, CA',
      hourlyRate: '$375',
      availability: 'Available tomorrow',
      image: 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Michael specializes in criminal defense with a track record of successful outcomes in complex cases.',
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: 'Associate',
      specialties: ['Family Law', 'Divorce', 'Child Custody'],
      rating: 4.7,
      reviews: 156,
      experience: 8,
      location: 'Chicago, IL',
      hourlyRate: '$275',
      availability: 'Available today',
      image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Emily focuses on family law matters with a compassionate approach to sensitive legal issues.',
    },
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const handleBookConsultation = () => {
    if (selectedLawyer && selectedDate && selectedTime) {
      alert(`Consultation booked with ${selectedLawyer.name} on ${selectedDate} at ${selectedTime}`);
      setSelectedLawyer(null);
      setSelectedDate('');
      setSelectedTime('');
    }
  };

  return (
    <div className="h-full bg-gray-50 overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lawyer Consultations</h1>
          <p className="text-gray-600">Connect with experienced attorneys for legal guidance</p>
        </div>

        {!selectedLawyer ? (
          /* Lawyer Directory */
          <div className="space-y-6">
            {lawyers.map((lawyer) => (
              <div key={lawyer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-6">
                  <img 
                    src={lawyer.image} 
                    alt={lawyer.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{lawyer.name}</h3>
                        <p className="text-blue-600 font-medium">{lawyer.title}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Award className="h-4 w-4" />
                            <span>{lawyer.experience} years experience</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{lawyer.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{lawyer.hourlyRate}</div>
                        <div className="text-sm text-gray-600">per hour</div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
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
                        <span className="text-sm text-green-600 font-medium">{lawyer.availability}</span>
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
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedLawyer(lawyer)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    placeholder="Please provide a brief overview of your legal matter..."
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
                      placeholder="(555) 123-4567"
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
                      <p>Rate: {selectedLawyer.hourlyRate}/hour</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBookConsultation}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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

export default LawyerConsultation;