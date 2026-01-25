// services/practiceExamService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Get current practice exam
 */
export const getCurrentPracticeExam = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await axios.get(`${API_URL}/liveExam/practice/current`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching current practice exam:", error);
    throw error;
  }
};

/**
 * Register for practice exam
 */
export const registerForPracticeExam = async (examId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/liveExam/practice/register`,
      { examId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering for practice exam:", error);
    throw error;
  }
};

/**
 * Check practice exam registration
 */
export const checkPracticeRegistration = async (examId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/liveExam/practice/registration/${examId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error checking practice registration:", error);
    throw error;
  }
};

/**
 * Get practice exam scheduler status
 */
export const getPracticeExamSchedulerStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/liveExam/practice/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching scheduler status:", error);
    throw error;
  }
};
