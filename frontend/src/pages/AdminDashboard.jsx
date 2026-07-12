import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===========================
      LOAD DASHBOARD
  =========================== */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        statsRes,
        usersRes,
        investmentsRes,
        transactionsRes,
        withdrawalsRes,
      ] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/investments"),
        api.get("/admin/transactions"),
        api.get("/admin/withdrawals"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setInvestments(investmentsRes.data);
      setTransactions(transactionsRes.data);
      setWithdrawals(withdrawalsRes.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ===========================
      APPROVE / REJECT
  =========================== */

  const updateWithdrawal = async (id, status) => {
    try {
      await api.put(`/admin/withdrawals/${id}`, {
        status,
      });

      alert(`Withdrawal ${status} successfully.`);
      loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed.");
    }
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />

        <div className="flex-grow-1">

          <AdminNavbar />

          <div className="container-fluid p-5">
            <h3>Loading Admin Dashboard...</h3>
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
          <h2 className="fw-bold">Dashboard</h2>
          <p className="text-muted">
            Welcome to the Veran Enterprise Administration Panel.
          </p>
        </div>

        {/* =======================
            STATISTICS
        ======================= */}

        <div className="row g-3 mb-4">

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 bg-primary text-white">
              <div className="card-body">
                <h6>Total Users</h6>
                <h2>{stats.users || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 bg-success text-white">
              <div className="card-body">
                <h6>Total Balance</h6>
                <h2>KES {stats.totalBalance || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 bg-warning">
              <div className="card-body">
                <h6>Total Investments</h6>
                <h2>{stats.investments || 0}</h2>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="card shadow border-0 bg-dark text-white">
              <div className="card-body">
                <h6>Transactions</h6>
                <h2>{stats.transactions || 0}</h2>
              </div>
            </div>
          </div>

        </div>

        {/* USERS */}

        <div className="card shadow mb-4">

          <div className="card-header fw-bold">
            Users
          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Balance</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fullName || user.name}</td>
                    <td>{user.email}</td>
                    <td>KES {user.balance}</td>
                    <td>
                      <span className="badge bg-primary">
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* INVESTMENTS */}

        <div className="card shadow mb-4">

          <div className="card-header fw-bold">
            Investments
          </div>

          <div className="table-responsive">

            <table className="table table-striped mb-0">

              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Profit</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {investments.map((item) => (
                  <tr key={item._id}>
                    <td>{item.user?.fullName || item.user?.name}</td>
                    <td>{item.package?.name}</td>
                    <td>KES {item.amount}</td>
                    <td>KES {item.profit}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* TRANSACTIONS */}

        <div className="card shadow mb-4">

          <div className="card-header fw-bold">
            Transactions
          </div>

          <div className="table-responsive">

            <table className="table table-striped mb-0">

              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {transactions.map((trx) => (
                  <tr key={trx._id}>
                    <td>{trx.user?.fullName || trx.user?.name}</td>
                    <td>{trx.type}</td>
                    <td>KES {trx.amount}</td>
                    <td>{trx.status}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* WITHDRAWALS */}

        <div className="card shadow">

          <div className="card-header fw-bold">
            Withdrawal Requests
          </div>

          <div className="table-responsive">

            <table className="table table-hover mb-0">

              <thead className="table-light">
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {withdrawals.map((item) => (
                  <tr key={item._id}>

                    <td>{item.user?.fullName || item.user?.name}</td>

                    <td>KES {item.amount}</td>

                    <td>{item.status}</td>

                    <td>

                      {item.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm me-2"
                            onClick={() =>
                              updateWithdrawal(item._id, "approved")
                            }
                          >
                            Approve
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              updateWithdrawal(item._id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

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