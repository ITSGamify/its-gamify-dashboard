import { request } from "@config/axios";
import {
  GetDepartmentParams,
  RequestDeleteParams,
  RequestDepartmentsParams,
  RequestUpdateDepartmentsParams,
} from ".";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { Department } from "@interfaces/api/department";

export const getDepartments = async (
  params?: GetDepartmentParams
): Promise<PaginatedResponse<Department>> => {
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const createDepartment = async (
  payload: RequestDepartmentsParams
): Promise<Department> => {
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const updateDepartment = async (
  payload: RequestUpdateDepartmentsParams
): Promise<void> => {
  const { id: departmentId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.DETAIL, { departmentId }),
    method: HTTP_METHODS.PUT,
    data,
  });
};

export const deleteDepartment = async (departmentId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.DETAIL, { departmentId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeDepartment = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.DELETE_RANGE),
    method: HTTP_METHODS.PUT,
    data: params,
  });
};
