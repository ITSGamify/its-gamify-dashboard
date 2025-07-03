import { useMutation } from "@tanstack/react-query";
import { createLesson, deleteLesson } from "./request";
import { LessonType } from "@interfaces/dom/course";

export interface RequestLessonParams {
  title: string;
  content: string;
  module_id?: string | null;
  type: LessonType;
  duration: number;
  index: number;
}

export const useCreateLesson = () => {
  return useMutation({
    mutationFn: (data: RequestLessonParams) => createLesson(data),
  });
};

export const useDeleteLesson = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteLesson,
    onSuccess,
  });
};
