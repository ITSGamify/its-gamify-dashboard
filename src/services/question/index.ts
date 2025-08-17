import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useQuery } from "@tanstack/react-query";
import { getChallengeQuestions } from "./request";

export interface GetQuestionParams extends PaginationParams {
  courseId?: string;
}

export const useGetChallengeQuestions = (params?: GetQuestionParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.QUESTION.BASE, params],
    queryFn: () => getChallengeQuestions(params),
    enabled: !!params && !!params.courseId,
  });
};
