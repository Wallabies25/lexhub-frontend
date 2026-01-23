import React from 'react';
import { useNavigate } from 'react-router-dom';


const ConsultationOverview: React.FC = () => {
  const navigate = useNavigate();

  const handleTryIt = () => {
    // Redirect to login page for restriction
    sessionStorage.setItem('showConsultToast', '1');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-purple-800 mb-6 text-center">Expert Consultation</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8 text-center">
          Connect with Sri Lanka's top IP lawyers for personalized legal advice. Our consultation platform matches you with verified experts, ensuring you get professional guidance for your intellectual property needs—whether it's registration, enforcement, or dispute resolution.
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center mb-10">
          <img src="/Consult1.png" alt="Consultation 1" className="w-full max-w-md rounded-2xl shadow-lg" />
          <img src="/Consult2.png" alt="Consultation 2" className="w-full max-w-md rounded-2xl shadow-lg" />
        </div>
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-8 max-w-4xl w-full mb-10">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Why Use Our Consultation Service?</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-800">
            <li><strong>Verified Lawyers:</strong> All consultants are vetted IP law professionals.</li>
            <li><strong>Personalized Advice:</strong> Get answers tailored to your unique situation.</li>
            <li><strong>Confidential & Secure:</strong> Your information is always protected.</li>
            <li><strong>Easy Booking:</strong> Schedule consultations at your convenience.</li>
            <li><strong>Multilingual Support:</strong> Communicate in English, Sinhala, or Tamil.</li>
            <li><strong>Transparent Fees:</strong> Know the cost upfront—no surprises.</li>
          </ul>
        </div>
        <div className="max-w-3xl w-full mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Our platform bridges the gap between you and legal experts, making it easy to get the help you need, when you need it. Whether you’re an inventor, business owner, or creative professional, our consultants are here to guide you every step of the way.
          </p>
          <p className="text-lg text-gray-700">
            <strong>Note:</strong> You must be signed in to book a consultation and access expert advice.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleTryIt}
            className="px-10 py-4 bg-purple-600 text-white rounded-2xl shadow-lg hover:bg-purple-700 transition-colors font-bold text-xl mt-2 mb-4"
          >
            Try It
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationOverview;
