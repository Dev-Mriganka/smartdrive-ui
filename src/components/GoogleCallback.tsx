import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get search params from URL
        const searchParams = new URLSearchParams(location.search);
        
        if (searchParams.has('error')) {
          const errorMsg = searchParams.get('error') || 'Unknown error';
          setError(`Google login failed: ${errorMsg}`);
          setStatus('error');
          return;
        }
        
        if (!searchParams.has('code')) {
          setError('No authorization code received from Google');
          setStatus('error');
          return;
        }
        
        // Process the callback
        await handleGoogleCallback(searchParams);
        setStatus('success');
        
        // Redirect to dashboard after success
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setStatus('error');
      }
    };

    processCallback();
  }, [handleGoogleCallback, location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="mb-6">
            <img 
              src="/smartdrive-logo.png" 
              alt="SmartDrive Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          
          {status === 'loading' && (
            <>
              <div className="loading-spinner mx-auto mb-4"></div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Completing Google Authentication
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we verify your Google credentials...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Authentication Successful!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You've successfully signed in with Google. Redirecting to your dashboard...
              </p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error || 'There was a problem signing in with Google.'}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Return to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
