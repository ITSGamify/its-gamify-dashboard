import { ReactNode, createContext, useState } from "react";

export type ToastSeverity = "success" | "warning" | "error" | null;
export interface ShowToastRequest {
  message: string | ReactNode;
  severity?: ToastSeverity;
  errorCode?: string;
}

export interface ToastContextState extends ShowToastRequest {
  open: boolean;
  key: number;
}

export interface ToastContextProps {
  state: ToastContextState;
  showToast: (request: ShowToastRequest) => void;
  handleClose: () => void;
}

const defaultState = {
  open: false,
  message: "",
  severity: null,
  errorCode: "",
  key: 0,
};

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext<ToastContextProps>({
  state: defaultState,
  showToast: () => null,
  handleClose: () => null,
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<ToastContextState>(defaultState);

  const handleClose = () => {
    setState(defaultState);
  };

  const showToast = (request: ShowToastRequest) => {
    setState({
      ...request,
      open: true,
      key: new Date().getTime(),
    });
  };

  return (
    <ToastContext.Provider value={{ state, showToast, handleClose }}>
      {children}
    </ToastContext.Provider>
  );
};
