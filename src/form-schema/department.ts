import * as yup from "yup";

export interface DepartmentsFormData {
  name: string;
  description?: string;
  location?: string;
}

export const departmentFormScheme: yup.ObjectSchema<DepartmentsFormData> =
  yup.object({
    name: yup
      .string()
      .required("Nhập tên phòng ban")
      .max(50, "Tên phòng ban không được vượt quá 50 ký tự"),
    location: yup.string().optional(),
    description: yup.string().optional(),
  });
