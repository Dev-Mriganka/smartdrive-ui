import {
    Bell,
    ChevronRight,
    Download,
    FileText,
    Folder,
    Grid3X3,
    HardDrive,
    Image,
    LogOut,
    MoreVertical,
    Search,
    Settings,
    Star,
    Trash2,
    Upload,
    User
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const FileStorage: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const storageStats = [
    {
      label: 'Total Files',
      value: '1,245',
      subtitle: 'Across all categories',
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      label: 'Storage Used',
      value: '7.8 GB / 50 GB',
      subtitle: '85% remaining',
      icon: HardDrive,
      color: 'text-green-400',
      progress: 15
    },
    {
      label: 'Documents',
      value: '856',
      subtitle: 'PDFs, Word docs, etc.',
      icon: FileText,
      color: 'text-purple-400'
    },
    {
      label: 'Images',
      value: '389',
      subtitle: 'Photos and graphics',
      icon: Image,
      color: 'text-orange-400'
    }
  ];

  const recentFiles = [
    {
      name: 'Project_Proposal_V2.pdf',
      type: 'PDF',
      size: '2.4 MB',
      date: '2024-07-28',
      icon: FileText,
      color: 'text-red-400'
    },
    {
      name: 'Marketing_Campaign_Image.jpg',
      type: 'Image',
      size: '1.8 MB',
      date: '2024-07-27',
      icon: Image,
      color: 'text-green-400'
    },
    {
      name: 'Financial_Report_Q2.docx',
      type: 'Document',
      size: '3.2 MB',
      date: '2024-07-26',
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      name: 'Client_Contract_Draft.pdf',
      type: 'PDF',
      size: '1.5 MB',
      date: '2024-07-25',
      icon: FileText,
      color: 'text-red-400'
    },
    {
      name: 'Product_Launch_Banner.png',
      type: 'Image',
      size: '4.1 MB',
      date: '2024-07-24',
      icon: Image,
      color: 'text-green-400'
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
              <Link to="/documents" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Documents
              </Link>
              <Link to="/images" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Images
              </Link>
              <Link to="/files" className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
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
            <Link to="/documents" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <FileText className="w-5 h-5" />
              Documents
            </Link>
            <Link to="/images" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <Image className="w-5 h-5" />
              Images
            </Link>
            <Link to="/files" className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg">
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
            <h1 className="text-3xl font-bold text-white mb-2">File Storage</h1>
            <p className="text-gray-400">Manage and organize your files with ease.</p>
          </div>

          {/* Storage Overview */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {storageStats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <h3 className="text-gray-300 font-medium mb-1">{stat.label}</h3>
                <p className="text-gray-400 text-sm">{stat.subtitle}</p>
                {stat.progress && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all" 
                        style={{ width: `${stat.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                <Upload className="w-6 h-6" />
                <span className="font-medium">Upload Files</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Folder className="w-6 h-6" />
                <span className="font-medium">Create Folder</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Search className="w-6 h-6" />
                <span className="font-medium">Search Files</span>
              </button>
              <button className="flex flex-col items-center gap-3 p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                <Download className="w-6 h-6" />
                <span className="font-medium">Download All</span>
              </button>
            </div>
          </div>

          {/* Recent Files */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">Recent Files</h2>
              <p className="text-gray-400">Your recently uploaded and modified files.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      File Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentFiles.map((file, index) => (
                    <tr key={index} className="hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <file.icon className={`w-5 h-5 ${file.color}`} />
                          <span className="text-sm font-medium text-white">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {file.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {file.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="text-gray-400 hover:text-white">
                            <Download className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">A list of your recently uploaded and modified files.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FileStorage;
