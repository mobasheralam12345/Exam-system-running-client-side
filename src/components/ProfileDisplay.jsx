import { useState } from "react";
import {
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import Swal from "sweetalert2";
import useProfile from "../hooks/useProfile";
import PasswordVerificationModal from "./PasswordVerificationModal";

/**
 * ProfileDisplay Component
 * Shows user profile details with edit capability
 * Requires password verification before allowing edits
 */
const ProfileDisplay = ({ verificationStatus = null }) => {
  const { profile, loading, updating, error, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);

  // Debug: log profile data when it changes
  console.log("ProfileDisplay received profile:", profile);

  // Initialize edit data when profile loads
  const getEditableProfile = () => {
    if (!editData && profile) {
      return {
        fullName: profile.fullName || profile.firstName || profile.name || "",
        email: profile.email || "",
        phone: profile.phone || profile.phoneNumber || "",
        enrollmentId:
          profile.enrollmentId ||
          profile.enrollment_id ||
          profile.enrollmentNo ||
          "",
        dateOfBirth:
          profile.dateOfBirth || profile.dob || profile.date_of_birth || "",
        address: profile.address || profile.location || "",
      };
    }
    return editData;
  };

  const currentEditData = getEditableProfile();

  /**
   * Start editing mode - show password verification first
   */
  const handleEdit = () => {
    setShowPasswordModal(true);
  };

  /**
   * Handle password verified for edit mode
   */
  const handlePasswordVerifiedForEdit = () => {
    setPasswordVerified(true);
    setShowPasswordModal(false);
    setEditData(currentEditData);
    setIsEditing(true);
  };

  /**
   * Cancel editing
   */
  const handleCancel = () => {
    setEditData(null);
    setIsEditing(false);
  };

  /**
   * Save profile changes
   */
  const handleSave = async () => {
    try {
      if (!currentEditData.fullName.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Full name is required",
          confirmButtonColor: "#3B82F6",
        });
        return;
      }

      const dataToUpdate = {
        fullName: currentEditData.fullName,
        phone: currentEditData.phone,
        address: currentEditData.address,
      };

      await updateProfile(dataToUpdate);

      setIsEditing(false);
      setEditData(null);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully",
        confirmButtonColor: "#10B981",
        timer: 2000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Failed to update profile",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  /**
   * Get verification status badge
   */
  const getVerificationBadge = () => {
    const status = verificationStatus?.status || verificationStatus?.isVerified;

    if (status === "verified" || status === true) {
      return (
        <div className="badge badge-success gap-2 text-white">
          <Shield className="w-4 h-4" />
          Verified
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="badge badge-warning gap-2 text-white">
          <span className="loading loading-spinner loading-xs"></span>
          Pending Review
        </div>
      );
    } else {
      return (
        <div className="badge badge-error gap-2 text-white">
          <Shield className="w-4 h-4" />
          Not Verified
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            <div className="skeleton h-8 w-32"></div>
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
            <div className="skeleton h-12 w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="alert alert-error shadow-lg">
          <span>Error loading profile: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Password Verification Modal */}
      <PasswordVerificationModal
        isOpen={showPasswordModal}
        onVerified={handlePasswordVerifiedForEdit}
        onClose={() => setShowPasswordModal(false)}
      />

      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl shadow-lg p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {profile?.fullName || profile?.name || "User Profile"}
            </h1>
            <p className="text-blue-100">
              Welcome to your exam verification profile
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getVerificationBadge()}
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8 border-t border-gray-100">
        {/* Edit Mode Toggle */}
        <div className="flex justify-end mb-6">
          {!isEditing ? (
            <button
              onClick={handleEdit}
              className="btn btn-primary gap-2 text-white"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : null}
        </div>

        {/* Profile Information */}
        {!isEditing ? (
          <div className="space-y-4">
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Full Name
                </span>
              </label>
              <div className="text-lg text-gray-900 font-medium">
                {profile?.fullName ||
                  profile?.firstName ||
                  profile?.name ||
                  "Not provided"}
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Email Address
                </span>
              </label>
              <div className="flex items-center gap-2 text-lg text-gray-900">
                <Mail className="w-5 h-5 text-blue-600" />
                {profile?.email || "Not provided"}
              </div>
            </div>

            {/* Enrollment ID */}
            {(profile?.enrollmentId ||
              profile?.enrollment_id ||
              profile?.enrollmentNo) && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Enrollment ID
                  </span>
                </label>
                <div className="text-lg text-gray-900 font-medium font-mono">
                  {profile?.enrollmentId ||
                    profile?.enrollment_id ||
                    profile?.enrollmentNo}
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Phone Number
                </span>
              </label>
              <div className="flex items-center gap-2 text-lg text-gray-900">
                <Phone className="w-5 h-5 text-blue-600" />
                {profile?.phone || profile?.phoneNumber || "Not provided"}
              </div>
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Address
                </span>
              </label>
              <div className="flex items-center gap-2 text-lg text-gray-900">
                <MapPin className="w-5 h-5 text-blue-600" />
                {profile?.address || profile?.location || "Not provided"}
              </div>
            </div>

            {/* Date of Birth */}
            {(profile?.dateOfBirth ||
              profile?.dob ||
              profile?.date_of_birth) && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Date of Birth
                  </span>
                </label>
                <div className="flex items-center gap-2 text-lg text-gray-900">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  {new Date(
                    profile?.dateOfBirth ||
                      profile?.dob ||
                      profile?.date_of_birth
                  ).toLocaleDateString()}
                </div>
              </div>
            )}

            {/* Account Created Date */}
            {profile?.createdAt && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Account Created
                  </span>
                </label>
                <div className="text-gray-600">
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Edit Mode */
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Full Name *
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered bg-white"
                value={currentEditData?.fullName || ""}
                onChange={(e) =>
                  setEditData({
                    ...currentEditData,
                    fullName: e.target.value,
                  })
                }
                placeholder="Enter your full name"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Email Address
                </span>
              </label>
              <input
                type="email"
                className="input input-bordered bg-gray-100"
                value={currentEditData?.email || ""}
                disabled
                placeholder="Email cannot be changed"
              />
            </div>

            {/* Enrollment ID (Read-only) */}
            {currentEditData?.enrollmentId && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">
                    Enrollment ID
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered bg-gray-100"
                  value={currentEditData?.enrollmentId || ""}
                  disabled
                />
              </div>
            )}

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Phone Number
                </span>
              </label>
              <input
                type="tel"
                className="input input-bordered bg-white"
                value={currentEditData?.phone || ""}
                onChange={(e) =>
                  setEditData({
                    ...currentEditData,
                    phone: e.target.value,
                  })
                }
                placeholder="Enter your phone number"
              />
            </div>

            {/* Address */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">
                  Address
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered bg-white"
                value={currentEditData?.address || ""}
                onChange={(e) =>
                  setEditData({
                    ...currentEditData,
                    address: e.target.value,
                  })
                }
                placeholder="Enter your address"
                rows="3"
              />
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={updating}
                className="flex-1 btn btn-primary text-white gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updating ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                disabled={updating}
                className="flex-1 btn btn-outline gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 rounded p-4">
        <p className="text-blue-700 text-sm">
          <strong>Note:</strong> Email and enrollment ID cannot be changed.
          These are verified during registration and are used for exam security
          purposes.
        </p>
      </div>
    </div>
  );
};

export default ProfileDisplay;
