import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./request";

export interface GetCategoryParams extends PaginationParams {
  name?: string;
}

export const useGetCategories = (params?: GetCategoryParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES.BASE, params],
    queryFn: () => getCategories(params),
    enabled: !!params,
  });
};
