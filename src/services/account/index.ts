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
  roleId: string | null;
  departments: string | null;
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

export interface RequestUpdateAccountParams extends Omit<RequestAccountsParams, 'password'> {
  id: string;
  password?: string; // Không bắt buộc khi cập nhật
}

export const useGetAccounts = (params?: GetAccountParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.BASE, params],
    queryFn: () => getAccounts(params),
    enabled: !!params,
  });
};

export const useCreateAccount = (callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
  return useMutation({
    mutationFn: (data: RequestAccountsParams) => createAccount(data),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
  });
};

export const useUpdateAccount = (callbacks?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
  return useMutation({
    mutationFn: (data: RequestUpdateAccountParams) => updateAccount(data),
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError,
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
