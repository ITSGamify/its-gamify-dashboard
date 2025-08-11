import { PATH } from "@constants/path";
// import { USER_ROLES } from "@constants/user-role";
import userSession from "@utils/user-session";

import DepartmentPage from "@pages/Department";
import CoursePage from "@pages/Course";
import CourseCreatePage from "@pages/Course/Create";
import LoginPage from "@pages/Login";
// import HomePage from "@pages/Home";
import NotFound404 from "@pages/NotFound404";
import ServerError500 from "@pages/ServerError500";
import Forbidden403 from "@pages/Forbidden403";
import MainLayout from "@components/layout/MainLayout";
import AccountPage from "@pages/Account";

import { ErrorBoundary } from "react-error-boundary";
import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import { JSX } from "react";
import UpdateCoursePage from "@pages/Course/Update";
import TournamentPage from "@pages/Tournament";
import ChallengeUpdatePage from "@pages/Tournament/Update";
import ChallengeCreatePage from "@pages/Tournament/Create";
import StatisticPage from "@pages/Statistic";
import { RoleEnum } from "@interfaces/api/user";
import CourseDetailPage from "@pages/Course/Detail";

// eslint-disable-next-line react-refresh/only-export-components
const ErrorFallback = () => {
  {
    return <ServerError500 />;
  }
};

type ProtectedRouteProps = {
  children: JSX.Element;
  fallbackUrl?: string;
  allowedRoles?: string[];
};

const getRoutes = (routes: RouteObject[]) => {
  return routes.map((route) => ({
    ...route,
    element: (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {route.element}
      </ErrorBoundary>
    ),
  }));
};

// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallbackUrl = PATH.LOGIN,
  allowedRoles = [],
}: ProtectedRouteProps) => {
  const isAuthenticated = userSession.isAuthenticated();
  const userProfile = userSession.getUserProfile();
  const isNotAllowedRole =
    userProfile &&
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(userProfile?.user.role);
  if (!isAuthenticated) {
    return <Navigate to={fallbackUrl} />;
  }

  if (isNotAllowedRole) {
    return <Navigate to="/403" />;
  }

  return children;
};

// eslint-disable-next-line react-refresh/only-export-components
const AuthenticationValidate: React.FC<{
  children: JSX.Element;
  redirectTo?: string;
}> = ({ children, redirectTo = PATH.HOME }) => {
  const isAuthenticated = userSession.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

const router = createBrowserRouter(
  getRoutes([
    {
      path: PATH.NOT_FOUND,
      element: <NotFound404 />,
    },
    {
      path: PATH.FORBIDDEN,
      element: <Forbidden403 />,
    },
    {
      path: PATH.INTERNAL_SERVER_ERROR,
      element: <ServerError500 />,
    },
    {
      path: PATH.LOGIN,
      element: (
        <AuthenticationValidate>
          <LoginPage />
        </AuthenticationValidate>
      ),
    },
    {
      element: (
        <ProtectedRoute
        // allowedRoles={[RoleEnum.ADMIN, RoleEnum.MANAGER, RoleEnum.TRAINER]}
        >
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: PATH.TOURNAMENT,
          element: <TournamentPage />,
        },

        {
          path: PATH.COURSES,
          element: <CoursePage />,
        },
        {
          path: PATH.DEPARTMENTS,
          element: <DepartmentPage />,
        },
        {
          path: PATH.COURSES_DETAIL,
          element: <CourseDetailPage />,
        },
      ],
    },
    {
      element: (
        <ProtectedRoute
        // allowedRoles={[RoleEnum.ADMIN, RoleEnum.MANAGER]}
        >
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: PATH.HOME,
          element: <StatisticPage />,
        },
      ],
    },
    {
      element: (
        <ProtectedRoute
        // allowedRoles={[RoleEnum.TRAINER]}
        >
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: PATH.COURSES_CREATE,
          element: <CourseCreatePage />,
        },
        {
          path: PATH.COURSES_EDIT,
          element: <UpdateCoursePage />,
        },
        {
          path: PATH.TOURNAMENT_EDIT,
          element: <ChallengeUpdatePage />,
        },
        {
          path: PATH.TOURNAMENT_CREATE,
          element: <ChallengeCreatePage />,
        },
      ],
    },
    {
      element: (
        <ProtectedRoute
        // allowedRoles={[RoleEnum.ADMIN]}
        >
          <MainLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: PATH.ACCOUNTS,
          element: <AccountPage />,
        },
      ],
    },
  ])
);

export default router;
