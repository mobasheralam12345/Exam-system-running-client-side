import axios from "axios";

// Configure API base URL - adjust this to match your Express server
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Profile API endpoints
export const profileService = {
  /**
   * Fetch user profile
   * @returns {Promise} User profile data
   */
  getProfile: async () => {
    try {
      const response = await api.get("/profile");
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  /**
   * Update user profile (name, phone, etc.)
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await api.put("/profile", profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  /**
   * Submit verification images and email
   * @param {Object} verificationData - Contains FormData with images and email
   * @returns {Promise} Verification submission response
   */
  submitVerification: async (verificationData) => {
    try {
      const response = await api.post("/profile/verify", verificationData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error submitting verification:", error);
      throw error;
    }
  },

  /**
   * Get verification status
   * @returns {Promise} Verification status
   */
  getVerificationStatus: async () => {
    try {
      const response = await api.get("/profile/verification-status");
      return response.data;
    } catch (error) {
      console.error("Error fetching verification status:", error);
      throw error;
    }
  },

  /**
   * Get user verification history/details
   * @returns {Promise} Verification details
   */
  getVerificationDetails: async () => {
    try {
      const response = await api.get("/profile/verification-details");
      return response.data;
    } catch (error) {
      console.error("Error fetching verification details:", error);
      throw error;
    }
  },

  /**
   * Verify password before allowing image verification
   * @param {string} password - User's password
   * @returns {Promise} Password verification response
   */
  verifyPassword: async (password) => {
    try {
      const response = await api.post("/profile/verify-password", {
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying password:", error);
      throw error;
    }
  },
};

export default profileService;
