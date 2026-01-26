// services/demoExamService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Get current active demo exam
 */
export const getCurrentDemoExam = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    const response = await axios.get(`${API_URL}/liveExam/demo/current`, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching current demo exam:", error);
    throw error;
  }
};

/**
 * Get next demo exam start time
 */
export const getNextDemoExamTime = async () => {
  try {
    const response = await axios.get(`${API_URL}/liveExam/demo/next`);
    return response.data;
  } catch (error) {
    console.error("Error fetching next demo exam time:", error);
    throw error;
  }
};

/**
 * Get demo exam scheduler status
 */
export const getDemoExamSchedulerStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/liveExam/demo/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching scheduler status:", error);
    throw error;
  }
};

/**
 * Register for demo exam
 */
export const registerForDemoExam = async (examId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_URL}/liveExam/register`,
      { examId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error registering for demo exam:", error);
    throw error;
  }
};
