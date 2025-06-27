// src/App.tsx
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "@providers/AuthProvider";
import { ToastProvider } from "@providers/ToastProvider";
import { QueryProvider } from "@providers/QueryProvider";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "@styles/global.css";
import { useGlobal } from "@hooks/shared/useGlobal";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, ToastContainerProps } from "react-toastify";

const toastConfig: ToastContainerProps = {
  limit: 5,
  icon: false,
  autoClose: 5000,
  closeButton: false,
  position: "top-right",
  hideProgressBar: true,
};

const App: React.FC = () => {
  const { themeOptions } = useGlobal();
  const theme = createTheme(themeOptions);

  return (
    <QueryProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastProvider>
          <ToastContainer {...toastConfig} />
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </QueryProvider>
  );
};

export default App;
