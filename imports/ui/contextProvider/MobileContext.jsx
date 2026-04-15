import React, {createContext, useContext, useEffect, useState} from "react";

const MobileContext = createContext(undefined);

export const MobileProvider = ({children}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const contextValue = {
    isMobile,
  };

  return <MobileContext.Provider value={contextValue}>{children}</MobileContext.Provider>;
};

export const useMobileContext = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error("useMobileContext must be used within an MobileProvider");
  }
  return context;
};
