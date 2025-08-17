import * as yup from "yup";

export interface CategoryFormData {
  name: string;
  description: string;
}

export const categoryFormScheme: yup.ObjectSchema<CategoryFormData> =
  yup.object({
    name: yup.string().required("Nhập tên danh mục"),
    description: yup.string().required("Nhập mô tả"),
  });
