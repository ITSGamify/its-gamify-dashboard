import { QUERY_KEYS } from "@constants/query";
import { PaginationParams } from "@interfaces/dom/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCourse,
  deleteCourse,
  deleteRangeCourse,
  getCourseDetail,
  getCourseModules,
  getCourses,
  updateCourse,
  reActiveCourse,
} from "./request";
import { Module } from "@interfaces/dom/course";

export interface GetCourseParams extends PaginationParams {
  department?: string;
  isActive: string;
  categories: string | null;
  courseTypes: string | null;
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
  department_ids?: string[] | null;
  category_id?: string;
  tags?: string[];
  modules?: Module[];
  file_ids?: string[];
  requirement?: string;
  targets?: string[];
  is_update_module: boolean;
  is_update_department: boolean;
  drafted: boolean;
  is_optional?: boolean;
  quarter_id?: string;
}

//update
export interface RequestUpdateCourseParams extends CourseRequestParams {
  id: string;
  current_step: string;
}
export interface CourseReActiveParams {
  id: string;
  is_active: boolean;
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
export const useReActiveCourse = (onSuccess?: () => void) => {
  return useMutation({
    mutationFn: (payload: CourseReActiveParams) => reActiveCourse(payload),
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

export const useGetCourseModules = (courseId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE.COURSE_SECTIONS, courseId],
    queryFn: () => getCourseModules(courseId),
    enabled: !!courseId,
  });
};
