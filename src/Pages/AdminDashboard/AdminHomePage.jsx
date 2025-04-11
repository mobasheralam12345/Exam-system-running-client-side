import React from "react";
import { NavLink } from "react-router-dom";

const AdminHomePage = () => {
  const sections = ["BCS", "HSC", "Bank"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-14 w-full max-w-5xl min-h-[80vh] flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-3">
            Manage your exam questions efficiently
          </p>
        </div>

        {/* Section Buttons with Hover Dropdowns */}
        <div className="flex flex-col gap-8 w-3/4 mx-auto">
          {sections.map((section) => (
            <div key={section} className="relative group w-full">
              {/* Button */}
              <button className="w-full text-xl font-semibold text-white bg-green-600 hover:bg-green-700 py-4 rounded-xl shadow-lg text-center transition duration-300">
                Add {section} Question
              </button>

              {/* Dropdown - show on hover of group or dropdown itself */}
              <div className="absolute left-0 right-0 top-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 z-20">
                <div
                  className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
                  onMouseEnter={(e) => {
                    e.currentTarget.classList.add("opacity-100", "visible");
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.classList.remove("opacity-100", "visible");
                  }}
                >
                  <NavLink
                    to={`/admin/${section}`}
                    className="block px-6 py-3 text-gray-800 hover:bg-gray-100 border-b"
                  >
                    {section}
                  </NavLink>
                  <NavLink
                    to={`/admin/${section}/others`}
                    className="block px-6 py-3 text-gray-800 hover:bg-gray-100"
                  >
                    Others
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
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
