import * as yup from "yup";

export interface AuthenticationFormData {
  email: string;
  password: string;
}

export const authenticationFormScheme: yup.ObjectSchema<AuthenticationFormData> =
  yup.object({
    email: yup
      .string()
      .email("Định dạng email không hợp lệ")
      .required("Vui lòng nhập email!"),
    password: yup.string().required("Vui lòng nhập email!"),
  });
