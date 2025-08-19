import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import StatutePage from './pages/StatutePage';
import ForumPage from './pages/ForumPage';
import ConsultationPage from './pages/ConsultationPage';
import StudentDashboard from './pages/StudentDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import { LanguageProvider } from './contexts/LanguageContext';
import LandingPage from './pages/LandingPage';
import AIAssistantOverview from './pages/AIAssistantOverview';
import StatuteOverview from './pages/StatuteOverview';
import ConsultationOverview from './pages/ConsultationOverview';
import { UserProvider } from './contexts/UserContext';
import BlogsPage from './pages/BlogsPage';

function AppContent() {
  const location = useLocation();
  // Remove header for overview pages as well
  const noHeaderRoutes = ['/', '/ai-assistant', '/statute-overview', '/consultation-overview'];
  const hideHeader = noHeaderRoutes.includes(location.pathname);
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/statutes" element={<StatutePage />} />
        <Route path="/statute-overview" element={<StatuteOverview />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/consultation-overview" element={<ConsultationOverview />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/ai-assistant" element={<AIAssistantOverview />} />
        <Route path="/blogs" element={<BlogsPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;