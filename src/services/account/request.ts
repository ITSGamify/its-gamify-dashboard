import { request } from "@config/axios";
import {
  GetAccountParams,
  RequestAccountsParams,
  RequestUpdateAccountParams,
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
    shouldNotShowError: true, // Không hiển thị toast mặc định, sẽ xử lý riêng
  });
};

export const updateAccount = async (
  payload: RequestUpdateAccountParams
): Promise<void> => {
  const { id: accountId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.ACCOUNT.DETAIL, { accountId }),
    method: HTTP_METHODS.PUT,
    data,
    shouldNotShowError: true, // Không hiển thị toast mặc định, sẽ xử lý riêng
  });
};

export const deleteAccount = async (accountId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.ACCOUNT.DETAIL, { accountId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeAccount = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.ACCOUNT.DELETE_RANGE),
    method: HTTP_METHODS.DELETE,
    data: params,
  });
};
