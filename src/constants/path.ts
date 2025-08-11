const COURSE_PATH = "/courses";

export const PATH = {
  LOGIN: "/login",
  HOME: "/",
  ACCOUNTS: "/accounts",
  DEPARTMENTS: "/departments",
  COURSES: COURSE_PATH,
  COURSES_CREATE: COURSE_PATH + "/create",
  COURSES_EDIT: COURSE_PATH + "/edit/:courseId",
  COURSES_DETAIL: COURSE_PATH + "/:courseId",
  QUIZ: "/quiz",
  TOURNAMENT: "/tournaments",
  TOURNAMENT_DETAIL: "/tournaments/:tournamentId",
  TOURNAMENT_EDIT: "/tournaments/edit/:tournamentId",
  TOURNAMENT_CREATE: "/tournaments/create",
  FORBIDDEN: "/403",
  NOT_FOUND: "/404",
  INTERNAL_SERVER_ERROR: "/500",
  STATISTIC: "/statistics",
};
