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

      const onSuccess = () => {
        toast.success(ToastContent, {
          data: {
            message: "Cập nhật thành công",
          },
        });
        onActionSuccess();
        reset();
      };

      if (data) {
        await updateAccount({ id: data.id, ...body }, { onSuccess });
      } else {
        await createAccount({ ...body }, { onSuccess });
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
