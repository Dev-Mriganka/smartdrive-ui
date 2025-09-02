import {
    Bell,
    ChevronRight,
    Eye,
    FileText,
    Folder,
    Grid3X3,
    Image,
    LogOut,
    Network,
    Pencil,
    Settings,
    Sparkles,
    Star,
    User
} from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ImageAI: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const aiImageFeatures = [
    {
      title: 'Generate Similar Images',
      description: 'Create new images based on the style and content of your uploaded image.',
      icon: Sparkles,
      buttonText: 'Activate Feature',
      color: 'text-green-400',
      disabled: true
    },
    {
      title: 'Image Enhancement',
      description: 'Automatically improve image quality, color, and sharpness with AI.',
      icon: Pencil,
      buttonText: 'Try Now',
      color: 'text-green-400',
      disabled: true
    },
    {
      title: 'Object Recognition',
      description: 'Identify and tag objects within your images for easier organization.',
      icon: Network,
      buttonText: 'Explore',
      color: 'text-green-400',
      disabled: true
    }
  ];

  const aiGeneratedImages = [
    {
      id: 1,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik0yMCAyMEgxODBWMTgwSDIwVjIwWiIgZmlsbD0iI0YwMCIvPgo8cGF0aCBkPSJNMTgwIDIwSDIwVjE4MEgxODBWMjBaIiBmaWxsPSIjRkZGIi8+Cjwvc3ZnPgo=',
      alt: 'Abstract composition'
    },
    {
      id: 2,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxwYXRoIGQ9Ik0yMCAyMEgxODBWMTgwSDIwVjIwWiIgZmlsbD0iIzAwRkYiLz4KPHBhdGggZD0iTTEwMCAxMDBMMTgwIDIwSDIwTDEwMCAxODBaIiBmaWxsPSIjMDA4MCIvPgo8L3N2Zz4K',
      alt: 'Glowing cube'
    },
    {
      id: 3,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNSIgZmlsbD0iI0ZGRDcwMCIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjgwIiByPSIzIiBmaWxsPSIjRkZENzAwIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEyMCIgcj0iNCIgZmlsbD0iI0ZGRDcwMCIvPgo8L3N2Zz4K',
      alt: 'Forest scene'
    },
    {
      id: 4,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOCIgZmlsbD0iI0ZGNjM0QyIvPgo8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0IiBmaWxsPSIjRkY2MzRDIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNiIgZmlsbD0iI0ZGNjM0QyIvPgo8L3N2Zz4K',
      alt: 'Network nodes'
    },
    {
      id: 5,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxyZWN0IHg9IjgwIiB5PSIxMDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI4MCIgZmlsbD0iIzAwRkYiLz4KPHJlY3QgeD0iMTIwIiB5PSIxMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzAwODAiLz4KPC9zdmc+Cg==',
      alt: 'Robotic arm'
    },
    {
      id: 6,
      src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjMDAwIi8+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiM0NDQiLz4KPHBhdGggZD0iTTQwIDEwMEgxNjBWMjAwSDQwVjEwMFoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cg==',
      alt: 'Stone passage'
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
              <Link to="/images" className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium">
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
            <Link to="/documents" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg">
              <FileText className="w-5 h-5" />
              Documents
            </Link>
            <Link to="/images" className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white rounded-lg">
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
            <h1 className="text-3xl font-bold text-white mb-2">Image AI Tasks</h1>
            <p className="text-gray-400">Leverage AI to process and enhance your images.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Image Features */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-2">AI Image Features</h2>
              <p className="text-gray-400 mb-6">Select an AI task to apply to your images.</p>
              
              <div className="space-y-6">
                {aiImageFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white mb-1">{feature.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{feature.description}</p>
                      <button 
                        className={`text-sm ${feature.disabled ? 'text-gray-500 cursor-not-allowed' : 'text-green-400 hover:text-green-300'}`}
                        disabled={feature.disabled}
                      >
                        {feature.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                <Eye className="w-5 h-5" />
                View All Images
              </button>
            </div>

            {/* AI Generated Images */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-2">AI Generated Images</h2>
              <p className="text-gray-400 mb-6">Images created or processed by AI.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {aiGeneratedImages.map((img) => (
                  <div key={img.id} className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                    <img 
                      src={img.src} 
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
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

export default ImageAI;
