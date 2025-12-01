// pages/Settings.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useUser } from '@/components/UserContext';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Home, Terminal, CheckCircle, XCircle } from 'lucide-react';

export default function Settings() {
  const { login, signup } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        result = await signup(email, password, fullName.trim());
      }

      if (result.error) {
        throw new Error(result.error.message);
      }

      setSuccess(isLogin ? 'Login successful! Redirecting...' : 'Account created successfully! Redirecting...');
      
      setTimeout(() => {
        navigate(createPageUrl('Home'));
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    navigate(createPageUrl('Home'));
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const switchMode = (mode) => {
    setIsLogin(mode);
    clearMessages();
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6907bbc1d9a3081c7edf7dd0/de7781c73_create-a-cool-grafity-logo-for-red-splat-handprint-with-the-text-netnapzpunk-style-high-quality.jpg"
          alt="NetNapz Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="absolute inset-0 bg-[size:50px_50px] bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] opacity-50"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-3 group" onClick={clearMessages}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-yellow-400">
                <span className="text-3xl font-black text-white">N</span>
              </div>
            </div>
            <span className="text-4xl font-black text-black">NetNapz</span>
          </Link>
          <p className="text-gray-600 mt-2 font-bold">
            {isLogin ? 'Welcome back! Ready to create?' : 'Join NetNapz! Everything is FREE! 🎉'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="cartoon-glass border-3 border-black p-8 rounded-3xl shadow-2xl">
          {/* Toggle Buttons */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1 border-2 border-black">
            <button
              onClick={() => switchMode(true)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                isLogin 
                  ? 'bg-gradient-to-r from-orange-400 to-green-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchMode(false)}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                !isLogin 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-100 border-2 border-green-500 rounded-xl text-green-600 text-sm font-bold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-600 text-sm font-bold flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Full Name (Signup only) */}
            {!isLogin && (
              <div>
                <label className="text-sm font-bold text-black mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 cartoon-btn bg-white border-2 border-black rounded-xl focus:outline-none focus:border-orange-400 font-bold"
                    placeholder="Your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-sm font-bold text-black mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 cartoon-btn bg-white border-2 border-black rounded-xl focus:outline-none focus:border-orange-400 font-bold"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-bold text-black mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 cartoon-btn bg-white border-2 border-black rounded-xl focus:outline-none focus:border-orange-400 font-bold"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="text-xs text-gray-500 mt-1 font-bold">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className={`w-full cartoon-btn font-bold py-3 text-lg border-2 border-black disabled:opacity-50 ${
                isLogin
                  ? 'bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white'
                  : 'bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isLogin ? 'Logging in...' : 'Creating Account...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {isLogin ? 'Login to Create!' : 'Create Free Account!'}
                </div>
              )}
            </Button>
          </form>

          {/* Continue as Guest */}
          <div className="mt-6">
            <Button
              onClick={handleContinueAsGuest}
              className="w-full cartoon-btn bg-white border-2 border-black text-black font-bold py-3 hover:bg-yellow-200"
            >
              <Home className="w-5 h-5 mr-2" />
              Continue as Guest
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <div className="bg-yellow-100 border-2 border-black rounded-xl p-3 mb-4">
              <p className="text-xs text-gray-700 font-bold">
                🎉 <strong>Everything is 100% FREE!</strong> No payments, no credits, no limits!
              </p>
            </div>
            
            {isLogin ? (
              <p className="text-gray-600 font-bold">
                Don't have an account?{' '}
                <button 
                  onClick={() => switchMode(false)}
                  className="text-purple-400 hover:text-purple-500 font-black underline"
                >
                  Create one here!
                </button>
              </p>
            ) : (
              <p className="text-gray-600 font-bold">
                Already have an account?{' '}
                <button 
                  onClick={() => switchMode(true)}
                  className="text-orange-400 hover:text-orange-500 font-black underline"
                >
                  Login here!
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 font-bold mb-4">Quick Access:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to={createPageUrl("Home")}
              className="text-orange-400 hover:text-orange-500 font-bold text-sm inline-flex items-center gap-1"
              onClick={clearMessages}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link 
              to={createPageUrl("NapzTerminal")}
              className="text-purple-400 hover:text-purple-500 font-bold text-sm inline-flex items-center gap-1"
              onClick={clearMessages}
            >
              <Terminal className="w-4 h-4" />
              Create
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}