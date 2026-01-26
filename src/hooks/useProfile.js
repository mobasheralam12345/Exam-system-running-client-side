import { useState, useCallback, useEffect } from "react";
import profileService from "../services/profileService";

/**
 * Hook to manage user profile state and operations
 * Handles fetching, updating, and verification status
 */
export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile
      const profileResponse = await profileService.getProfile();

      // Handle both nested (data.data) and direct response format
      const profileData = profileResponse?.data || profileResponse;
      setProfile(profileData);

      // Also fetch verification status
      const verifyStatusResponse = await profileService.getVerificationStatus();

      const verifyData = verifyStatusResponse?.data || verifyStatusResponse;
      setVerificationStatus(verifyData);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to fetch profile";
      setError(errorMessage);
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    try {
      setUpdating(true);
      setError(null);
      const response = await profileService.updateProfile(updatedData);

      // Handle both nested and direct response format
      const updatedProfile = response?.data || response;
      setProfile(updatedProfile);
      return response;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMsg);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const submitVerification = useCallback(
    async (formData) => {
      try {
        setUpdating(true);
        setError(null);
        const response = await profileService.submitVerification(formData);
        // Refresh profile to get updated verification status
        await fetchProfile();
        return response;
      } catch (err) {
        const errorMsg =
          err.response?.data?.message || "Failed to submit verification";
        setError(errorMsg);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [fetchProfile]
  );

  const refetchVerificationStatus = useCallback(async () => {
    try {
      const verifyStatusResponse = await profileService.getVerificationStatus();

      const verifyData = verifyStatusResponse?.data || verifyStatusResponse;
      setVerificationStatus(verifyData);
      return verifyStatusResponse;
    } catch (err) {
      console.error("Error fetching verification status:", err);
      throw err;
    }
  }, []);

  const verifyPassword = useCallback(async (password) => {
    try {
      setError(null);
      const response = await profileService.verifyPassword(password);
      return response;
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Password verification failed";
      setError(errorMsg);
      throw err;
    }
  }, []);

  return {
    profile,
    verificationStatus,
    loading,
    error,
    updating,
    fetchProfile,
    updateProfile,
    submitVerification,
    refetchVerificationStatus,
    verifyPassword,
  };
};

export default useProfile;
