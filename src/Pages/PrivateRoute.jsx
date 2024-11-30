import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

const PrivateRoute = ({ children }) => {
    // Check if the user is authenticated by checking localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const loading = false; // Simulate loading state if necessary

    if (loading) {
        return <span className="loading loading-spinner loading-md"></span>;
    }

    // If the user is authenticated, render the children (protected component)
    if (isAuthenticated) {
        return children;
    }

    // Otherwise, redirect to the login page
    return <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired
};

export default PrivateRoute;
