import { request } from "@config/axios";

import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import {
  CompleteMultipartUploadModel,
  FileUploadParams,
  GeneratePresignedUrlParam,
  InitiateMultipartUploadParam,
} from ".";
import { StorageFile } from "@interfaces/api/file";

export const fileUpload = async (
  data: FileUploadParams
): Promise<StorageFile> => {
  const fileExtension = data.file.name.split(".").pop()?.toLowerCase();

  if (!fileExtension) {
    throw new Error("File type not allowed.");
  }

  const sanitizedFileName = data.file.name
    .replace(/[^a-zA-Z0-9\u3040-\u30ff\u4e00-\u9faf\uac00-\ud7af.]/gu, "") // Allow letters, numbers, and Japanese characters (Hiragana, Katakana, and Hangul)
    .replace(/\.(?=.*\.)/g, ""); // Remove all dots except the last one
  const newFile = new File([data.file], sanitizedFileName, {
    type: data.file.type,
  });

  const formData = new FormData();
  formData.append("file", newFile);

  return request({
    url: getRoute(END_POINTS.STORAGE_FILES.UPLOAD),
    method: HTTP_METHODS.POST,
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
};

export const initialUpload = async (
  params: InitiateMultipartUploadParam
): Promise<string> => {
  return request({
    url: getRoute(END_POINTS.STORAGE_FILES.INITIAL_UPLOAD),
    method: HTTP_METHODS.POST,
    data: params,
  });
};
export const getPresignUrlUpload = async (
  params: GeneratePresignedUrlParam
): Promise<string> => {
  return request({
    url: getRoute(END_POINTS.STORAGE_FILES.GENERATE_PRESIGNED_URL),
    method: HTTP_METHODS.POST,
    data: params,
  });
};
export const completedUpload = async (
  params: CompleteMultipartUploadModel
): Promise<string> => {
  return request({
    url: getRoute(END_POINTS.STORAGE_FILES.COMPLETED_UPLOAD),
    method: HTTP_METHODS.POST,
    data: params,
  });
};
