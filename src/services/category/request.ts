import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { Category } from "@interfaces/api/category";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetCategoryParams } from ".";

export const getCategories = async (
  params?: GetCategoryParams
): Promise<PaginatedResponse<Category>> => {
  return request({
    url: getRoute(END_POINTS.CATEGORIES.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
