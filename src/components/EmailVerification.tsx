import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check the link and try again.');
      return;
    }

    const verify = async () => {
      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now log in.');
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'An error occurred during verification. The token may be invalid or expired.');
      }
    };

    verify();
  }, [searchParams]);

  const renderIcon = () => {
    switch (status) {
      case 'verifying':
        return <Loader className="h-12 w-12 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-12 w-12 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form-container w-full max-w-md text-center">
        <div className="mx-auto mb-6">
          {renderIcon()}
        </div>
        <h1 className="text-2xl font-bold mb-4">
          {status === 'verifying' && 'Verifying Email'}
          {status === 'success' && 'Verification Successful'}
          {status === 'error' && 'Verification Failed'}
        </h1>
        <p className="text-gray-600 mb-8">{message}</p>
        {(status === 'success' || status === 'error') && (
          <Link to="/login" className="btn-primary w-full">
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
