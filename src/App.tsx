import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SettingsPage from './pages/SettingsPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConnectionChecker } from './components/ConnectionChecker';

function App() {
  return (
    <ToastProvider>
      <ConnectionChecker>
        <AuthProvider>
          <LanguageProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/chatbot" element={<ChatbotPage />} />
                  <Route path="/statutes" element={<StatutePage />} />
                  <Route path="/forum" element={<ForumPage />} />
                  <Route path="/consultation" element={<ConsultationPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/lawyer-dashboard" element={<LawyerDashboard />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </Router>
          </LanguageProvider>
        </AuthProvider>
      </ConnectionChecker>
    </ToastProvider>
  );
}

export default App;