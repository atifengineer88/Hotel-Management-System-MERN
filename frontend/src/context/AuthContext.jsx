import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize User on Load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
      // Decode user from local storage or token payload if you prefer
      // For now, we trust the token existence
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      // Update State
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      
      return true; // Explicit success return
    } catch (err) {
      console.error("Login API Error:", err);
      // Pass the error up so Login.jsx can catch it
      throw err; 
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    toast.success("Logged out");
  };

  const register = async (userData) => {
    try {
      await axios.post('http://localhost:5000/api/auth/register', userData);
      return true;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};