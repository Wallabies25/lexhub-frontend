import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { t } = useLanguage();

  const quickQuestions = [
    'What is a trademark?',
    'How to file a patent?',
    'Copyright protection duration',
    'Industrial design registration',
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Handle message sending logic here
      setMessage('');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label={t('chatbot.open')}
      >
        <MessageCircle className="h-8 w-8" />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-900 to-emerald-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">AI Legal Assistant</h3>
                <p className="text-xs text-blue-100">Online now</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-800">
                Hello! I'm your AI legal assistant. I can help you with IP law questions. How can I assist you today?
              </p>
            </div>

            {/* Quick Questions */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(question)}
                  className="w-full text-left p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;