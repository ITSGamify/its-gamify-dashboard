import * as yup from "yup";

export interface DepartmentsFormData {
  name: string;
  description?: string;
  location: string;
}

export const departmentFormScheme: yup.ObjectSchema<DepartmentsFormData> =
  yup.object({
    name: yup.string().required("Nhập tên phòng ban"),
    location: yup.string().required("Nhập địa điểm "),
    description: yup.string().optional(),
  });
