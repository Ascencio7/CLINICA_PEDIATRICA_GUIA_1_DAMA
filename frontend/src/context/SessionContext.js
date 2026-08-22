import React, { createContext, useContext, useState } from 'react';

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [userName, setUserName] = useState('');

  return (
    <SessionContext.Provider value={{ userName, setUserName }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
