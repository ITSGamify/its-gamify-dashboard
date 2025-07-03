import { Department } from "@interfaces/api/department";
import { useCallback, useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { departmentFormScheme } from "src/form-schema/department";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateDepartment, useUpdateDepartment } from "@services/department";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";

interface Props {
  data: Department | null;
  onActionSuccess: () => void;
}

export interface DepartmentFormValues {
  name: string;
  description?: string;
  location?: string;
  leaderId?: string | "";
}

export const useDepartmentModal = ({ data, onActionSuccess }: Props) => {
  const { control, handleSubmit, reset } = useForm<DepartmentFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: useMemo(
      () => ({
        name: data?.name || "",
        location: data?.location ? data?.location : "",
        description: data?.description || "",
        leaderId: data?.leader?.id || "",
      }),
      [data]
    ),
    resolver: yupResolver(
      departmentFormScheme
    ) as Resolver<DepartmentFormValues>,
  });

  const { mutateAsync: createDepartment, isPending: isPendingCreate } =
    useCreateDepartment();
  const { mutateAsync: updateDepartment, isPending: isPendingUpdate } =
    useUpdateDepartment();
  const isSaving = isPendingCreate || isPendingUpdate;

  const handleSave = useCallback(
    async (formData: DepartmentFormValues) => {
      const body = {
        name: formData.name,
        location: formData.location,
        description: formData.description || "Phòng nhân sự",
      };

      const onSuccess = () => {
        toast.success(ToastContent, {
          data: {
            message: "Cập nhật thành công!",
          },
        });
        onActionSuccess();
        reset();
      };

      if (data) {
        await updateDepartment({ id: data.id, ...body }, { onSuccess });
      } else {
        await createDepartment({ ...body }, { onSuccess });
      }
    },
    [data, onActionSuccess, reset, createDepartment, updateDepartment]
  );

  useEffect(() => {
    if (data) {
      reset({ name: data.name, location: data.location });
    } else {
      reset({ name: "", location: "" });
    }
  }, [data, reset]);

  return {
    control,
    isSaving,
    handleSubmit: handleSubmit(handleSave),
  };
};
