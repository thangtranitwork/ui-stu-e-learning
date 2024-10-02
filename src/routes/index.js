import {
  LoginPage,
  HomePage,
  RegisterPage,
  EditProfilePage,
  LogoutPage,
  QuizzesPage,
  QuizPage,
  QuizCreatePage,
  CoursesPage,
  CourseDetailPage,
  LessonDetailPage,
  HandleVerifyEmail,
  ForgotPasswordPage,
  CourseCreatePage,
  EditCoursePage,
  PostsPage,
  PostPage,
  FriendsPage,
  LessonCreate,
  AdminPage,
  ChatPage,
} from "../pages";

import { DefaultLayout } from "../components/Layout";
import UserDetail from "../pages/UserDetail";

export const publicRoutes = [
  {
    path: "/",
    component: HomePage,
    layout: DefaultLayout,
  },
  {
    path: "/login",
    component: LoginPage,
  },
  {
    path: "/register",
    component: RegisterPage,
  },
  {
    path: "/forgot-password",
    component: ForgotPasswordPage,
  },
  {
    path: "/register/:code",
    component: HandleVerifyEmail,
  },
  {
    path: "/profile",
    component: UserDetail,
    layout: DefaultLayout,
  },
  {
    path: "/profile/edit",
    component: EditProfilePage,
    layout: DefaultLayout,
  },
  {
    path: "/logout",
    component: LogoutPage,
    layout: DefaultLayout,
  },
  {
    path: "/quizzes",
    component: QuizzesPage,
    layout: DefaultLayout,
  },
  {
    path: "/quizzes/new",
    component: QuizCreatePage,
    layout: DefaultLayout,
  },
  {
    path: "/quizzes/:quizId",
    component: QuizPage,
    layout: DefaultLayout,
  },
  {
    path: "/courses",
    component: CoursesPage,
    layout: DefaultLayout,
  },
  {
    path: "/courses/new",
    component: CourseCreatePage,
    layout: DefaultLayout,
  },
  {
    path: "/courses/:courseId/edit",
    component: EditCoursePage,
    layout: DefaultLayout,
  },
  {
    path: "/courses/:courseId", // Thêm route cho trang chi tiết khóa học
    component: CourseDetailPage,
    layout: DefaultLayout,
  },
  {
    path: "/courses/:courseId/lessons/:lessonId",
    component: LessonDetailPage,
    layout: DefaultLayout,
  },
  {
    path: "/users/:id",
    component: UserDetail,
    layout: DefaultLayout,
  },
  {
    path: "/posts",
    component: PostsPage,
    layout: DefaultLayout,
  },
  {
    path: "/posts/:postId",
    component: PostPage,
    layout: DefaultLayout,
  },
  {
    path: "/friends",
    component: FriendsPage,
    layout: DefaultLayout,
  },

  {
    path: "/courses/:courseId/new",
    component: LessonCreate,
    layout: DefaultLayout,
  },
  {
    path: "/admin",
    component: AdminPage,
    layout: DefaultLayout,
  },
  {
    path: "/chat/:targetUserId",
    component: ChatPage,
    layout: DefaultLayout,
  },
];
