import { QUERY_KEYS } from "@constants/query";
import { useQuery } from "@tanstack/react-query";
import { getRoles } from "./request";

export const useGetRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLE],
    queryFn: () => getRoles(),
  });
};
