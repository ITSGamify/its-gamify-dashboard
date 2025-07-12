import { useMutation } from "@tanstack/react-query";
import { createModule, deleteModule, updateModule } from "./request";
import { Lesson } from "@interfaces/dom/course";

export interface RequestModuleParams {
  title: string;
  description: string;
  course_id?: string;
  ordered_number?: number;
}

export interface RequestUpdateModuleParams extends RequestModuleParams {
  id: string;
  lessons: Lesson[];
}

export const useCreateModule = () => {
  return useMutation({
    mutationFn: (data: RequestModuleParams) => createModule(data),
  });
};

export const useDeleteModule = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteModule,
    onSuccess,
  });
};

export const useUpdateModule = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestUpdateModuleParams) => updateModule(payload),
    onSuccess,
  });
};
