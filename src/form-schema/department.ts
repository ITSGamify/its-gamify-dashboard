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
      .max(50, "Tên phòng ban không được vượt quá 50 ký tự")
      .test(
        "not-only-spaces",
        "Tên phòng ban không được chỉ chứa khoảng trắng",
        (value) => {
          if (!value) return false; // Trường hợp rỗng
          return value.trim().length > 0; // Phải có ít nhất 1 ký tự không phải khoảng trắng
        }
      )
      .test(
        "no-leading-trailing-spaces",
        "Tên phòng ban không được chứa khoảng trắng ở đầu hoặc cuối",
        (value) => {
          if (!value) return true;
          return value.trim() === value;
        }
      )
      .test(
        "no-consecutive-spaces",
        "Tên phòng ban không được chứa nhiều khoảng trắng liên tiếp",
        (value) => {
          if (!value) return true;
          return !value.includes("  ");
        }
      )
      .test(
        "no-special-chars-at-start",
        "Tên phòng ban không được bắt đầu bằng ký tự đặc biệt",
        (value) => {
          if (!value) return true;
          const trimmedValue = value.trim();
          if (trimmedValue.length === 0) return true;
          
          // Kiểm tra ký tự đầu tiên có phải là ký tự đặc biệt không
          const firstChar = trimmedValue.charAt(0);
          const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
          
          return !specialCharsRegex.test(firstChar);
        }
      ),
    location: yup.string().optional(),
    description: yup.string().optional(),
  });
