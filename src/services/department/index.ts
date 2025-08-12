import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createDepartment,
  deleteDepartment,
  deleteRangeDepartment,
  getDepartments,
  updateDepartment,
  getStatistics,
} from "./request";

export interface GetDepartmentParams extends PaginationParams {
  name?: string;
}

export interface RequestDeleteParams {
  ids: string[];
}

export interface RequestDepartmentsParams {
  name: string;
  description?: string;
  location?: string;
}

export interface RequestUpdateDepartmentsParams
  extends RequestDepartmentsParams {
  id: string;
}

export interface GetStatisticParams extends PaginationParams {
  quarterId?: string;
}

export const useGetStatistics = (params?: GetStatisticParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENT.STATISTIC, params],
    queryFn: () => getStatistics(params),
    enabled: !!params && !!params.quarterId,
  });
};
export const useGetDeparments = (params?: GetDepartmentParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DEPARTMENT.BASE, params],
    queryFn: () => getDepartments(params),
    enabled: !!params,
  });
};

export const useCreateDepartment = () => {
  return useMutation({
    mutationFn: (data: RequestDepartmentsParams) => createDepartment(data),
  });
};

export const useUpdateDepartment = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateDepartmentsParams) =>
      updateDepartment(data),
    onSuccess,
  });
};

export const useDeleteDepartment = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteDepartment,
    onSuccess,
  });
};

export const useDeleteRangeDepartments = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteRangeDepartment,
    onSuccess,
  });
};
