import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Settings, FileText, Upload, Shield, Key } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showAuthDetails, setShowAuthDetails] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  // Check if user logged in via Google OAuth2 (simple heuristic)
  const isGoogleAuth = user?.username?.includes('google') || 
                      localStorage.getItem('accessToken')?.length > 200; // JWT tokens are typically longer

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

          {/* Authentication Status Card */}
          <div className="mt-8 dashboard-card bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-l-4 border-green-400">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-800">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    Authentication Status
                    <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {isGoogleAuth ? (
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Signed in with Google OAuth2
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Key className="w-4 h-4 mr-1" />
                        Signed in with Email & Password
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowAuthDetails(!showAuthDetails)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {showAuthDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {showAuthDetails && (
              <div className="mt-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Session Information</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p><strong>Email Verified:</strong> ✅ Yes</p>
                  <p><strong>Authentication Method:</strong> {isGoogleAuth ? 'Google OAuth2' : 'Email/Password'}</p>
                  <p><strong>Session:</strong> Active JWT Token</p>
                </div>
              </div>
            )}
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
