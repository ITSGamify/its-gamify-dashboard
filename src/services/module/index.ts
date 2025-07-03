import { useMutation } from "@tanstack/react-query";
import { createModule, deleteModule } from "./request";

export interface RequestModuleParams {
  title: string;
  description: string;
  course_id?: string;
  ordered_number?: number;
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
