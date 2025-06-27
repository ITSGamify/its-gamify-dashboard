import { StorageFile } from "@interfaces/api/file";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { fileUpload } from "./request";

export type FileUploadParams = {
  file: File;
};

export const useFileUpload = (
  options?: UseMutationOptions<StorageFile, Error, FileUploadParams, unknown>
) => {
  return useMutation({ mutationFn: fileUpload, ...options });
};
