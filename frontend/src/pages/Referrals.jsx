import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Referrals() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      const res = await api.get("/referrals");
      setData(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load referrals");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(data.referralLink);
    alert("Referral link copied!");
  };

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <h3>Loading...</h3>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">
          Referral Dashboard
        </h2>

        <div className="row">

          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5>Total Referrals</h5>
                <h2>{data.totalReferrals}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5>Referral Earnings</h5>
                <h2>KES {data.referralEarnings}</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow">
              <div className="card-body text-center">
                <h5>Your Referral Code</h5>
                <h3>{data.referralCode}</h3>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow mb-4">

          <div className="card-body">

            <label className="form-label">
              Referral Link
            </label>

            <div className="input-group">

              <input
                className="form-control"
                value={data.referralLink}
                readOnly
              />

              <button
                className="btn btn-success"
                onClick={copyLink}
              >
                Copy
              </button>

            </div>

          </div>

        </div>

        <div className="card shadow">

          <div className="card-header">
            <h5>My Referrals</h5>
          </div>

          <div className="table-responsive">

            <table className="table table-hover">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>

                {data.referrals.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>KES {user.balance}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>
    </>
  );
}
