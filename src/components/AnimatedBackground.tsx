import React, { useEffect, useState } from 'react';

const AnimatedBackground: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Throttle mouse movement updates using requestAnimationFrame
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Single Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900"></div>

      {/* Floating SVGs that respond to mouse movement */}
      <div 
        className="absolute top-1/4 left-1/4 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 20 - 10}px, ${mousePosition.y * 20 - 10}px)`
        }}
      >
        <svg className="w-16 h-16 text-blue-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-3/4 right-1/4 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -15 + 7.5}px, ${mousePosition.y * -15 + 7.5}px)`
        }}
      >
        <svg className="w-12 h-12 text-indigo-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </div>

      <div 
        className="absolute bottom-1/4 left-1/3 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 25 - 12.5}px, ${mousePosition.y * -20 + 10}px)`
        }}
      >
        <svg className="w-20 h-20 text-purple-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-1/2 right-1/3 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -30 + 15}px, ${mousePosition.y * 15 - 7.5}px)`
        }}
      >
        <svg className="w-14 h-14 text-blue-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-1/6 right-1/6 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 18 - 9}px, ${mousePosition.y * -18 + 9}px)`
        }}
      >
        <svg className="w-10 h-10 text-indigo-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
        </svg>
      </div>

      <div 
        className="absolute bottom-1/6 left-1/6 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -22 + 11}px, ${mousePosition.y * 22 - 11}px)`
        }}
      >
        <svg className="w-8 h-8 text-purple-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-2/3 left-1/2 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 12 - 6}px, ${mousePosition.y * -12 + 6}px)`
        }}
      >
        <svg className="w-18 h-18 text-blue-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-1/3 right-1/4 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -8 + 4}px, ${mousePosition.y * 8 - 4}px)`
        }}
      >
        <svg className="w-22 h-22 text-indigo-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z"/>
        </svg>
      </div>

      <div 
        className="absolute bottom-1/3 left-1/4 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 16 - 8}px, ${mousePosition.y * -16 + 8}px)`
        }}
      >
        <svg className="w-11 h-11 text-purple-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z"/>
        </svg>
      </div>

      <div 
        className="absolute top-1/2 right-1/6 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePosition.x * -14 + 7}px, ${mousePosition.y * 14 - 7}px)`
        }}
      >
        <svg className="w-13 h-13 text-blue-400/30 dark:text-white/5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
        </svg>
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/5 dark:to-white/5"></div>
    </div>
  );
};

export default AnimatedBackground;
