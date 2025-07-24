import React, { createContext ,useState} from 'react';
import { doctors } from '../assets/assets';

export const AppContext = createContext();

const UserProvider = ({ children }) => {
  const currencySymbol='$';
  const [token, setToken] = useState(true);
  const value={
    doctors,
    currencySymbol,
    token,
    setToken
  }
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default UserProvider;
