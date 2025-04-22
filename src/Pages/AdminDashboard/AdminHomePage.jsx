import React from "react";
import { NavLink } from "react-router-dom";

const AdminHomePage = () => {
  const sections = ["BCS", "HSC"];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-14 w-full max-w-6xl min-h-[100vh] flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-3/4 mx-auto">
          {sections.map((section) => (
            <div key={section} className="bg-gray-100 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
                {section}
              </h2>
              <div className="flex flex-col gap-4">
                <NavLink
                  to={`/admin/${section}`}
                  className="w-full text-lg font-medium text-white bg-green-600 hover:bg-green-700 py-3 px-4 rounded-lg text-center transition duration-300"
                >
                  Add {section} Question
                </NavLink>
                <NavLink
                  to={`/admin/${section}/others`}
                  className="w-full text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded-lg text-center transition duration-300"
                >
                   Other 
                </NavLink>
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
