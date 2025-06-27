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
    full_name: yup.string().required("Nhập tên tài khoản"),
    email: yup.string().email("Email không hợp lệ").required("Nhập email"),
    role_id: yup.string().required("Chọn quyền hạn"),
    department_id: yup.string().required("Chọn phòng ban"),
    password: yup
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
      .required("Nhập mật khẩu"),
  });
