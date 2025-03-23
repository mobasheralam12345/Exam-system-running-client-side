import React from "react";
import { NavLink } from "react-router-dom";

const AdminHomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-14 w-full max-w-5xl min-h-[80vh] flex flex-col justify-center">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-3">
            Manage your exam questions efficiently
          </p>
        </div>

        {/* Button Section (Stacked Buttons) */}
        <div className="flex flex-col gap-8 w-3/4 mx-auto">
          <NavLink
            to="/admin/BCS"
            className="text-xl font-semibold text-white bg-green-600 hover:bg-green-700 py-4 rounded-xl shadow-lg text-center transition duration-300"
          >
            Add BCS Question
          </NavLink>
          <NavLink
            to="/admin/HSC"
            className="text-xl font-semibold text-white bg-green-600 hover:bg-green-700 py-4 rounded-xl shadow-lg text-center transition duration-300"
          >
            Add HSC Question
          </NavLink>
          <NavLink
            to=""
            className="text-xl font-semibold text-white bg-green-600 hover:bg-green-700 py-4 rounded-xl shadow-lg text-center transition duration-300"
          >
            Add Bank Exam Question
          </NavLink>
        </div>

        {/* Extra Info */}
        <div className="mt-16 text-center text-gray-700">
          <p className="font-medium text-lg">
            Ensure all questions are properly reviewed before submission.
          </p>
          <p className="mt-3 text-base">
            For support, contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
