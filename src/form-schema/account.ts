import * as yup from "yup";

export interface AccountFormScheme {
  full_name: string;
  email: string;
  role_id: string;
  department_id: string;
  password: string;
  avatar_url?: string;
}

export const accountFormScheme: yup.ObjectSchema<AccountFormScheme> =
  yup.object({
    avatar_url: yup.string().optional(),
    full_name: yup
      .string()
      .required("Nhập tên tài khoản")
      .max(50, "Tên tài khoản không được vượt quá 50 ký tự")
      .test(
        "no-leading-trailing-spaces",
        "Tên tài khoản không được chứa khoảng trắng ở đầu hoặc cuối",
        (value) => {
          if (!value) return true; // Skip if empty (required validation will catch this)
          return value.trim() === value;
        }
      )
      .test(
        "no-consecutive-spaces",
        "Tên tài khoản không được chứa nhiều khoảng trắng liên tiếp",
        (value) => {
          if (!value) return true; // Skip if empty
          return !value.includes("  "); // Check for consecutive spaces
        }
      ),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Nhập email")
      .max(50, "Email không được vượt quá 50 ký tự")
      .test("no-spaces", "Email không được chứa khoảng trắng", (value) => {
        if (!value) return true; // Skip if empty
        return !value.includes(" "); // Email shouldn't contain any spaces
      }),
    role_id: yup.string().required("Chọn quyền hạn"),
    department_id: yup.string().required("Chọn phòng ban"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Nhập mật khẩu")
      .test("no-spaces", "Mật khẩu không được chứa khoảng trắng", (value) => {
        if (!value) return true;
        return !value.includes(" ");
      }),
  });
