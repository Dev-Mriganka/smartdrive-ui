import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from './AnimatedBackground';
import ThemeToggle from './ThemeToggle';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      setSuccess('Registration successful! Please check your email for verification.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = 
    formData.username.trim() && 
    formData.email.trim() && 
    formData.password.trim() && 
    formData.confirmPassword.trim() && 
    formData.firstName.trim() && 
    formData.lastName.trim();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in-up relative">
      <AnimatedBackground />
      <ThemeToggle />
      <div className="form-container w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4">
            <img 
              src="/smartdrive-logo.png" 
              alt="SmartDrive Logo" 
              className="h-16 w-auto mx-auto"
            />
          </div>
          <h1 className="brand-logo mb-2">Create Account</h1>
          <p className="brand-subtitle dark:text-gray-300">Join SmartDrive today</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us and start managing your files with AI
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="message-error flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="message-success flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>{success}</span>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="modern-input"
                placeholder="John"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="modern-input"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Username Field */}
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="modern-input pl-10"
                placeholder="johndoe"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="modern-input pl-10"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="modern-input pl-10 pr-10"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="modern-input pl-10 pr-10"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
