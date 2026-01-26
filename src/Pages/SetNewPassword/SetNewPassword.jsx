import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SetNewPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Get email and code from previous step
  const email = location.state?.email;
  const code = location.state?.code;

  // Redirect if no email or code
  React.useEffect(() => {
    if (!email || !code) {
      Swal.fire({
        icon: "error",
        title: "Invalid Access",
        text: "Please start from the forgot password page.",
      });
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields.",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your password has been reset successfully.",
        timer: 2500,
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Server error, please try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 font-sans">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 drop-shadow-lg select-none text-center">
          Set New Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your new password below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block mb-2 text-lg font-semibold text-gray-700 cursor-pointer"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full px-5 py-3 pr-12 border rounded-xl text-lg border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition hover:shadow-lg"
                disabled={loading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-lg font-semibold text-gray-700 cursor-pointer"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full px-5 py-3 pr-12 border rounded-xl text-lg border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition hover:shadow-lg"
                disabled={loading}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg hover:bg-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-8 text-center text-indigo-700 font-semibold text-sm select-none">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="underline hover:text-indigo-900"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;
