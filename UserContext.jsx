// components/UserContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on app start
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('netnapz_token');
        const userData = localStorage.getItem('netnapz_user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('netnapz_token');
        localStorage.removeItem('netnapz_user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem('netnapz_users') || '{}');
      const user = users[email];
      
      if (!user) {
        throw new Error('No account found with this email');
      }

      if (user.password !== password) {
        throw new Error('Invalid password');
      }

      // Create session
      const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));
      const userData = {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at,
        profile_picture: user.profile_picture
      };

      localStorage.setItem('netnapz_token', token);
      localStorage.setItem('netnapz_user', JSON.stringify(userData));
      setUser(userData);

      return { data: { user: userData }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signup = async (email, password, fullName) => {
    try {
      // Get existing users
      const users = JSON.parse(localStorage.getItem('netnapz_users') || '{}');
      
      if (users[email]) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: 'user_' + Date.now(),
        email,
        password, // In real app, hash this!
        full_name: fullName,
        created_at: new Date().toISOString(),
        profile_picture: null
      };

      // Save user
      users[email] = newUser;
      localStorage.setItem('netnapz_users', JSON.stringify(users));

      // Auto-login after signup
      const token = btoa(JSON.stringify({ email, timestamp: Date.now() }));
      const userData = {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        created_at: newUser.created_at,
        profile_picture: newUser.profile_picture
      };

      localStorage.setItem('netnapz_token', token);
      localStorage.setItem('netnapz_user', JSON.stringify(userData));
      setUser(userData);

      return { data: { user: userData }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const logout = () => {
    localStorage.removeItem('netnapz_token');
    localStorage.removeItem('netnapz_user');
    setUser(null);
  };

  const updateProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    const users = JSON.parse(localStorage.getItem('netnapz_users') || '{}');
    
    if (users[user.email]) {
      users[user.email] = { ...users[user.email], ...updates };
      localStorage.setItem('netnapz_users', JSON.stringify(users));
    }

    localStorage.setItem('netnapz_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// ✅ MAKE SURE THIS EXPORT IS PRESENT
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// ✅ ALSO EXPORT THE CONTEXT ITSELF FOR ADVANCED USAGE
export { UserContext };