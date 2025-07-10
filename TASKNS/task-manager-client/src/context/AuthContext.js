import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Initialize auth state from localStorage - optimized with useMemo
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user info from token
          const decoded = jwt_decode(token);
          
          // Check if token is expired
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token expired, logout
            handleLogout();
          } else {
            // Set user data from token
            setUser({
              id: decoded.sub,
              email: decoded.email,
              role: decoded.role,
            });
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);
  
  // Login handler
  const handleLogin = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await authAPI.login({ email, password });
      const { accessToken, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', accessToken);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      toast.success('Login successful!');
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register handler
  const handleRegister = async (userData) => {
    try {
      setIsLoading(true);
      await authAPI.register(userData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout handler
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    navigate('/login');
  };
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }), [user, isAuthenticated, isLoading]);
  
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext); 