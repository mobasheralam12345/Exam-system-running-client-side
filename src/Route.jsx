import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Pages/MainLayout";
import Home from "./Pages/Home";
import PrivateRoute from "./Pages/PrivateRoute";
import About from "./Pages/About";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Exam from "./Pages/Exam/Exam";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import SubjectWiseExam from "./Pages/SubjectWiseExam/SubjectWise-Exam";
import HscExam from "../src/Pages/HscExam/HscExam";
import HscSubjectWiseExam from "./Pages/HscExam/HscSubjectWiseExam";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AddBCS from "./Pages/AdminDashboard/BCSExamAdmin";
import AddHSC from "./Pages/AdminDashboard/HSCExam";
import AdminHomePage from "./Pages/AdminDashboard/AdminHomePage";
import AddBCSOthers from "./Pages/AdminDashboard/bcsOthers";
import BCSOthersExam from "./Pages/BCSOthers/BCSOthersExam";
import AddHSCOthers from "./Pages/AdminDashboard/hscOthers";
import HSCOthersExam from "./Pages/HSCOthers/HSCOthersExam";

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
        path: "/exam",
        element: (
          <PrivateRoute>
            <Exam />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/subjectwise-exam",
        element: (
          <PrivateRoute>
            <SubjectWiseExam />
          </PrivateRoute>
        ),
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
        path: "/admin",
        element: <AdminLogin></AdminLogin>,
      },
      {
        path: "/admin/BCS",
        element: <AddBCS></AddBCS>,
      },
      {
        path: "/admin/HSC",
        element: <AddHSC></AddHSC>,
      },
      {
        path: "/admin-dashboard",
        element: <AdminHomePage></AdminHomePage>,
      },
      {
        path: "/admin/BCS/others",
        element: <AddBCSOthers></AddBCSOthers>,
      },
      {
        path: "/BCSOthersExam",
        element: <BCSOthersExam></BCSOthersExam>,
      },
      {
        path: "/admin/HSC/others",
        element: <AddHSCOthers></AddHSCOthers>,
      },
      {
        path: "/HSCOthersExam",
        element: <HSCOthersExam></HSCOthersExam>,
      },
    ],
  },
]);

export default router;
