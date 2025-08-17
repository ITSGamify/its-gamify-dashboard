import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { Category } from "@interfaces/api/category";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import {
  CategoryReActiveParams,
  GetCategoryParams,
  RequestCategoryParams,
  RequestDeleteParams,
  RequestUpdateCategoryParams,
} from ".";

export const getCategories = async (
  params?: GetCategoryParams
): Promise<PaginatedResponse<Category>> => {
  return request({
    url: getRoute(END_POINTS.CATEGORIES.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const reActiveCategory = async (
  payload: CategoryReActiveParams
): Promise<void> => {
  const { id: categoryId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.CATEGORIES.RE_ACTIVE, { categoryId }),
    method: HTTP_METHODS.PUT,
    data: data,
  });
};

export const createCategory = async (
  payload: RequestCategoryParams
): Promise<Category> => {
  return request({
    url: getRoute(END_POINTS.CATEGORIES.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const updateCategory = async (
  payload: RequestUpdateCategoryParams
): Promise<void> => {
  const { id: categoryId } = payload;
  return request({
    url: getRoute(END_POINTS.CATEGORIES.DETAIL, { categoryId }),
    method: HTTP_METHODS.PUT,
    data: payload,
  });
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.CATEGORIES.DETAIL, { categoryId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeCategory = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.CATEGORIES.DELETE_RANGE),
    method: HTTP_METHODS.DELETE,
    data: params,
  });
};
