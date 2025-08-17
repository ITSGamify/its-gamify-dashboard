import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCategories,
  reActiveCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  deleteRangeCategory,
} from "./request";

export interface GetCategoryParams extends PaginationParams {
  name?: string;
  isActive?: string;
}
export interface CategoryReActiveParams {
  id: string;
  is_active: boolean;
}

export interface RequestCategoryParams {
  name: string;
  description: string;
}

export interface RequestUpdateCategoryParams extends RequestCategoryParams {
  id: string;
}
export interface RequestDeleteParams {
  ids: string[];
}
export const useGetCategories = (params?: GetCategoryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES.BASE, params],
    queryFn: () => getCategories(params),
    enabled: !!params,
  });
};

export const useReActiveCategory = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: CategoryReActiveParams) => reActiveCategory(payload),
    onSuccess,
  });
};

export const useCreateCategory = () => {
  return useMutation({
    mutationFn: (data: RequestCategoryParams) => createCategory(data),
  });
};

export const useUpdateCategory = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateCategoryParams) => updateCategory(data),
    onSuccess,
  });
};

export const useDeleteCategory = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteCategory,
    onSuccess,
  });
};

export const useDeleteRangeCategories = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteRangeCategory,
    onSuccess,
  });
};
