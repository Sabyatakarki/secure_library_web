"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api/axios";
import { logoutUser } from "../../../../lib/actions/auth-actions";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  // Step 1: Added profilePicture field to state
 const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    studentId: "",
    phoneNumber: "",
    department: "",
    semester: "",
    address: "",
    role: "",
    isVerified: false,
    isActive: false,
    profilePicture: "",
    mfaEnabled: false,
});

  // Step 2: States for image handling (selected file and client preview URL)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Cleanup object URLs to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  async function fetchProfile() {
    try {
      const response = await api.get("/users/profile");
      setProfile(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to load profile details.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Handle local file selection with instant client-side preview
  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedImage(file);

    // Generate local preview URL instantly
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  // Unified save function (Updates both text details and profile picture)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // 1. Upload Profile Picture if a new image was selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append("profilePicture", selectedImage);

        await api.put("/users/profile-picture", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
      }

      // 2. Update Profile Text Information
      await api.put("/users/profile", {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        department: profile.department,
        semester: Number(profile.semester),
        address: profile.address,
      });

      setMessage({ text: "Profile updated successfully!", type: "success" });
      
      // Reset selected image states and sync state with backend database
      setSelectedImage(null);
      setPreviewUrl(null);
      fetchProfile();
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to update profile. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    if (!window.confirm("Are you sure you want to logout?")) return;

    setSaving(true);
    const response = await logoutUser();

    if (response.success) {
      router.push("/login");
      router.refresh();
    } else {
      setMessage({ text: response.message || "Logout failed.", type: "error" });
    }
    setSaving(false);
  }

  // Determine which image src to render (Priority: Local Preview > Backend Mongo Image > Fallback Default)
  const getProfileImageSrc = () => {
    if (previewUrl) {
      return previewUrl;
    }
    if (profile.profilePicture) {
      return `http://localhost:5050/uploads/profile_pictures/${profile.profilePicture}`;
    }
    return "/default-profile.png";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-pulse space-y-6">
        <div className="h-28 bg-slate-200 rounded-2xl" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="h-48 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header Banner & Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="h-28 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900" />
        <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 w-full sm:w-auto text-center sm:text-left">
            {/* Step 4: Display Profile Image Frame */}
            <div className="relative group">
              <img
                src={getProfileImageSrc()}
                alt={profile.fullName || "Profile"}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
              />
              
              {/* Step 5: Choose File Button Trigger */}
              <label className="absolute bottom-1 right-1 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-xl cursor-pointer shadow-lg transition backdrop-blur-sm">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  hidden
                />
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>

            <div className="mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  {profile.fullName || "Student Profile"}
                </h1>
                {selectedImage && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Unsaved Photo
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {profile.email} • <span className="capitalize">{profile.role || "Student"}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 font-semibold text-xs px-4 py-2.5 rounded-xl transition duration-150 active:scale-[0.98] self-stretch sm:self-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Notification Alert */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-xl border text-xs font-medium flex items-center gap-3 ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal & Academic Information Section */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your editable contact and academic information.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={profile.phoneNumber}
                onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                placeholder="Computer Science"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Semester
              </label>
              <input
                type="number"
                value={profile.semester}
                onChange={(e) => setProfile({ ...profile, semester: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition"
                placeholder="1"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Address
              </label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition resize-none"
                placeholder="Residential address..."
              />
            </div>
          </div>
        </div>

        {/* Account Details & Status (Read-Only) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">System Records</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified campus system attributes and security parameters.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                College Email
              </label>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full bg-slate-100/70 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Student ID
              </label>
              <input
                type="text"
                value={profile.studentId}
                readOnly
                className="w-full bg-slate-100/70 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                System Role
              </label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="w-full bg-slate-100/70 border border-slate-200 text-slate-500 rounded-xl px-3.5 py-2.5 text-xs cursor-not-allowed capitalize"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Account Status
              </label>
              <div className="flex items-center h-[38px] px-3.5 bg-slate-100/70 border border-slate-200 rounded-xl">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    profile.isActive
                      ? "bg-emerald-100/80 text-emerald-800"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${profile.isActive ? "bg-emerald-600" : "bg-slate-500"}`} />
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Email Verification
              </label>
              <div className="flex items-center h-[38px] px-3.5 bg-slate-100/70 border border-slate-200 rounded-xl">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                    profile.isVerified
                      ? "bg-blue-100/80 text-blue-800"
                      : "bg-amber-100/80 text-amber-800"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${profile.isVerified ? "bg-blue-600" : "bg-amber-600"}`} />
                  {profile.isVerified ? "Verified Account" : "Unverified Account"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-6 py-3 rounded-xl shadow-sm transition duration-150 active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              "Save Profile Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}