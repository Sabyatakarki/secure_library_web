"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/api/axios";
import { logoutUser } from "../../../../lib/actions/auth-actions";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const router = useRouter();

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
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await api.get("/users/profile");

      setProfile(response.data.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      await api.put("/users/profile", {
        fullName: profile.fullName,
        phoneNumber: profile.phoneNumber,
        department: profile.department,
        semester: Number(profile.semester),
        address: profile.address,
      });

      setMessage("Profile updated successfully.");

      fetchProfile();
    } catch (error) {
      console.error(error);
      setMessage("Failed to update profile.");
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
    setMessage(response.message);
  }

  setSaving(false);
}

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
  <div className="max-w-3xl">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">
        My Profile
      </h1>

      <button
        type="button"
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition"
      >
        Logout
      </button>
    </div>

    {message && (
      <div className="mb-5 border rounded-lg p-3">
        {message}
      </div>
    )}

    <form onSubmit={handleSubmit} className="space-y-5">

      <div>
        <label>Full Name</label>

        <input
          type="text"
          value={profile.fullName}
          onChange={(e) =>
            setProfile({
              ...profile,
              fullName: e.target.value,
            })
          }
          className="w-full border rounded p-3"
        />
      </div>

      <div>
        <label>College Email</label>

        <input
          type="email"
          value={profile.email}
          readOnly
          className="w-full border rounded p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>Student ID</label>

        <input
          type="text"
          value={profile.studentId}
          readOnly
          className="w-full border rounded p-3 bg-gray-100"
        />
      </div>

      <div>
        <label>Phone Number</label>

        <input
          type="text"
          value={profile.phoneNumber}
          onChange={(e) =>
            setProfile({
              ...profile,
              phoneNumber: e.target.value,
            })
          }
          className="w-full border rounded p-3"
        />
      </div>

      <div>
        <label>Department</label>

        <input
          type="text"
          value={profile.department}
          onChange={(e) =>
            setProfile({
              ...profile,
              department: e.target.value,
            })
          }
          className="w-full border rounded p-3"
        />
      </div>

      <div>
        <label>Semester</label>

        <input
          type="number"
          value={profile.semester}
          onChange={(e) =>
            setProfile({
              ...profile,
              semester: e.target.value,
            })
          }
          className="w-full border rounded p-3"
        />
      </div>

      <div>
        <label>Address</label>

        <textarea
          value={profile.address}
          onChange={(e) =>
            setProfile({
              ...profile,
              address: e.target.value,
            })
          }
          className="w-full border rounded p-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label>Role</label>

          <input
            value={profile.role}
            readOnly
            className="w-full border rounded p-3 bg-gray-100"
          />
        </div>

        <div>
          <label>Account Status</label>

          <input
            value={profile.isActive ? "Active" : "Inactive"}
            readOnly
            className="w-full border rounded p-3 bg-gray-100"
          />
        </div>
      </div>

      <div>
        <label>Email Verification</label>

        <input
          value={profile.isVerified ? "Verified" : "Not Verified"}
          readOnly
          className="w-full border rounded p-3 bg-gray-100"
        />
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#556B2F] hover:bg-[#465927] text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>
      </div>

    </form>
  </div>
);
}