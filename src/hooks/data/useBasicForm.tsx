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
  department_id?: string | null;
  category_id?: string;
  tags: string[];
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
      department_id: data?.department_id || "",
      category_id: data?.category_id || "",
      tags: data?.tags || [],
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
        department_id: data.department_id || null,
        category_id: data.category_id || "",
        tags: data.tags || [],
      });
    }
  }, [data, reset]);

  const tags = watch("tags");
  const classify = watch("classify");
  const handleAddTag = useCallback(
    (newTag: string) => {
      if (newTag && !tags.includes(newTag)) {
        const updatedTags = [...tags, newTag];
        setValue("tags", updatedTags);
      }
    },
    [tags, setValue]
  );

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags = tags.filter((tag) => tag !== tagToRemove);
      setValue("tags", updatedTags);
    },
    [tags, setValue]
  );

  return {
    control,
    handleSubmit: handleSubmit(handleNextState),
    tags,
    classify,
    handleAddTag,
    handleRemoveTag,
  };
};
