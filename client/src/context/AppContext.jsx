import React, { createContext, useContext, useState } from 'react';
import Axios from 'axios';
import { useAuth } from '@clerk/clerk-react'; // IMPORTANT: Add this import

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const { getToken } = useAuth(); // IMPORTANT: Get the Clerk token function

  // Use environment variable for production
  const axios = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  });

  // Request interceptor - ADD CLERK TOKEN TO EVERY REQUEST
  axios.interceptors.request.use(
    async (config) => {
      try {
        // Get the Clerk token
        const token = await getToken();
        
        // Add it to the Authorization header
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('✅ Token added to request');
        } else {
          console.log('⚠️ No token available - user may not be signed in');
        }
        
        console.log('Making request to:', config.baseURL + config.url);
        console.log('Request data:', config.data);
      } catch (error) {
        console.error('❌ Error getting token:', error);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for debugging
  axios.interceptors.response.use(
    (response) => {
      console.log('Response received:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('Response error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  const value = {
    showHotelReg,
    setShowHotelReg,
    isOwner,
    setIsOwner,
    axios
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppProvider = AppContextProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
};