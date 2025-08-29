import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI legal assistant specializing in IP law. How can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Add CSS for animations
  useEffect(() => {
    // Create style element for animations if it doesn't exist
    if (!document.getElementById('chatbot-animations')) {
      const style = document.createElement('style');
      style.id = 'chatbot-animations';
      style.innerHTML = `
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes typingBounce {
          0%, 80%, 100% { 
            transform: translateY(0);
          }
          40% { 
            transform: translateY(-5px);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Clean up style element when component unmounts
      const styleElement = document.getElementById('chatbot-animations');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const quickQuestions = [
    'What is a trademark?',
    'How to file a patent?',
    'Copyright protection duration',
    'IP infringement remedies',
  ];  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotPageHistory');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Fix timestamps which are stored as strings in localStorage
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        
        // Only take the last 5 messages for the widget
        if (parsedMessages.length > 0) {
          setChatHistory(messagesWithDates.slice(-5));
        }
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
  }, []);

  // Scroll to bottom whenever messages change or chat opens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isOpen]);  const handleSend = () => {
    if (message.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
      
      // Save to shared localStorage
      try {
        const savedMessages = localStorage.getItem('chatbotPageHistory');
        let allMessages = savedMessages ? JSON.parse(savedMessages) : [];
        allMessages = [...allMessages, userMessage];
        localStorage.setItem('chatbotPageHistory', JSON.stringify(allMessages));
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
      
      // Get response content
      const responseContent = generateResponse(message);
      
      // Calculate typing delay based on content length
      const typingDelay = Math.min(Math.max(responseContent.length * 8, 700), 2000);
      
      // Simulate typing delay
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: responseContent,
          timestamp: new Date(),
        };
        
        setChatHistory(prev => [...prev, botMessage]);
        setIsTyping(false);
        
        // Save bot response to shared localStorage
        try {
          const savedMessages = localStorage.getItem('chatbotPageHistory');
          let allMessages = savedMessages ? JSON.parse(savedMessages) : [];
          allMessages = [...allMessages, botMessage];
          localStorage.setItem('chatbotPageHistory', JSON.stringify(allMessages));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }, typingDelay);
    }
  };

  const generateResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('trademark')) {
      return "A trademark is a symbol, word, or phrase that legally distinguishes the products of one company from those of others. Registration provides exclusive rights to use the mark in connection with your goods/services. Would you like more specific information about trademarks?";
    } else if (lowerQuery.includes('patent')) {
      return "Patents protect inventions and provide exclusive rights for a limited period (usually 20 years) in exchange for detailed public disclosure. The application process is complex and typically requires professional assistance. Would you like to know more about specific patent types or application steps?";
    } else if (lowerQuery.includes('copyright')) {
      return "Copyright protection covers original creative works like art, music, literature, and software. Protection begins automatically at creation, though registration provides additional benefits. In most countries, it lasts for the author's lifetime plus 70 years.";
    } else if (lowerQuery.includes('infringement')) {
      return "IP infringement occurs when someone uses protected IP without permission. Remedies may include injunctions, monetary damages, and destruction of infringing items. The specific approach depends on the type of IP involved and jurisdiction.";
    } else if (lowerQuery.includes('duration') || lowerQuery.includes('how long')) {
      return "IP protection duration varies by type: Trademarks can last indefinitely with proper renewals, patents typically last 20 years from filing, and copyright generally lasts for the author's lifetime plus 70 years. Would you like specifics for a particular type?";
    } else {
      return "I can help with various IP law questions. For more detailed assistance, consider using the full AI Legal Assistant on our Chatbot page. What specific aspect of intellectual property are you interested in?";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-full shadow-lg hover:from-blue-600 hover:to-emerald-500 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label={t('chatbot.open')}
      >
        <MessageCircle className="h-8 w-8" />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-emerald-400 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold">IP Law Assistant</h3>
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
          </div>          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div 
                key={msg.id} 
                className={`mb-3 ${msg.type === 'user' ? 'text-right' : ''}`}
                style={{ 
                  opacity: 0, 
                  animation: `fadeIn 0.3s ease-out forwards`,
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div 
                  className={`inline-block px-3 py-2 rounded-lg max-w-[85%] transition-all duration-200 hover:shadow-md ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                  </p>
                </div>
              </div>
            ))}            {isTyping && (
              <div className="mb-3">
                <div className="inline-block px-3 py-2 bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[85%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingBounce 1s infinite' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingBounce 1s infinite 0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'typingBounce 1s infinite 0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />

            {/* Quick Questions - Only show if less than 3 messages */}
            {chatHistory.length < 3 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-gray-500 font-medium">Quick questions:</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left p-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your IP law question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-lg hover:from-blue-600 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <Link 
                to="/chatbot" 
                className="text-xs text-blue-600 hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Open full IP Law Assistant
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;