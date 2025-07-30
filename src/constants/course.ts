export const INITIAL_CREATE_STEP = 0;
export const CONTENT_STEP = 1;
export const MATERIAL_STEP = 2;
export const CONFIRMING_DETAILS_STEP = 3;
import { OptionField } from "@hooks/shared/useGetOptions";
import { Course } from "@interfaces/api/course";

export const STEPS = [
  "Thông tin cơ bản",
  "Nội dung khóa học",
  "Tài liệu học tập",
  "Xem trước & Xuất bản",
];

export const LEADER_ONLY = "0";
export const DEPARTMENT_ONLY = "1";
export const ALL = "2";

export const INITIAL = "INITIAL";
export const CONTENT = "CONTENT";
export const MATERIAL = "MATERIAL";
export const CONFIRM = "CONFIRM";
export const PUBLISHED = "PUBLISHED";

export const courseOptionField: OptionField<Course> = {
  labelField: "title",
  valueField: "id",
};
