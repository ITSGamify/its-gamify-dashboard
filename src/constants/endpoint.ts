export const BASE_KEYS = {
  DEPARTMENTS: "departments",
  ACCOUNTS: "users",
  COURSES: "courses",
  ROLES: "roles",
  STORAGE_FILES: "files",
  CATEGORIES: "categories",
  MODULES: "course-sections",
  LESSONS: "lessons",
  MATERIALS: "learning-materials",
  QUATER: "quarters",
  CHALLENGE: "challenges",
};

export const END_POINTS = {
  LOGIN: "/auth",
  LOGOUT: "/auth/logout",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  CHECK_AUTH_STATUS: "/auth/check-auth-status",
  GET_USER_INFO: "/user/info",
  UPDATE_USER_INFO: "/user/update",
  CHANGE_PASSWORD: "/user/change-password",
  UPLOAD_AVATAR: "/user/upload-avatar",
  ROLES: BASE_KEYS.ROLES,
  DEPARTMENT: {
    BASE: BASE_KEYS.DEPARTMENTS,
    DETAIL: `${BASE_KEYS.DEPARTMENTS}/:departmentId`,
    DELETE_RANGE: `${BASE_KEYS.DEPARTMENTS}/delete-range`,
    STATISTIC: BASE_KEYS.DEPARTMENTS + "/statistics",
  },
  ACCOUNT: {
    BASE: BASE_KEYS.ACCOUNTS,
    DETAIL: `${BASE_KEYS.ACCOUNTS}/:accountId`,
    DELETE_RANGE: `${BASE_KEYS.ACCOUNTS}/delete-range`,
  },
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    DELETE_RANGE: `${BASE_KEYS.COURSES}/delete-range`,
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
  },
  CATEGORIES: {
    BASE: BASE_KEYS.CATEGORIES,
  },
  QUATER: {
    BASE: BASE_KEYS.QUATER,
  },
  STORAGE_FILES: {
    UPLOAD: `${BASE_KEYS.STORAGE_FILES}`,
    INITIAL_UPLOAD: `${BASE_KEYS.STORAGE_FILES}/s3/initiate-upload`,
    GENERATE_PRESIGNED_URL: `${BASE_KEYS.STORAGE_FILES}/s3/generate-presigned-url`,
    COMPLETED_UPLOAD: `${BASE_KEYS.STORAGE_FILES}/s3/complete-upload`,
  },
  MODULES: {
    BASE: BASE_KEYS.MODULES,
    DETAIL: `${BASE_KEYS.MODULES}/:moduleId`,
  },
  LESSONS: {
    BASE: BASE_KEYS.LESSONS,
    DETAIL: `${BASE_KEYS.LESSONS}/:lessonId`,
  },
  MATERIALS: {
    BASE: BASE_KEYS.MATERIALS,
    DETAIL: `${BASE_KEYS.MATERIALS}/:materialId`,
  },
  CHALLENGE: {
    BASE: BASE_KEYS.CHALLENGE,
    DETAIL: `${BASE_KEYS.CHALLENGE}/:challengeId`,
    DELETE_RANGE: `${BASE_KEYS.CHALLENGE}/delete-range`,
  },
};
