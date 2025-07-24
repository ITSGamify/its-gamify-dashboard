import { StorageFile } from "@interfaces/api/file";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  completedUpload,
  fileUpload,
  getPresignUrlUpload,
  initialUpload,
} from "./request";

export type FileUploadParams = {
  file: File;
};

export interface InitiateMultipartUploadParam {
  file_name: string;
}

export interface GeneratePresignedUrlParam
  extends InitiateMultipartUploadParam {
  upload_id: string;
  part_number: number;
}

export interface PartETag {
  part_number: number;
  e_tag: string;
}
export interface CompleteMultipartUploadModel {
  file_name: string;
  upload_id: string;
  part_e_tags: PartETag[];
}

export const useFileUpload = (
  options?: UseMutationOptions<StorageFile, Error, FileUploadParams, unknown>
) => {
  return useMutation({ mutationFn: fileUpload, ...options });
};

export const useS3InitialUpload = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (params: InitiateMultipartUploadParam) => initialUpload(params),
    onSuccess,
  });
};
export const useS3GetPresignUrlUpload = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (params: GeneratePresignedUrlParam) =>
      getPresignUrlUpload(params),
    onSuccess,
  });
};
export const useS3CompletedUpload = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (params: CompleteMultipartUploadModel) =>
      completedUpload(params),
    onSuccess,
  });
};
