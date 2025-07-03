import { useMutation } from "@tanstack/react-query";
import { createMaterial, deleteMaterial } from "./request";

export interface RequestMaterialParams {
  file: File;
  CourseId: string;
}

export const useCreateMaterial = () => {
  return useMutation({
    mutationFn: (data: RequestMaterialParams) => createMaterial(data),
  });
};

export const useDeleteMaterial = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteMaterial,
    onSuccess,
  });
};
