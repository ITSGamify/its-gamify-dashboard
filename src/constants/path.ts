const COURSE_PATH = "/courses";

export const PATH = {
  LOGIN: "/login",
  HOME: "/",
  ACCOUNTS: "/accounts",
  DEPARTMENTS: "/departments",
  COURSES: COURSE_PATH,
  COURSES_CREATE: COURSE_PATH + "/create",
  COURSES_EDIT: COURSE_PATH + "/edit/:courseId",
  QUIZ: "/quiz",
  TOURNAMENT: "/tournament",
  FORBIDDEN: "/403",
  NOT_FOUND: "/404",
  INTERNAL_SERVER_ERROR: "/500",
};
