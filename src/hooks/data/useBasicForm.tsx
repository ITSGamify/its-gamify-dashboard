import { yupResolver } from "@hookform/resolvers/yup";
import { StepFormProps } from "@interfaces/api/course";
import { useCallback } from "react";
import { useForm, Resolver } from "react-hook-form";
import { basicFormSchema } from "src/form-schema/course";

export interface BasicForm {
  title: string;
  short_description: string;
  description?: string;
  thumbnail_image_id?: string;
  introduction_video_id?: string;
  classify?: number;
  department_id?: string;
  category_id?: string;
  tags: string[];
}

export const useBasicForm = ({ data, handleNextState }: StepFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BasicForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: data?.title || "",
      short_description: data?.short_description || "",
      description: data?.description || "",
      thumbnail_image_id: data?.thumbnail_image_id || "111111",
      introduction_video_id: data?.introduction_video_id || "111111",
      classify: data?.classify || 1,
      department_id: data?.department_id || "1111111",
      category_id: data?.category_id || "111111",
      tags: data?.tags || [],
    },
    resolver: yupResolver(basicFormSchema) as Resolver<BasicForm>,
  });

  console.log(errors);
  const tags = watch("tags"); // Theo dõi giá trị của tags

  // Sử dụng useCallback để tối ưu hóa hàm thêm tag
  const handleAddTag = useCallback(
    (newTag: string) => {
      if (newTag && !tags.includes(newTag)) {
        // Kiểm tra xem tag đã tồn tại chưa
        const updatedTags = [...tags, newTag];
        setValue("tags", updatedTags); // Cập nhật giá trị trong react-hook-form
      }
    },
    [tags, setValue]
  ); // Thêm tags và setValue vào dependency array

  // Sử dụng useCallback để tối ưu hóa hàm xóa tag
  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      const updatedTags = tags.filter((tag) => tag !== tagToRemove);
      setValue("tags", updatedTags); // Cập nhật giá trị trong react-hook-form
    },
    [tags, setValue]
  );

  return {
    control,
    handleSubmit: handleSubmit(handleNextState),
    tags,
    handleAddTag,
    handleRemoveTag,
  };
};
