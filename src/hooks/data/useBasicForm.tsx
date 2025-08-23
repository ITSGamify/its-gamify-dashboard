import { yupResolver } from "@hookform/resolvers/yup";
import { StepFormProps } from "@interfaces/api/course";
import { useCallback, useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { basicFormSchema } from "src/form-schema/course";

export interface BasicForm {
  title: string;
  short_description: string;
  description?: string;
  thumbnail_image_id?: string;
  introduction_video_id?: string;
  classify?: string;
  department_ids?: string[] | null;
  category_id?: string;
  is_optional: boolean;
  quarter_id: string;
}

export const useBasicForm = ({ data, handleNextState }: StepFormProps) => {
  const { control, handleSubmit, watch, setValue, reset } = useForm<BasicForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: data?.title || "",
      short_description: data?.short_description || "",
      description: data?.description || "",
      thumbnail_image_id: data?.thumbnail_image_id || "",
      introduction_video_id: data?.introduction_video_id || "",
      classify: data?.classify || "ALL",
      department_ids:
        data?.course_departments?.map((dept) => dept.department_id) || [],
      category_id: data?.category_id || "",
      is_optional: data?.is_optional || false,
      quarter_id: data?.quarter_id || "",
    },
    resolver: yupResolver(basicFormSchema) as Resolver<BasicForm>,
  });

  useEffect(() => {
    if (data) {
      reset({
        title: data.title || "",
        short_description: data.short_description || "",
        description: data.description || "",
        thumbnail_image_id: data.thumbnail_image_id || "",
        introduction_video_id: data.introduction_video_id || "",
        classify: data.classify || "ALL",
        department_ids:
          data.course_departments?.map((dept) => dept.department_id) || [],
        category_id: data.category_id || "",
        quarter_id: data.quarter_id || "",
        is_optional: data.is_optional || false,
      });
    }
  }, [data, reset]);

  const classify = watch("classify");

  const departmentIds = watch("department_ids");
  const handleDepartmentIdsChange = useCallback(
    (newIds: string[]) => {
      setValue("department_ids", newIds);
    },
    [setValue]
  );

  const handleRemoveDepartmentId = useCallback(
    (departmentIdToRemove: string) => {
      const updatedIds = (departmentIds || []).filter(
        (id) => id !== departmentIdToRemove
      );
      setValue("department_ids", updatedIds);
    },
    [departmentIds, setValue]
  );

  return {
    control,
    handleSubmit: handleSubmit(handleNextState),
    classify,
    departmentIds,
    handleRemoveDepartmentId,
    handleDepartmentIdsChange,
  };
};
