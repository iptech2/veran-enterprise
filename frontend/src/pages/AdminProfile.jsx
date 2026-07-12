import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminProfile() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* ===========================
      LOAD PROFILE
  =========================== */

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");

      setProfile({
        fullName: res.data.fullName || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        role: res.data.role || "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ===========================
      UPDATE PROFILE
  =========================== */

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/users/profile", {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...JSON.parse(localStorage.getItem("user")),
          ...res.data.user,
        })
      );

      alert("Profile updated successfully.");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    }
  };

  /* ===========================
      CHANGE PASSWORD
  =========================== */

  const changePassword = async (e) => {
    e.preventDefault();

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      return alert("Passwords do not match.");
    }

    try {
      await api.put("/users/change-password", passwordData);

      alert("Password changed successfully.");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to change password."
      );
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />

        <div className="flex-grow-1">
          <AdminNavbar />

          <div className="container-fluid p-5">
            <h3>Loading Profile...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="flex-grow-1 bg-light">

        <AdminNavbar />

        <div className="container-fluid p-4">

          <div className="mb-4">
            <h2 className="fw-bold">
              Admin Settings
            </h2>

            <p className="text-muted">
              Manage your administrator account.
            </p>
          </div>

          <div className="row">

            {/* PROFILE */}

            <div className="col-lg-7">

              <div className="card shadow border-0 mb-4">

                <div className="card-header fw-bold">
                  Profile Information
                </div>

                <div className="card-body">

                  <form onSubmit={updateProfile}>

                    <div className="mb-3">
                      <label className="form-label">
                        Full Name
                      </label>

                      <input
                        className="form-control"
                        value={profile.fullName}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            fullName:
                              e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={profile.email}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            email:
                              e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Phone
                      </label>

                      <input
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            phone:
                              e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Role
                      </label>

                      <input
                        className="form-control"
                        value={profile.role}
                        disabled
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                    >
                      Save Profile
                    </button>

                  </form>

                </div>

              </div>

            </div>

            {/* PASSWORD */}

            <div className="col-lg-5">

              <div className="card shadow border-0">

                <div className="card-header fw-bold">
                  Change Password
                </div>

                <div className="card-body">

                  <form
                    onSubmit={changePassword}
                  >

                    <div className="mb-3">

                      <label className="form-label">
                        Current Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={
                          passwordData.currentPassword
                        }
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        New Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={
                          passwordData.newPassword
                        }
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={
                          passwordData.confirmPassword
                        }
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <button className="btn btn-success">
                      Change Password
                    </button>

                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}