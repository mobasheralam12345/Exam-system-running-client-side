import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const VerifyResetCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if no email
  React.useEffect(() => {
    if (!email) {
      Swal.fire({
        icon: "error",
        title: "Invalid Access",
        text: "Please start from the forgot password page.",
      });
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter the verification code.",
      });
      return;
    }

    if (code.length !== 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid Code",
        text: "Verification code must be 6 digits.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/user/verify-reset-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to verify code");
      }

      Swal.fire({
        icon: "success",
        title: "Code Verified!",
        text: "Now you can set your new password.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Navigate to set new password page with email and code
      setTimeout(() => {
        navigate("/set-new-password", { 
          state: { 
            email, 
            code 
          } 
        });
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Verification Failed",
        text: err.message || "Server error, please try again later.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-16">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-12 font-sans">
        <h1 className="text-4xl font-extrabold mb-4 text-indigo-700 drop-shadow-lg select-none text-center">
          Verify Code
        </h1>
        <p className="text-gray-600 text-center mb-2">
          Enter the 6-digit verification code sent to:
        </p>
        <p className="text-indigo-700 font-semibold text-center mb-8">
          {email}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="code"
              className="block mb-2 text-lg font-semibold text-gray-700 cursor-pointer"
            >
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="w-full px-5 py-3 border rounded-xl text-lg border-gray-300 shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-400 transition hover:shadow-lg tracking-widest text-center font-mono"
              disabled={loading}
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-700 text-white font-extrabold rounded-xl shadow-lg hover:bg-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <div className="mt-8 flex justify-between text-indigo-700 font-semibold text-sm select-none">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="underline hover:text-indigo-900"
          >
            Resend Code
          </button>
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

export default VerifyResetCode;
