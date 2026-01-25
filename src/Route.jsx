import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import PrivateRoute from "./Pages/PrivateRoute";
import About from "./Pages/About";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import VerifyResetCode from "./Pages/VerifyResetCode/VerifyResetCode";
import SetNewPassword from "./Pages/SetNewPassword/SetNewPassword";
import BcsExam from "./Pages/BcsExam/BcsExam";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import StudentExamReview from "./Pages/StudentDashboard/StudentExamReview";
import StudentLeaderboard from "./Pages/StudentDashboard/StudentLeaderboard";
import BcsSubjectWise from "./Pages/BcsExam/subjectWiseBCS";
import HscExam from "../src/Pages/HscExam/HscExam";
import HscSubjectWiseExam from "./Pages/HscExam/HscSubjectWiseExam";
import BCSOthersExam from "./Pages/BCSOthers/BCSOthersExam";
import HSCOthersExam from "./Pages/HSCOthers/HSCOthersExam";
import BankExam from "./Pages/BankExam/BankExam";
import BankSubjectWise from "./Pages/BankExam/subjectwiseBank";
import LiveExamsPage from "./Pages/LiveExam/liveExams";
import AdminExamCreator from "./Pages/Admin/Exam-Creation/AdminExamCreator";
import LiveExamRoom from "./Pages/ExamRoom/LiveExamRoom";
import OthersExamRoom from "./Pages/ExamRoom/OthersExamRoom";
import ExamReview from "./Pages/ExamReview";
import Profile from "./Pages/Profile";
import { i } from "framer-motion/client";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminManagement from "./Pages/Admin/AdminManagement";
import AdminRegistration from "./Pages/Admin/AdminRegistration";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminPrivateRoute from "./Pages/AdminPrivateRoute";
import ExamHistory from "./Pages/Admin/ExamHistory";
import ExamRanking from "./Pages/Admin/ExamRanking";
import UserProfile from "./Pages/UserProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <StudentDashboard></StudentDashboard>,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/verify-reset-code",
        element: <VerifyResetCode />,
      },
      {
        path: "/set-new-password",
        element: <SetNewPassword />,
      },
      {
        path: "/bcs/all-questions",
        element: <BcsExam></BcsExam>,
      },
      {
        path: "/bcs/subjectwise",
        element: <BcsSubjectWise></BcsSubjectWise>,
      },
      {
        path: "/bank/all-questions",
        element: <BankExam></BankExam>,
      },
      {
        path: "/bank/subjectwise",
        element: <BankSubjectWise></BankSubjectWise>,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/hsc/all-questions",
        element: <HscExam></HscExam>,
      },
      {
        path: "/hsc/subjectwise",
        element: <HscSubjectWiseExam></HscSubjectWiseExam>,
      },
      {
        path: "/BCSOthersExam",
        element: <BCSOthersExam></BCSOthersExam>,
      },
      {
        path: "/HSCOthersExam",
        element: <HSCOthersExam></HSCOthersExam>,
      },
      {
        path: "/LiveExams",
        element: <LiveExamsPage></LiveExamsPage>,
      },
      {
        path: "/exam/live",
        element: (
          <PrivateRoute>
            <LiveExamRoom />
          </PrivateRoute>
        ),
      },
      {
        path: "/exam/practice",
        element: (
          <PrivateRoute>
            <OthersExamRoom />
          </PrivateRoute>
        ),
      },
      {
        path: "/exam/review",
        element: (
          <PrivateRoute>
            <ExamReview />
          </PrivateRoute>
        ),
      },

      {
        path: "/Profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/user-profile",
        element: <UserProfile />,
      },
      {
        path: "/admin",
        element: (
          <AdminPrivateRoute>
            <AdminDashboard />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/admin/management",
        element: (
          <AdminPrivateRoute>
            <AdminManagement />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/admin/create-exam",
        element: (
          <AdminPrivateRoute>
            <AdminExamCreator />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/admin/register",
        element: <AdminRegistration></AdminRegistration>,
      },
      {
        path: "/admin/login",
        element: <AdminLogin></AdminLogin>,
      },
      {
        path: "/admin/exam-history",
        element: (
          <AdminPrivateRoute>
            <ExamHistory />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/admin/exam-history/:examId/ranking",
        element: (
          <AdminPrivateRoute>
            <ExamRanking />
          </AdminPrivateRoute>
        ),
      },
      {
        path: "/student/dashboard",
        element: (
          <PrivateRoute>
            <StudentDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/student/exam-review/:submissionId",
        element: (
          <PrivateRoute>
            <StudentExamReview />
          </PrivateRoute>
        ),
      },
      {
        path: "/student/leaderboard/:examId",
        element: (
          <PrivateRoute>
            <StudentLeaderboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
