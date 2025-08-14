import React from 'react';
import { Home, MessageCircle, Search, Users, Scale } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chatbot', label: 'Legal Assistant', icon: MessageCircle },
    { id: 'search', label: 'Statute Search', icon: Search },
    { id: 'consultation', label: 'Consultations', icon: Users },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white flex flex-col">
      <div className="p-6 border-b border-blue-800">
        <div className="flex items-center space-x-3">
          <Scale className="h-8 w-8 text-yellow-400" />
          <div>
            <h1 className="text-xl font-bold">LegalHub</h1>
            <p className="text-blue-200 text-sm">Professional Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-800 text-white shadow-lg'
                      : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-blue-800">
        <div className="bg-blue-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-bold">JD</span>
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-blue-200 text-sm">Senior Attorney</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;