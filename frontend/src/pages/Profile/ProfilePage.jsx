import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { updateProfile, uploadAvatar } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, setUser, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    age: user?.age || "",
    income: user?.income || "",
  });

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateProfile(form);
      setUser(res.data);
      setEditing(false);
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const res = await uploadAvatar(formData);
      setUser(res.data);
    } catch {
      alert("Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ===== LOGOUT ===== */
  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header-card">
        <label className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {user?.avatar ? (
              <img
                src={`http://localhost:5000${user.avatar}`}
                alt="avatar"
                className="profile-avatar-img"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <input type="file" hidden onChange={handleAvatarChange} />
          <span className="avatar-edit-text">
            {uploading ? "Uploading…" : "Change"}
          </span>
        </label>

        <div className="profile-header-info">
          <h2 className="profile-name">{user?.name || "User"}</h2>
          <p className="profile-email">{user?.email}</p>
        </div>

        <button
          className="btn-cta profile-edit-btn"
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={saving}
        >
          {editing ? (saving ? "Saving…" : "Save") : "Edit Profile"}
        </button>
      </div>

      {/* PERSONAL DETAILS */}
      <div className={`profile-details-card ${editing ? "editing" : ""}`}>
        <h3 className="profile-section-title">Personal Details</h3>

        <div className="profile-details-grid">
          <div className="profile-detail-item">
            <span className="detail-label">Full Name</span>
            {editing ? (
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            ) : (
              <span className="detail-value">{user?.name || "-"}</span>
            )}
          </div>

          <div className="profile-detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email || "-"}</span>
          </div>

          <div className="profile-detail-item">
            <span className="detail-label">Age</span>
            {editing ? (
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
              />
            ) : (
              <span className="detail-value">{user?.age || "-"}</span>
            )}
          </div>

          <div className="profile-detail-item">
            <span className="detail-label">Monthly Income</span>
            {editing ? (
              <input
                type="number"
                value={form.income}
                onChange={(e) => setForm({ ...form, income: e.target.value })}
              />
            ) : (
              <span className="detail-value highlight">
                ₹{user?.income || 0}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* ACCOUNT & SECURITY */}
      <div className="account-actions-card">
        <h3 className="account-actions-title">Account & Security</h3>

        <div className="account-actions">
          <button className="btn-cta logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <button className="btn-cta danger-btn">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
