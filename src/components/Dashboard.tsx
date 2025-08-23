import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, FileText, Upload } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <img 
                  src="/smartdrive-logo.png" 
                  alt="SmartDrive Logo" 
                  className="h-8 w-auto"
                />
                <h1 className="brand-logo text-xl">SmartDrive</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 font-medium">
                Welcome, {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary flex items-center text-sm"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Profile Card */}
            <div className="dashboard-card">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <p className="text-sm text-gray-600">@{user?.username}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="btn-primary w-full flex items-center justify-center">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </button>
                <button className="btn-secondary w-full flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Files
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="dashboard-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <div className="space-y-3">
                <button className="btn-secondary w-full flex items-center justify-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </button>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 dashboard-card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to SmartDrive! 🚀
            </h2>
            <p className="text-gray-600 mb-6">
              Your AI-powered file management solution. Upload, organize, and discover your files with intelligent features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-6 glass rounded-xl">
                <div className="dashboard-stat">0</div>
                <div className="text-sm text-gray-600 font-medium">Files Uploaded</div>
              </div>
              <div className="text-center p-6 glass rounded-xl">
                <div className="dashboard-stat">0 GB</div>
                <div className="text-sm text-gray-600">Storage Used</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">100%</div>
                <div className="text-sm text-gray-600">AI Ready</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
