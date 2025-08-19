import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'si' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.chatbot': 'AI Assistant',
    'nav.statutes': 'Statute Database',
    'nav.forum': 'Community Forum',
    'nav.consultation': 'Lawyer Consultation',
    'nav.student': 'Student Dashboard',
    'nav.lawyer': 'Lawyer Dashboard',
    'nav.about': 'About',
    'nav.login': 'Login',
    'hero.title': 'Empowering Sri Lanka with IP Law Knowledge',
    'hero.subtitle': 'Your comprehensive platform for intellectual property law resources, AI assistance, and legal consultation',
    'hero.cta': 'Get Started',
    'search.placeholder': 'Search IP statutes, cases, or legal topics...',
    'filter.all': 'All Categories',
    'filter.trademarks': 'Trademarks',
    'filter.copyrights': 'Copyrights',
    'filter.patents': 'Patents',
    'filter.designs': 'Industrial Designs',
    'consultation.cta': 'Consult a Lawyer',
    'chatbot.open': 'Ask AI Assistant',
  },
  si: {
    'nav.home': 'මුල් පිටුව',
    'nav.chatbot': 'AI සහායක',
    'nav.statutes': 'නීති දත්ත ගබඩාව',
    'nav.forum': 'ප්‍රජා සංසදය',
    'nav.consultation': 'නීතිඥ උපදේශනය',
    'nav.student': 'ශිෂ්‍ය පුවරුව',
    'nav.lawyer': 'නීතිඥ පුවරුව',
    'nav.about': 'අප ගැන',
    'nav.login': 'ප්‍රවේශය',
    'hero.title': 'බුද්ධිමය දේපල නීතිය පිළිබඳ දැනුමෙන් ශ්‍රී ලංකාව සවිබල ගැන්වීම',
    'hero.subtitle': 'බුද්ධිමය දේපල නීති සම්පත්, AI සහාය සහ නීති උපදේශන සඳහා ඔබේ සම්පූර්ණ වේදිකාව',
    'hero.cta': 'ආරම්භ කරන්න',
    'search.placeholder': 'IP නීති, නඩු හෝ නීතිමය මාතෘකා සොයන්න...',
    'filter.all': 'සියලු කාණ්ඩ',
    'filter.trademarks': 'වෙළඳ ලකුණු',
    'filter.copyrights': 'ප්‍රකාශන හිමිකම්',
    'filter.patents': 'පේටන්ට්',
    'filter.designs': 'කාර්මික නිර්මාණ',
    'consultation.cta': 'නීතිඥවරයෙකුගෙන් උපදේශනය ලබා ගන්න',
    'chatbot.open': 'AI සහායකයෙන් අසන්න',
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.chatbot': 'AI உதவியாளர்',
    'nav.statutes': 'சட்ட தரவுத்தளம்',
    'nav.forum': 'சமூக மன்றம்',
    'nav.consultation': 'வழக்கறிஞர் ஆலோசனை',
    'nav.student': 'மாணவர் டாஷ்போர்டு',
    'nav.lawyer': 'வழக்கறிஞர் டாஷ்போர்டு',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.login': 'உள்நுழைவு',
    'hero.title': 'அறிவுசார் சொத்து சட்ட அறிவுடன் இலங்கையை வலுப்படுத்துதல்',
    'hero.subtitle': 'அறிவுசார் சொத்து சட்ட வளங்கள், AI உதவி மற்றும் சட்ட ஆலோசனைக்கான உங்கள் விரிவான தளம்',
    'hero.cta': 'தொடங்குங்கள்',
    'search.placeholder': 'IP சட்டங்கள், வழக்குகள் அல்லது சட்ட தலைப்புகளைத் தேடுங்கள்...',
    'filter.all': 'அனைத்து வகைகள்',
    'filter.trademarks': 'வர்த்தக முத்திரைகள்',
    'filter.copyrights': 'பதிப்புரிமைகள்',
    'filter.patents': 'காப்புரிமைகள்',
    'filter.designs': 'தொழில்துறை வடிவமைப்புகள்',
    'consultation.cta': 'வழக்கறிஞரை ஆலோசிக்கவும்',
    'chatbot.open': 'AI உதவியாளரிடம் கேளுங்கள்',
  },
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};