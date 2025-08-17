import { Module } from "@interfaces/dom/course";
import * as yup from "yup";

export interface BasicsFormData {
  title: string;
  short_description: string;
  description: string;
  thumbnail_image_id: string;
  introduction_video_id: string;
  classify: string;
  department_ids?: string[] | null;
  category_id: string;
  tags: string[];
  is_optional: boolean;
  quarter_id: string;
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
    title: yup.string().required("Tiêu đề là bắt buộc"),
    short_description: yup.string().required("Mô tả ngắn là bắt buộc"),
    description: yup.string().required("Mô tả là bắt buộc"),
    thumbnail_image_id: yup.string().required("Ảnh thu nhỏ là bắt buộc"),
    introduction_video_id: yup
      .string()
      .required("Video giới thiệu là bắt buộc"),
    classify: yup.string().required("Phân loại là bắt buộc"),
    department_ids: yup.array().of(yup.string().defined()).optional(),
    category_id: yup.string().required("Danh mục là bắt buộc"),
    tags: yup.array().of(yup.string().defined()).required("Thẻ là bắt buộc"),
    quarter_id: yup.string().required("Thời gian áp dụng khóa học là bắt buộc"),
    is_optional: yup
      .boolean()
      .required("Trạng thái tùy chọn là bắt buộc")
      .when("type", {
        is: (type: string) => type === "Leader" || type === "Department",
        then: (schema) =>
          schema.oneOf(
            [false],
            "Trạng thái tùy chọn phải là bắt buộc cho loại Leader và Department"
          ),
      }),
  });

export const learningMaterialsFormSchema: yup.ObjectSchema<LearningMaterialsFormData> =
  yup.object().shape({
    requirement: yup.string().required("Yêu cầu là bắt buộc"),
    targets: yup
      .array()
      .of(yup.string().defined())
      .required("Mục tiêu là bắt buộc"),
  });

export const moduleSchema: yup.ObjectSchema<Module> = yup.object().shape({
  id: yup.string().required("ID là bắt buộc"),
  title: yup.string().required("Tiêu đề là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  course_id: yup.string().required("ID khóa học là bắt buộc"),
  ordered_number: yup.number().required("Số thứ tự là bắt buộc"),
  lessons: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required("ID là bắt buộc"),
        title: yup.string().required("Tiêu đề bài học là bắt buộc"),
        index: yup.number().required("Chỉ mục là bắt buộc"),
        type: yup
          .string()
          .oneOf(["video", "article", "quiz", "practice"])
          .required("Loại bài học là bắt buộc"),
        duration: yup
          .number()
          .typeError("Vui lòng nhập số phút")
          .min(0, "Thời lượng phải lớn hơn không")
          .required("Thời lượng là bắt buộc"),
        content: yup.string().required("Nội dung là bắt buộc"),
        module_id: yup.string().required("ID module là bắt buộc"),
        image_files: yup.array().when("type", {
          is: "article",
          then: (schema) =>
            schema
              .min(1, "Cần ít nhất một hình ảnh cho dạng này")
              .required("Tệp hình ảnh là bắt buộc cho bài học dạng bài viết"),
          otherwise: (schema) => schema.optional(),
        }),
        practices: yup.array().when("type", {
          is: "practice",
          then: (schema) =>
            schema
              .min(1, "Cần ít nhất một thuật ngữ cho dạng này")
              .required("Thuật ngữ là bắt buộc cho bài học dạng bài viết"),
          otherwise: (schema) => schema.optional(),
        }),
        video_url: yup.string().when("type", {
          is: "video",
          then: (schema) =>
            schema.required("URL video là bắt buộc cho bài học dạng video"),
          otherwise: (schema) => schema.optional(),
        }),
        questions: yup.array().when("type", {
          is: "quiz",
          then: (schema) =>
            schema
              .min(1, "Cần ít nhất một câu hỏi cho bài học dạng kiểm tra")
              .required("Câu hỏi là bắt buộc cho bài học dạng kiểm tra"),
          otherwise: (schema) => schema.optional(),
        }),
      })
    )
    .required("Cần ít nhất một bài học"),
});
