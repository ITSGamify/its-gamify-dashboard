import { yupResolver } from "@hookform/resolvers/yup";
import { StepFormProps } from "@interfaces/api/course";
import { Module } from "@interfaces/dom/course";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { courseContentSchema } from "src/form-schema/course";

export interface CourseContentForm {
  modules: Module[];
}

export const useCourseContentForm = ({
  data,
  handleNextState,
}: StepFormProps) => {
  const defaultValue: Module = {
    id: "",
    title: "Module 1: Giới thiệu",
    description: "Giới thiệu tổng quan về khóa học",
    lessons: [
      {
        id: "lession-1",
        title: "Bài 1: Giới thiệu khóa học",
        type: "video",
        duration: 10,
        content: "Nội dung giới thiệu khóa học",
        video_url: "aaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
      {
        id: "lession-2",
        title: "Bài 2: Cài đặt môi trường",
        type: "article",
        duration: 15,
        content: "Hướng dẫn cài đặt môi trường làm việc",
      },
    ],
  };

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CourseContentForm>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      modules: data?.modules || [
        {
          ...defaultValue,
        },
      ],
    },
    resolver: yupResolver(courseContentSchema) as Resolver<CourseContentForm>,
  });
  console.log(errors);
  const {
    fields: fieldModule,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control,
    name: "modules",
    keyName: "fieldId", // Use fieldId instead of the default 'id' to avoid conflicts
  });

  const handleAddModule = () => {
    appendModule({
      ...defaultValue,
    });
  };

  const handleRemoveModule = (index: number) => {
    removeModule(index);
  };
  return {
    control,
    handleSubmit: handleSubmit(handleNextState),
    handleAddModule,
    handleRemoveModule,
    modules: fieldModule,
    setValue,
    getValues,
    watch,
  };
};
