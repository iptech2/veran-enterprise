import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD PROFILE
  // ==========================

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/profile");

      setProfile(res.data);

      setForm({
        fullName: res.data.fullName,
        email: res.data.email,
        phone: res.data.phone,
      });

    } catch (err) {
      console.log(err);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // ==========================
  // UPDATE PROFILE
  // ==========================

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/profile", form);

      alert("Profile updated successfully.");

      loadProfile();

    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile.");
    }
  };

  // ==========================
  // CHANGE PASSWORD
  // ==========================

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/change-password", password);

      alert("Password changed successfully.");

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h3>Loading Profile...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container py-4">

        <h2 className="fw-bold mb-4">
          My Profile
        </h2>

        <div className="row">

          {/* LEFT SIDE */}

          <div className="col-lg-4">

            <div className="card shadow mb-4">

              <div className="card-body text-center">

                <img
                  src={
                    profile.profilePhoto ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="rounded-circle mb-3"
                  width="140"
                  height="140"
                />

                <h4>{profile.fullName}</h4>

                <p className="text-muted">
                  {profile.email}
                </p>

                <hr />

                <p>
                  <strong>Wallet</strong>
                </p>

                <h3 className="text-success">
                  KES {profile.balance.toLocaleString()}
                </h3>

                <hr />

                <p>
                  <strong>Referral Code</strong>
                </p>

                <h5 className="text-primary">
                  {profile.referralCode}
                </h5>

                <hr />

                <p>
                  <strong>Role</strong>
                </p>

                <span className="badge bg-dark">
                  {profile.role}
                </span>

                <hr />

                <p>
                  <strong>Joined</strong>
                </p>

                <p>
                  {new Date(profile.createdAt).toLocaleDateString()}
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="col-lg-8">

            {/* PROFILE */}

            <div className="card shadow mb-4">

              <div className="card-header">
                <h5 className="mb-0">
                  Profile Information
                </h5>
              </div>

              <div className="card-body">

                <form onSubmit={updateProfile}>

                  <div className="mb-3">

                    <label className="form-label">
                      Full Name
                    </label>

                    <input
                      className="form-control"
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          fullName: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="mb-3">

                    <label>Email</label>

                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="mb-3">

                    <label>Phone</label>

                    <input
                      className="form-control"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                    />

                  </div>

                  <button className="btn btn-success">
                    Save Changes
                  </button>

                </form>

              </div>

            </div>

            {/* PASSWORD */}

            <div className="card shadow">

              <div className="card-header">
                <h5 className="mb-0">
                  Change Password
                </h5>
              </div>

              <div className="card-body">

                <form onSubmit={changePassword}>

                  <div className="mb-3">

                    <label>
                      Current Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={password.currentPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          currentPassword: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      New Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={password.newPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          newPassword: e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="mb-3">

                    <label>
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={password.confirmPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                  </div>

                  <button className="btn btn-primary">
                    Change Password
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}