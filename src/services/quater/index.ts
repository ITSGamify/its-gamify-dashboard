import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getQuaters } from "./request";

export interface GetQuaterParams extends PaginationParams {
  name?: string;
}

export const useGetQuaters = (params?: GetQuaterParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUATER.BASE, params],
    queryFn: () => getQuaters(params),
    enabled: !!params,
  });
};
