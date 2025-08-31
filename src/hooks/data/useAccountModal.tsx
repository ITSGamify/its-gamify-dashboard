import { yupResolver } from "@hookform/resolvers/yup";
import { User } from "@interfaces/api/user";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
import { Resolver, useForm } from "react-hook-form";
import { accountFormScheme } from "src/form-schema/account";
import { useCreateAccount, useUpdateAccount } from "@services/account";

interface Props {
  user: User | null;
  onActionSuccess: () => void;
}

export interface AccountFormValues {
  full_name: string;
  email: string;
  role_id: string;
  department_id: string;
  password: string;
  avatar_url: string;
}

export const useAccountModal = ({ user: data, onActionSuccess }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => {
      return !prev;
    });
  };

  const { control, handleSubmit, reset, watch } = useForm<AccountFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: useMemo(
      () => ({
        full_name: data?.full_name || "",
        password: data?.password || "",
        email: data?.email ? data.email : "",
        role_id: data?.role_id || "",
        department_id: data?.department_id || "",
        avatar_url: data?.avatar_url || "",
      }),
      [data]
    ),
    resolver: yupResolver(accountFormScheme) as Resolver<AccountFormValues>,
  });

  const { mutateAsync: createAccount, isPending: isPendingCreate } =
    useCreateAccount();
  const { mutateAsync: updateAccount, isPending: isPendingUpdate } =
    useUpdateAccount();
  const isSaving = isPendingCreate || isPendingUpdate;

  const handleSave = useCallback(
    async (formData: AccountFormValues) => {
      const body = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id,
        department_id: formData.department_id,
        avatar_url: formData.avatar_url,
      };

      try {
        if (data) {
          await updateAccount({ id: data.id, ...body });
          toast.success(ToastContent, {
            data: {
              message: "Cập nhật thành công",
            },
          });
        } else {
          await createAccount({ ...body });
          toast.success(ToastContent, {
            data: {
              message: "Tạo tài khoản thành công",
            },
          });
        }
        onActionSuccess();
        reset();
      } catch (error: any) {
        // Xử lý lỗi email trùng lặp
        const errorMessage =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message;

        if (
          errorMessage &&
          errorMessage.toLowerCase().includes("email") &&
          (errorMessage.toLowerCase().includes("đã tồn tại") ||
            errorMessage.toLowerCase().includes("already exists") ||
            errorMessage.toLowerCase().includes("duplicate") ||
            errorMessage.toLowerCase().includes("exists"))
        ) {
          toast.error(ToastContent, {
            data: {
              message: "Email đã tồn tại!",
            },
          });
        } else {
          // Hiển thị lỗi mặc định nếu không phải lỗi email trùng lặp
          toast.error(ToastContent, {
            data: {
              message: errorMessage || "Đã xảy ra lỗi!",
            },
          });
        }
      }
    },
    [data, onActionSuccess, reset, createAccount, updateAccount]
  );

  useEffect(() => {
    if (data) {
      reset({
        full_name: data?.full_name || "",
        password: data?.password || "",
        email: data?.email ? data.email : "",
        role_id: data?.role_id || "",
        department_id: data?.department_id || "",
        avatar_url: data?.avatar_url || "",
      });
    } else {
      reset({
        full_name: "",
        password: "",
        email: "",
        role_id: "",
        department_id: "",
        avatar_url: "",
      });
    }
  }, [data, reset]);

  return {
    showPassword,
    toggleShowPassword,
    control,
    isSaving,
    handleSubmit: handleSubmit(handleSave),
    reset,
    watch,
  };
};
