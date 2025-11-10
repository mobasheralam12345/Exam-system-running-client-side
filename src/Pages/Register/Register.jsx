import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    collegeOrUniversity: "",
    image: null,
    password: "",
    confirmPassword: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const submissionData = { ...formData }; // image is base64 string here

      const res = await fetch(`${BACKEND_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Registration completed. Please login.",
        timer: 2500,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-2xl w-full">
        <div className="p-8 md:p-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create Your Account
            </h1>
            <p className="text-gray-600">
              Register to get started with our system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Choose a username"
              />
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your email address"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                placeholder="Enter your address"
              />
            </div>

            {/* College/University */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College/University
              </label>
              <input
                type="text"
                name="collegeOrUniversity"
                value={formData.collegeOrUniversity}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your college or university"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {imagePreview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 object-cover rounded-xl border-2 border-gray-300"
                  />
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your password"
                autoComplete="new-password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Confirm your password"
                autoComplete="off"
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-shadow shadow-lg hover:shadow-xl"
            >
              {loading ? "Creating Account..." : "Complete Registration"}
            </button>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-semibold text-indigo-600 hover:text-indigo-800 focus:outline-none"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
