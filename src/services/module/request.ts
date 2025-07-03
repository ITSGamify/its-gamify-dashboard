import { Module } from "@interfaces/dom/course";
import { RequestModuleParams } from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";

export const createModule = async (
  payload: RequestModuleParams
): Promise<Module> => {
  return request({
    url: getRoute(END_POINTS.MODULES.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const deleteModule = async (moduleId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.MODULES.DETAIL, { moduleId }),
    method: HTTP_METHODS.DELETE,
  });
};
