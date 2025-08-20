import React from 'react';
import { useNavigate } from 'react-router-dom';

const StatuteOverview: React.FC = () => {
  const navigate = useNavigate();

  const handleTryIt = () => {
    // Redirect to login page for restriction
    sessionStorage.setItem('showSearchToast', '1');
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-emerald-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-emerald-800 mb-6 text-center">Statute Database</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8 text-center">
          Explore Sri Lanka's most comprehensive IP statute and case law database. Search, filter, and review up-to-date legal documents, regulations, and precedents. Our database is designed for students, professionals, and anyone seeking reliable legal information, with advanced search and multilingual support.
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center mb-10">
          <img src="/Statute1.png" alt="Statute Database 1" className="w-full max-w-md rounded-2xl shadow-lg" />
          <img src="/Statute2.png" alt="Statute Database 2" className="w-full max-w-md rounded-2xl shadow-lg" />
        </div>
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-8 max-w-4xl w-full mb-10">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Key Features</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-800">
            <li><strong>Comprehensive Coverage:</strong> Access statutes, regulations, and case law in one place.</li>
            <li><strong>Advanced Search:</strong> Find documents by keyword, topic, or citation.</li>
            <li><strong>Multilingual:</strong> Browse content in English, Sinhala, or Tamil.</li>
            <li><strong>Regular Updates:</strong> Stay current with the latest legal changes and decisions.</li>
            <li><strong>Easy Navigation:</strong> User-friendly interface for quick research and review.</li>
            <li><strong>Trusted Sources:</strong> All content is verified by legal professionals.</li>
          </ul>
        </div>
        <div className="max-w-3xl w-full mb-10">
          <p className="text-lg text-gray-700 mb-4">
            The Statute Database is your go-to resource for legal research in Sri Lanka. Whether you are preparing for a case, studying for exams, or simply want to understand your rights, our platform makes legal information accessible and actionable.
          </p>
          <p className="text-lg text-gray-700">
            <strong>Note:</strong> You must be signed in to access the full database and use advanced features.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleTryIt}
            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-colors font-bold text-xl mt-2 mb-4"
          >
            Try It
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatuteOverview;
