import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getChallenges,
  getChallengeDetail,
  deleteChallenge,
  deleteRangeChallenges,
  createChallenge,
  updateChallenge,
  reActiveChallenge,
} from "./request";
import { QuizQuestion } from "@interfaces/dom/course";

export interface RequestChallengeParams {
  title: string;
  description: string;
  num_of_room: number;
  thumbnail_image: string;
  thumbnail_image_id: string;
  course_id: string;
  category_id: string;
  isActive: string;
  updated_questions: QuizQuestion[];
  new_questions: QuizQuestion[];
}

export interface RequestUpdateChallengeParams extends RequestChallengeParams {
  id: string;
}

export interface GetChallengeParams extends PaginationParams {
  categories: string | null;
}

export interface RequestDeleteParams {
  ids: string[];
}

export interface ChallengeReActiveParams {
  id: string;
  is_active: boolean;
}

export const useGetChallenges = (params?: GetChallengeParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.BASE, params],
    queryFn: () => getChallenges(params),
    enabled: !!params,
  });
};

export const useGetChallengeDetail = (challengeId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CHALLENGE.DETAIL, challengeId],
    queryFn: () => getChallengeDetail(challengeId),
    enabled: !!challengeId,
  });
};

export const useDeleteChallenge = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteChallenge,
    onSuccess,
  });
};

export const useDeleteRangeChallenges = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteRangeChallenges,
    onSuccess,
  });
};

export const useCreateChallenge = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestChallengeParams) => createChallenge(data),
    onSuccess,
  });
};
export const useUpdateChallenge = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (data: RequestUpdateChallengeParams) => updateChallenge(data),
    onSuccess,
  });
};

export const useReActiveChallenge = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: ChallengeReActiveParams) =>
      reActiveChallenge(payload),
    onSuccess,
  });
};
