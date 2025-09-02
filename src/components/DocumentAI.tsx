import {
    BarChart3,
    Bell,
    CheckCircle,
    ChevronRight,
    Clock,
    FileSearch,
    FileText,
    Folder,
    Grid3X3,
    Image,
    Languages,
    LogOut,
    Settings,
    Star,
    Upload,
    User,
    XCircle
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const DocumentAI: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const aiFeatures = [
    {
      title: 'Generate Summary',
      description: 'Condense long documents into key insights to quickly grasp core information.',
      icon: FileText,
      buttonText: 'Generate Summary',
      color: 'bg-blue-500'
    },
    {
      title: 'Extract Data',
      description: 'Automatically pull out specific data points like names, dates, and entities.',
      icon: FileSearch,
      buttonText: 'Extract Data',
      color: 'bg-green-500'
    },
    {
      title: 'Translate',
      description: 'AI-powered translation.',
      icon: Languages,
      buttonText: 'Translate',
      color: 'bg-purple-500'
    },
    {
      title: 'Analyze Sentiment',
      description: 'Analyze the emotional tone of the document content for valuable insights.',
      icon: BarChart3,
      buttonText: 'Analyze Sentiment',
      color: 'bg-orange-500'
    }
  ];

  const recentDocuments = [
    {
      name: 'Project Proposal V2.docx',
      status: 'Completed',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      name: 'Q3 Financial Report.pdf',
      status: 'Processing',
      time: '1 day ago',
      icon: Clock,
      color: 'text-gray-400'
    },
    {
      name: 'Marketing Strategy.pptx',
      status: 'Uploaded',
      time: '3 days ago',
      icon: Upload,
      color: 'text-gray-400'
    },
    {
      name: 'Client Onboarding Guide.docx',
      status: 'Completed',
      time: '5 days ago',
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      name: 'Legal Agreement Draft.pdf',
      status: 'Error',
      time: '1 week ago',
      icon: XCircle,
      color: 'text-red-400'
    }
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-400">AISmartDrive</span>
            </div>
            
            <nav className="flex items-center gap-6 ml-8">
              <Link to="/dashboard" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link to="/documents" className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
                Documents
              </Link>
              <Link to="/images" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Images
              </Link>
              <Link to="/files" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                File Storage
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search files and content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-green-500 text-white rounded text-sm">
                Search
              </button>
            </div>
            
            <button className="p-2 text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-300 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">
                  {user?.firstName || 'User'}
                </span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-90' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-800 min-h-screen p-6">
          <nav className="space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <Grid3X3 className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/documents" className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg">
              <FileText className="w-5 h-5" />
              Documents
            </Link>
            <Link to="/images" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <Image className="w-5 h-5" />
              Images
            </Link>
            <Link to="/files" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <Folder className="w-5 h-5" />
              File Storage
            </Link>
            
            <div className="pt-4">
              <div className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg cursor-pointer">
                <Settings className="w-5 h-5" />
                Settings
                <ChevronRight className="w-4 h-4 ml-auto" />
              </div>
              <div className="ml-8 space-y-1">
                <Link to="/account" className="block px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Account Settings
                </Link>
                <Link to="/plan" className="block px-4 py-2 text-sm text-gray-400 hover:text-white">
                  Plan Management
                </Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Document AI Processing</h1>
            <p className="text-gray-400">Leverage AI to process and analyze your documents.</p>
          </div>

          {/* AI Features Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {aiFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                  {feature.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* AI Processing Results */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-2">AI Processing Results</h2>
            <p className="text-gray-400 mb-4">Status and output of your AI tasks.</p>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">Select a document and an AI feature to begin processing.</p>
            </div>
          </div>

          {/* Recent Document Activity */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">Recent Document Activity</h2>
              <p className="text-gray-400">Overview of your latest document actions.</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{doc.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <doc.icon className={`w-4 h-4 ${doc.color}`} />
                          <span className={`text-sm ${doc.color}`}>{doc.status}</span>
                          <span className="text-gray-400 text-sm">• {doc.time}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentAI;
