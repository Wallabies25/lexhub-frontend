import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Lightbulb } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Legal Assistant specializing in Sri Lankan IP law. I can help you understand trademarks, copyrights, patents, and industrial designs. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'What is a trademark and how do I register one?',
    'How long does copyright protection last in Sri Lanka?',
    'What are the requirements for patent filing?',
    'How to protect industrial designs?',
    'What is the difference between trademark and copyright?',
    'Can I trademark a business name?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('trademark')) {
      return "A trademark is a distinctive sign that identifies and distinguishes goods or services. In Sri Lanka, trademarks are registered through the National Intellectual Property Office (NIPO). The registration process typically takes 12-18 months and provides protection for 10 years, renewable indefinitely. Key requirements include distinctiveness, non-conflict with existing marks, and proper classification under the Nice Classification system.";
    } else if (lowerMessage.includes('copyright')) {
      return "Copyright in Sri Lanka protects original literary, artistic, musical, and other creative works. Protection is automatic upon creation and lasts for the author's lifetime plus 70 years. For corporate works, it's 95 years from publication. Copyright covers reproduction, distribution, public performance, and adaptation rights. Registration isn't mandatory but provides additional legal benefits.";
    } else if (lowerMessage.includes('patent')) {
      return "Patents protect new inventions and innovations in Sri Lanka. To be patentable, an invention must be novel, involve an inventive step, and be industrially applicable. Patent protection lasts 20 years from the filing date. The application process involves filing with NIPO, examination, and publication. Annual maintenance fees are required to keep the patent active.";
    } else if (lowerMessage.includes('industrial design')) {
      return "Industrial designs protect the aesthetic aspects of products - their shape, pattern, color, or ornamentation. In Sri Lanka, designs are registered through NIPO for an initial period of 5 years, extendable up to 15 years total. The design must be new and have individual character to qualify for protection.";
    } else {
      return "I'm here to help with Sri Lankan IP law questions. I can provide information about trademarks, copyrights, patents, industrial designs, and related legal procedures. Please feel free to ask specific questions about intellectual property protection, registration processes, or legal requirements.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: simulateBotResponse(inputValue),
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-blue-900 to-emerald-600 rounded-lg">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">AI Legal Assistant</h1>
              <p className="text-gray-600 text-sm">Specialized in Sri Lankan IP Law</p>
            </div>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-900 to-emerald-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-emerald-600 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-6 rounded-b-lg">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about IP law, trademarks, copyrights, patents..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={2}
                disabled={isTyping}
                aria-label="Type your legal question"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="px-6 py-3 bg-gradient-to-r from-blue-900 to-emerald-600 text-white rounded-xl hover:from-blue-800 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This AI assistant provides general legal information. Always consult with a qualified IP lawyer for specific legal advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;