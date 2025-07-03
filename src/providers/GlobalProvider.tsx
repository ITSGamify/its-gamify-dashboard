import { ThemeOptions } from "@mui/material/styles";
import { themeOptions } from "@styles/theme";
import React, { createContext, useState } from "react";

// Define types for the context
interface GlobalContextProps {
  themeOptions: ThemeOptions;
  setThemeOptions: (themeOptions: ThemeOptions) => void;
}

// Create a context object
// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext<GlobalContextProps | undefined>(
  undefined
);

// Create a provider component
export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeOptions>(themeOptions);

  return (
    <GlobalContext.Provider
      value={{ themeOptions: theme, setThemeOptions: setTheme }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
