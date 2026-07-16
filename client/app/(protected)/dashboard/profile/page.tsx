"use client";

import { useEffect, useState } from "react";
import api from "../../../../lib/api/axios";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");

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

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="max-w-3xl">

      <h1 className="text-3xl font-bold mb-6">
        My Profile
      </h1>

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

        <button
          type="submit"
          disabled={saving}
          className="bg-[#556B2F] text-white px-6 py-3 rounded-lg"
        >
          {saving ? "Saving..." : "Update Profile"}
        </button>

      </form>

    </div>
  );
}