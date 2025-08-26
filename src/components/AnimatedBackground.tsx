import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AnimatedBackground: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className={`absolute inset-0 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50' 
          : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
      }`}></div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${
            theme === 'light' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(147, 197, 253, 0.1)'
          } 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating File Icons */}
      <div className="absolute inset-0">
        {/* File Icon 1 */}
        <div className="absolute top-20 left-10 animate-float-slow opacity-20">
          <svg className="w-12 h-12 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 2 */}
        <div className="absolute top-40 right-20 animate-float-medium opacity-30">
          <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 3 */}
        <div className="absolute bottom-32 left-1/4 animate-float-fast opacity-25">
          <svg className="w-10 h-10 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 4 */}
        <div className="absolute top-1/3 right-1/3 animate-float-slow opacity-20">
          <svg className="w-6 h-6 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 5 */}
        <div className="absolute bottom-20 right-10 animate-float-medium opacity-30">
          <svg className="w-9 h-9 text-indigo-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 6 */}
        <div className="absolute top-1/2 left-20 animate-float-fast opacity-25">
          <svg className="w-7 h-7 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 7 */}
        <div className="absolute bottom-1/3 right-1/4 animate-float-slow opacity-20">
          <svg className="w-11 h-11 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>

        {/* File Icon 8 */}
        <div className="absolute top-1/4 left-1/3 animate-float-medium opacity-30">
          <svg className="w-8 h-8 text-indigo-200" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
            <path d="M14 2v6h6"/>
          </svg>
        </div>
      </div>

      {/* Floating Circles */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-32 h-32 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
          theme === 'light' ? 'bg-blue-200' : 'bg-blue-600'
        }`}></div>
        <div className={`absolute top-1/3 right-1/4 w-24 h-24 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
          theme === 'light' ? 'bg-purple-200' : 'bg-purple-600'
        }`} style={{animationDelay: '2s'}}></div>
        <div className={`absolute bottom-1/4 left-1/3 w-28 h-28 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
          theme === 'light' ? 'bg-indigo-200' : 'bg-indigo-600'
        }`} style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  );
};

export default AnimatedBackground;
