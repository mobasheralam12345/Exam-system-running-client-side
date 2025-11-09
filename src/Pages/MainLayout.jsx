import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

const MainLayout = () => {
  const location = useLocation();

  const hideNavbarFooterPaths = [
    "/admin",
    "/admin/management",
    "/admin/register",
    "/admin/login",
    "/admin/create-exam",
  ];

  const shouldHide = hideNavbarFooterPaths.includes(location.pathname);

  return (
    <div>
      {!shouldHide && <Navbar />}
      <div className="min-h-screen mt-5">
        <Outlet />
      </div>
      {!shouldHide && <Footer />}
    </div>
  );
};

export default MainLayout;
