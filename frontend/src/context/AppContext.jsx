import React, { createContext } from 'react';
import { doctors } from '../assets/assets';

export const AppContext = createContext();

const UserProvider = ({ children }) => {
  return (
    <AppContext.Provider value={{ doctors }}>
      {children}
    </AppContext.Provider>
  );
};

export default UserProvider;
