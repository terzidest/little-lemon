import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState([]);

  return (
    <AppContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
