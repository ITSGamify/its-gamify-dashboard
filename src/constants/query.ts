import { BASE_KEYS } from "@constants/endpoint";

export const QUERY_KEYS = {
  ROLE: BASE_KEYS.ROLES,
  DEPARTMENT: {
    BASE: BASE_KEYS.DEPARTMENTS,
  },
  ACCOUNT: {
    BASE: BASE_KEYS.ACCOUNTS,
  },
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
  },
  CATEGORIES: {
    BASE: BASE_KEYS.CATEGORIES,
  },
  QUATER: {
    BASE: BASE_KEYS.QUATER,
  },
  CHALLENGE: {
    BASE: BASE_KEYS.CHALLENGE,
    DETAIL: `${BASE_KEYS.CHALLENGE}/:challengeId`,
  },
};

export const DEFAULT_LIMIT_OPTIONS_PARAMS = 50;
