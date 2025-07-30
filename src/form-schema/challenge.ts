import * as yup from "yup";

export interface BasicChallengeFormData {
  title: string;
  description: string;
  num_of_room: number;
  thumbnail_image: string;
  course_id: string;
  category_id: string;
  thumbnail_image_id: string;
}

export const basicChallengeFormSchema: yup.ObjectSchema<BasicChallengeFormData> =
  yup.object().shape({
    title: yup.string().required("Tiêu đề là bắt buộc"),
    description: yup.string().required("Mô tả là bắt buộc"),
    category_id: yup.string().required("Thể loại là bắt buộc"),
    thumbnail_image: yup.string().required("Ảnh thu nhỏ là bắt buộc"),
    thumbnail_image_id: yup.string().required("Ảnh thu nhỏ là bắt buộc"),
    num_of_room: yup
      .number()
      .typeError("Số phòng phải là số")
      .required("Số phòng là bắt buộc"),
    course_id: yup.string().required("Khóa học là bắt buộc"),
  });
