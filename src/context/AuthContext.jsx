import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const signup = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.signup(userData);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googlePayload) => {
    setLoading(true);
    try {
      const response = await authAPI.googleAuth(googlePayload);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const sendEmailOTP = async (email) => {
    const response = await authAPI.sendEmailOTP(email);
    return response.data;
  };

  const sendPhoneOTP = async (phone) => {
    const response = await authAPI.sendPhoneOTP(phone);
    return response.data;
  };

  const verifyOTP = async (identifier, otp, type) => {
    const response = await authAPI.verifyOTP({ identifier, otp, type });
    return response.data;
  };

  const updateProfile = async (data) => {
    const response = await authAPI.updateProfile(data);
    setUser(response.data.user);
    return response.data;
  };

  const getAllUsers = async () => {
    const response = await authAPI.getAllUsers();
    return response.data;
  };

  const sendConnectionRequest = async (userId) => {
    const response = await authAPI.sendConnectionRequest(userId);
    return response.data;
  };

  const acceptConnectionRequest = async (userId) => {
    const response = await authAPI.acceptConnectionRequest(userId);
    return response.data;
  };

  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      return null;
    }
  };

  const rejectConnectionRequest = async (userId) => {
    const response = await authAPI.rejectConnectionRequest(userId);
    await fetchCurrentUser();
    return response.data;
  };

  const getConnections = async () => {
    const response = await authAPI.getConnections();
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        googleLogin,
        logout,
        sendEmailOTP,
        sendPhoneOTP,
        verifyOTP,
        updateProfile,
        getAllUsers,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        getConnections,
        fetchCurrentUser,
        userId: decodeToken(token)?.id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
