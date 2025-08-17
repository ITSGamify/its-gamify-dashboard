import { BASE_KEYS } from "@constants/endpoint";

export const QUERY_KEYS = {
  ROLE: BASE_KEYS.ROLES,
  DEPARTMENT: {
    BASE: BASE_KEYS.DEPARTMENTS,
    STATISTIC: BASE_KEYS.DEPARTMENTS + "/statistics",
  },
  ACCOUNT: {
    BASE: BASE_KEYS.ACCOUNTS,
  },
  COURSE: {
    BASE: BASE_KEYS.COURSES,
    DETAIL: `${BASE_KEYS.COURSES}/:courseId`,
    COURSE_SECTIONS: `${BASE_KEYS.COURSES}/:courseId/course-sections`,
    RE_ACTIVE: `${BASE_KEYS.COURSES}/:courseId/re-active`,
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
  QUESTION: {
    BASE: BASE_KEYS.QUESTION,
  },
};

export const DEFAULT_LIMIT_OPTIONS_PARAMS = 50;
