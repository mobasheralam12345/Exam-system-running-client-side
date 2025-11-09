import React from "react";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  const isLoggedIn = () => {
    return !!localStorage.getItem("jwtToken");
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Left - Brand Name (no left spacing) */}
        <div className="text-2xl font-bold text-indigo-600">ExamDesk</div>

        {/* Middle - Admin Mode Badge */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-semibold text-sm">
            Admin Mode
          </span>
        </div>

        {/* Right - Dashboard and Login/Logout (no right spacing) */}
        <div className="flex items-center gap-4">
          {isLoggedIn() && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
            >
              Dashboard
            </button>
          )}

          {isLoggedIn() ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/admin/login")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
