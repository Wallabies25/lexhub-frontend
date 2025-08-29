import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Lightbulb, BookOpen, FileText, Award, CheckCircle, Copy, Trash, Mic, MicOff } from 'lucide-react';
import '../components/chatbot.css';
import '../components/voice-chat.css';

// Add SpeechRecognition type definitions
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  context?: string;
}

interface ConversationContext {
  topic?: string;
  lastTopic?: string;
  followUpSuggested?: boolean;
  userPreference?: string;
  userCase?: string;
  jurisdiction?: string;
  complexity?: 'basic' | 'advanced';
  businessType?: string;
  userRole?: string;
  lastQueryTimestamp?: number;
}

const ChatbotPage: React.FC = () => {  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI Legal Assistant specializing in IP law. I can help you understand trademarks, copyrights, patents, and industrial designs under both international and Sri Lankan law. What would you like to know today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const quickQuestions = [
    'What is a trademark and how do I register one?',
    'How long does copyright protection last?',
    'What are the requirements for patent filing?',
    'How do I protect industrial designs?',
    'What is the difference between trademark and copyright?',
    'How do I handle IP infringement?',
    'What\'s the cost of registering a trademark?',
    'How can I enforce my patent rights internationally?',
    'Can I trademark my business name?',
    'What is fair use in copyright law?'
  ];
    const ipLawResources = [
    { title: 'WIPO Intellectual Property Handbook', url: 'https://www.wipo.int/publications/en/details.jsp?id=275' },
    { title: 'USPTO Trademark Basics', url: 'https://www.uspto.gov/trademarks/basics' },
    { title: 'Copyright Registration Guide', url: 'https://www.copyright.gov/registration/' },
    { title: 'Patent Process Overview', url: 'https://www.uspto.gov/patents/basics' },
    { title: 'Madrid System for International Trademarks', url: 'https://www.wipo.int/madrid/en/' },
    { title: 'Fair Use Doctrine Explained', url: 'https://www.copyright.gov/fair-use/' },
    { title: 'Design Patent Application Guide', url: 'https://www.uspto.gov/patents/basics/types-patent-applications/design-patent-application-guide' },
    { title: 'Trade Secret Protection Best Practices', url: 'https://www.wipo.int/tradesecrets/en/' }
  ];

  // List of IP law terms for search/autocomplete
  const ipLawTerms = [
    'trademark', 'copyright', 'patent', 'industrial design',
    'infringement', 'licensing', 'fair use', 'trade secret',
    'Madrid Protocol', 'WIPO', 'USPTO', 'EUIPO',
    'registered mark', 'unregistered mark', 'service mark',
    'patent pending', 'provisional patent', 'utility patent',
    'design patent', 'plant patent', 'copyright registration',
    'work made for hire', 'public domain', 'moral rights',
    'derivative work', 'trade dress', 'dilution', 'genericide'
  ];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);

  // Filter state for resources
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  
  // Filtered resources based on selected filter
  const filteredResources = resourceFilter === 'all' 
    ? ipLawResources 
    : ipLawResources.filter(resource => 
        resource.title.toLowerCase().includes(resourceFilter.toLowerCase())
      );

  // Function to search IP law terms
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const filteredResults = ipLawTerms.filter(
      item => item.toLowerCase().includes(term.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
    
    setSearchResults(filteredResults);
  };
  
  // Function to use a search result
  const useSearchTerm = (term: string) => {
    setInputValue(`What is ${term}?`);
    setSearchTerm('');
    setSearchResults([]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    });
  };
    // Function to analyze conversation and update context
  // UTILITY FUNCTIONS - Currently not used directly but kept for reference and future use
  // This function analyzes conversation and updates context
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
    } else if (lowerMessage.includes('industrial design') || lowerMessage.includes('design patent')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'industrial_design';
    } else if (lowerMessage.includes('infringement') || lowerMessage.includes('violation')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'infringement';
    } else if (lowerMessage.includes('licens')) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'licensing';
    }
    
    // Track jurisdiction information
    const jurisdictionPatterns = [
      { pattern: /\b(us|usa|united states)\b/i, value: 'United States' },
      { pattern: /\b(uk|united kingdom)\b/i, value: 'United Kingdom' },
      { pattern: /\b(eu|european union)\b/i, value: 'European Union' },
      { pattern: /\b(canada)\b/i, value: 'Canada' },
      { pattern: /\b(australia)\b/i, value: 'Australia' },
      { pattern: /\b(japan)\b/i, value: 'Japan' },
      { pattern: /\b(china)\b/i, value: 'China' },
      { pattern: /\b(india)\b/i, value: 'India' }
    ];
    
    // Enhanced topic detection to identify non-technical legal questions
    // This helps recognize when users don't know the proper legal terminology
    const enhancedTopicPatterns = [
      // Database and unauthorized access patterns
      { pattern: /\b(database|data|information|files)\b.*?\b(access|entry|enter|use|using|used|get|got|accessed)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i, topic: 'unauthorized_access' },
      { pattern: /\b(access|entered|entry|get|got|took|using|used|took)\b.*?\b(database|data|information|files)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i, topic: 'unauthorized_access' },
      { pattern: /\b(steal|stole|stolen|took|taking)\b.*?\b(data|information|database|content|files)\b/i, topic: 'unauthorized_access' },
      { pattern: /\b(hack|hacked|hacking|breach|breached)\b/i, topic: 'unauthorized_access' },
      
      // General IP infringement with non-technical language
      { pattern: /\b(someone|they|people|person)\b.*?\b(use|using|used|copy|copied|copying|stole|steal|stealing|took|taking)\b.*?\b(my|our|mine|company|business)\b.*?\b(idea|work|content|creation|product|design)\b/i, topic: 'infringement' },
      { pattern: /\b(protect|protection|protecting)\b.*?\b(my|our|mine)\b.*?\b(idea|work|business|company|product|invention|design|content|creation)\b/i, topic: 'ip_protection' },
      
      // Simple trademark questions without using "trademark" term
      { pattern: /\b(name|logo|brand|slogan)\b.*?\b(protect|copy|copied|copying|use|using|steal|stole|stolen)\b/i, topic: 'trademark' },
      { pattern: /\b(company|business|product)\b.*?\b(name|brand)\b.*?\b(same|similar|copied|copy|copying|use|using|used)\b/i, topic: 'trademark' },
      
      // Copyright questions without using "copyright" term
      { pattern: /\b(book|music|song|video|photo|picture|image|art|artwork|movie|film|content|software|code|article|writing)\b.*?\b(copy|copied|copying|use|used|using|steal|stole|stolen)\b/i, topic: 'copyright' },
      { pattern: /\b(create|created|wrote|written|made|recorded|produced|drew|painted|designed|developed|coded)\b.*?\b(copied|copy|copying|stole|stolen|using|used)\b/i, topic: 'copyright' },
      
      // Patent-related without using "patent" term
      { pattern: /\b(invent|invented|invention|innovation|created|device|machine|process|method|technology)\b.*?\b(protect|copy|copied|copying|stole|stolen|use|used|using)\b/i, topic: 'patent' },
    ];
    
    // Check for enhanced topic patterns
    for (const pattern of enhancedTopicPatterns) {
      if (pattern.pattern.test(lowerMessage)) {
        newContext.lastTopic = newContext.topic;
        newContext.topic = pattern.topic;
        break;
      }
    }
    
    for (const jp of jurisdictionPatterns) {
      if (jp.pattern.test(lowerMessage)) {
        newContext.jurisdiction = jp.value;
        break;
      }
    }
    
    // Track complexity level
    if (/\badvanced\b|\bdetailed\b|\bcomplex\b|\bspecific\b/i.test(lowerMessage)) {
      newContext.complexity = 'advanced';
    } else if (/\bbasic\b|\bsimple\b|\bbeginning\b|\bintroduction\b/i.test(lowerMessage)) {
      newContext.complexity = 'basic';
    }
    
    // Track user case information
    if (lowerMessage.includes('my company') || lowerMessage.includes('my business') || 
        lowerMessage.includes('our company') || lowerMessage.includes('our business')) {
      newContext.userCase = 'business';
      
      // Try to detect business type
      if (lowerMessage.includes('startup') || lowerMessage.includes('new company')) {
        newContext.businessType = 'startup';
      } else if (lowerMessage.includes('software') || lowerMessage.includes('tech') || 
                lowerMessage.includes('technology') || lowerMessage.includes('app')) {
        newContext.businessType = 'technology';
      } else if (lowerMessage.includes('creative') || lowerMessage.includes('design') || 
                lowerMessage.includes('art') || lowerMessage.includes('media')) {
        newContext.businessType = 'creative';
      } else if (lowerMessage.includes('manufacturing') || lowerMessage.includes('product') || 
                lowerMessage.includes('hardware')) {
        newContext.businessType = 'manufacturing';
      }
    } else if (lowerMessage.includes('my creation') || lowerMessage.includes('my work') || 
              lowerMessage.includes('my invention') || lowerMessage.includes('i created')) {
      newContext.userCase = 'creator';
      
      // Try to detect user role
      if (lowerMessage.includes('invent') || lowerMessage.includes('patent')) {
        newContext.userRole = 'inventor';
      } else if (lowerMessage.includes('artist') || lowerMessage.includes('author') || 
                lowerMessage.includes('music') || lowerMessage.includes('write') || 
                lowerMessage.includes('book') || lowerMessage.includes('song')) {
        newContext.userRole = 'creator';
      }
    }
    
    // Track user role if mentioned
    if (lowerMessage.includes('student') || lowerMessage.includes('studying') || 
        lowerMessage.includes('university') || lowerMessage.includes('college')) {
      newContext.userRole = 'student';
    } else if (lowerMessage.includes('lawyer') || lowerMessage.includes('attorney') || 
              lowerMessage.includes('legal professional')) {
      newContext.userRole = 'legal professional';
    } else if (lowerMessage.includes('entrepreneur') || lowerMessage.includes('founder') || 
              lowerMessage.includes('ceo') || lowerMessage.includes('owner')) {
      newContext.userRole = 'entrepreneur';
    }
    
    // Reset follow-up suggestion flag when user sends a new message
    newContext.followUpSuggested = false;
    
    // Add timestamp for tracking conversation flow
    newContext.lastQueryTimestamp = Date.now();
    
    return newContext;
  };
  // Function to analyze past conversations and extract user preferences
  const analyzeUserPreferences = (): {jurisdiction?: string, interests?: string[], businessType?: string, userRole?: string, complexity?: string} => {
    const preferences: {jurisdiction?: string, interests?: string[], businessType?: string, userRole?: string, complexity?: string} = {
      interests: []
    };
    
    // Get past messages from localStorage
    try {
      const savedMessages = localStorage.getItem('chatbotPageHistory');
      if (!savedMessages) return preferences;
      
      const messages = JSON.parse(savedMessages);
      const userMessages = messages.filter((msg: any) => msg.type === 'user');
      
      // Look for jurisdiction mentions
      const jurisdictionPatterns = [
        { pattern: /\b(us|usa|united states)\b/i, value: 'United States' },
        { pattern: /\b(uk|united kingdom)\b/i, value: 'United Kingdom' },
        { pattern: /\b(eu|european union)\b/i, value: 'European Union' },
        { pattern: /\b(canada)\b/i, value: 'Canada' },
        { pattern: /\b(australia)\b/i, value: 'Australia' },
        { pattern: /\b(japan)\b/i, value: 'Japan' },
        { pattern: /\b(china)\b/i, value: 'China' },
        { pattern: /\b(india)\b/i, value: 'India' }
      ];
      
      // Look for IP topic interests
      const interestPatterns = [
        { pattern: /\btrademark\b/i, value: 'trademark' },
        { pattern: /\bcopyright\b/i, value: 'copyright' },
        { pattern: /\bpatent\b/i, value: 'patent' },
        { pattern: /\bindustrial design\b/i, value: 'industrial design' },
        { pattern: /\btrade secret\b/i, value: 'trade secret' },
        { pattern: /\blicensing\b/i, value: 'licensing' },
        { pattern: /\binfringement\b/i, value: 'infringement' },
        { pattern: /\benforcement\b/i, value: 'enforcement' }
      ];
      
      // Business type patterns
      const businessPatterns = [
        { pattern: /\bstartup\b/i, value: 'startup' },
        { pattern: /\bsoftware\b|\btech\b|\btechnology\b/i, value: 'technology' },
        { pattern: /\bcreative\b|\bart\b|\bdesign\b/i, value: 'creative' },
        { pattern: /\bmanufacturing\b|\bproduct\b/i, value: 'manufacturing' },
        { pattern: /\bservice\b/i, value: 'service' },
        { pattern: /\bretail\b|\bcommerce\b|\bstore\b/i, value: 'retail' }
      ];
      
      // User role patterns
      const rolePatterns = [
        { pattern: /\binventor\b/i, value: 'inventor' },
        { pattern: /\bartist\b|\bcreator\b|\bauthor\b|\bmusician\b/i, value: 'creator' },
        { pattern: /\bentrepreneur\b|\bfounder\b|\bceo\b|\bowner\b/i, value: 'entrepreneur' },
        { pattern: /\blawyer\b|\battorney\b|\blegal\b/i, value: 'legal professional' },
        { pattern: /\bstudent\b/i, value: 'student' }
      ];
      
      // Complexity level inference
      const complexityPatterns = [
        { pattern: /\badvanced\b|\bdetailed\b|\bcomplex\b|\bspecific\b/i, value: 'advanced' },
        { pattern: /\bbasic\b|\bsimple\b|\bbeginning\b|\bintroduction\b/i, value: 'basic' }
      ];

      // Count message frequency for each pattern to determine strongest matches
      const jurisdictionCounts: {[key: string]: number} = {};
      const interestCounts: {[key: string]: number} = {};
      const businessCounts: {[key: string]: number} = {};
      const roleCounts: {[key: string]: number} = {};
      const complexityCounts: {[key: string]: number} = {};
      
      for (const message of userMessages) {
        const content = message.content.toLowerCase();
        
        // Check for jurisdiction mentions
        for (const jp of jurisdictionPatterns) {
          if (jp.pattern.test(content)) {
            jurisdictionCounts[jp.value] = (jurisdictionCounts[jp.value] || 0) + 1;
          }
        }
        
        // Check for interests
        for (const ip of interestPatterns) {
          if (ip.pattern.test(content)) {
            interestCounts[ip.value] = (interestCounts[ip.value] || 0) + 1;
          }
        }
        
        // Check for business type
        for (const bp of businessPatterns) {
          if (bp.pattern.test(content)) {
            businessCounts[bp.value] = (businessCounts[bp.value] || 0) + 1;
          }
        }
        
        // Check for user role
        for (const rp of rolePatterns) {
          if (rp.pattern.test(content)) {
            roleCounts[rp.value] = (roleCounts[rp.value] || 0) + 1;
          }
        }
        
        // Check for complexity preference
        for (const cp of complexityPatterns) {
          if (cp.pattern.test(content)) {
            complexityCounts[cp.value] = (complexityCounts[cp.value] || 0) + 1;
          }
        }
      }
      
      // Set preferences based on frequency counts
      // Jurisdiction - select the most frequently mentioned
      if (Object.keys(jurisdictionCounts).length > 0) {
        preferences.jurisdiction = Object.entries(jurisdictionCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
      }
      
      // Interests - add all with at least 1 mention, sorted by frequency
      if (Object.keys(interestCounts).length > 0) {
        preferences.interests = Object.entries(interestCounts)
          .sort((a, b) => b[1] - a[1])
          .map(entry => entry[0]);
      }
      
      // Business type - select the most frequently mentioned
      if (Object.keys(businessCounts).length > 0) {
        preferences.businessType = Object.entries(businessCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
      }
      
      // User role - select the most frequently mentioned
      if (Object.keys(roleCounts).length > 0) {
        preferences.userRole = Object.entries(roleCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
      }
      
      // Complexity - select the most frequently mentioned
      if (Object.keys(complexityCounts).length > 0) {
        preferences.complexity = Object.entries(complexityCounts)
          .sort((a, b) => b[1] - a[1])[0][0];
      }
      
    } catch (error) {
      console.error('Error analyzing user preferences:', error);
    }
    
    return preferences;
  }  
    // UTILITY FUNCTIONS - Currently not used directly but kept for reference and future use
  // This function detects if a user's question is unclear and needs clarification
  const detectUnclearQuestion = (message: string): boolean => {
    const lowerMessage = message.toLowerCase();
    
    // Check if the message is too short or vague
    if (message.length < 12 || message.split(' ').length < 3) {
      return true;
    }
    
    // Check for vague terms without specific context
    const vaguePatterns = [
      /^(what|how|can|is|are|do|does).{0,10}(law|legal|ip|laws)/i,
      /^(help|need help|question|advice).{0,15}(law|legal|ip|data)/i,
      /\b(ip law|intellectual property)\b.*?\b(question|help|advice)\b/i,
      /^(hello|hi|hey).{0,15}(question|help|advice|information)/i,
      /\b(explain|tell me about|what is).{0,5}$/i,
    ];
    
    for (const pattern of vaguePatterns) {
      if (pattern.test(lowerMessage)) {
        return true;
      }
    }
    
    // Check if message contains IP-related terms but lacks specific action or question
    const hasIpTerms = /\b(trademark|copyright|patent|intellectual property|ip|data protection)\b/i.test(lowerMessage);
    const hasQuestion = /\b(how|what|when|where|why|who|can|could|should|would|is|are|do|does)\b.*\?/i.test(lowerMessage) || message.includes('?');
    
    if (hasIpTerms && !hasQuestion) {
      return true;
    }
    
    return false;
  };
  // UTILITY FUNCTIONS - Currently not used directly but kept for reference and future use
  // This function provides guidance for unclear questions
  const generateClarificationResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    // Check for IP topic hints in the unclear question
    if (/\b(trademark|brand|logo|name)\b/i.test(lowerMessage)) {
      return "I'd like to help with your trademark question. To provide the most accurate information, could you clarify what specific aspect of trademarks you're interested in?\n\n• Are you looking to register a trademark?\n• Do you have questions about trademark infringement?\n• Are you wondering if something can be trademarked?\n• Do you need information about international trademark protection?\n\nProviding a bit more detail will help me give you the most relevant information.";
    } 
    else if (/\b(copyright|book|music|art|creative|author|artist)\b/i.test(lowerMessage)) {
      return "I'd like to help with your copyright question. To provide the most useful information, could you tell me more about:\n\n• The type of creative work involved (book, music, art, software, etc.)\n• Whether you're the creator or using someone else's work\n• The specific copyright issue you're facing (protection, infringement, fair use, etc.)\n\nWith a bit more context, I can provide more targeted guidance.";
    }
    else if (/\b(data|database|information|access|computer|system)\b/i.test(lowerMessage)) {
      return "I see you're asking about data or database-related legal issues. To help you better, could you tell me:\n\n• Are you concerned about protecting data from unauthorized access?\n• Has there been a data breach or unauthorized access incident?\n• Are you looking for information on legal requirements for data protection?\n• Are you seeking remedies for unauthorized data use?\n\nWith more specific information, I can provide more accurate guidance.";
    }
    else {
      return "I'd like to help with your intellectual property question. To provide the most helpful guidance, could you share a bit more about:\n\n• The specific type of intellectual property involved (trademark, copyright, patent, trade secret, etc.)\n• The specific issue you're facing (registration, protection, infringement, licensing, etc.)\n• Whether this is for personal use, a business, or academic purposes\n\nWith this additional context, I'll be able to provide more targeted information.";
    }
  };  // Function to simulate chatbot response
  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if the question is unclear and needs clarification
    const isUnclearQuestion = lowerMessage.length < 12 || lowerMessage.split(' ').length < 3 ||
      /^(what|how|can|is|are|do|does).{0,10}(law|legal|ip|laws)/i.test(lowerMessage) ||
      /^(help|need help|question|advice).{0,15}(law|legal|ip|data)/i.test(lowerMessage);
    
    if (isUnclearQuestion) {
      // Return a simple clarification request
      return "I'd like to help with your question. Could you provide a bit more detail or context so I can give you the most relevant information?";
    }
    
    // Check for Sri Lanka specific IP law questions
    const isSriLankaQuery = lowerMessage.includes('sri lanka') || 
                          lowerMessage.includes('sri lankan') || 
                          lowerMessage.includes('lanka') || 
                          lowerMessage.includes('srilanka') || 
                          lowerMessage.includes('lankan');
                          
    if (isSriLankaQuery) {
      if (lowerMessage.includes('ip act') || lowerMessage.includes('intellectual property act') || 
          (lowerMessage.includes('act') && lowerMessage.includes('36') && lowerMessage.includes('2003'))) {
        return "Sri Lanka's Intellectual Property Act, No. 36 of 2003 is the primary legislation governing intellectual property in Sri Lanka. This comprehensive law covers:\n\n• Trademarks (Part IV)\n• Industrial Designs (Part III)\n• Patents (Part II)\n• Copyrights (Part I)\n• Unfair competition and undisclosed information\n\nThe Act established the National Intellectual Property Office (NIPO) of Sri Lanka, which administers IP registrations. The Act is compliant with the WTO's TRIPS Agreement (Trade-Related Aspects of Intellectual Property Rights).\n\nWould you like specific information about any particular aspect of this Act?";
      }
      
      if (lowerMessage.includes('trademark') || lowerMessage.includes('trade mark') || lowerMessage.includes('brand')) {
        if (lowerMessage.includes('register') || lowerMessage.includes('registration') || lowerMessage.includes('apply')) {
          return "To register a trademark in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n1. **Application**: Submit to the National Intellectual Property Office (NIPO) with:\n   • Representation of the mark\n   • List of goods/services with appropriate classes\n   • Applicant details\n   • Power of attorney (if filed through an agent)\n   • Priority documents (if claiming priority)\n\n2. **Fees**: Pay the required application fee (varies by number of classes)\n\n3. **Examination**: The Registrar examines for compliance and distinctiveness\n\n4. **Publication**: If accepted, the mark is published in the Gazette\n\n5. **Opposition Period**: 3 months where third parties may oppose\n\n6. **Registration**: If no opposition or opposition resolved, the mark is registered\n\nThe initial term is 10 years from filing date, renewable for successive 10-year periods. For specific assistance, you may contact the NIPO or a qualified IP attorney in Sri Lanka.";
        } else if (lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('validity')) {
          return "Under Sri Lanka's Intellectual Property Act, No. 36 of 2003:\n\n• Trademark registration is valid for **10 years** from the date of filing\n• Registration can be **renewed indefinitely** for successive periods of 10 years\n• A renewal application must be filed within 12 months before expiration\n• A 6-month grace period after expiration is available with payment of surcharge\n• If not renewed, the trademark will be removed from the register\n\nRegistered trademark owners must use the mark in Sri Lanka to maintain protection, as non-use for an uninterrupted period of 5 years can make the mark vulnerable to cancellation upon request by interested parties.";
        } else if (lowerMessage.includes('infringement') || lowerMessage.includes('unauthorized')) {
          return "Under Sri Lanka's Intellectual Property Act, No. 36 of 2003, trademark infringement occurs when someone without authorization:\n\n• Uses an identical or similar mark for identical or similar goods/services, creating a likelihood of confusion\n• Uses a well-known mark that would indicate a connection with the owner or likely damage their interests\n\nRemedies for trademark infringement in Sri Lanka include:\n• Injunctions (temporary or permanent)\n• Damages or account of profits\n• Seizure, forfeiture, or destruction of infringing goods\n• Criminal penalties for willful trademark counterfeiting (fines up to Rs. 500,000 and/or imprisonment up to 6 months)\n\nInfringement actions can be filed in the Commercial High Court of Colombo. The time limit for filing civil actions is typically 5 years from the act of infringement.";
        } else {
          return "Trademark protection in Sri Lanka is governed by the Intellectual Property Act, No. 36 of 2003:\n\n• **Definition**: A trademark can be any sign that distinguishes goods or services of one enterprise from those of others\n• **Requirements**: Must be distinctive and not identical/similar to existing marks\n• **Registration**: Not mandatory but provides stronger protection\n• **Rights**: Exclusive right to use the mark and prevent unauthorized use by others\n• **Term**: 10 years, renewable indefinitely for successive 10-year periods\n• **Use Requirement**: Marks unused for 5 consecutive years may be vulnerable to cancellation\n• **Well-Known Marks**: Special protection even if not registered in Sri Lanka\n\nThe National Intellectual Property Office (NIPO) handles trademark registrations in Sri Lanka. Would you like more specific information about trademark registration or enforcement in Sri Lanka?";
        }
      }
      
      if (lowerMessage.includes('copyright') || lowerMessage.includes('author') || lowerMessage.includes('creative work')) {
        if (lowerMessage.includes('register') || lowerMessage.includes('registration')) {
          return "In Sri Lanka, under the Intellectual Property Act, No. 36 of 2003, copyright protection is **automatic** upon creation of an original work. Formal registration is not required to obtain copyright protection.\n\nHowever, Sri Lanka does offer a voluntary copyright registration system through the National Intellectual Property Office (NIPO) that can help provide evidence of ownership:\n\n1. Submit an application to NIPO with:\n   • Copy of the work\n   • Details of the author/owner\n   • Date of creation/publication\n   • Proof of identity\n   • Applicable fee\n\n2. NIPO issues a certificate that can serve as prima facie evidence of ownership\n\nThis registration is particularly useful for providing evidence in case of infringement disputes, though it does not confer any additional rights beyond those automatically granted under the law.";
        } else if (lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('term')) {
          return "Copyright duration in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n• **Literary, artistic, and scientific works**: Life of the author plus 70 years\n• **Joint authorship works**: 70 years from the death of the last surviving author\n• **Anonymous/pseudonymous works**: 70 years from the date of publication\n• **Audiovisual works**: 70 years from the date of making available to the public or 70 years from creation if not made available\n• **Applied art**: 25 years from the date of creation\n• **Photographic works**: 50 years from creation\n• **Computer programs**: Life of the author plus 70 years\n• **Performances**: 50 years from the performance\n• **Sound recordings**: 50 years from fixation\n• **Broadcasts**: 50 years from the broadcast\n\nThese terms are calculated from the beginning of the year following the death, publication, or creation as applicable.";
        } else if (lowerMessage.includes('fair') || lowerMessage.includes('exception')) {
          return "Sri Lanka's Intellectual Property Act, No. 36 of 2003 provides certain exceptions to copyright protection, similar to fair use/fair dealing doctrines. These include:\n\n• **Private reproduction**: Limited personal or private use\n• **Quotations**: Short quotations compatible with fair practice\n• **Teaching**: Reproduction for teaching purposes\n• **News reporting**: Reproduction for current events reporting\n• **Reproduction for judicial proceedings**\n• **Reproduction for libraries and archives** under specific conditions\n• **Public speeches and lectures**: Limited reproduction for informatory purposes\n• **Ephemeral recordings** by broadcasting organizations\n• **Public display** of works permanently in public places\n\nThese exceptions are subject to the condition that they don't conflict with normal exploitation of the work and don't unreasonably prejudice the legitimate interests of the rights holder. For specific scenarios, consulting with a Sri Lankan IP attorney is recommended.";
        } else {
          return "Copyright in Sri Lanka is governed by the Intellectual Property Act, No. 36 of 2003:\n\n• **Protected Works**: Literary, artistic, musical, audiovisual works, computer programs, databases, and derivative works\n• **Rights Granted**: Economic rights (reproduction, distribution, public display, etc.) and moral rights (attribution and integrity)\n• **Acquisition**: Automatic upon creation; no registration required (though voluntary registration is available)\n• **Duration**: Generally author's life plus 70 years (varies by work type)\n• **Ownership**: Generally belongs to the author, except in employment situations where it may belong to the employer\n• **Infringement Remedies**: Civil (injunctions, damages) and criminal penalties\n\nThe Act also provides protection for related rights including performances, phonograms, and broadcasts. Would you like more specific information about any aspect of copyright protection in Sri Lanka?";
        }
      }
      
      if (lowerMessage.includes('patent') || lowerMessage.includes('invention')) {
        if (lowerMessage.includes('application') || lowerMessage.includes('register') || lowerMessage.includes('file')) {
          return "To patent an invention in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n1. **Prepare Application**:\n   • Complete specification with claims\n   • Drawings (if necessary)\n   • Abstract\n   • Applicant and inventor details\n\n2. **File with NIPO** (National Intellectual Property Office) with prescribed fees\n\n3. **Examination Process**:\n   • Formality examination\n   • Publication in the Gazette (after 18 months from filing)\n   • Substantive examination (upon request within 3 years of filing)\n\n4. **Grant and Publication**: If approved, patent is granted and published\n\nForeign applicants must appoint a local agent. Sri Lanka recognizes Paris Convention priority (12 months). The application and all documents must be in English, Sinhala, or Tamil.\n\nPatent fees include filing fees, examination fees, and annual maintenance fees that increase over the patent term.";
        } else if (lowerMessage.includes('duration') || lowerMessage.includes('term') || lowerMessage.includes('how long')) {
          return "Patent duration in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n• Patents are granted for a period of **20 years** from the filing date\n• No extensions are available, even for pharmaceutical patents\n• Maintenance requires payment of annual fees, starting from the second year\n• Failure to pay annual fees will result in the patent lapsing\n• A grace period of 6 months is available for late payment with a surcharge\n• After expiration, the invention enters the public domain\n\nThe effective term may be shorter if the patent is invalidated through legal proceedings or if the patent holder surrenders the patent rights.";
        } else if (lowerMessage.includes('requirement') || lowerMessage.includes('criteria')) {
          return "For an invention to be patentable in Sri Lanka under the Intellectual Property Act, No. 36 of 2003, it must meet these requirements:\n\n1. **Novelty**: The invention must be new and not part of the prior art worldwide\n\n2. **Inventive Step**: The invention must not be obvious to a person skilled in the relevant field\n\n3. **Industrial Applicability**: The invention must be capable of being made or used in some kind of industry\n\n4. **Patentable Subject Matter**: The invention must not fall under excluded categories such as:\n   • Discoveries, scientific theories, and mathematical methods\n   • Plants, animals, and biological processes\n   • Methods of treatment for humans or animals\n   • Diagnostic, therapeutic, and surgical methods\n   • Inventions contrary to public order or morality\n\nThe application must also sufficiently disclose the invention to enable a person skilled in the art to carry it out.";
        } else {
          return "Patent protection in Sri Lanka is governed by the Intellectual Property Act, No. 36 of 2003:\n\n• **Definition**: A patent protects new inventions involving an inventive step and capable of industrial application\n• **Requirements**: Novelty, inventive step, and industrial applicability\n• **Term**: 20 years from filing date (non-renewable)\n• **Rights**: Exclusive right to make, use, sell, and import the patented invention\n• **Application Process**: Filing with the National Intellectual Property Office (NIPO)\n• **Enforcement**: Through Commercial High Court of Colombo\n• **Annual Fees**: Required to maintain the patent in force\n\nSri Lanka is a member of the Paris Convention, allowing priority claims based on foreign applications filed within the previous 12 months. However, Sri Lanka is not a member of the Patent Cooperation Treaty (PCT), so direct national filing is required.\n\nWould you like specific information about patent application procedures or enforcement in Sri Lanka?";
        }
      }
      
      if (lowerMessage.includes('industrial design') || lowerMessage.includes('design patent')) {
        if (lowerMessage.includes('register') || lowerMessage.includes('application') || lowerMessage.includes('file')) {
          return "To register an industrial design in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n1. **Prepare Application**:\n   • Graphic representation or photographs of the design\n   • Indication of the article incorporating the design\n   • Applicant details\n   • Power of attorney (if filed through an agent)\n   • Priority documents (if claiming priority)\n\n2. **File with NIPO** (National Intellectual Property Office) with prescribed fees\n\n3. **Examination Process**:\n   • Formality examination\n   • Substantive examination (novelty and originality)\n\n4. **Registration and Publication**: If approved, the design is registered and published in the Gazette\n\nForeign applicants must appoint a local agent. Sri Lanka recognizes Paris Convention priority (6 months). Multiple designs for the same class can be included in one application.";
        } else if (lowerMessage.includes('duration') || lowerMessage.includes('term') || lowerMessage.includes('how long')) {
          return "Industrial design protection in Sri Lanka under the Intellectual Property Act, No. 36 of 2003:\n\n• Initial term of protection is **5 years** from the filing date\n• Renewable for **two consecutive periods of 5 years** each\n• Maximum total protection period of **15 years**\n• Renewal application must be filed within 6 months before expiration\n• Grace period of 6 months after expiration is available with payment of surcharge\n\nAfter the maximum protection period expires, the design enters the public domain and can be freely used by anyone.";
        } else {
          return "Industrial design protection in Sri Lanka is governed by the Intellectual Property Act, No. 36 of 2003:\n\n• **Definition**: Protects the ornamental or aesthetic aspect of an article, comprising 3D features (shape) or 2D features (patterns, lines, colors)\n• **Requirements**: Must be new or original and not dictated solely by technical function\n• **Registration**: Required for protection, filed with the National Intellectual Property Office (NIPO)\n• **Term**: 5 years, renewable for two additional 5-year periods (maximum 15 years total)\n• **Rights**: Exclusive right to make, sell, import articles bearing the design\n• **Exclusions**: Designs contrary to public order or morality are not registrable\n\nThe owner of a registered design can take legal action against unauthorized use, including seeking injunctions, damages, and destruction of infringing articles.\n\nWould you like specific information about the industrial design registration process or enforcement in Sri Lanka?";
        }
      }
      
      if (lowerMessage.includes('nipo') || lowerMessage.includes('national intellectual property office')) {
        return "The National Intellectual Property Office (NIPO) of Sri Lanka is the government agency responsible for administering intellectual property rights in the country. Established under the Intellectual Property Act, No. 36 of 2003, NIPO's functions include:\n\n• Registration of trademarks, patents, and industrial designs\n• Maintaining IP registers and databases\n• Providing information to the public on IP matters\n• Promoting awareness and understanding of IP rights\n• Implementing international IP treaties and agreements\n\nContact Information:\nNational Intellectual Property Office of Sri Lanka\nSamagam Medura,\nD.R. Wijewardena Mawatha,\nColombo 10, Sri Lanka\nTelephone: +94 11 2689368\nFax: +94 11 2689367\nEmail: nipo@sltnet.lk\nWebsite: www.nipo.gov.lk\n\nNIPO operates under the Ministry of Industry and Commerce and plays a vital role in Sri Lanka's intellectual property ecosystem.";
      }    }
    
    // Handle database access, data protection and unauthorized access questions
    if (lowerMessage.includes('database') || 
        (lowerMessage.includes('access') && lowerMessage.includes('without permission')) || 
        (lowerMessage.includes('entry') && lowerMessage.includes('without permission')) ||
        lowerMessage.includes('unauthorized access') ||
        lowerMessage.includes('data breach') ||
        (lowerMessage.includes('using') && lowerMessage.includes('data') && lowerMessage.includes('permission'))) {
      
      if (lowerMessage.includes('action') || lowerMessage.includes('sue') || lowerMessage.includes('legal') || lowerMessage.includes('remedy') || lowerMessage.includes('against')) {
        return "When someone accesses a database without authorization, several legal remedies are available:\n\n1. **Computer Fraud and Abuse Act (CFAA)**: In the US, unauthorized access to computer systems is a federal offense that can lead to both criminal charges and civil liability\n\n2. **Data Protection Laws**: Regulations like GDPR (EU), CCPA (California), or various national data protection laws may provide specific remedies for unauthorized data access\n\n3. **Breach of Contract**: If the unauthorized user violated terms of service or confidentiality agreements\n\n4. **Trade Secret Laws**: If the database contains proprietary business information that qualifies as trade secrets\n\n5. **Copyright Infringement**: If the database structure or contents are protected by copyright\n\n6. **Legal Steps to Take**:\n   • Document the unauthorized access with evidence\n   • Report to law enforcement for criminal investigation\n   • Send cease and desist letters\n   • File for injunctive relief to prevent further access\n   • Pursue damages through litigation\n\nWould you like more specific information about any of these remedies or how to determine which laws apply to your situation?";
      } else if (lowerMessage.includes('prevent') || lowerMessage.includes('protect') || lowerMessage.includes('security')) {
        return "To protect your database from unauthorized access, consider these legal and technical measures:\n\n1. **Legal Protections**:\n   • Implement clear Terms of Service and Acceptable Use Policies\n   • Use robust data processing agreements with third parties\n   • Include confidentiality clauses in employee contracts\n   • Register database copyrights if the structure is original\n   • Maintain trade secret status by implementing reasonable security measures\n\n2. **Technical Measures**:\n   • Implement strong access controls and authentication\n   • Use encryption for sensitive data\n   • Maintain access logs and monitoring systems\n   • Regular security audits and penetration testing\n\n3. **Compliance Requirements**:\n   • Ensure compliance with relevant data protection laws (GDPR, CCPA, etc.)\n   • Implement data breach notification procedures\n   • Regular employee training on data security\n\nWould you like more specific information about legal protections for databases or technical security measures?";
      } else {
        return "Unauthorized access to databases is governed by several legal frameworks:\n\n1. **Computer Crime Laws**: Laws like the Computer Fraud and Abuse Act (US) criminalize unauthorized access to computer systems and data\n\n2. **Data Protection Regulations**: Laws like GDPR (EU), CCPA (California), and other regional data protection laws regulate how data should be protected and establish penalties for breaches\n\n3. **Intellectual Property Protection**:\n   • **Copyright**: Database structures and content may be protected by copyright if they show sufficient originality\n   • **Trade Secret Law**: Proprietary databases containing valuable business information may qualify for trade secret protection\n   • **Contract Law**: Terms of service, confidentiality agreements, and other contracts can provide additional legal protection\n\n4. **Potential Consequences**:\n   • Criminal penalties including fines and imprisonment\n   • Civil liability for damages\n   • Regulatory fines for inadequate security measures\n   • Reputational damage\n\nWould you like more information about specific legal remedies available when unauthorized access occurs, or about preventive measures you can take to protect your data?";
      }
      
      // If we reach here, it means none of the database access conditions matched
      // Return a default response instead of null to ensure type consistency
      return "";
    }
    
    // Comprehensive IP-specific responses
    if (lowerMessage.includes('trademark')) {
      if (lowerMessage.includes('register') || lowerMessage.includes('application') || lowerMessage.includes('how do i')) {
        return "To register a trademark, follow these steps:\n\n1. **Conduct a search** - Ensure your mark isn't already in use or registered\n2. **Prepare your application** - Include a clear representation of your mark and identify the applicable classes of goods/services\n3. **File your application** with the IP office (costs vary by jurisdiction, typically $250-$750 per class)\n4. **Respond to any office actions** - Address examiner concerns or objections\n5. **Publication and opposition period** - Your mark will be published, allowing others to oppose it\n6. **Registration certificate** - If no oppositions are filed or are successfully overcome\n\nThe process typically takes 6-18 months. Would you like specific information about trademark searches or classification systems?";
      } else if (lowerMessage.includes('business name')) {
        return "Yes, you can trademark a business name if it functions as a source identifier for your goods or services. To be eligible, the name should be:\n\n• Distinctive (not generic or merely descriptive)\n• Not confusingly similar to existing trademarks\n• Actually used in commerce or intended to be used\n\nKeep in mind that registering a business name with a state agency (like an LLC filing) is different from trademark registration and doesn't provide trademark protections. For strong legal protection across your industry, federal trademark registration is recommended.\n\nWould you like to know more about distinctiveness requirements or the difference between descriptive and suggestive business names?";
      } else if (lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
        return "Trademark registration costs vary by country and the number of classes. Here's a general breakdown:\n\n• **Filing fees**: $250-$350 per class in the US (USPTO), with slight discounts for electronic filing\n• **International registration** (Madrid System): Base fee plus additional fees per designated country\n• **Attorney fees**: $500-$2,000 for a straightforward application\n• **Maintenance fees**: Required periodically (in the US, between 5-6 years, 9-10 years, and every 10 years thereafter)\n\nAdditional costs may include trademark search fees, office action responses, and opposition proceedings if they arise. Would you like more specific information about a particular country's fee structure or the benefits of using an attorney?";
      } else {
        return "A trademark is a distinctive sign (word, logo, slogan, sound, etc.) that identifies and distinguishes your goods or services from others in the marketplace. Trademarks serve as a badge of origin and quality.\n\nKey features of trademark protection:\n• Can last indefinitely with proper use and renewal (typically every 10 years)\n• Provides exclusive rights in the specific classes of goods/services registered\n• Stronger protection for distinctive or invented marks compared to descriptive ones\n• Registration is territorial (country-specific), though international options exist\n\nCommon trademark symbols include ™ (unregistered trademark), ℠ (service mark), and ® (registered trademark - only use this after official registration).\n\nWhat specific aspect of trademarks would you like to explore further?";
      }
    } else if (lowerMessage.includes('copyright')) {
      if (lowerMessage.includes('register') || lowerMessage.includes('application')) {
        return "Copyright registration, while voluntary in most countries, provides important legal benefits:\n\n• Creates a public record of ownership\n• Required before filing an infringement lawsuit in some countries (like the US)\n• Allows claims for statutory damages and attorney's fees\n• Serves as prima facie evidence of validity\n\nThe registration process typically involves:\n1. Completing an application form with creator information and work details\n2. Submitting a deposit copy of your work\n3. Paying the required fee (US fees range from $45-$500 depending on type and filing method)\n\nMany countries offer online registration systems. Would you like more specific information about registration in a particular country or for a specific type of work?";
      } else if (lowerMessage.includes('duration') || lowerMessage.includes('how long') || lowerMessage.includes('last')) {
        return "Copyright duration varies by country, but generally follows these patterns:\n\n• **Standard works**: Author's lifetime plus 70 years after death in most countries (including US, EU, UK)\n• **Works made for hire/corporate works**: 95 years from publication or 120 years from creation (whichever is shorter) in the US\n• **Anonymous/pseudonymous works**: Often 70 years from publication if author identity isn't disclosed\n• **Joint works**: 70 years after the death of the last surviving author\n\nSome countries have different terms - for example, Mexico offers life plus 100 years. Unlike trademarks or patents, copyright protection doesn't require renewal.\n\nIs there a specific type of work or country you're curious about?";
      } else if (lowerMessage.includes('fair use') || lowerMessage.includes('fair dealing')) {
        return "Fair use (US) or fair dealing (UK, Canada, Australia) are important limitations to copyright that allow limited use of copyrighted material without permission for purposes such as:\n\n• Criticism and review\n• News reporting\n• Research and private study\n• Teaching and education\n• Parody and satire (in many jurisdictions)\n\nCourts typically consider these factors when evaluating fair use:\n1. Purpose and character of the use (commercial vs. non-profit/educational)\n2. Nature of the copyrighted work\n3. Amount and substantiality of the portion used\n4. Effect on the potential market for the original work\n\nFair use/dealing is determined case-by-case and can be unpredictable. Would you like to discuss a specific fair use scenario?";
      } else {
        return "Copyright protects original creative works fixed in a tangible medium, including:\n• Literary works (books, articles, software code)\n• Musical works and sound recordings\n• Dramatic works and performances\n• Artistic works (paintings, photographs, sculptures)\n• Audiovisual works (films, videos, games)\n• Architectural works\n\nKey features of copyright protection:\n• Automatic upon creation - no registration required (though registration provides benefits)\n• Grants exclusive rights to reproduce, distribute, display, perform, and create derivatives\n• Protects expression of ideas, not the ideas themselves\n• Includes moral rights in many countries (right to attribution and integrity)\n\nWhat specific aspect of copyright would you like to know more about?";
      }
    } else if (lowerMessage.includes('patent')) {
      if (lowerMessage.includes('application') || lowerMessage.includes('filing') || lowerMessage.includes('how do i')) {
        return "Filing a patent application involves these key steps:\n\n1. **Confirm patentability** - Ensure your invention is novel, non-obvious, and useful\n2. **Prepare documentation** - Create detailed descriptions, claims, and drawings\n3. **File a provisional application** (optional) - Provides 12 months of \"patent pending\" status\n4. **File a non-provisional application** - The formal application that will be examined\n5. **Examination process** - Respond to office actions from patent examiners\n6. **Patent issuance** - Pay issuance fees when approved\n\nThe process typically takes 2-5 years and costs vary widely (typically $10,000-$20,000 total including attorney fees for a straightforward utility patent in the US).\n\nWould you like more information about patentability requirements, provisional applications, or international patent protection?";
      } else if (lowerMessage.includes('requirement')) {
        return "For an invention to be patentable, it must meet these core requirements:\n\n1. **Patentable subject matter** - Must fall within statutory categories (process, machine, article of manufacture, composition of matter) and not be an abstract idea, natural phenomenon, or law of nature\n\n2. **Novelty** - Must be new and not previously disclosed to the public\n\n3. **Non-obviousness** - Must not be an obvious advancement to someone skilled in the relevant field\n\n4. **Utility** - Must have a useful purpose and actually work as described\n\n5. **Enablement** - The application must describe the invention in sufficient detail to enable others to make and use it\n\nDo you have a specific invention you're considering patenting? I can help you evaluate these requirements for your particular case.";
      } else if (lowerMessage.includes('type')) {
        return "There are three main types of patents:\n\n1. **Utility patents** - The most common type, protecting new and useful processes, machines, manufactures, compositions of matter, or improvements thereof. Last for 20 years from filing date.\n\n2. **Design patents** - Protect the ornamental design or appearance of an article of manufacture (how something looks, not how it works). Last for 15 years from issuance in the US.\n\n3. **Plant patents** - Protect new varieties of asexually reproduced plants. Last for 20 years from filing date.\n\nSome countries use different terminology or have additional categories. Would you like more information about a specific type of patent or how to determine which is right for your invention?";
      } else {
        return "Patents provide inventors with exclusive rights to their inventions for a limited time (typically 20 years from filing for utility patents) in exchange for public disclosure. This legal monopoly allows inventors to commercialize their innovations without competition.\n\nKey aspects of patent protection:\n• Territorial (separate applications needed for each country/region)\n• Expensive to obtain and maintain compared to other IP rights\n• Requires complete disclosure of how the invention works\n• Must be actively enforced by the patent owner\n• Cannot be renewed beyond the statutory term\n\nWhat specific aspect of patents would you like to explore further?";
      }
    } else if (lowerMessage.includes('industrial design')) {
      return "Industrial designs protect the aesthetic aspects of products - their visual appearance, shape, pattern, or ornamentation. They don't protect functional features (those would be covered by patents).\n\nKey features of industrial design protection:\n• Typically lasts 10-25 years depending on the country\n• Must be novel/original and have individual character\n• Registration process is usually simpler than patents\n• Can complement utility patent protection for the same product\n\nIn the US, designs are protected through design patents, while many other countries have specific industrial design registration systems. The Hague System offers international registration in multiple countries with a single application.\n\nIs there a specific aspect of industrial design protection you'd like to know more about?";
    } else if (lowerMessage.includes('infringement') || lowerMessage.includes('violation')) {
      return "IP infringement occurs when someone uses protected intellectual property without permission. The appropriate response depends on the type of IP:\n\n• **For trademarks**: Cease and desist letters, UDRP complaints (for domain names), or litigation\n• **For copyrights**: DMCA takedown notices, cease and desist letters, or lawsuits\n• **For patents**: Carefully assess validity and infringement before sending demand letters or filing suit\n\nRemedies may include:\n- Injunctions (court orders to stop infringing activity)\n- Monetary damages (actual damages or statutory damages for copyright)\n- Destruction of infringing goods\n- Sometimes attorney's fees for the prevailing party\n\nBefore taking action, consider whether the use might fall under exceptions like fair use (copyright) or experimental use (patents). Would you like guidance on a specific infringement scenario?";
    } else if (lowerMessage.includes('difference between') && (lowerMessage.includes('trademark') || lowerMessage.includes('copyright') || lowerMessage.includes('patent'))) {
      return "Here are the key differences between major IP types:\n\n**Trademarks**\n• Protect: Brand identifiers (names, logos, slogans)\n• Purpose: Indicate source of goods/services and prevent consumer confusion\n• Duration: Indefinite with proper use and renewal\n• Examples: Nike swoosh, Coca-Cola name\n\n**Copyrights**\n• Protect: Creative works (art, music, literature, software)\n• Purpose: Encourage creation by giving creators control over their works\n• Duration: Author's life + 70 years (typically)\n• Examples: Books, songs, paintings, photographs\n\n**Patents**\n• Protect: Inventions and functional improvements\n• Purpose: Encourage innovation through temporary monopolies\n• Duration: 20 years from filing (utility patents)\n• Examples: New machines, processes, compositions\n\n**Trade Secrets**\n• Protect: Confidential business information\n• Purpose: Maintain competitive advantage\n• Duration: Indefinite as long as secrecy maintained\n• Examples: Formulas, customer lists, manufacturing techniques\n\nWhich specific comparison would you like me to elaborate on?";
    } else if (lowerMessage.includes('thank')) {
      return "You're welcome! I'm happy to help with any other IP law questions you might have. Feel free to ask about trademark registration, copyright protection, patent applications, or any other intellectual property matters whenever you need assistance.";    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi ')) {
      return "Hello! I'm here to help with your intellectual property law questions. I can provide information about trademarks, copyrights, patents, industrial designs, and IP enforcement strategies. What specific IP issue can I assist you with today?";    
    } else {
      // For follow-up suggestions, create a simple object with just the needed properties
      // instead of calling updateConversationContext which may not be available
      const topicMatch = lowerMessage.match(/\b(trademark|copyright|patent|industrial design|infringement|unauthorized access|ip protection)\b/i);
      const simplifiedContext = {
        topic: topicMatch ? topicMatch[1].toLowerCase() : null,
        followUpSuggested: false
      };
      
      // Check if we should provide a follow-up based on conversation context
      if (simplifiedContext.topic && !simplifiedContext.followUpSuggested) {
        // No need to call setConversationContext here since it might not be available
        
        switch(simplifiedContext.topic) {
          case 'trademark':
            return "I notice we're discussing trademarks. To provide more targeted help, I'd like to understand your specific needs. Are you interested in:\n\n• Registering a new trademark?\n• Conducting a trademark search?\n• Understanding how to protect your mark internationally?\n• Learning about trademark infringement and enforcement?\n• Understanding the difference between ™ and ® symbols?\n\nOr is there another trademark-related topic I can help with?";
          case 'copyright':
            return "I see we're discussing copyright law. To better assist you with your specific situation, could you tell me if you're interested in:\n\n• Registering a copyright for your work?\n• Understanding fair use exceptions?\n• Learning about DMCA takedown procedures for online content?\n• Determining copyright duration for specific works?\n• Understanding how to license your copyrighted work?\n• Learning about international copyright protection?\n\nThis will help me provide more relevant information for your needs.";
          case 'patent':
            return "I understand we're discussing patents. To provide the most helpful information, could you specify which aspect you're most interested in:\n\n• Determining if your invention is patentable?\n• Understanding provisional vs. non-provisional applications?\n• Learning about international patent protection through PCT?\n• Estimating costs and timelines for the patent process?\n• Understanding how to conduct a patent search?\n• Learning about enforcing your patent rights?\n\nKnowing your specific interest will help me tailor my guidance to your situation.";
          case 'industrial_design':
            return "I see we're discussing industrial designs. To provide more targeted assistance, could you indicate which of these topics would be most helpful:\n\n• Registration procedures for design protection?\n• Strategies for maximizing design protection?\n• International protection through the Hague System?\n• How design rights differ from utility patents or copyright?\n• Enforcement options for design infringement?\n• Costs and timelines for design registration?\n\nThis will help me focus my guidance on your specific needs.";
          case 'infringement':
            return "I understand we're discussing IP infringement issues. To provide more relevant advice, could you specify:\n\n• Which type of IP right is being infringed (trademark, copyright, patent, design)?\n• Whether you're the rights holder or responding to an infringement claim?\n• If you're considering formal legal action or seeking alternative resolutions?\n• Whether the infringement is occurring online or offline?\n• If the infringement crosses international borders?\n\nWith this information, I can provide more targeted guidance for your situation.";
          case 'unauthorized_access':
            return "I understand you're asking about unauthorized data or database access. To provide more specific guidance, could you tell me:\n\n• Are you trying to protect your data from unauthorized access?\n• Has your data already been accessed without authorization?\n• Are you seeking legal remedies against someone who accessed your data?\n• Are you trying to understand the legal requirements for data protection?\n• Do you need information about specific laws like CFAA, GDPR, or others?\n\nThis will help me provide the most relevant information for your situation.";
          case 'ip_protection':
            return "I see you're interested in protecting your intellectual property. To provide the most helpful guidance, could you tell me more about what you're trying to protect:\n\n• Is it a brand name, logo, or slogan? (Trademark protection)\n• Creative content like text, images, music, or software? (Copyright protection)\n• A new invention or technical process? (Patent protection)\n• The appearance or design of a product? (Industrial design protection)\n• Confidential business information? (Trade secret protection)\n\nOnce I understand what you're protecting, I can provide more targeted advice.";
          default:
            if (userMessage.length < 15 || userMessage.split(' ').length < 4) {
              return "I'd be happy to help with your IP law question, but could you provide a bit more detail about your specific situation? For example:\n\n• What type of intellectual property are you dealing with? (brand names, creative works, inventions, designs)\n• What specific aspect are you interested in? (protection, registration, infringement, licensing)\n• Is this for personal use, a business, or academic purposes?\n\nThe more details you can provide, the more tailored my guidance can be.";
            }
            return "I'm your friendly IP law assistant, here to help with any intellectual property questions you might have. I can provide information about:\n\n• Trademarks for protecting brand identifiers\n• Copyrights for creative works\n• Patents for inventions and innovations\n• Industrial designs for product appearance\n• Trade secrets for confidential business information\n• IP enforcement strategies\n• Online content protection (including YouTube videos and social media)\n• Data protection and unauthorized access issues\n\nTo help you most effectively, could you share what specific IP topic you're interested in or what creative/business assets you're looking to protect? I'm here to provide clear, practical guidance for your situation.";
        }
      }
      
      return "I'm your friendly IP law assistant, here to help with any intellectual property questions you might have. I can provide information about:\n\n• Trademarks for protecting brand identifiers\n• Copyrights for creative works\n• Patents for inventions and innovations\n• Industrial designs for product appearance\n• Trade secrets for confidential business information\n• IP enforcement strategies\n• Online content protection (including YouTube videos and social media)\n• Sri Lankan IP laws under the Intellectual Property Act No. 36 of 2003\n\nTo help you most effectively, could you share what specific IP topic you're interested in or what creative/business assets you're looking to protect? I'm here to provide clear, practical guidance for your situation.";
    }
  };const handleSendMessage = async () => {
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
    
    // Update conversation context with simplified approach
    const lowerMessage = inputValue.toLowerCase();
    const topicMatch = lowerMessage.match(/\b(trademark|copyright|patent|industrial design|infringement|unauthorized access|ip protection)\b/i);
    
    if (topicMatch) {
      setConversationContext(prev => ({
        ...prev,
        topic: topicMatch[1].toLowerCase(),
        followUpSuggested: false
      }));
    }
    
    // Get the response content
    const responseContent = simulateBotResponse(inputValue);
    
    // Calculate typing delay based on content length (simulates realistic typing speed)
    const typingDelay = Math.min(Math.max(responseContent.length * 10, 800), 2500);
    
    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: responseContent,
        timestamp: new Date(),
        context: JSON.stringify(conversationContext), // Store context with the message
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, typingDelay);
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

  // Function to export chat history
  const exportChatHistory = () => {
    // Create a formatted string of the conversation
    const chatText = messages.map(msg => {
      const sender = msg.type === 'user' ? 'You' : 'AI Assistant';
      const time = msg.timestamp.toLocaleString();
      return `${sender} (${time}):\n${msg.content}\n\n`;
    }).join('');
    
    // Create a downloadable file
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ip-law-chat-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotPageHistory');
    const savedContext = localStorage.getItem('chatbotPageContext');
    
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
      localStorage.setItem('chatbotPageHistory', JSON.stringify(messages));
    }
  }, [messages]);
  
  // Save conversation context to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(conversationContext).length > 0) {
      localStorage.setItem('chatbotPageContext', JSON.stringify(conversationContext));
    }
  }, [conversationContext]);
  // State for feedback mechanism
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState<string | null>(null);
  
  // Speech recognition notification
  const [speechNotificationShown, setSpeechNotificationShown] = useState<boolean>(false);
  
  // Function to handle feedback submission
  const handleFeedback = (messageId: string, rating: 'helpful' | 'unhelpful') => {
    // Store feedback in localStorage for future reference
    try {
      const feedbackData = localStorage.getItem('chatbotFeedback') || '{}';
      const feedback = JSON.parse(feedbackData);
      feedback[messageId] = rating;
      localStorage.setItem('chatbotFeedback', JSON.stringify(feedback));
      
      // Show thank you message
      setShowFeedback(null);
      setFeedbackMessage('Thank you for your feedback!');
      setTimeout(() => setFeedbackMessage(null), 3000);
      
      // In a real implementation, this would send feedback to backend
      console.log(`Feedback for message ${messageId}: ${rating}`);
    } catch (error) {
      console.error('Error saving feedback:', error);
    }
  };

  // State for personalized recommendations
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([]);
    // Update personalized suggestions based on user preferences
  useEffect(() => {
    const userPrefs = analyzeUserPreferences();
    const newSuggestions: string[] = [];
    
    // Add jurisdiction-specific questions if we have detected a jurisdiction
    if (userPrefs.jurisdiction) {
      if (userPrefs.interests?.includes('trademark')) {
        newSuggestions.push(`How do I register a trademark in ${userPrefs.jurisdiction}?`);
      }
      if (userPrefs.interests?.includes('patent')) {
        newSuggestions.push(`What are the patent filing requirements in ${userPrefs.jurisdiction}?`);
      }
      if (userPrefs.interests?.includes('copyright')) {
        newSuggestions.push(`How is copyright enforced in ${userPrefs.jurisdiction}?`);
      }
    }
    
    // Add user role-specific questions
    if (userPrefs.userRole) {
      switch (userPrefs.userRole) {
        case 'inventor':
          newSuggestions.push('How do I protect my invention before filing a patent?');
          newSuggestions.push('What is a provisional patent application?');
          break;
        case 'creator':
          newSuggestions.push('How can I license my creative work?');
          newSuggestions.push('What rights do I have if someone uses my work without permission?');
          break;
        case 'entrepreneur':
          newSuggestions.push('How do I develop an IP strategy for my business?');
          newSuggestions.push('What IP assets should my business protect first?');
          break;
        case 'legal professional':
          newSuggestions.push('What are the latest developments in IP law?');
          newSuggestions.push('How do I conduct a comprehensive IP audit?');
          break;
        case 'student':
          newSuggestions.push('Can you explain IP concepts in simple terms?');
          newSuggestions.push('What are the basic types of intellectual property?');
          break;
      }
    }
    
    // Add business type-specific questions
    if (userPrefs.businessType) {
      switch (userPrefs.businessType) {
        case 'startup':
          newSuggestions.push('What IP protections should a startup prioritize?');
          newSuggestions.push('How do IP assets affect startup valuation?');
          break;
        case 'technology':
          newSuggestions.push('How do I protect software with IP rights?');
          newSuggestions.push('Are algorithms patentable?');
          break;
        case 'creative':
          newSuggestions.push('How do I register copyright for artistic works?');
          newSuggestions.push('What is the difference between copyright and design rights?');
          break;
        case 'manufacturing':
          newSuggestions.push('How do I protect my product design?');
          newSuggestions.push('What is trade dress protection?');
          break;
      }
    }
    
    // Add complexity-adjusted questions
    if (userPrefs.complexity === 'advanced' && userPrefs.interests?.length) {
      const interest = userPrefs.interests[0]; // Primary interest
      switch (interest) {
        case 'trademark':
          newSuggestions.push('What is the process for opposing a trademark application?');
          newSuggestions.push('How does trademark dilution differ from infringement?');
          break;
        case 'patent':
          newSuggestions.push('What are the implications of the Alice Corp. decision on software patents?');
          newSuggestions.push('How do I conduct a freedom-to-operate analysis?');
          break;
        case 'copyright':
          newSuggestions.push('How does the fair use doctrine apply to transformative works?');
          newSuggestions.push('What are the DMCA safe harbor provisions?');
          break;
      }
    } else if (userPrefs.complexity === 'basic' && userPrefs.interests?.length) {
      const interest = userPrefs.interests[0]; // Primary interest
      switch (interest) {
        case 'trademark':
          newSuggestions.push('What is the difference between TM and ® symbols?');
          newSuggestions.push('How long does trademark protection last?');
          break;
        case 'patent':
          newSuggestions.push('What types of patents are there?');
          newSuggestions.push('How much does it cost to file a patent?');
          break;
        case 'copyright':
          newSuggestions.push('Do I need to register my copyright?');
          newSuggestions.push('What works are protected by copyright?');
          break;
      }
    }
    
    // Add general topic-specific questions if we have fewer than 4 suggestions
    if (newSuggestions.length < 4 && userPrefs.interests?.length) {
      // Add suggestions based on top interests
      userPrefs.interests.slice(0, 2).forEach(interest => {
        switch (interest) {
          case 'trademark':
            if (!newSuggestions.some(s => s.includes('difference between ™'))) {
              newSuggestions.push('What is the difference between ™ and ® symbols?');
            }
            if (!newSuggestions.some(s => s.includes('trademark search'))) {
              newSuggestions.push('How do I conduct a trademark search?');
            }
            break;
          
          case 'copyright':
            if (!newSuggestions.some(s => s.includes('register my copyright'))) {
              newSuggestions.push('Do I need to register my copyright?');
            }
            if (!newSuggestions.some(s => s.includes('copyright infringement'))) {
              newSuggestions.push('What constitutes copyright infringement?');
            }
            break;
          
          case 'patent':
            if (!newSuggestions.some(s => s.includes('provisional'))) {
              newSuggestions.push('What is the difference between a provisional and non-provisional patent?');
            }
            if (!newSuggestions.some(s => s.includes('cost'))) {
              newSuggestions.push('How much does patent filing cost?');
            }
            break;
            
          case 'licensing':
            newSuggestions.push('What are the key elements of an IP licensing agreement?');
            newSuggestions.push('What is the difference between exclusive and non-exclusive licensing?');
            break;
            
          case 'infringement':
          case 'enforcement':
            newSuggestions.push('What remedies are available for IP infringement?');
            newSuggestions.push('How do I send a cease and desist letter?');
            break;
        }
      });
    }
    
    // Set personalized suggestions (up to 4)
    if (newSuggestions.length > 0) {
      // Remove any duplicates before slicing
      const uniqueSuggestions = Array.from(new Set(newSuggestions));
      setPersonalizedSuggestions(uniqueSuggestions.slice(0, 4));
    }
  }, [messages.length]);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition on component mount
  useEffect(() => {
    // Check if speech recognition is supported by the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
        // Setup recognition event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        
        // Auto-send message if there's content and it's not in the middle of typing
        setTimeout(() => {
          if (recognitionRef.current && !isTyping && inputValue.trim()) {
            handleSendMessage();
          }
        }, 500);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue((prev) => prev + transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };      
      setSpeechSupported(true);
    } else {
      // If speech recognition is not supported, set the flag and show a notification
      setSpeechSupported(false);
      if (!speechNotificationShown) {
        setSpeechNotificationShown(true);
        setFeedbackMessage("Voice input is not supported in your browser. Try using Chrome for the best experience.");
        setTimeout(() => setFeedbackMessage(null), 5000);
      }
    }
  }, []);
    // Function to toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        // Clear the input if it's already been sent
        if (!inputValue.trim()) {
          setInputValue('');
        }
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Speech recognition error on start:', error);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="w-full px-4 h-[calc(100vh-4rem)] flex flex-col rounded-lg shadow-md overflow-hidden relative">
        {/* Feedback thank you message */}
        {feedbackMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-full shadow-md z-50"
               style={{ 
                 animation: 'fadeInOut 3s ease-in-out forwards',
               }}>
            {feedbackMessage}
          </div>
        )}
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">AI Legal Assistant</h1>
                <p className="text-gray-600 text-sm">Specialized in Intellectual Property Law</p>
              </div>
            </div>            <div className="flex space-x-2">
              <button 
                onClick={exportChatHistory}
                className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2"
                title="Export chat history"
              >
                <FileText className="h-4 w-4" />
                <span>Export Chat</span>
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear the chat history?')) {
                    setMessages([{
                      id: Date.now().toString(),
                      type: 'bot',
                      content: "Hello! I'm your AI Legal Assistant specializing in IP law. I can help you understand trademarks, copyrights, patents, and industrial designs. What would you like to know today?",
                      timestamp: new Date(),
                    }]);
                    setConversationContext({});
                    localStorage.removeItem('chatbotPageHistory');
                    localStorage.removeItem('chatbotPageContext');
                  }
                }}
                className="px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center space-x-2"
                title="Clear chat history"
              >
                <Trash className="h-4 w-4" />
                <span>Clear Chat</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">            {/* Quick Questions */}
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center space-x-2 mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">Quick Questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs hover:bg-blue-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>            {/* Personalized Suggestions - Only shown when suggestions exist */}
            {personalizedSuggestions.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 border-b border-gray-200 px-6 py-3 animate-fadeIn">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Personalized For You:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {personalizedSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(suggestion)}
                      className="personalized-suggestion px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-600 to-emerald-500'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-5 w-5 text-white" />
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>                    <div
                      className={`group relative px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className={`text-xs ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                        
                        {/* Feedback buttons for bot messages */}
                        {message.type === 'bot' && (
                          <div className="flex space-x-2">
                            {showFeedback === message.id ? (
                              <>
                                <button
                                  onClick={() => handleFeedback(message.id, 'helpful')}
                                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                >
                                  Helpful
                                </button>
                                <button
                                  onClick={() => handleFeedback(message.id, 'unhelpful')}
                                  className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                >
                                  Not Helpful
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => setShowFeedback(message.id)}
                                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                              >
                                Was this helpful?
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Copy button for bot messages */}
                      {message.type === 'bot' && (
                        <button 
                          onClick={() => copyToClipboard(message.content)}
                          className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-0 group-hover:bg-opacity-80 text-transparent group-hover:text-gray-500 transition-all"
                          title="Copy to clipboard"
                        >
                          {copiedText === message.content ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-3xl">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center">
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
            </div>            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-5">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search IP law terms..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                      {searchResults.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => useSearchTerm(term)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <div className="flex-1 relative">                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Ask me about IP law, trademarks, copyrights, patents..."}
                    className={`w-full px-4 py-3 pr-12 border ${isListening ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none`}
                    rows={2}
                    disabled={isTyping}
                    aria-label="Type your legal question"
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
                      {conversationContext.topic === 'industrial_design' && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Design</span>
                      )}
                      {conversationContext.topic === 'infringement' && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Infringement</span>
                      )}
                    </div>
                  )}                </div>
                {/* Voice Chat Button */}
                <button
                  onClick={toggleVoiceInput}
                  disabled={isTyping || !speechSupported}
                  className={`px-4 py-3 ${isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-600 hover:bg-blue-700'} 
                    text-white rounded-xl transition-all duration-200 flex items-center justify-center mr-2
                    ${!speechSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
                  aria-label={isListening ? "Stop recording" : "Start voice input"}
                  title={speechSupported ? (isListening ? "Stop recording" : "Start voice input") : "Voice input not supported on this browser"}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                {/* Send Button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl hover:from-blue-700 hover:to-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />                </button>
              </div>
              
              {/* Feedback notification */}
              {feedbackMessage && (
                <div className="mt-3 p-2 bg-blue-100 text-blue-800 rounded-lg animate-fade-in-out flex items-center justify-center">
                  <div className="text-sm">{feedbackMessage}</div>
                </div>
              )}
              
              <p className="text-xs text-gray-500 mt-2">
                This AI assistant provides general legal information. Always consult with a qualified IP lawyer for specific legal advice.
              </p>
            </div>
          </div>

          {/* Sidebar - IP Resources */}
          <div className="w-72 bg-gray-50 border-l border-gray-200 hidden lg:block overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-gray-900">IP Law Resources</h3>
              </div>
              <div className="mb-4">
                <div className="flex space-x-2 mb-2">
                  <button
                    onClick={() => setResourceFilter('all')}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      resourceFilter === 'all' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setResourceFilter('trademark')}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      resourceFilter === 'trademark' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Trademark
                  </button>
                  <button
                    onClick={() => setResourceFilter('copyright')}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      resourceFilter === 'copyright' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Copyright
                  </button>
                  <button
                    onClick={() => setResourceFilter('patent')}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      resourceFilter === 'patent' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Patent
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                {filteredResources.map((resource, index) => (
                  <a 
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                      <p className="text-xs text-gray-500 mt-1">External resource</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <div className="mt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Award className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-medium text-gray-900">IP Protection Tips</h3>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Register trademarks early to secure rights</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Use proper copyright notices on creative works</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>File patents before public disclosure</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>Use NDAs before sharing confidential information</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;