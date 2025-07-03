import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCourse,
  deleteCourse,
  deleteRangeCourse,
  getCourseDetail,
  getCourses,
  updateCourse,
} from "./request";
import { Module } from "@interfaces/dom/course";

export interface GetCourseParams extends PaginationParams {
  department?: string;
}

export interface RequestDeleteParams {
  ids: string[];
}

//Create
export interface CourseRequestParams {
  title?: string;
  short_description?: string;
  description?: string;
  thumbnail_image_id?: string;
  introduction_video_id?: string;
  classify?: string;
  department_id?: string | null;
  category_id?: string;
  tags?: string[];
  modules?: Module[];
  file_ids?: string[];
  requirement?: string;
  targets?: string[];
}

//update
export interface RequestUpdateCourseParams extends CourseRequestParams {
  id: string;
  current_step: string;
}

export const useGetCourses = (params?: GetCourseParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.BASE, params],
    queryFn: () => getCourses(params),
    enabled: !!params,
  });
};

export const useGetCourseDetail = (courseId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.DETAIL, courseId],
    queryFn: () => getCourseDetail(courseId),
    enabled: !!courseId,
  });
};

export const useUpdateCourse = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: RequestUpdateCourseParams) => updateCourse(payload),
    onSuccess,
  });
};

export const useCreateCourse = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: CourseRequestParams) => createCourse(payload),
    onSuccess,
  });
};

export const useDeleteCourse = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteCourse,
    onSuccess,
  });
};

export const useDeleteRangeCourses = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: deleteRangeCourse,
    onSuccess,
  });
};
