import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createAccount,
  deleteAccount,
  deleteRangeAccount,
  getAccounts,
  updateAccount,
} from "./request";

export interface GetAccountParams extends PaginationParams {
  role?: string;
  status?: string;
}
export interface RequestDeleteParams {
  ids: string[];
}

export interface RequestAccountsParams {
  full_name: string;
  email: string;
  role_id: string;
  department_id: string;
  password: string;
  avatar_url: string;
}

export interface RequestUpdateAccountParams extends RequestAccountsParams {
  id: string;
}

export const useGetAccounts = (params?: GetAccountParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.BASE, params],
    queryFn: () => getAccounts(params),
    enabled: !!params,
  });
};

export const useCreateAccount = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestAccountsParams) => createAccount(data),
    onSuccess,
  });
};
export const useUpdateAccount = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateAccountParams) => updateAccount(data),
    onSuccess,
  });
};

export const useDeleteAccount = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess,
  });
};

export const useDeleteRangeAccounts = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteRangeAccount,
    onSuccess,
  });
};
