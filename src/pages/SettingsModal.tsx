import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';

const TABS = [
  { key: 'profile', label: 'Profile' },
  { key: 'account', label: 'Account' },
  { key: 'theme', label: 'Theme' },
];

const SettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const context = useContext(UserContext);
  const user = context?.user;
  const updateUser = context?.updateUser;
  const [activeTab, setActiveTab] = useState('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [showPhotoActions, setShowPhotoActions] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [autoTheme, setAutoTheme] = useState(() => localStorage.getItem('autoTheme') === 'true');

  const handleSave = async () => {
    setSaving(true);
    if (updateUser) {
      await updateUser({ displayName, bio });
    }
    setSaving(false);
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (updateUser) updateUser({ photo: ev.target?.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = () => {
    if (updateUser) updateUser({ photo: '/default-avatar.png' });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('autoTheme', autoTheme ? 'true' : 'false');
    if (autoTheme) {
      const hour = new Date().getHours();
      setTheme(hour >= 19 || hour < 7 ? 'dark' : 'light');
    }
  }, [autoTheme]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#23243a] rounded-2xl shadow-2xl w-full max-w-xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Settings</h2>
        <div className="flex justify-center gap-8 border-b border-[#35365a] mb-6">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`pb-2 px-2 text-base font-medium focus:outline-none ${activeTab === tab.key ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {activeTab === 'profile' && (
          <div>
            <h3 className="text-xl font-semibold text-blue-400 text-center mb-1">Profile Settings</h3>
            <p className="text-gray-300 text-center mb-6 text-sm">Customize your profile information and appearance</p>
            <div className="flex flex-col items-center mb-6">
              <div
                className="relative group"
                onMouseEnter={() => setShowPhotoActions(true)}
                onMouseLeave={() => setShowPhotoActions(false)}
                onClick={() => setShowPhotoActions(true)}
                style={{ width: 120, height: 120 }}
              >
                <img
                  src={user?.photo || '/default-avatar.png'}
                  alt="Profile"
                  className="w-28 h-28 rounded-full border-4 border-blue-200 shadow object-cover transition-all duration-200"
                  style={{ width: 120, height: 120 }}
                />
                {(showPhotoActions) && (
                  <>
                    <button
                      type="button"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-[#23243a] border-2 border-blue-400 text-blue-300 hover:text-blue-500 rounded-full p-2 shadow-lg transition-all"
                      style={{ zIndex: 2 }}
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="Upload photo"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16v-8m0 0l-3 3m3-3l3 3"/><rect x="4" y="4" width="16" height="16" rx="4"/></svg>
                    </button>
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#23243a] border-2 border-blue-400 text-blue-300 hover:text-red-500 rounded-full p-2 shadow-lg transition-all"
                      style={{ zIndex: 2 }}
                      onClick={handleDeletePhoto}
                      aria-label="Delete photo"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 6l12 12M6 18L18 6"/></svg>
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="bg-[#23243a] border border-[#35365a] rounded-xl p-4 mb-6">
              <div className="mb-4">
                <label className="block text-gray-200 font-semibold mb-1">Display Name</label>
                <input
                  type="text"
                  className="w-full bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  maxLength={40}
                />
              </div>
              <div>
                <label className="block text-gray-200 font-semibold mb-1">Bio</label>
                <textarea
                  className="w-full bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  maxLength={150}
                  rows={3}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{bio.length}/150 characters</div>
              </div>
            </div>
            <button
              className="w-full bg-gradient-to-r from-blue-500 to-blue-400 text-white font-semibold py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-500 transition disabled:opacity-60"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        )}
        {activeTab === 'account' && (
          <div>
            <h3 className="text-xl font-semibold text-blue-400 text-center mb-1">Account Settings</h3>
            <p className="text-gray-300 text-center mb-6 text-sm">Manage your account information and security</p>
            <div className="bg-[#23243a] border border-[#35365a] rounded-xl p-6 mb-8">
              <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <span className="inline-block align-middle">Contact Information</span>
              </h4>
              <div className="mb-4">
                <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                  <span className="material-icons text-blue-400">phone</span> Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={user?.phone || ''}
                    onChange={e => updateUser && updateUser({ phone: e.target.value })}
                    maxLength={20}
                  />
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                    onClick={() => {}} // Optionally show a toast or feedback
                    type="button"
                  >
                    Update Phone
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-200 font-semibold mb-1 flex items-center gap-2">
                  <span className="material-icons text-blue-400">email</span> Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    className="flex-1 bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={user?.email || ''}
                    onChange={e => updateUser && updateUser({ email: e.target.value })}
                    maxLength={40}
                  />
                  <button
                    className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition"
                    onClick={() => {}} // Optionally show a toast or feedback
                    type="button"
                  >
                    Update Email
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-[#23243a] border border-[#35365a] rounded-xl p-6">
              <h4 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <span className="material-icons text-blue-400">lock</span> Security Settings
              </h4>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  // Optionally show a toast or feedback
                }}
              >
                <div className="mb-4">
                  <label className="block text-gray-200 font-semibold mb-1">Current Password</label>
                  <input
                    type="password"
                    className="w-full bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-200 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    className="w-full bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your new password"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-200 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full bg-[#23243a] border border-[#35365a] rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirm your new password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-blue-800 transition"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        )}
        {activeTab === 'theme' && (
          <div>
            <h3 className="text-xl font-semibold text-blue-400 text-center mb-1">Appearance Settings</h3>
            <div className="bg-[#23243a] border border-[#35365a] rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between relative">
              <div className="flex-1 flex flex-col items-center justify-center">
                <div
                  className="flex flex-col items-center justify-center w-64 h-32 rounded-xl border border-[#35365a] bg-[#18192b] cursor-pointer hover:bg-[#23243a] transition"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  <span className="text-3xl mb-2"><span className="material-icons">settings</span></span>
                  <span className="text-gray-200">Click to toggle theme</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="w-full border border-white/20 rounded-xl p-4 text-center">
                  <div className="text-gray-300 mb-2">Current Status:</div>
                  <div className="font-semibold text-lg text-white">
                    Manual: {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                  </div>
                </div>
              </div>
              <span className="absolute top-4 right-4 bg-blue-700 text-white text-xs px-3 py-1 rounded-full font-bold">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </div>
            <div className="bg-[#23243a] border border-[#35365a] rounded-xl p-6 mt-6">
              <h4 className="text-lg font-semibold text-green-300 mb-4 flex items-center gap-2">
                <span className="material-icons text-green-400">schedule</span> Automatic Theme Scheduling
              </h4>
              <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTheme}
                    onChange={e => setAutoTheme(e.target.checked)}
                    className="form-checkbox h-5 w-5 text-green-500 rounded focus:ring-green-400"
                  />
                  <span className="text-white font-medium">Enable automatic theme scheduling</span>
                </label>
                <span className={`ml-4 px-3 py-1 rounded-full text-xs font-bold ${autoTheme ? 'bg-green-700 text-white' : 'bg-gray-700 text-gray-300'}`}>{autoTheme ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="text-gray-400 text-sm ml-7">Automatically switch between light and dark themes based on time of day</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
