import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Lightbulb, BookOpen, Clock } from 'lucide-react';
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
      content: "Hello! I'm your Legal Assistant specializing in IP law and data protection. I can help you with trademarks, patents, copyrights, unauthorized database access issues, and other intellectual property matters. How can I assist you today?",
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
  
  // Quick suggestion questions for users
  const quickSuggestions = [
    'What is a trademark and how do I register one?',
    'What are the legal remedies for unauthorized database access?',
    'How do I protect my data from unauthorized access?',
    'What is the difference between copyright and patent?',
    'How do I handle IP infringement?',
    'What laws protect against database hacking?',
    'What are the requirements for data protection compliance?',
    'How long does copyright protection last?'
  ];
  
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
    } else if (
      lowerMessage.includes('database') || 
      (lowerMessage.includes('access') && lowerMessage.includes('without permission')) || 
      (lowerMessage.includes('entry') && lowerMessage.includes('without permission')) ||
      lowerMessage.includes('unauthorized access') ||
      lowerMessage.includes('data breach') ||
      (lowerMessage.includes('using') && lowerMessage.includes('data') && lowerMessage.includes('permission')) ||
      (lowerMessage.includes('hack') || lowerMessage.includes('hacked')) ||
      (lowerMessage.includes('steal') && lowerMessage.includes('data')) ||
      /\b(database|data|information|files)\b.*?\b(access|entry|enter|use|using|used|get|got|accessed)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i.test(lowerMessage) ||
      /\b(access|entered|entry|get|got|took|using|used|took)\b.*?\b(database|data|information|files)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i.test(lowerMessage)
    ) {
      newContext.lastTopic = newContext.topic;
      newContext.topic = 'unauthorized_access';
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

  // Function to detect if a user's question is unclear and needs clarification
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

  // Function to provide guidance for unclear questions
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
  };

  const simulateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const newContext = updateConversationContext(userMessage);
    setConversationContext(newContext);
    
    // Check if the question is unclear and needs clarification
    if (detectUnclearQuestion(userMessage)) {
      return generateClarificationResponse(userMessage);
    }
      // Handle database access, data protection and unauthorized access questions
    if (lowerMessage.includes('database') || 
        (lowerMessage.includes('access') && lowerMessage.includes('without permission')) || 
        (lowerMessage.includes('entry') && lowerMessage.includes('without permission')) ||
        lowerMessage.includes('unauthorized access') ||
        lowerMessage.includes('data breach') ||
        lowerMessage.includes('hack') || lowerMessage.includes('hacked') ||
        (lowerMessage.includes('using') && lowerMessage.includes('data') && lowerMessage.includes('permission')) ||
        /\b(database|data|information|files)\b.*?\b(access|entry|enter|use|using|used|get|got|accessed)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i.test(lowerMessage) ||
        /\b(access|entered|entry|get|got|took|using|used|took)\b.*?\b(database|data|information|files)\b.*?\b(without|no|not)\b.*?\b(permission|consent|authorization|approve|approval|allowed)\b/i.test(lowerMessage) ||
        /\b(steal|stole|stolen|took|taking)\b.*?\b(data|information|database|content|files)\b/i.test(lowerMessage)) {
      
      if (lowerMessage.includes('action') || lowerMessage.includes('sue') || lowerMessage.includes('legal') || lowerMessage.includes('remedy') || lowerMessage.includes('against') || lowerMessage.includes('report')) {
        return "When someone accesses a database without authorization, several legal remedies are available:\n\n1. **Computer Fraud and Abuse Act (CFAA)**: In the US, unauthorized access to computer systems is a federal offense that can lead to both criminal charges and civil liability\n\n2. **Data Protection Laws**: Regulations like GDPR (EU), CCPA (California), or various national data protection laws may provide specific remedies for unauthorized data access\n\n3. **Breach of Contract**: If the unauthorized user violated terms of service or confidentiality agreements\n\n4. **Trade Secret Laws**: If the database contains proprietary business information that qualifies as trade secrets\n\n5. **Copyright Infringement**: If the database structure or contents are protected by copyright\n\n6. **Legal Steps to Take**:\n   • Document the unauthorized access with evidence\n   • Report to law enforcement for criminal investigation\n   • Send cease and desist letters\n   • File for injunctive relief to prevent further access\n   • Pursue damages through litigation\n\nWould you like more specific information about any of these remedies or how to determine which laws apply to your situation?";
      } else if (lowerMessage.includes('prevent') || lowerMessage.includes('protect') || lowerMessage.includes('security') || lowerMessage.includes('secure') || lowerMessage.includes('protecting')) {
        return "To protect your database from unauthorized access, consider these legal and technical measures:\n\n1. **Legal Protections**:\n   • Implement clear Terms of Service and Acceptable Use Policies\n   • Use robust data processing agreements with third parties\n   • Include confidentiality clauses in employee contracts\n   • Register database copyrights if the structure is original\n   • Maintain trade secret status by implementing reasonable security measures\n\n2. **Technical Measures**:\n   • Implement strong access controls and authentication\n   • Use encryption for sensitive data\n   • Maintain access logs and monitoring systems\n   • Regular security audits and penetration testing\n\n3. **Compliance Requirements**:\n   • Ensure compliance with relevant data protection laws (GDPR, CCPA, etc.)\n   • Implement data breach notification procedures\n   • Regular employee training on data security\n\nWould you like more specific information about legal protections for databases or technical security measures?";
      } else if (lowerMessage.includes('law') || lowerMessage.includes('laws') || lowerMessage.includes('regulation') || lowerMessage.includes('regulations') || lowerMessage.includes('legislation')) {
        return "Unauthorized access to databases is governed by several key laws and regulations:\n\n1. **Computer Crime Laws**:\n   • Computer Fraud and Abuse Act (CFAA) in the US\n   • Computer Misuse Act in the UK\n   • Similar cybercrime laws in most countries\n\n2. **Data Protection Regulations**:\n   • General Data Protection Regulation (GDPR) in the EU\n   • California Consumer Privacy Act (CCPA) \n   • Health Insurance Portability and Accountability Act (HIPAA) for healthcare data\n   • Personal Information Protection and Electronic Documents Act (PIPEDA) in Canada\n\n3. **Industry-Specific Regulations**:\n   • Financial data: Gramm-Leach-Bliley Act, Payment Card Industry Data Security Standard (PCI DSS)\n   • Critical infrastructure: Various sector-specific regulations\n\nThese laws impose obligations on data controllers/processors and establish penalties for data breaches and unauthorized access.\n\nWould you like more details about a specific law or how these apply to your situation?";
      } else if (lowerMessage.includes('penalties') || lowerMessage.includes('fine') || lowerMessage.includes('jail') || lowerMessage.includes('prison') || lowerMessage.includes('criminal')) {
        return "Penalties for unauthorized database access can be severe and vary by jurisdiction:\n\n1. **Criminal Penalties**:\n   • Under the US Computer Fraud and Abuse Act: Fines and imprisonment up to 10 years for first offenses (longer for repeat offenders)\n   • UK Computer Misuse Act: Up to 10 years imprisonment for serious cases\n   • Most countries have similar criminal sanctions\n\n2. **Civil Liabilities**:\n   • Damages for actual losses\n   • Statutory damages in some cases\n   • Punitive damages for willful violations\n   • Legal costs and attorney fees\n\n3. **Regulatory Fines**:\n   • GDPR violations: Up to €20 million or 4% of global annual revenue\n   • CCPA violations: $2,500-$7,500 per intentional violation\n   • Industry-specific fines under HIPAA, etc.\n\n4. **Additional Consequences**:\n   • Professional sanctions\n   • Loss of government contracts\n   • Reputational damage\n\nThe severity depends on factors like intent, scale of breach, sensitivity of data, and resulting harm.\n\nWould you like information about a specific jurisdiction's penalties?";
      } else if (lowerMessage.includes('evidence') || lowerMessage.includes('proof') || lowerMessage.includes('document') || lowerMessage.includes('track')) {
        return "Documenting evidence of unauthorized database access is crucial for legal action:\n\n1. **Technical Evidence to Collect**:\n   • Access logs showing unauthorized IP addresses or accounts\n   • Timestamps of suspicious activities\n   • Authentication failure records\n   • Database audit trails showing abnormal queries or data extraction\n   • Network traffic logs showing unusual patterns\n   • System changes or modifications made during unauthorized access\n\n2. **Preservation Methods**:\n   • Create forensic copies of log files\n   • Use write-blocking technology to preserve original data\n   • Maintain chain of custody documentation\n   • Consider engaging a digital forensics expert\n\n3. **Documentation Best Practices**:\n   • Create detailed incident reports\n   • Document all remediation steps taken\n   • Preserve communications related to the incident\n   • Take screenshots of relevant system information\n\n4. **Legal Considerations**:\n   • Follow proper legal procedures to ensure admissibility\n   • Consider involving law enforcement early\n   • Consult with legal counsel about evidence handling\n\nWould you like more specific guidance on any of these evidence collection approaches?";
      } else {
        return "Unauthorized access to databases is governed by several legal frameworks:\n\n1. **Computer Crime Laws**: Laws like the Computer Fraud and Abuse Act (US) criminalize unauthorized access to computer systems and data\n\n2. **Data Protection Regulations**: Laws like GDPR (EU), CCPA (California), and other regional data protection laws regulate how data should be protected and establish penalties for breaches\n\n3. **Intellectual Property Protection**:\n   • **Copyright**: Database structures and content may be protected by copyright if they show sufficient originality\n   • **Trade Secret Law**: Proprietary databases containing valuable business information may qualify for trade secret protection\n   • **Contract Law**: Terms of service, confidentiality agreements, and other contracts can provide additional legal protection\n\n4. **Potential Consequences**:\n   • Criminal penalties including fines and imprisonment\n   • Civil liability for damages\n   • Regulatory fines for inadequate security measures\n   • Reputational damage\n\nWould you like more information about specific legal remedies available when unauthorized access occurs, or about preventive measures you can take to protect your data?";
      }
    }
      // Comprehensive IP-specific responses
    if (lowerMessage.includes('trademark')) {
      if (lowerMessage.includes('register') || lowerMessage.includes('application')) {
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
    } else if (lowerMessage.includes('patent')) {
      if (lowerMessage.includes('application') || lowerMessage.includes('file')) {
        return "Filing a patent application involves these key steps:\n\n1. Ensure your invention is patentable (novel, non-obvious, useful)\n2. Prepare detailed documentation including drawings and specifications\n3. File a provisional application for early protection (optional)\n4. File a non-provisional application with claims defining your invention's scope\n5. Respond to office actions from patent examiners\n6. Pay issuance fees when approved\n\nThe process typically takes 2-5 years. Would you like me to elaborate on any particular step?";
      } else if (lowerMessage.includes('requirement')) {
        return "For an invention to be patentable, it must meet three main requirements:\n\n1. Novelty: It must be new and not previously disclosed to the public\n2. Non-obviousness: It must not be an obvious next step to someone skilled in the field\n3. Utility: It must have a useful purpose and actually work\n\nAdditionally, the invention must fall within patentable subject matter, which varies by country but generally excludes abstract ideas, natural phenomena, and laws of nature. Do you have a specific invention you're considering patenting?";
      } else {
        return "Patents protect inventions and grant inventors exclusive rights for a limited period (typically 20 years from filing) in exchange for public disclosure. There are three main types: utility patents (for new processes, machines, etc.), design patents (for ornamental designs), and plant patents (for new plant varieties). What specific aspect of patent law are you interested in?";
      }
    }else if (lowerMessage.includes('infringement') || lowerMessage.includes('violation')) {
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
          case 'unauthorized_access':
            return "Regarding unauthorized database access, would you like to know more about legal remedies available, preventative measures you can take, or how to document evidence of unauthorized access?";
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
        </div>      </div>
      
      {/* Messages */}
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
                      {JSON.parse(message.context).topic === 'unauthorized_access' && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">Data Protection</span>
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
              placeholder="Ask me about trademarks, patents, copyrights, database protection, or IP infringement..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              disabled={isTyping}
            />            {conversationContext.topic && (
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
                {conversationContext.topic === 'unauthorized_access' && (
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">Data Protection</span>
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