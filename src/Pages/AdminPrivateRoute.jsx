import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  const adminToken = localStorage.getItem("adminToken");
  console.log("adminToken:", adminToken); // Check token presence

  if (!adminToken) {
    console.log("No admin token found");
    return false;
  }

  try {
    const decoded = jwtDecode(adminToken);
    console.log("Decoded token:", decoded);

    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log("Token expired");
      localStorage.removeItem("adminToken");
      return false;
    }

    if (decoded.role !== "admin" && decoded.role != "editor") {
      console.log("Role is not admin");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("adminToken");
    return false;
  }
};

const AdminPrivateRoute = ({ children }) => {
  const auth = isAuthenticated();
  console.log("isAuthenticated:", auth);

  if (!auth) {
    console.log("Redirecting to /admin/login");
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminPrivateRoute;
