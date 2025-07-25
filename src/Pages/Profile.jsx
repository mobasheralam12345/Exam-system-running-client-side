import React, { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [activeTab, setActiveTab] = useState("personal");

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user ID (implement based on your auth system)
        const userId = localStorage.getItem("userId") || "mock-user-id";

        // For now, use mock data with API structure ready for future implementation
        const mockUserData = await getMockUserData();

        // TODO: Replace with actual API calls when ready
        // const response = await fetch(`${BACKEND_URL}/user/profile/${userId}`);
        // if (!response.ok) throw new Error('Failed to fetch profile');
        // const data = await response.json();
        // setUser(data.user);

        setUser(mockUserData.user);
        setEditForm(mockUserData.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Mock data function (matches API structure)
  const getMockUserData = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      user: {
        _id: "user_123",
        username: "john_doe_bd",
        email: "john.doe@example.com",
        fullName: "John Doe",
        phone: "+880 1712 345678",
        dateOfBirth: "1995-05-15",
        gender: "Male",
        address: "Dhaka, Bangladesh",
        institution: "University of Dhaka",
        department: "Computer Science and Engineering",
        studentId: "CSE-2019-123",
        profilePicture: null,
        joinDate: "2024-01-15T10:30:00Z",
        lastLogin: "2024-07-25T14:30:00Z",
        isVerified: true,
        status: "active",
        bio: "Computer Science student passionate about technology and learning. Preparing for BCS and other competitive exams.",
        socialLinks: {
          facebook: "",
          linkedin: "",
          twitter: "",
        },
        preferences: {
          notifications: true,
          newsletter: true,
          examReminders: true,
          darkMode: false,
          language: "English",
        },
      },
    };
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({ ...user });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (section, key, value) => {
    setEditForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handlePreferenceChange = (key) => {
    setEditForm((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key],
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`${BACKEND_URL}/user/profile/${user._id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(editForm)
      // });

      // if (!response.ok) throw new Error('Failed to update profile');

      setUser(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Profile
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.fullName}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  user.fullName?.charAt(0) || user.username?.charAt(0) || "U"
                )}
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.fullName || user.username}
                  </h1>
                  <p className="text-lg text-gray-600 mb-1">@{user.username}</p>
                  <p className="text-gray-600 mb-2">{user.email}</p>

                  <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {user.status === "active" ? "✓ Active" : "✗ Inactive"}
                    </span>
                    {user.isVerified && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  {isEditing ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 shadow-sm"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Save Changes</span>
                      </button>
                      <button
                        onClick={handleEditToggle}
                        className="px-6 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEditToggle}
                      className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div className="mb-4">
                  <p className="text-gray-700 text-base leading-relaxed max-w-2xl">
                    {user.bio}
                  </p>
                </div>
              )}

              {/* Member Info */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center text-sm text-gray-500 space-x-6">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Joined {formatDate(user.joinDate)}
                </span>
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Last active {formatDateTime(user.lastLogin)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6">
              {[
                { id: "personal", name: "Personal Information", icon: "👤" },
                { id: "academic", name: "Academic Details", icon: "🎓" },
                { id: "preferences", name: "Preferences", icon: "⚙️" },
                { id: "account", name: "Account Security", icon: "🔒" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200 bg-white"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.fullName || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Username
                      </label>
                      <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                        @{user.username}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Email Address
                      </label>
                      <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={editForm.phone || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.phone || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Date of Birth
                      </label>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editForm.dateOfBirth || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.dateOfBirth
                            ? formatDate(user.dateOfBirth)
                            : "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Gender
                      </label>
                      {isEditing ? (
                        <select
                          name="gender"
                          value={editForm.gender || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">
                            Prefer not to say
                          </option>
                        </select>
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.gender || "Not specified"}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Address
                      </label>
                      {isEditing ? (
                        <textarea
                          name="address"
                          rows="3"
                          value={editForm.address || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Enter your full address"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.address || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          rows="4"
                          value={editForm.bio || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.bio || "No bio provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Academic Details Tab */}
            {activeTab === "academic" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Academic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Institution
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="institution"
                          value={editForm.institution || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="e.g., University of Dhaka"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.institution || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Department/Faculty
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={editForm.department || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="e.g., Computer Science and Engineering"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.department || "Not provided"}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Student/Employee ID
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="studentId"
                          value={editForm.studentId || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="e.g., CSE-2019-123"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.studentId || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-6">
                    Social Links
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Facebook
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.socialLinks?.facebook || ""}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "socialLinks",
                              "facebook",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="https://facebook.com/username"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.socialLinks?.facebook ? (
                            <a
                              href={user.socialLinks.facebook}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View Profile
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        LinkedIn
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.socialLinks?.linkedin || ""}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "socialLinks",
                              "linkedin",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="https://linkedin.com/in/username"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.socialLinks?.linkedin ? (
                            <a
                              href={user.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View Profile
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Twitter
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.socialLinks?.twitter || ""}
                          onChange={(e) =>
                            handleNestedInputChange(
                              "socialLinks",
                              "twitter",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          placeholder="https://twitter.com/username"
                        />
                      ) : (
                        <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg">
                          {user.socialLinks?.twitter ? (
                            <a
                              href={user.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline"
                            >
                              View Profile
                            </a>
                          ) : (
                            "Not provided"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Notification & App Preferences
                  </h3>

                  <div className="space-y-4">
                    {[
                      {
                        key: "notifications",
                        label: "General Notifications",
                        description:
                          "Receive general app notifications and updates",
                      },
                      {
                        key: "newsletter",
                        label: "Newsletter Subscription",
                        description:
                          "Receive weekly newsletter with exam updates and tips",
                      },
                      {
                        key: "examReminders",
                        label: "Exam Reminders",
                        description:
                          "Get notified about upcoming live exams and deadlines",
                      },
                      {
                        key: "darkMode",
                        label: "Dark Mode",
                        description:
                          "Use dark theme for better viewing experience",
                      },
                    ].map((pref) => (
                      <div
                        key={pref.key}
                        className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {pref.label}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {pref.description}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            isEditing && handlePreferenceChange(pref.key)
                          }
                          disabled={!isEditing}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            (
                              isEditing
                                ? editForm.preferences?.[pref.key]
                                : user.preferences?.[pref.key]
                            )
                              ? "bg-indigo-600"
                              : "bg-gray-300"
                          } ${
                            isEditing
                              ? "cursor-pointer"
                              : "cursor-not-allowed opacity-60"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              (
                                isEditing
                                  ? editForm.preferences?.[pref.key]
                                  : user.preferences?.[pref.key]
                              )
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-6">
                    App Settings
                  </h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Preferred Language
                    </label>
                    {isEditing ? (
                      <select
                        value={editForm.preferences?.language || "English"}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "preferences",
                            "language",
                            e.target.value
                          )
                        }
                        className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="English">English</option>
                        <option value="Bangla">বাংলা</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 py-3 px-4 bg-gray-50 rounded-lg max-w-xs">
                        {user.preferences?.language || "English"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Account Security Tab */}
            {activeTab === "account" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Account Security
                  </h3>

                  {/* Account Status */}
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-6 mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-6">
                      Account Status
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Email Verification
                        </span>
                        <span className="flex items-center text-sm text-emerald-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {user.isVerified ? "Verified" : "Not Verified"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Account Status
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-50 text-gray-700 border border-gray-200"
                          }`}
                        >
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Member Since
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDate(user.joinDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Last Login
                        </span>
                        <span className="text-sm text-gray-900">
                          {formatDateTime(user.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Actions */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-6">
                      Security Actions
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-indigo-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2H7v-2H5v-2l3.257-3.257A6 6 0 0115 7z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              Change Password
                            </p>
                            <p className="text-sm text-gray-500">
                              Update your account password
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <button className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-amber-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-gray-500">
                              Enable 2FA for enhanced security
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <button className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-emerald-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              Login History
                            </p>
                            <p className="text-sm text-gray-500">
                              View recent account activity
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>

                      <button className="flex items-center justify-between p-6 border border-gray-300 rounded-lg hover:bg-orange-50 transition-colors">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mr-4">
                            <svg
                              className="w-6 h-6 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-orange-900">
                              Delete Account
                            </p>
                            <p className="text-sm text-orange-700">
                              Permanently delete your account
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-orange-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
