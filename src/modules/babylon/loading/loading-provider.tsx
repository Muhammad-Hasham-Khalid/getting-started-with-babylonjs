import React, { createContext, useCallback, useContext, useState } from "react";

const initialState = {
  visible: false,
  show: () => {},
  hide: () => {},
};

const LoadingContext = createContext(initialState);

export const useLoadingContext = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null;
}> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);

  const hide = useCallback(() => setVisible(false), []);

  const value = { visible, show, hide };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
};
