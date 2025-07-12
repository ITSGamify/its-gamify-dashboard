import { Module } from "@interfaces/dom/course";
import * as yup from "yup";

export interface BasicsFormData {
  title: string;
  short_description: string;
  description: string;
  thumbnail_image_id: string;
  introduction_video_id: string;
  classify: string;
  department_id?: string | null;
  category_id: string;
  tags: string[];
}

export interface CourseContentFormData {
  modules: Module[];
}

export interface LearningMaterialsFormData {
  requirement: string;
  targets: string[];
}

export const basicFormSchema: yup.ObjectSchema<BasicsFormData> = yup
  .object()
  .shape({
    title: yup.string().required("Title is required"),
    short_description: yup.string().required("Short description is required"),
    description: yup.string().required(),
    thumbnail_image_id: yup.string().required(),
    introduction_video_id: yup.string().required(),
    classify: yup.string().required(),
    department_id: yup.string().nullable().optional(),
    category_id: yup.string().required(),
    tags: yup.array().of(yup.string().defined()).required(),
  });

export const moduleSchema = (): yup.ObjectSchema<Module> =>
  yup.object().shape({
    id: yup.string().required(),
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    course_id: yup.string().required(),
    ordered_number: yup.number().required(),
    lessons: yup
      .array()
      .of(
        yup.object().shape({
          id: yup.string().required(),
          title: yup.string().required("Lesson title is required"),
          index: yup.number().required(),
          type: yup
            .string()
            .oneOf(["video", "article", "quiz"])
            .required("Lesson type is required"),
          duration: yup.number().required("Duration is required"),
          content: yup.string().required("Content is required"),
          module_id: yup.string().required("Content is required"),
          image_files: yup.array().required(),
          video_url: yup.string().when("type", {
            is: "video",
            then: (schema) =>
              schema.required("Video URL is required for video lessons"),
            otherwise: (schema) => schema.optional(),
          }),
        })
      )
      .required("At least one lesson is required"),
  });

export const courseContentSchema = yup.object().shape({
  modules: yup.array().of(moduleSchema()).default([]),
});

export const learningMaterialsFormSchema: yup.ObjectSchema<LearningMaterialsFormData> =
  yup.object().shape({
    requirement: yup.string().required("Title is required"),
    targets: yup.array().of(yup.string().defined()).required(),
  });

export const moduleSchema2: yup.ObjectSchema<Module> = yup.object().shape({
  id: yup.string().required(),
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  course_id: yup.string().required(),
  ordered_number: yup.number().required(),
  lessons: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required(),
        title: yup.string().required("Lesson title is required"),
        index: yup.number().required(),
        type: yup
          .string()
          .oneOf(["video", "article", "quiz"])
          .required("Lesson type is required"),
        duration: yup.number().required("Duration is required"),
        content: yup.string().required("Content is required"),
        module_id: yup.string().required("Content is required"),
        image_files: yup.array().required(),
        video_url: yup.string().when("type", {
          is: "video",
          then: (schema) =>
            schema.required("Video URL is required for video lessons"),
          otherwise: (schema) => schema.optional(),
        }),
      })
    )
    .required("At least one lesson is required"),
});
