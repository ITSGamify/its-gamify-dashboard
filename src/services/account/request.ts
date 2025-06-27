import { request } from "@config/axios";
import {
  GetAccountParams,
  RequestAccountsParams,
  RequestDeleteParams,
} from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { User } from "@interfaces/api/user";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";

export const getAccounts = async (
  params?: GetAccountParams
): Promise<PaginatedResponse<User>> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNT.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const createAccount = async (
  payload: RequestAccountsParams
): Promise<User> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNT.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const updateAccount = async (
  payload: RequestAccountsParams & { id: string }
): Promise<void> => {
  const { id: accountId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.ACCOUNT.BASE, { accountId }),
    method: HTTP_METHODS.PUT,
    data,
  });
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.DETAIL, { accountId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeAccount = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.DEPARTMENT.DELETE_RANGE),
    method: HTTP_METHODS.PUT,
    data: params,
  });
};
