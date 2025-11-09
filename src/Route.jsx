import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import PrivateRoute from "./Pages/PrivateRoute";
import About from "./Pages/About";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import BcsExam from "./Pages/BcsExam/BcsExam";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import BcsSubjectWise from "./Pages/BcsExam/subjectWiseBCS";
import HscExam from "../src/Pages/HscExam/HscExam";
import HscSubjectWiseExam from "./Pages/HscExam/HscSubjectWiseExam";
import BCSOthersExam from "./Pages/BCSOthers/BCSOthersExam";
import HSCOthersExam from "./Pages/HSCOthers/HSCOthersExam";
import BankExam from "./Pages/BankExam/BankExam";
import BankSubjectWise from "./Pages/BankExam/subjectwiseBank";
import LiveExamsPage from "./Pages/LiveExam/liveExams";
import AdminExamCreator from "./Pages/Admin/Exam-Creation/AdminExamCreator";
import LiveExamInterface from "./Pages/LiveExamRoom";
import LiveExamRoom from "./Pages/ExamRoom/LiveExamRoom";
import OthersExamRoom from "./Pages/ExamRoom/OthersExamRoom";
import ExamReview from "./Pages/ExamReview";
import Profile from "./Pages/Profile";
import { i } from "framer-motion/client";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminManagement from "./Pages/Admin/AdminManagement";
import AdminRegistration from "./Pages/Admin/AdminRegistration";
import AdminLogin from "./Pages/Admin/AdminLogin";

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
        path: "/admin/create-exam",
        element: <AdminExamCreator></AdminExamCreator>,
      },
      {
        path: "/Exam/Room/Live",
        element: <LiveExamInterface></LiveExamInterface>,
      },
      {
        path: "/exam/live",
        element: <LiveExamRoom></LiveExamRoom>,
      },
      {
        path: "/exam/practice",
        element: <OthersExamRoom></OthersExamRoom>,
      },
      {
        path: "/Exam/Review",
        element: <ExamReview></ExamReview>,
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
        path: "/admin",
        element: <AdminDashboard></AdminDashboard>,
      },
      {
        path: "/admin/management",
        element: <AdminManagement></AdminManagement>,
      },
      {
        path: "/admin/register",
        element: <AdminRegistration></AdminRegistration>,
      },
      {
        path: "/admin/login",
        element: <AdminLogin></AdminLogin>,
      },
    ],
  },
]);

export default router;
