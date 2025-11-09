import React, { useEffect, useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import AdminNavbar from "./AdminNavbar";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [editors, setEditors] = useState([]);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("success"); // 'success' or 'error'
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(true); // Loading state for initial fetch
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false); // Loading state for delete

  // Fetch both admins and editors from single API
  async function fetchUsers() {
    setFetchingUsers(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/roles`);
      if (!res.ok) {
        throw new Error("Failed to load users");
      }
      const { admins, editors } = await res.json();
      setAdmins(admins);
      setEditors(editors);
    } catch (error) {
      console.error("Error loading users:", error.message);
      showMessage("Failed to load users. Please try again.", "error");
    } finally {
      setFetchingUsers(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const showMessage = (message, type = "success") => {
    setMessageContent(message);
    setMessageType(type);
    setMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setMessageModalOpen(false);
    setMessageContent("");
  };

  const openInviteModal = (role) => {
    setInviteRole(role);
    setInviteEmail("");
    setInviteModalOpen(true);
  };

  const closeInviteModal = () => setInviteModalOpen(false);

  const openDeleteConfirmation = (id) => {
    setDeleteTarget(id);
    setConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalOpen(false);
    setDeleteTarget(null);
  };

  const handleInvite = async () => {
    if (!inviteEmail) {
      showMessage("Please enter an email address.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data.message.includes("already sent")) {
          showMessage("Invitation already sent to this email.", "error");
        } else {
          showMessage(data.message || "Failed to send invitation.", "error");
        }
      } else {
        showMessage(
          `Invitation sent successfully to ${inviteEmail}!`,
          "success"
        );
        fetchUsers();
      }
      closeInviteModal();
    } catch (error) {
      showMessage("Error sending invitation. Please try again.", "error");
      console.error("Invitation error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${deleteTarget}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        showMessage(err.message || "Failed to delete user.", "error");
      } else {
        showMessage("User and invitation deleted successfully!", "success");
        fetchUsers();
      }
      closeConfirmModal();
    } catch (error) {
      showMessage("Error deleting user. Please try again.", "error");
      console.error("Delete error:", error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Admin Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your team members and send invitations
            </p>
          </header>

          {/* Loading State for Initial Fetch */}
          {fetchingUsers ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {/* Admins Section */}
              <section className="mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Admins
                  </h2>
                  <button
                    onClick={() => openInviteModal("admin")}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200"
                    aria-label="Add Admin"
                  >
                    <span className="text-2xl font-bold leading-none">+</span>
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {admins.length === 0 && (
                    <p className="p-8 text-gray-500 text-center">
                      No admins found.
                    </p>
                  )}
                  {admins.map(({ _id, name, email }) => (
                    <div
                      key={_id}
                      className="flex justify-between items-center px-6 py-5 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-lg">
                          {name || "No Name"}
                        </span>
                        <span className="text-gray-500 text-sm">({email})</span>
                      </div>
                      <button
                        onClick={() => openDeleteConfirmation(_id)}
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                        aria-label={`Remove admin ${email}`}
                      >
                        <span className="text-2xl font-bold leading-none">
                          −
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Editors Section */}
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Editors
                  </h2>
                  <button
                    onClick={() => openInviteModal("editor")}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 hover:shadow-lg transition-all duration-200"
                    aria-label="Add Editor"
                  >
                    <span className="text-2xl font-bold leading-none">+</span>
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {editors.length === 0 && (
                    <p className="p-8 text-gray-500 text-center">
                      No editors found.
                    </p>
                  )}
                  {editors.map(({ _id, name, email }) => (
                    <div
                      key={_id}
                      className="flex justify-between items-center px-6 py-5 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900 text-lg">
                          {name || "No Name"}
                        </span>
                        <span className="text-gray-500 text-sm">({email})</span>
                      </div>
                      <button
                        onClick={() => openDeleteConfirmation(_id)}
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 hover:shadow-lg transition-all duration-200"
                        aria-label={`Remove editor ${email}`}
                      >
                        <span className="text-2xl font-bold leading-none">
                          −
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Invite Modal */}
        {inviteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Invite New{" "}
                {inviteRole.charAt(0).toUpperCase() + inviteRole.slice(1)}
              </h3>
              <input
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="border border-gray-300 rounded-xl w-full px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                disabled={loading}
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => !loading && closeInviteModal()}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleInvite}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Invitation"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal for Delete */}
        {confirmModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove this user? This action will
                delete the user and their invitation.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeConfirmModal}
                  className="px-6 py-2.5 rounded-xl border border-red-400 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Message Modal */}
        {messageModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
              <h3
                className={`text-2xl font-bold mb-4 ${
                  messageType === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {messageType === "success" ? "Success" : "Error"}
              </h3>
              <p className="text-gray-700 mb-6">{messageContent}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeMessageModal}
                  className="px-6 py-2.5 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminManagement;
