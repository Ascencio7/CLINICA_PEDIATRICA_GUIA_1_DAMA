import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

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
  const [darkMode, setDarkMode] = useState(false);
  const colors = darkMode ? darkColors : lightColors;

  return (
    <SessionContext.Provider value={{ userName, setUserName, darkMode, setDarkMode, colors }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
