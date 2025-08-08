import { TOURNAMENT_KEY } from "@constants/challenge";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChallengeStepFormProps } from "@interfaces/api/challenge";
import { useGetCourseDetail } from "@services/course";
import { useEffect, useRef } from "react";
import { Resolver, useForm } from "react-hook-form";
import { basicChallengeFormSchema } from "src/form-schema/challenge";

export interface ChallengeInforForm {
  title: string;
  description: string;
  num_of_room: number;
  thumbnail_image: string;
  thumbnail_image_id: string;
  course_id: string;
  category_id: string;
}

export const useChallengeForm = ({
  handleNextState,
  formData,
}: ChallengeStepFormProps) => {
  const { control, handleSubmit, watch, setValue, reset, getValues } =
    useForm<ChallengeInforForm>({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        title: formData?.title || "",
        description: formData?.description || "",
        thumbnail_image: formData?.thumbnail_image || "",
        thumbnail_image_id: formData?.thumbnail_image_id || "",
        course_id: formData?.course_id || "",
        category_id: formData?.category_id || "",
        num_of_room: formData?.num_of_room || 0,
      },
      resolver: yupResolver(
        basicChallengeFormSchema
      ) as Resolver<ChallengeInforForm>,
    });

  const courseId = watch("course_id");

  const { data: courseDetail, isFetching: isLoadingCourse } =
    useGetCourseDetail(courseId || "");

  const prevCourseIdRef = useRef<string | undefined>(courseId);

  useEffect(() => {
    if (courseId !== prevCourseIdRef.current && courseDetail) {
      reset({
        ...getValues(),
        title: courseDetail.title || "",
        description: courseDetail.description || "",
        category_id: courseDetail.category_id || "",
        thumbnail_image_id: courseDetail.thumbnail_image_id || "",
        thumbnail_image: courseDetail.thumbnail_image || "",
        course_id: courseId,
      });
      sessionStorage.setItem(TOURNAMENT_KEY, JSON.stringify(getValues()));
      prevCourseIdRef.current = courseId;
    }
  }, [courseId, courseDetail, reset, getValues]);

  return {
    control,
    handleSubmit: handleSubmit(handleNextState),
    watch,
    setValue,
    courseId,
    isLoadingCourse,
  };
};
