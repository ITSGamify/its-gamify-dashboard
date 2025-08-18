import * as yup from "yup";

export interface CategoryFormData {
  name: string;
  description: string;
}

export const categoryFormScheme: yup.ObjectSchema<CategoryFormData> =
  yup.object({
    name: yup
      .string()
      .required("Nhập tên danh mục")
      .test(
        "no-leading-trailing-spaces",
        "Tên danh mục không được chứa khoảng trắng ở đầu hoặc cuối",
        (value) => {
          if (!value) return true; // Skip if empty (required validation will catch this)
          return value.trim() === value;
        }
      )
      .test(
        "no-consecutive-spaces",
        "Tên danh mục không được chứa nhiều khoảng trắng liên tiếp",
        (value) => {
          if (!value) return true; // Skip if empty
          return !value.includes("  "); // Check for consecutive spaces
        }
      ),
    description: yup
      .string()
      .required("Nhập mô tả")
      .test(
        "no-leading-trailing-spaces",
        "Mô tả không được chứa khoảng trắng ở đầu hoặc cuối",
        (value) => {
          if (!value) return true; // Skip if empty (required validation will catch this)
          return value.trim() === value;
        }
      )
      .test(
        "no-consecutive-spaces",
        "Mô tả không được chứa nhiều khoảng trắng liên tiếp",
        (value) => {
          if (!value) return true; // Skip if empty
          return !value.includes("  "); // Check for consecutive spaces
        }
      ),
  });
