// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useUser } from '@/components/UserContext';
import { Button } from '@/components/ui/button';
import { User, Crown, Sparkles, Terminal, Image, Video, Code, Globe, Archive, Home, Trash2, Eye, Download, Clock, Edit3, CheckCircle, XCircle } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateProfile } = useUser();
  const [userCreations, setUserCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');

  // Load user creations
  useEffect(() => {
    if (user) {
      loadUserCreations();
      setEditName(user.full_name || '');
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadUserCreations = () => {
    try {
      const creations = JSON.parse(localStorage.getItem('netnapz_creations') || '[]');
      const userCreations = creations.filter(creation => creation.user_id === user.id);
      setUserCreations(userCreations);
    } catch (error) {
      console.error('Error loading creations:', error);
      setUserCreations([]);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = () => {
    if (editName.trim()) {
      updateProfile({ full_name: editName.trim() });
    }
    setEditingProfile(false);
  };

  const deleteCreation = (creationId) => {
    try {
      const creations = JSON.parse(localStorage.getItem('netnapz_creations') || '[]');
      const updatedCreations = creations.filter(creation => creation.id !== creationId);
      localStorage.setItem('netnapz_creations', JSON.stringify(updatedCreations));
      setUserCreations(updatedCreations.filter(creation => creation.user_id === user.id));
    } catch (error) {
      console.error('Error deleting creation:', error);
    }
  };

  const getCreationIcon = (type) => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4 text-orange-400" />;
      case 'image': return <Image className="w-4 h-4 text-purple-400" />;
      case 'video': return <Video className="w-4 h-4 text-pink-400" />;
      case 'website': return <Globe className="w-4 h-4 text-blue-400" />;
      case 'game': return <Sparkles className="w-4 h-4 text-yellow-400" />;
      case 'webapp': return <Terminal className="w-4 h-4 text-green-400" />;
      default: return <Archive className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // If no user is logged in
  if (!user) {
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
        </div>

        <div className="relative z-10 text-center max-w-md w-full">
          <div className="cartoon-glass border-3 border-black p-8 rounded-3xl shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4 border-3 border-black">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-black text-black mb-4">Welcome to NetNapz!</h2>
            <p className="text-gray-700 mb-6 font-bold">
              Login to see your profile, save your creations, and unlock all our FREE AI tools!
            </p>
            <Link to={createPageUrl("Settings")}>
              <Button className="cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold py-3 px-6 text-lg border-2 border-black w-full">
                <User className="w-5 h-5 mr-2" />
                Login / Sign Up
              </Button>
            </Link>
            <p className="text-xs text-gray-600 mt-4 font-bold">
              🎉 Everything is 100% FREE! No payments ever!
            </p>
          </div>
          
          <div className="mt-8">
            <Link 
              to={createPageUrl("Home")}
              className="text-orange-400 hover:text-orange-500 font-bold text-sm inline-flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 relative">
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

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to={createPageUrl("Home")} className="inline-flex items-center gap-3 group mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-yellow-400">
                <span className="text-3xl font-black text-white">N</span>
              </div>
            </div>
            <span className="text-4xl font-black text-black">NetNapz</span>
          </Link>
          <h1 className="text-3xl font-black text-black mb-2">My Profile</h1>
          <p className="text-gray-600 font-bold">
            {userCreations.length > 0 
              ? `You've created ${userCreations.length} amazing things! 🎨` 
              : 'Your personal AI creation space awaits! 🚀'
            }
          </p>
        </div>

        {/* Profile Card */}
        <div className="cartoon-glass border-3 border-black p-6 rounded-3xl shadow-2xl mb-8">
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center shadow-2xl overflow-hidden border-3 border-black">
                <span className="text-white font-bold text-3xl">
                  {(user.full_name || user.email)?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {editingProfile ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="px-3 py-1 border-2 border-black rounded-lg font-bold text-xl"
                      placeholder="Your name"
                    />
                    <button
                      onClick={saveProfile}
                      className="p-1 bg-green-400 text-white rounded-lg hover:bg-green-500 border-2 border-black"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="p-1 bg-red-400 text-white rounded-lg hover:bg-red-500 border-2 border-black"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-black">
                      {user.full_name || "NetNapz User"}
                    </h2>
                    <button
                      onClick={() => setEditingProfile(true)}
                      className="p-1 hover:bg-gray-100 rounded-lg border-2 border-transparent hover:border-black"
                      title="Edit name"
                    >
                      <Edit3 className="w-4 h-4 text-gray-500" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-gray-600 font-bold mb-3">{user.email}</p>
              
              {/* Stats */}
              <div className="flex gap-6 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-black text-orange-400">{userCreations.length}</div>
                  <div className="text-sm font-bold text-black">Total Creations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">
                    {userCreations.filter(c => c.type === 'code').length}
                  </div>
                  <div className="text-sm font-bold text-black">Code Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-purple-400">
                    {userCreations.filter(c => c.type === 'image').length}
                  </div>
                  <div className="text-sm font-bold text-black">Images</div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full border border-black">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-bold text-white">Free Member</span>
                </div>
                <div className="text-xs text-gray-500">
                  Joined {formatDate(user.created_at)}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to={createPageUrl("NapzTerminal")}>
              <Button className="w-full cartoon-btn bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 border-2 border-black text-lg">
                <Terminal className="w-5 h-5 mr-2" />
                Create New
              </Button>
            </Link>
            <Button
              onClick={logout}
              className="w-full cartoon-btn bg-white border-2 border-red-500 text-red-600 hover:bg-red-100 font-bold py-4 text-lg"
            >
              <User className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Recent Creations */}
        <div className="cartoon-glass border-3 border-black p-6 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
            <h3 className="text-xl font-black text-black">
              My Creations
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>All Time</span>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-3 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-bold">Loading your creations...</p>
            </div>
          ) : userCreations.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-bold">No creations yet</p>
              <p className="text-sm text-gray-500 mt-1">Start creating to see your work here!</p>
              <Link to={createPageUrl("NapzTerminal")}>
                <Button className="mt-4 cartoon-btn bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 text-white font-bold">
                  <Terminal className="w-4 h-4 mr-2" />
                  Start Creating Now
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCreations.slice(0, 6).map((creation) => (
                <div key={creation.id} className="cartoon-btn bg-white border-2 border-black p-4 rounded-xl hover:border-purple-400 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getCreationIcon(creation.type)}
                      <span className="text-xs font-bold text-gray-500 uppercase">
                        {creation.type || 'creation'}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteCreation(creation.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity border-2 border-transparent hover:border-red-300"
                      title="Delete creation"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                  
                  <h4 className="font-black text-black mb-2 line-clamp-2">
                    {creation.title || 'Untitled Creation'}
                  </h4>
                  
                  {creation.prompt && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {creation.prompt}
                    </p>
                  )}
                  
                  {creation.content && creation.type !== 'image' && creation.type !== 'video' && (
                    <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded border border-gray-300">
                      <code className="line-clamp-2">{creation.content.substring(0, 100)}...</code>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(creation.created_at)}</span>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded border-2 border-transparent hover:border-gray-300" title="View">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded border-2 border-transparent hover:border-gray-300" title="Download">
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}