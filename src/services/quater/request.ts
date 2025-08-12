import { request } from "@config/axios";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { GetQuaterParams } from ".";
import { Quarter } from "@interfaces/api/course";

export const getQuaters = async (
  params?: GetQuaterParams
): Promise<PaginatedResponse<Quarter>> => {
  return request({
    url: getRoute(END_POINTS.QUATER.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};
