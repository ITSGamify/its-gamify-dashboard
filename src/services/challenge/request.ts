import { END_POINTS } from "@constants/endpoint";
import {
  GetChallengeParams,
  RequestChallengeParams,
  RequestDeleteParams,
  RequestUpdateChallengeParams,
} from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { Challenge } from "@interfaces/api/challenge";

export const getChallenges = async (
  params?: GetChallengeParams
): Promise<PaginatedResponse<Challenge>> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const getChallengeDetail = async (
  challengeId: string
): Promise<Challenge> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.DETAIL, { challengeId }),
    method: HTTP_METHODS.GET,
  });
};

export const deleteChallenge = async (challengeId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.DETAIL, { challengeId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeChallenges = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.CHALLENGE.DELETE_RANGE),
    method: HTTP_METHODS.PUT,
    data: params,
  });
};

export const createChallenge = async (
  payload: RequestChallengeParams
): Promise<Challenge> => {
  return request({
    url: getRoute(END_POINTS.CHALLENGE.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const updateChallenge = async (
  payload: RequestUpdateChallengeParams & { id: string }
): Promise<void> => {
  const { id: challengeId, ...data } = payload;
  return request({
    url: getRoute(END_POINTS.CHALLENGE.DETAIL, { challengeId }),
    method: HTTP_METHODS.PUT,
    data,
  });
};
