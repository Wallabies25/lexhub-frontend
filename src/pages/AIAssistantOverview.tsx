import React from 'react';
import { useNavigate } from 'react-router-dom';



const AIAssistantOverview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-blue-100 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-5xl font-extrabold text-blue-900 mb-6 text-center">AI Legal Assistant</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mb-8 text-center">
          Our AI Legal Assistant is your 24/7 partner for navigating intellectual property law in Sri Lanka. Powered by advanced AI, it provides instant, reliable answers to your legal questions, helps you draft documents, and guides you through complex legal processes—all in your preferred language. Whether you're a student, entrepreneur, or legal professional, our assistant is designed to make legal knowledge accessible, understandable, and actionable.
        </p>
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-center mb-10">
          <img src="/AIChatBot.png" alt="AI Legal Assistant" className="w-full max-w-md rounded-2xl shadow-lg" />
          <img src="/AIChatBot2.png" alt="AI Legal Assistant 2" className="w-full max-w-md rounded-2xl shadow-lg" />
        </div>
        <div className="bg-white bg-opacity-80 rounded-2xl shadow-xl p-8 max-w-4xl w-full mb-10">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">What can the AI Legal Assistant do?</h2>
          <ul className="list-disc pl-6 space-y-3 text-lg text-gray-800">
            <li><strong>Instant Q&A:</strong> Get immediate, accurate answers to your IP law questions, including trademarks, copyrights, patents, and more.</li>
            <li><strong>Document Drafting:</strong> Generate contracts, legal notices, and forms tailored to your needs in seconds.</li>
            <li><strong>Statute & Case Search:</strong> Quickly find and understand relevant laws, regulations, and legal precedents.</li>
            <li><strong>Step-by-Step Guidance:</strong> Receive clear, actionable steps for legal processes and compliance.</li>
            <li><strong>Multilingual Support:</strong> Interact in English, Sinhala, or Tamil for maximum accessibility.</li>
            <li><strong>24/7 Availability:</strong> Access legal help anytime, anywhere, without waiting for appointments.</li>
            <li><strong>Privacy First:</strong> Your questions and data are always confidential and never shared.</li>
            <li><strong>Learning & Research:</strong> Use the assistant as a study tool to deepen your understanding of IP law.</li>
          </ul>
        </div>
        <div className="max-w-3xl w-full mb-10">
          <p className="text-lg text-gray-700 mb-4">
            Unlike traditional legal resources, our AI Assistant is always available and adapts to your needs. Whether you need a quick answer, a detailed explanation, or help drafting a document, it’s designed to save you time and empower you with knowledge. The assistant is built on the latest AI technology, similar to platforms like Grok and OpenAI, but tailored specifically for Sri Lankan IP law.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            You can ask questions in natural language, request summaries of legal topics, or get help with legal forms. The assistant is constantly updated to reflect the latest changes in the law, ensuring you always have access to current and accurate information.
          </p>
          <p className="text-lg text-gray-700">
            Try it now and experience a new way to interact with legal knowledge—fast, private, and always at your fingertips.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={() => navigate('/chatbot')}
            className="px-10 py-4 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-600 transition-colors font-bold text-xl mt-2 mb-4"
          >
            Try It
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantOverview;
