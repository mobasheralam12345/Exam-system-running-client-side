import { createBrowserRouter } from "react-router-dom";
import MainLayout from './Pages/MainLayout';
import Home from './Pages/Home';
import PrivateRoute from './Pages/PrivateRoute';
import About from './Pages/About';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Exam from './Pages/Exam/Exam';
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import SubjectWiseExam from './Pages/SubjectWiseExam/SubjectWise-Exam';
import HscExam from '../src/Pages/HscExam/HscExam';
import HscSubjectWiseExam from "./Pages/HscExam/HscSubjectWiseExam";
import AdminLogin from "./Pages/Admin/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/dashboard',
        element: <StudentDashboard></StudentDashboard>
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/exam',
        element: <PrivateRoute><Exam /></PrivateRoute>
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/subjectwise-exam',
        element: <PrivateRoute><SubjectWiseExam /></PrivateRoute>
      },
      {
        path : '/hsc/all-questions',
        element : <HscExam></HscExam>
      },
      {
        path: '/hsc/subjectwise',
        element : <HscSubjectWiseExam></HscSubjectWiseExam>
      },
      {
        path : '/admin',
        element: <AdminLogin></AdminLogin>
      },
      {
        path : '/admin-dashboard',
        element: <AdminDashboard></AdminDashboard>
      }
      
    ]
  },
]);

export default router;
