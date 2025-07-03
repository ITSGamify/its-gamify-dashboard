// src/config/axios.ts
import axios, { AxiosRequestConfig } from "axios";
import { API_URL } from "./env";
import userSession from "@utils/user-session";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
import { PATH } from "@constants/path";

export const baseApiURL = API_URL + `/api`;

export const axiosInstance = axios.create();

axiosInstance.defaults.withCredentials = false;

axiosInstance.interceptors.request.use(async function (config) {
  config.baseURL = baseApiURL;
  config.headers["Accept"] = "application/json";

  const profile = userSession.getUserProfile();
  if (profile) {
    config.headers["Authorization"] = `Bearer ${profile.token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    let errData = error.response?.data;
    const status = error.response?.status || error.code;
    const shouldNotShowError = error?.config?.shouldNotShowError;

    if (error.response && error.response.data instanceof Blob) {
      // Convert Blob into text to read JSON error message
      const errorText = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = () => reject(reader.error);
        reader.onload = () => resolve(reader.result as string);
        reader.readAsText(error.response.data);
      });

      errData = JSON.parse(errorText);
    } else {
      console.log(error, "error on blob");
    }
    switch (status) {
      case 401:
        userSession.clearUserProfile();
        window.location.href = PATH.LOGIN;
        break;
      case "ERR_NETWORK":
        toast.error(ToastContent, {
          data: {
            message: error.message,
          },
        });
        break;
      default:
        if (!shouldNotShowError) {
          console.log("show error", errData);
          toast.error(ToastContent, {
            data: {
              // message: i18next.t(`${i18ErrNamespace}:${errData.message}`),
              message: "Lỗi không xác định!",
              // errorCode: errData.error_code,
            },
          });
        }
    }
    return Promise.reject(error);
  }
);

export const request = async (
  options: AxiosRequestConfig & { shouldNotShowError?: boolean }
) => {
  try {
    const res = await axiosInstance(options);
    return res?.data;
  } catch (error) {
    console.log("request error: ", error);
    throw error;
  }
};
