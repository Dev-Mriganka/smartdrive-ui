import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check if we have tokens in URL parameters (from backend redirect)
        const accessToken = searchParams.get('access_token');

        const email = searchParams.get('email');
        
        if (accessToken && email) {
          console.log('🔗 Processing Google callback with tokens from URL');
          // Update auth context by calling handleGoogleCallback
          await handleGoogleCallback(accessToken);
          console.log('✅ Auth context updated successfully');
          setStatus('success');
          
          // Check if this is a popup window
          if (window.opener) {
            // This is a popup window - notify parent and close
            setTimeout(() => {
              window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, window.location.origin);
              window.close();
            }, 1500);
          } else {
            // This is a direct navigation - redirect to dashboard immediately
            console.log('🔄 Redirecting to dashboard...');
            navigate('/dashboard');
          }
        } else {
          // Process callback normally (for popup flow)
          const code = searchParams.get('code');
          if (code) {
            await handleGoogleCallback(code);
          }
          setStatus('success');
          
          // Check if this is a popup window
          if (window.opener) {
            // This is a popup window - notify parent and close
            setTimeout(() => {
              window.opener.postMessage({ type: 'GOOGLE_LOGIN_SUCCESS' }, window.location.origin);
              window.close();
            }, 1500);
          } else {
            // This is a direct navigation - redirect to dashboard
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          }
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
        
        // Check if this is a popup window
        if (window.opener) {
          // This is a popup window - notify parent and close
          setTimeout(() => {
            window.opener.postMessage({ type: 'GOOGLE_LOGIN_ERROR', error: errorMessage }, window.location.origin);
            window.close();
          }, 3000);
        } else {
          // This is a direct navigation - redirect to login
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      }
    };

    processCallback();
  }, [searchParams, handleGoogleCallback, navigate, errorMessage]);

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative">
      <ThemeToggle />
      <div className="card w-full max-w-md p-8 text-center animate-fade-in-up">
        {status === 'loading' && (
          <>
            <div className="mb-6">
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Completing Authentication
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we complete your Google sign-in...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Welcome to SmartDrive! Redirecting to dashboard...
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Authentication Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login page...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
