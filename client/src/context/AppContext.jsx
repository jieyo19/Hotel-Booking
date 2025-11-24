import React, { createContext, useContext, useState } from 'react';
import Axios from 'axios';

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // FIXED: Direct URL - no environment variable needed
  const axios = Axios.create({
    baseURL: 'http://localhost:3000',  // ← Changed this line!
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true  // ← Changed to true for better authentication
  });

  // Request interceptor for debugging
  axios.interceptors.request.use(
    (config) => {
      console.log('Making request to:', config.baseURL + config.url);
      console.log('Request data:', config.data);
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