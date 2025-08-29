import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Lightbulb, BookOpen, Clock, Award, FileText, Copy, CheckCircle } from 'lucide-react';
import './chatbot.css'; // Importing custom CSS for animations

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: string; // To store the conversation context
}

interface ConversationContext {
  topic?: string;
  lastTopic?: string;
  followUpSuggested?: boolean;
  userPreference?: string;
  userCase?: string;
  jurisdiction?: string;
  complexity?: 'basic' | 'intermediate' | 'advanced';
  lastQuestions?: string[];
  sentimentScore?: number;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your Legal Assistant specializing in IP law. I can help you with trademarks, patents, copyrights, and other intellectual property matters. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Function to connect to API backend (placeholder for future implementation)
  const connectToBackend = async () => {
    try {
      // This would be replaced with actual API authentication
      const key = localStorage.getItem('api_key') || 'demo_key';
      setApiKey(key);
      
      // Simulate API connection success
      setTimeout(() => {
        setIsConnectedToBackend(true);
        console.log('Connected to backend API service');
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      return false;
    }
  };
  
  // Try to connect to backend on component mount
  useEffect(() => {
    connectToBackend();
  }, []);
  
  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    const savedContext = localStorage.getItem('conversationContext');
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Fix timestamps which are stored as strings in localStorage
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
      }
    }
    
    if (savedContext) {
      try {
        setConversationContext(JSON.parse(savedContext));
      } catch (error) {
        console.error('Error parsing saved context:', error);
      }
    }
  }, []);
  
  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 1) { // Don't save if only the welcome message exists
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Save conversation context to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(conversationContext).length > 0) {
      localStorage.setItem('conversationContext', JSON.stringify(conversationContext));
    }
  }, [conversationContext]);
  
  // Function to get response from API (placeholder for future implementation)
  const getResponseFromAPI = async (query: string, context: ConversationContext): Promise<string> => {
    // This would be replaced with an actual API call
    try {
      // Simulate API response delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For now, return the simulated response
      return simulateBotResponse(query);
    } catch (error) {
      console.error('API response error:', error);
      return "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.";
    }
  };
  
  const quickSuggestions = [
    'How do I register a trademark?',
    'What\'s the difference between copyright and patent?',
    'How long does IP protection last?',
    'How to handle IP infringement?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  // Function to analyze the conversation and update context
  const updateConversationContext = (userMessage: string): ConversationContext => {
    const lowerMessage = userMessage.toLowerCase();
    const newContext = { ...conversationContext };
    
    // Track the main topic of conversation
    if (lowerMessage.includes('trademark')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'trademark';
    } else if (lowerMessage.includes('copyright')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'copyright';
    } else if (lowerMessage.includes('patent')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'patent';
    } else if (lowerMessage.includes('infringement') || lowerMessage.includes('violation')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'infringement';
    }
    
    // Track user case information
    if (lowerMessage.includes('my company') || lowerMessage.includes('my business')) {
      newContext.userCase = 'business';
    } else if (lowerMessage.includes('my creation') || lowerMessage.includes('my work')) {
      newContext.userCase = 'creator';
    }
    
    // Track jurisdiction/country information
    const countries = ['us', 'usa', 'united states', 'uk', 'united kingdom', 'eu', 'european union', 
      'canada', 'australia', 'japan', 'china', 'india', 'germany', 'france'];
    for (const country of countries) {
      if (lowerMessage.includes(country)) {
        newContext.jurisdiction = country;
        break;
      }
    }
    
    // Track complexity level
    if (lowerMessage.includes('explain simply') || lowerMessage.includes('basic')) {
      newContext.complexity = 'basic';
    } else if (lowerMessage.includes('more detail') || lowerMessage.includes('advanced')) {
      newContext.complexity = 'advanced';
    }
    
    // Store last question for context
    if (!newContext.lastQuestions) {
      newContext.lastQuestions = [];
    }
    if (newContext.lastQuestions.length >= 3) {
      newContext.lastQuestions.shift();
    }
    newContext.lastQuestions.push(userMessage);
    
    // Reset follow-up suggestion flag when user sends a new message
    newContext.followUpSuggested = false;
    
    return newContext;
  };

  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const newContext = updateConversationContext(userMessage);
    setConversationContext(newContext);
    
    // Comprehensive IP-specific responses
    if (lowerMessage.includes('trademark')) {      if (lowerMessage.includes('register') || lowerMessage.includes('application')) {
        let response = "To register a trademark, you'll need to follow these steps:\n\n1. Conduct a trademark search to ensure your mark isn't already in use\n2. Prepare your application including a clear representation of your mark\n3. Identify the appropriate classes of goods/services (Nice Classification)\n4. File your application with the relevant IP office\n5. Respond to any office actions or examiner queries\n6. Wait for publication and opposition period\n7. Receive registration if no oppositions are filed\n\nThe process typically takes 6-18 months depending on the jurisdiction.";
        
        // Add jurisdiction-specific information if available
        if (newContext.jurisdiction) {
          if (newContext.jurisdiction.includes('us') || newContext.jurisdiction.includes('united states')) {
            response += "\n\nIn the United States, you would file with the USPTO (United States Patent and Trademark Office). The basic filing fee starts at $250-$350 per class for electronic filing. You can use the TEAS (Trademark Electronic Application System) online.";
          } else if (newContext.jurisdiction.includes('uk') || newContext.jurisdiction.includes('united kingdom')) {
            response += "\n\nIn the United Kingdom, you would file with the UK Intellectual Property Office. The basic fee is £170 for one class, with £50 for each additional class. You can apply online through the UK IPO website.";
          } else if (newContext.jurisdiction.includes('eu') || newContext.jurisdiction.includes('european union')) {
            response += "\n\nIn the European Union, you can file an EU trademark (EUTM) application with the EUIPO (European Union Intellectual Property Office), which provides protection across all EU member states. The basic fee is €850 for one class, with additional fees for more classes.";
          }
        }
        
        response += "\n\nWould you like more details about any of these steps?";
        return response;
      } else if (lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
        return "Trademark registration costs vary by country and the number of classes you're registering for. Basic fees usually range from $250-$350 per class in the US (USPTO), while international registrations through the Madrid System have additional fees. You may also incur attorney fees if you use legal assistance. Would you like information about a specific country's fee structure?";
      } else {
        return "Trademarks protect brands, logos, slogans, and other distinctive signs that identify the source of goods or services. They can last indefinitely as long as you continue using the mark and file renewal applications (typically every 10 years). Strong trademarks are distinctive and non-descriptive. What specific aspect of trademark law would you like to explore further?";
      }
    } else if (lowerMessage.includes('copyright')) {
      if (lowerMessage.includes('register')) {
        return "Copyright registration, while not required for protection in most countries, provides important legal benefits:\n\n1. It creates a public record of your ownership\n2. It's required before filing an infringement lawsuit in some countries (like the US)\n3. It allows you to claim statutory damages and attorney's fees\n4. It's considered prima facie evidence of validity\n\nTo register, you submit an application with the copyright office along with copies of your work and the required fee. Would you like more specific information about registration in a particular country?";
      } else if (lowerMessage.includes('duration') || lowerMessage.includes('how long')) {
        return "Copyright duration varies by country, but generally lasts for:\n\n• The author's lifetime plus 70 years after death in most countries\n• 95 years from publication or 120 years from creation (whichever is shorter) for works made for hire in the US\n• Different terms may apply for anonymous works, joint works, or older works\n\nUnlike trademarks or patents, copyright protection doesn't require renewal. Is there a specific work type you're curious about?";
      } else {
        return "Copyright protects original creative works including literature, music, art, software, films, and architecture. Protection is automatic upon creation in a fixed form - no registration required (though registration provides additional benefits). Copyright gives you exclusive rights to reproduce, distribute, display, perform, and create derivative works. What specific aspect of copyright would you like to know more about?";
      }
    }
    } else if (lowerMessage.includes('patent')) {
      if (lowerMessage.includes('application') || lowerMessage.includes('file')) {
        return "Filing a patent application involves these key steps:\n\n1. Ensure your invention is patentable (novel, non-obvious, useful)\n2. Prepare detailed documentation including drawings and specifications\n3. File a provisional application for early protection (optional)\n4. File a non-provisional application with claims defining your invention's scope\n5. Respond to office actions from patent examiners\n6. Pay issuance fees when approved\n\nThe process typically takes 2-5 years. Would you like me to elaborate on any particular step?";
      } else if (lowerMessage.includes('requirement')) {
        return "For an invention to be patentable, it must meet three main requirements:\n\n1. Novelty: It must be new and not previously disclosed to the public\n2. Non-obviousness: It must not be an obvious next step to someone skilled in the field\n3. Utility: It must have a useful purpose and actually work\n\nAdditionally, the invention must fall within patentable subject matter, which varies by country but generally excludes abstract ideas, natural phenomena, and laws of nature. Do you have a specific invention you're considering patenting?";
      } else {
        return "Patents protect inventions and grant inventors exclusive rights for a limited period (typically 20 years from filing) in exchange for public disclosure. There are three main types: utility patents (for new processes, machines, etc.), design patents (for ornamental designs), and plant patents (for new plant varieties). What specific aspect of patent law are you interested in?";
      }
    } else if (lowerMessage.includes('infringement') || lowerMessage.includes('violation')) {
      return "IP infringement occurs when someone uses protected intellectual property without permission. The appropriate response depends on the type of IP:\n\n• For trademarks: Cease and desist letters, UDRP complaints (for domain names), or litigation\n• For copyrights: DMCA takedown notices, cease and desist letters, or lawsuits\n• For patents: Carefully assess validity and infringement before sending demand letters or filing suit\n\nRemedies may include injunctions, damages, destruction of infringing goods, and sometimes attorney's fees. Would you like to discuss a specific infringement scenario?";
    } else if (lowerMessage.includes('difference between') && (lowerMessage.includes('trademark') || lowerMessage.includes('copyright') || lowerMessage.includes('patent'))) {
      return "The key differences between major IP types are:\n\n• Trademarks: Protect brand identifiers (names, logos, slogans) that distinguish your goods/services. Can last indefinitely with proper use and renewal.\n\n• Copyrights: Protect creative works (art, music, literature, software) automatically upon creation. Last for author's life + 70 years in most countries.\n\n• Patents: Protect inventions and functional improvements. Require formal application and approval. Last 20 years from filing for utility patents.\n\n• Trade Secrets: Protect confidential business information that provides competitive advantage. Last indefinitely as long as secrecy is maintained.\n\nWhich specific comparison would you like me to elaborate on?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm happy to help with any other IP law questions you might have. Feel free to ask about trademark registration, copyright protection, patent applications, or any other intellectual property matters whenever you need assistance.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi ')) {
      return "Hello! I'm here to help with your intellectual property law questions. I can provide information about trademarks, copyrights, patents, and other IP matters. What specific IP issue can I assist you with today?";
    } else {
      // Check if we should provide a follow-up based on conversation context
      if (conversationContext.topic && !conversationContext.followUpSuggested) {
        // Mark that we've suggested a follow-up to avoid repetition
        setConversationContext({...conversationContext, followUpSuggested: true});
        
        switch(conversationContext.topic) {
          case 'trademark':
            return "I notice we're discussing trademarks. Would you like to know more about trademark registration, search process, infringement, or international protection?";
          case 'copyright':
            return "Since we're talking about copyright, would you like information about fair use, registration benefits, or how to handle unauthorized use of your work?";
          case 'patent':
            return "Regarding patents, would you be interested in learning about patent searching, the difference between provisional and non-provisional applications, or enforcement strategies?";
          case 'infringement':
            return "For IP infringement issues, I can provide information about cease and desist letters, damage calculations, or alternative dispute resolution. What would be most helpful?";
          default:
            return "I can help with various intellectual property matters including trademarks, copyrights, patents, and trade secrets. What specific area of IP law would you like to explore?";
        }
      }
      
      return "I'm here to help with intellectual property law questions. I can provide information about trademark registration, copyright protection, patent applications, infringement issues, and other IP-related topics. What specific aspect of IP law would you like to learn more about?";
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

    try {
      // If connected to backend, use API, otherwise use simulated response
      let botResponse: string;
      
      if (isConnectedToBackend && apiKey) {
        // Use API for response when available
        botResponse = await getResponseFromAPI(inputValue, conversationContext);
      } else {
        // Use simulated response as fallback
        botResponse = simulateBotResponse(inputValue);
      }
      
      // Add a slight delay to make the interaction feel more natural
      setTimeout(() => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
          context: JSON.stringify(conversationContext), // Store context with the message
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: "I'm sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-lg">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">IP Law Assistant</h1>
            <p className="text-gray-600 text-sm">AI-powered intellectual property guidance</p>
          </div>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Ask me about:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleQuickSuggestion(suggestion)}
              className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transform transition-transform hover:scale-110 ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-emerald-400'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div
                className={`group px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className={`text-xs ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  
                  {/* Topic indicator for bot messages */}
                  {message.type === 'bot' && message.context && (
                    <div className="flex space-x-1">
                      {JSON.parse(message.context).topic === 'trademark' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">Trademark</span>
                      )}
                      {JSON.parse(message.context).topic === 'copyright' && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">Copyright</span>
                      )}
                      {JSON.parse(message.context).topic === 'patent' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Patent</span>
                      )}
                      {JSON.parse(message.context).topic === 'infringement' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">Infringement</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-3 max-w-3xl">
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white text-gray-800 border border-gray-100 px-4 py-3 rounded-2xl shadow-sm">
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
      <div className="bg-white border-t border-gray-200 p-5">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about trademarks, patents, copyrights, or IP infringement..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              disabled={isTyping}
            />
            {conversationContext.topic && (
              <div className="absolute bottom-2 left-4 flex items-center">
                {conversationContext.topic === 'trademark' && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Trademark</span>
                )}
                {conversationContext.topic === 'copyright' && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Copyright</span>
                )}
                {conversationContext.topic === 'patent' && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Patent</span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white rounded-xl hover:from-blue-600 hover:to-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-3">
          <p className="text-xs text-gray-500">
            This AI assistant provides general IP law information. Always consult with a qualified attorney for legal advice.
          </p>
          <div className="flex space-x-2">
            <button 
              title="Browse IP Law Resources"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <BookOpen className="h-4 w-4 text-gray-500" />
            </button>
            <button 
              title="View Chat History"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Clock className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;