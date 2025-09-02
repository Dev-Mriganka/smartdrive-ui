import { CheckCircle, Loader2, Mail, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { userAPI } from '../services/api';
import ThemeToggle from './ThemeToggle';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        await userAPI.verifyEmail(token);
        setStatus('success');
        setMessage('Email verified successfully! You can now sign in to your account.');
      } catch (error) {
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Email verification failed');
      }
    };

    verifyEmail();
  }, [searchParams]);

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
              Verifying Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your email address...
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verified!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <Link
              to="/login"
              className="btn-primary inline-flex items-center"
            >
              <Mail className="h-4 w-4 mr-2" />
              Sign In
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="mb-6">
              <XCircle className="h-16 w-16 text-red-600 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <Link
                to="/login"
                className="btn-primary inline-flex items-center w-full justify-center"
              >
                Return to Login
              </Link>
              <Link
                to="/register"
                className="btn-secondary inline-flex items-center w-full justify-center"
              >
                Create New Account
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
