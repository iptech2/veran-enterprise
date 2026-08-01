import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminReferrals() {
  // ==========================
  // MOBILE SIDEBAR
  // ==========================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ==========================
  // STATE
  // ==========================

  const [data, setData] = useState({
    totalCommission: 0,
    totalReferrals: 0,
    topReferrers: [],
    referredUsers: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const res = await api.get("/admin/referrals");
      setData(res.data);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to load referrals"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex">

        <AdminSidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-grow-1">

          <AdminNavbar
            toggleSidebar={toggleSidebar}
          />

          <div className="container-fluid p-5">
            <h3>Loading...</h3>
          </div>

        </div>

      </div>
    );
  }

  return (
    <div className="d-flex">

      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-grow-1 bg-light">

        <AdminNavbar
          toggleSidebar={toggleSidebar}
        />

        <div className="container-fluid p-4">

          <h2 className="fw-bold mb-4">
            Referral Management
          </h2>

          <div className="row mb-4">

            <div className="col-md-6">

              <div className="card shadow border-0 text-center">

                <div className="card-body">

                  <h6>Total Referral Commission</h6>

                  <h3 className="text-success">
                    KES {Number(
                      data.totalCommission || 0
                    ).toLocaleString()}
                  </h3>

                </div>

              </div>

            </div>

            <div className="col-md-6">

              <div className="card shadow border-0 text-center">

                <div className="card-body">

                  <h6>Total Successful Referrals</h6>

                  <h3>{data.totalReferrals}</h3>

                </div>

              </div>

            </div>

          </div>

        {/* TOP REFERRERS */}

<div className="card shadow mb-4">

  <div className="card-header d-flex justify-content-between align-items-center">
    <strong>Top Referrers</strong>

    <span className="badge bg-primary">
      {data.topReferrers.length} Users
    </span>
  </div>

  <div className="card-body">

    <div className="table-responsive">

      <table className="table table-bordered table-hover mb-0">

        <thead className="table-dark">

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Referral Code</th>
            <th>Referrals</th>
            <th>Earnings</th>
          </tr>

        </thead>

        <tbody>

          {data.topReferrers.length === 0 ? (

            <tr>
              <td colSpan="5" className="text-center">
                No referral data found.
              </td>
            </tr>

          ) : (

            data.topReferrers.map((user) => (

              <tr key={user._id}>

                <td>{user.fullName}</td>

                <td>{user.email}</td>

                <td>{user.referralCode}</td>

                <td>{user.referralCount}</td>

                <td className="text-success fw-bold">
                  KES {Number(user.referralEarnings || 0).toLocaleString()}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  </div>

</div>

{/* REFERRAL RELATIONSHIPS */}

<div className="card shadow">

  <div className="card-header d-flex justify-content-between align-items-center">

    <strong>Referral Relationships</strong>

    <span className="badge bg-dark">
      {data.referredUsers.length} Records
    </span>

  </div>

  <div className="card-body">

    <div className="table-responsive">

      <table className="table table-hover mb-0">

        <thead className="table-dark">

          <tr>

            <th>New User</th>
            <th>Email</th>
            <th>Referred By</th>
            <th>Date Joined</th>

          </tr>

        </thead>

        <tbody>

          {data.referredUsers.length === 0 ? (

            <tr>

              <td colSpan="4" className="text-center">
                No referrals found.
              </td>

            </tr>

          ) : (

            data.referredUsers.map((user) => (

              <tr key={user._id}>

                <td>{user.fullName}</td>

                <td>{user.email}</td>

                <td>{user.referredBy?.fullName || "-"}</td>

                <td>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

              </tr>

            ))

          )}

        </tbody>
</table>

    </div>

  </div>

</div>

        </div>

      </div>

    </div>

  );
}