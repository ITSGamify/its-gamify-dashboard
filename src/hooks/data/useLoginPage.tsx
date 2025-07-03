import { useCallback, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

import { Resolver, useForm } from "react-hook-form";
import {
  AuthenticationFormData,
  authenticationFormScheme,
} from "src/form-schema/authentication";
import { useLogin } from "@services/authentication";
import userSession from "@utils/user-session";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { getRoute } from "@utils/route";
import { PATH } from "@constants/path";

export interface AuthenticationFormValues {
  email: string;
  password: string;
}

// Constants cho cookie
const REMEMBER_ME_COOKIE = "remember_me";
const SAVED_EMAIL_COOKIE = "saved_email";
const COOKIE_EXPIRY_DAYS = 30;

export const useLoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const savedRememberMe = Cookies.get(REMEMBER_ME_COOKIE);
    return savedRememberMe === "true";
  });

  const handleRememberMe = () => {
    setRememberMe((prev) => {
      const newValue = !prev;

      if (newValue) {
        Cookies.set(REMEMBER_ME_COOKIE, "true", {
          expires: COOKIE_EXPIRY_DAYS,
          sameSite: "strict",
        });
      } else {
        Cookies.remove(REMEMBER_ME_COOKIE);
        Cookies.remove(SAVED_EMAIL_COOKIE);
      }

      return newValue;
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => {
      return !prev;
    });
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthenticationFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: useMemo(
      () => ({
        email: Cookies.get(SAVED_EMAIL_COOKIE) || "",
        password: "",
      }),
      []
    ),
    resolver: yupResolver(
      authenticationFormScheme
    ) as Resolver<AuthenticationFormValues>,
  });

  const { mutateAsync: login, isPending: isLoading } = useLogin();

  const handleLogin = useCallback(
    async (formData: AuthenticationFormValues) => {
      if (rememberMe) {
        Cookies.set(SAVED_EMAIL_COOKIE, formData.email, {
          expires: COOKIE_EXPIRY_DAYS,
          sameSite: "strict",
          secure: true,
        });
      }

      await login(formData, {
        onSuccess: (data) => {
          userSession.storeUserProfile(data);
          reset();
          const route = getRoute(PATH.HOME);
          navigate(route);
        },
      });
    },
    [rememberMe, login, reset, navigate]
  );

  useEffect(() => {
    if (errors.email?.message) {
      setError(errors.email.message);
    } else if (errors.password?.message) {
      setError(errors.password.message);
    } else {
      setError(null);
    }
  }, [errors.email, errors.password]);

  return {
    control,
    isLoading,
    handleSubmit: handleSubmit(handleLogin),
    error,
    showPassword,
    handleTogglePasswordVisibility,
    rememberMe,
    handleRememberMe,
  };
};
