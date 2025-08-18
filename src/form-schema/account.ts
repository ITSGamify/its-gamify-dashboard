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
      .max(50, "Tên tài khoản không được vượt quá 50 ký tự"),
    email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Nhập email")
      .max(50, "Email không được vượt quá 50 ký tự"),
    role_id: yup.string().required("Chọn quyền hạn"),
    department_id: yup.string().required("Chọn phòng ban"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Nhập mật khẩu"),
  });
