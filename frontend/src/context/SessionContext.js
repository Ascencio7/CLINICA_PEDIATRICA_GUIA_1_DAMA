import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SessionContext = createContext(null);
const DARK_MODE_STORAGE_KEY = 'darkMode';
const TOKEN_STORAGE_KEY = 'token';
const USER_NAME_STORAGE_KEY = 'userName';

export const lightColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  secondaryText: '#64748B',
  border: '#E2E8F0',
  input: '#F8FAFC',
};

export const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  secondaryText: '#CBD5E1',
  border: '#475569',
  input: '#334155',
};

export const SessionProvider = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [token, setToken] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const colors = darkMode ? darkColors : lightColors;

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem(DARK_MODE_STORAGE_KEY);
        if (storedDarkMode !== null) setDarkMode(storedDarkMode === 'true');
      } catch (error) {
        console.warn('No se pudo cargar la preferencia de modo oscuro:', error);
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedValues = await AsyncStorage.multiGet([TOKEN_STORAGE_KEY, USER_NAME_STORAGE_KEY]);
        const storedToken = storedValues.find(([key]) => key === TOKEN_STORAGE_KEY)?.[1];
        const storedUserName = storedValues.find(([key]) => key === USER_NAME_STORAGE_KEY)?.[1];

        if (storedToken) setToken(storedToken);
        if (storedUserName) setUserName(storedUserName);
      } catch (error) {
        console.warn('No se pudo cargar la sesión guardada:', error);
      } finally {
        setSessionLoaded(true);
      }
    };

    loadSession();
  }, []);

  useEffect(() => {
    if (!themeLoaded) return;

    AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode)).catch(error => {
      console.warn('No se pudo guardar la preferencia de modo oscuro:', error);
    });
  }, [darkMode, themeLoaded]);

  const logout = async () => {
    await AsyncStorage.multiRemove([TOKEN_STORAGE_KEY, USER_NAME_STORAGE_KEY]);
    setToken(null);
    setUserName('');
  };

  if (!themeLoaded || !sessionLoaded) return null;

  return (
    <SessionContext.Provider value={{ userName, setUserName, token, setToken, logout, darkMode, setDarkMode, colors }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
