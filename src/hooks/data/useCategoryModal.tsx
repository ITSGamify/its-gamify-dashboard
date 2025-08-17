import { useCallback, useEffect, useMemo } from "react";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import ToastContent from "@components/ui/atoms/Toast";
import { Category } from "@interfaces/api/category";
import { categoryFormScheme } from "src/form-schema/category";
import { useCreateCategory, useUpdateCategory } from "@services/category";

interface Props {
  data: Category | null;
  onActionSuccess: () => void;
}

export interface CategoryFormValues {
  name: string;
  description: string;
}

export const useCategoryModal = ({ data, onActionSuccess }: Props) => {
  const { control, handleSubmit, reset } = useForm<CategoryFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: useMemo(
      () => ({
        name: data?.name || "",
      }),
      [data]
    ),
    resolver: yupResolver(categoryFormScheme) as Resolver<CategoryFormValues>,
  });

  const { mutateAsync: createCategory, isPending: isPendingCreate } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isPendingUpdate } =
    useUpdateCategory();
  const isSaving = isPendingCreate || isPendingUpdate;

  const handleSave = useCallback(
    async (formData: CategoryFormValues) => {
      const body = {
        name: formData.name,
        description: formData.description,
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
        await updateCategory({ id: data.id, ...body }, { onSuccess });
      } else {
        await createCategory({ ...body }, { onSuccess });
      }
    },
    [data, onActionSuccess, reset, createCategory, updateCategory]
  );

  useEffect(() => {
    if (data) {
      reset({ name: data.name, description: data.description });
    } else {
      reset({ name: "", description: "" });
    }
  }, [data, reset]);

  return {
    control,
    isSaving,
    handleSubmit: handleSubmit(handleSave),
  };
};
