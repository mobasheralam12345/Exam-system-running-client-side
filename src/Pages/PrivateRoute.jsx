import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children, loading = false }) => {
  // Check if JWT token exists in localStorage to determine auth state
  const token = localStorage.getItem("userToken");

  if (loading) {
    // You can replace with any custom loading spinner or component
    return <span className="loading loading-spinner loading-md"></span>;
  }

  if (token) {
    // Authenticated, render protected children
    return children;
  }

  // Not authenticated, redirect to login
  return <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  loading: PropTypes.bool,
};

export default PrivateRoute;
