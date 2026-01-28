import React, { createContext, useContext, useState } from "react";

export const CaptainDataContext = createContext(null);

export const useCaptain = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error("Error at context");
  }
  return context;
};

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const updateCaptain = (captainData) => {
    setCaptain(captainData);
  };

  const values = {
    captain,
    setCaptain,
    loading,
    setLoading,
    error,
    setError,
    updateCaptain,
  };

  return (
    <CaptainDataContext.Provider value={values}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
