import { request } from "@config/axios";

import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { RequestMaterialParams } from ".";
import { Material } from "@interfaces/api/course";

export const createMaterial = async (
  data: RequestMaterialParams
): Promise<Material> => {
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
  formData.append("CourseId", data.CourseId);

  return request({
    url: getRoute(END_POINTS.MATERIALS.BASE),
    method: HTTP_METHODS.POST,
    headers: { "Content-Type": "multipart/form-data" },
    data: formData,
  });
};

export const deleteMaterial = async (materialId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.MATERIALS.DETAIL, { materialId }),
    method: HTTP_METHODS.DELETE,
  });
};
