import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { Eye, EyeOff } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect path from location state or fallback to "/"
  const redirectPath = location.state?.from?.pathname || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.emailOrUsername || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in both fields.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        let errorMessage = "Login failed";
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          errorMessage = errData.message || errorMessage;
        } else {
          errorMessage = await res.text();
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      // Save token and user info in localStorage
      localStorage.setItem("userToken", data.token);
      const { id, email, username } = data.user;
      localStorage.setItem("userInfo", JSON.stringify({ id, email, username }));

      // Dispatch custom event to notify Navbar and other components
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("authChange"));

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: `Hello, ${username}`,
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect user to the page they came from or homepage
      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 2000);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err.message || "Server error, please try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 font-sans">
        <h1 className="text-4xl font-extrabold mb-8 text-indigo-700 drop-shadow-lg select-none text-center">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label
              htmlFor="emailOrUsername"
              className="block mb-2 text-lg font-semibold text-gray-700 cursor-pointer"
            >
              Email or Username
            </label>
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="Enter your email or username"
              className="w-full px-5 py-3 border rounded-xl text-lg border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition hover:shadow-lg"
              disabled={loading}
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-lg font-semibold text-gray-700 cursor-pointer"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-5 py-3 pr-12 border rounded-xl text-lg border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition hover:shadow-lg"
                disabled={loading}
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg hover:bg-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-indigo-700 font-semibold text-sm select-none">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="underline hover:text-indigo-900"
          >
            Forgot Password?
          </button>
          <div>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="underline hover:text-indigo-900"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
