import { request } from "@config/axios";
import {
  CourseRequestParams,
  GetCourseParams,
  RequestDeleteParams,
  RequestUpdateCourseParams,
} from ".";
import { PaginatedResponse } from "@interfaces/dom/query";
import { getRoute } from "@utils/route";
import { HTTP_METHODS } from "@constants/request";
import { END_POINTS } from "@constants/endpoint";
import { Course } from "@interfaces/api/course";

export const getCourses = async (
  params?: GetCourseParams
): Promise<PaginatedResponse<Course>> => {
  return request({
    url: getRoute(END_POINTS.COURSE.BASE),
    method: HTTP_METHODS.GET,
    params,
  });
};

export const getCourseDetail = async (courseId: string): Promise<Course> => {
  return request({
    url: getRoute(END_POINTS.COURSE.DETAIL, { courseId }),
    method: HTTP_METHODS.GET,
  });
};

export const updateCourse = async (
  payload: RequestUpdateCourseParams
): Promise<Course> => {
  const { id: courseId } = payload;
  return request({
    url: getRoute(END_POINTS.COURSE.DETAIL, { courseId }),
    method: HTTP_METHODS.PUT,
    data: payload,
  });
};

export const createCourse = async (
  payload: CourseRequestParams
): Promise<Course> => {
  return request({
    url: getRoute(END_POINTS.COURSE.BASE),
    method: HTTP_METHODS.POST,
    data: payload,
  });
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  return request({
    url: getRoute(END_POINTS.COURSE.DETAIL, { courseId }),
    method: HTTP_METHODS.DELETE,
  });
};

export const deleteRangeCourse = async (
  payload: RequestDeleteParams
): Promise<void> => {
  const { ids: params } = payload;
  return request({
    url: getRoute(END_POINTS.COURSE.DELETE_RANGE),
    method: HTTP_METHODS.PUT,
    data: params,
  });
};
