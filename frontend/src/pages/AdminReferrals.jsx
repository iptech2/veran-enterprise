import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

export default function AdminReferrals() {
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
      alert(err.response?.data?.message || "Failed to load referrals");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid p-5">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4">

        <h2 className="mb-4">Referral Management</h2>

        <div className="row mb-4">

          <div className="col-md-6">
            <div className="card shadow text-center">
              <div className="card-body">
                <h5>Total Referral Commission</h5>
                <h3 className="text-success">
                  KES {data.totalCommission}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow text-center">
              <div className="card-body">
                <h5>Total Successful Referrals</h5>
                <h3>{data.totalReferrals}</h3>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow mb-4">

          <div className="card-header">
            <strong>Top Referrers</strong>
          </div>

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-bordered">

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

                  {data.topReferrers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.referralCode}</td>
                      <td>{user.referralCount}</td>
                      <td>KES {user.referralEarnings}</td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

        <div className="card shadow">

          <div className="card-header">
            <strong>Referral Relationships</strong>
          </div>

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover">

                <thead className="table-dark">
                  <tr>
                    <th>New User</th>
                    <th>Email</th>
                    <th>Referred By</th>
                    <th>Date Joined</th>
                  </tr>
                </thead>

                <tbody>

                  {data.referredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>
                        {user.referredBy?.fullName}
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}