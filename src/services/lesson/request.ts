import { Lesson } from "@interfaces/dom/course";
import { RequestLessonParams } from ".";
import { request } from "@config/axios";
import { getRoute } from "@utils/route";
import { END_POINTS } from "@constants/endpoint";
import { HTTP_METHODS } from "@constants/request";

export const createLesson = async (
  payload: RequestLessonParams
): Promise<Lesson> => {
  return request({
    url: getRoute(END_POINTS.LESSONS.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.LESSONS.DETAIL, { lessonId }),
    method: HTTP_METHODS.DELETE,
  });
};
