import {
  Bell,
  Folder,
  Grid3X3,
  History,
  Moon,
  Search,
  Settings as SettingsIcon,
  Share2,
  Sparkles,
  Sun,
  Trash2,
  User
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    fullName: 'Alex Petrov',
    email: 'alex.petrov@example.com',
    language: 'English (United States)'
  });
  const [preferences, setPreferences] = useState({
    startOnLogin: true,
    enableAISummaries: true,
    enableOfflineAccess: false
  });

  // Debug theme state
  useEffect(() => {
    console.log('Current theme:', theme);
    console.log('Document classes:', document.documentElement.classList.toString());
  }, [theme]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log('Saving changes:', { formData, preferences });
  };

  return (
    <div className="flex h-screen settings-page">
      {/* Sidebar */}
      <aside className="w-64 settings-sidebar flex flex-col p-6 border-r">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-gradient-to-br from-[#00e075] to-[#00b35e] rounded-lg">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <h1 className="text-xl font-bold settings-text-primary">SmartDrive</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg settings-card font-medium">
            <Grid3X3 className="h-5 w-5 settings-text-accent" />
            <span>Dashboard</span>
          </Link>
          <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:settings-card settings-text-secondary hover:text-white transition-colors" href="#">
            <Folder className="h-5 w-5" />
            <span>My Files</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:settings-card settings-text-secondary hover:text-white transition-colors" href="#">
            <Share2 className="h-5 w-5" />
            <span>Shared with me</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:settings-card settings-text-secondary hover:text-white transition-colors" href="#">
            <History className="h-5 w-5" />
            <span>Recent</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:settings-card settings-text-secondary hover:text-white transition-colors" href="#">
            <Trash2 className="h-5 w-5" />
            <span>Trash</span>
          </a>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg settings-card font-medium">
            <SettingsIcon className="h-5 w-5 settings-text-accent" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Storage Section */}
        <div className="mt-auto">
          <div className="settings-card p-4 rounded-xl border">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold settings-text-primary">Storage</h3>
              <p className="text-sm font-medium settings-text-accent">65%</p>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
              <div className="bg-gradient-to-r from-[#00b35e] to-[#00e075] h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs settings-text-secondary mb-4">13 GB of 20 GB used</p>
            <button className="w-full text-sm py-2 px-4 rounded-lg settings-button-primary font-semibold transition-colors">
              Upgrade Storage
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto settings-page">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold settings-text-primary">Settings</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 settings-text-secondary" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="settings-input rounded-full py-2.5 pl-12 pr-5 focus:outline-none focus:ring-2 focus:ring-[#00e075] w-72"
              />
            </div>
            <button 
              onClick={toggleTheme}
              className="flex items-center justify-center size-10 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
            <button className="flex items-center justify-center size-10 bg-white/5 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell className="h-5 w-5 settings-text-secondary" />
              <span className="absolute top-2 right-2 block size-2 settings-text-accent rounded-full"></span>
            </button>
            <div className="size-11 bg-gray-700 rounded-full border-2 border-[#262626] flex items-center justify-center">
              <User className="h-5 w-5 settings-text-secondary" />
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="max-w-4xl mx-auto">
          {/* Account Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold settings-text-primary">Account</h3>
              <p className="text-sm settings-text-secondary mt-1">Manage your account information and preferences.</p>
            </div>
            <div className="md:col-span-2 settings-card p-6 rounded-xl border">
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                  <div>
                    <button className="px-4 py-2 border border-[#262626] settings-card hover:bg-[#1c1c1c] settings-text-primary rounded-lg transition-colors text-sm font-semibold">
                      Change Picture
                    </button>
                    <p className="text-xs settings-text-secondary mt-2">JPG, GIF or PNG. 1MB max.</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium settings-text-secondary mb-1" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="w-full settings-input rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#00e075]"
                    id="name"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium settings-text-secondary mb-1" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    className="w-full settings-input rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#00e075]"
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={handleSaveChanges}
                    className="px-5 py-2 settings-button-primary rounded-lg transition-colors text-sm font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold settings-text-primary">Preferences</h3>
              <p className="text-sm settings-text-secondary mt-1">Customize your AI Smart Drive experience.</p>
            </div>
            <div className="md:col-span-2 settings-card p-6 rounded-xl border">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium settings-text-secondary mb-1" htmlFor="language">
                    Language
                  </label>
                  <select
                    className="w-full settings-input rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#00e075]"
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  >
                    <option>English (United States)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium settings-text-primary">Start application on login</h4>
                    <p className="text-xs settings-text-secondary">Automatically launch AI Smart Drive when you start your computer.</p>
                  </div>
                  <label className="switch">
                    <input
                      checked={preferences.startOnLogin}
                      onChange={handlePreferenceChange}
                      name="startOnLogin"
                      type="checkbox"
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium settings-text-primary">Enable AI summaries</h4>
                    <p className="text-xs settings-text-secondary">Automatically generate summaries for new documents.</p>
                  </div>
                  <label className="switch">
                    <input
                      checked={preferences.enableAISummaries}
                      onChange={handlePreferenceChange}
                      name="enableAISummaries"
                      type="checkbox"
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium settings-text-primary">Enable offline access</h4>
                    <p className="text-xs settings-text-secondary">Keep a local copy of your files for offline use.</p>
                  </div>
                  <label className="switch">
                    <input
                      checked={preferences.enableOfflineAccess}
                      onChange={handlePreferenceChange}
                      name="enableOfflineAccess"
                      type="checkbox"
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-semibold settings-text-primary">Security</h3>
              <p className="text-sm settings-text-secondary mt-1">Enhance the security of your account.</p>
            </div>
            <div className="md:col-span-2 settings-card p-6 rounded-xl border">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-medium settings-text-primary">Two-Factor Authentication</h4>
                    <p className="text-xs settings-text-secondary mt-1">Add an extra layer of security to your account.</p>
                  </div>
                  <button className="px-4 py-2 border border-[#262626] settings-card hover:bg-[#1c1c1c] settings-text-primary rounded-lg transition-colors text-sm font-semibold whitespace-nowrap">
                    Enable 2FA
                  </button>
                </div>
                <div className="pt-4">
                  <h4 className="text-sm font-medium settings-text-primary mb-2">Connected Devices</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">desktop_windows</span>
                        <div>
                          <p className="text-sm settings-text-primary">My Desktop</p>
                          <p className="text-xs text-green-400">Current session</p>
                        </div>
                      </div>
                      <button className="text-xs settings-text-accent hover:underline">Disconnect</button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400">phone_iphone</span>
                        <div>
                          <p className="text-sm settings-text-primary">Alex's iPhone 15 Pro</p>
                          <p className="text-xs settings-text-secondary">Last seen: 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-xs settings-text-accent hover:underline">Disconnect</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS for toggle switches */}
      <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #475569;
          transition: .4s;
          border-radius: 20px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 14px;
          width: 14px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #00e075;
        }
        input:checked + .slider:before {
          transform: translateX(16px);
        }
      `}</style>
    </div>
  );
};

export default Settings;
