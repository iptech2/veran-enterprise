// import { useEffect, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import AdminNavbar from "../components/AdminNavbar";
// import api from "../services/api";

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({});
//   const [users, setUsers] = useState([]);
//   const [investments, setInvestments] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [withdrawals, setWithdrawals] = useState([]);
//   const [loading, setLoading] = useState(true);

// const [sidebarOpen, setSidebarOpen] = useState(false);

// const toggleSidebar = () => {  setSidebarOpen((prev) => !prev);};

//   /* ===========================
//       LOAD DASHBOARD
//   =========================== */

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       const [
//         statsRes,
//         usersRes,
//         investmentsRes,
//         transactionsRes,
//         withdrawalsRes,
//       ] = await Promise.all([
//         api.get("/admin/dashboard"),
//         api.get("/admin/users"),
//         api.get("/admin/investments"),
//         api.get("/admin/transactions"),
//         api.get("/admin/withdrawals"),
//       ]);

//       setStats(statsRes.data);
//       setUsers(usersRes.data);
//       setInvestments(investmentsRes.data);
//       setTransactions(transactionsRes.data);
//       setWithdrawals(withdrawalsRes.data);
//     } catch (err) {
//       console.error(err.response?.data || err.message);
//       alert("Failed to load admin dashboard.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDashboard();
//   }, []);

//   /* ===========================
//       APPROVE / REJECT
//   =========================== */

//   const updateWithdrawal = async (id, status) => {
//     try {
//       await api.put(`/admin/withdrawals/${id}`, {
//         status,
//       });

//       alert(`Withdrawal ${status} successfully.`);
//       loadDashboard();
//     } catch (err) {
//       alert(err.response?.data?.message || "Operation failed.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex">
//         {/* <AdminSidebar /> */}
//         <AdminSidebar isOpen={sidebarOpen}   toggleSidebar={toggleSidebar}/>

//         <div className="flex-grow-1">

//             <AdminNavbar toggleSidebar={toggleSidebar} />

//           <div className="container-fluid p-5">
//             <h3>Loading Admin Dashboard...</h3>
//           </div>

//         </div>
//       </div>
//     );
//   }

// return (
//   <div className="d-flex">

//     <AdminSidebar
//   isOpen={sidebarOpen}
//   toggleSidebar={toggleSidebar}
// />

// <div className="flex-grow-1 bg-light">

//   <AdminNavbar
//     toggleSidebar={toggleSidebar}
//   />

//       <div className="container-fluid p-4">

//         <div className="mb-4">
//           <h2 className="fw-bold">Dashboard</h2>
//           <p className="text-muted">
//             Welcome to the Veran Enterprise Administration Panel.
//           </p>
//         </div>

//         {/* =======================
//             STATISTICS
//         ======================= */}

//         <div className="row g-3 mb-4">

//           <div className="col-lg-3 col-md-6">
//             <div className="card shadow border-0 bg-primary text-white">
//               <div className="card-body">
//                 <h6>Total Users</h6>
//                 <h2>{stats.users || 0}</h2>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-6">
//             <div className="card shadow border-0 bg-success text-white">
//               <div className="card-body">
//                 <h6>Total Balance</h6>
//                 <h2>KES {stats.totalBalance || 0}</h2>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-6">
//             <div className="card shadow border-0 bg-warning">
//               <div className="card-body">
//                 <h6>Total Investments</h6>
//                 <h2>{stats.investments || 0}</h2>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-3 col-md-6">
//             <div className="card shadow border-0 bg-dark text-white">
//               <div className="card-body">
//                 <h6>Transactions</h6>
//                 <h2>{stats.transactions || 0}</h2>
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* USERS */}

//         <div className="card shadow mb-4">

//           <div className="card-header fw-bold">
//             Users
//           </div>

//           <div className="table-responsive">

//             <table className="table table-hover align-middle mb-0">

//               <thead className="table-light">
//                 <tr>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Balance</th>
//                   <th>Role</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {users.map((user) => (
//                   <tr key={user._id}>
//                     <td>{user.fullName || user.name}</td>
//                     <td>{user.email}</td>
//                     <td>KES {user.balance}</td>
//                     <td>
//                       <span className="badge bg-primary">
//                         {user.role}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//         {/* INVESTMENTS */}

//         <div className="card shadow mb-4">

//           <div className="card-header fw-bold">
//             Investments
//           </div>

//           <div className="table-responsive">

//             <table className="table table-striped mb-0">

//               <thead className="table-light">
//                 <tr>
//                   <th>User</th>
//                   <th>Package</th>
//                   <th>Amount</th>
//                   <th>Profit</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {investments.map((item) => (
//                   <tr key={item._id}>
//                     <td>{item.user?.fullName || item.user?.name}</td>
//                     <td>{item.package?.name}</td>
//                     <td>KES {item.amount}</td>
//                     <td>KES {item.profit}</td>
//                     <td>{item.status}</td>
//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//         {/* TRANSACTIONS */}

//         <div className="card shadow mb-4">

//           <div className="card-header fw-bold">
//             Transactions
//           </div>

//           <div className="table-responsive">

//             <table className="table table-striped mb-0">

//               <thead className="table-light">
//                 <tr>
//                   <th>User</th>
//                   <th>Type</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {transactions.map((trx) => (
//                   <tr key={trx._id}>
//                     <td>{trx.user?.fullName || trx.user?.name}</td>
//                     <td>{trx.type}</td>
//                     <td>KES {trx.amount}</td>
//                     <td>{trx.status}</td>
//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//         {/* WITHDRAWALS */}

//         <div className="card shadow">

//           <div className="card-header fw-bold">
//             Withdrawal Requests
//           </div>

//           <div className="table-responsive">

//             <table className="table table-hover mb-0">

//               <thead className="table-light">
//                 <tr>
//                   <th>User</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {withdrawals.map((item) => (
//                   <tr key={item._id}>

//                     <td>{item.user?.fullName || item.user?.name}</td>

//                     <td>KES {item.amount}</td>

//                     <td>{item.status}</td>

//                     <td>

//                       {item.status === "pending" && (
//                         <>
//                           <button
//                             className="btn btn-success btn-sm me-2"
//                             onClick={() =>
//                               updateWithdrawal(item._id, "approved")
//                             }
//                           >
//                             Approve
//                           </button>

//                           <button
//                             className="btn btn-danger btn-sm"
//                             onClick={() =>
//                               updateWithdrawal(item._id, "rejected")
//                             }
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}

//                     </td>

//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       </div>

//     </div>

//   </div>
// );
// }

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
  const [manualDeposits, setManualDeposits] = useState([]);

  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

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
        manualDepositsRes,
      ] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/investments"),
        api.get("/admin/transactions"),
        api.get("/admin/withdrawals"),
        api.get("/manual-deposits/admin/pending"),
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setInvestments(investmentsRes.data);
      setTransactions(transactionsRes.data);
      setWithdrawals(withdrawalsRes.data);
      setManualDeposits(manualDepositsRes.data);
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
      WITHDRAWAL APPROVE / REJECT
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

  /* ===========================
      MANUAL DEPOSIT APPROVE
  =========================== */

  const approveManualDeposit = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this deposit? The user's wallet will be credited."
    );

    if (!confirmed) return;

    try {
      await api.put(`/manual-deposits/admin/${id}/approve`);

      alert("Manual deposit approved and wallet credited.");

      loadDashboard();
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
          "Failed to approve manual deposit."
      );
    }
  };

  /* ===========================
      MANUAL DEPOSIT REJECT
  =========================== */

  const rejectManualDeposit = async (id) => {
    const adminNote = window.prompt(
      "Enter a reason for rejecting this deposit:"
    );

    if (adminNote === null) return;

    try {
      await api.put(`/manual-deposits/admin/${id}/reject`, {
        adminNote:
          adminNote.trim() ||
          "Deposit rejected by administrator.",
      });

      alert("Manual deposit rejected.");

      loadDashboard();
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert(
        err.response?.data?.message ||
          "Failed to reject manual deposit."
      );
    }
  };

  /* ===========================
      LOADING
  =========================== */

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-grow-1">
          <AdminNavbar toggleSidebar={toggleSidebar} />

          <div className="container-fluid p-5">
            <h3>Loading Admin Dashboard...</h3>
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
                  <h2>
                    KES {stats.totalBalance || 0}
                  </h2>
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

          {/* =======================
              MANUAL M-PESA DEPOSITS
          ======================= */}

          <div className="card shadow mb-4">

            <div className="card-header fw-bold d-flex justify-content-between align-items-center">

              <span>
                Manual M-Pesa Deposit Requests
              </span>

              <span className="badge bg-warning text-dark">
                {manualDeposits.length} Pending
              </span>

            </div>

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone Used</th>
                    <th>Amount</th>
                    <th>Till</th>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>

                </thead>

                <tbody>

                  {manualDeposits.length === 0 ? (

                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-muted py-4"
                      >
                        No pending manual deposits.
                      </td>
                    </tr>

                  ) : (

                    manualDeposits.map((item) => (

                      <tr key={item._id}>

                        <td>
                          <strong>
                            {item.user?.fullName ||
                              item.user?.name ||
                              "Unknown User"}
                          </strong>
                        </td>

                        <td>
                          {item.user?.email || "-"}
                        </td>

                        <td>
                          {item.phone}
                        </td>

                        <td>
                          <strong>
                            KES {Number(item.amount).toLocaleString()}
                          </strong>
                        </td>

                        <td>
                          <span className="badge bg-dark">
                            {item.tillNumber}
                          </span>
                        </td>

                        <td>
                          <small>
                            {item.reference}
                          </small>
                        </td>

                        <td>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td>

                          <div className="d-flex gap-2">

                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                approveManualDeposit(
                                  item._id
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                rejectManualDeposit(
                                  item._id
                                )
                              }
                            >
                              Reject
                            </button>

                          </div>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* =======================
              USERS
          ======================= */}

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

                      <td>
                        {user.fullName || user.name}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        KES {user.balance}
                      </td>

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

          {/* =======================
              INVESTMENTS
          ======================= */}

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

                      <td>
                        {item.user?.fullName ||
                          item.user?.name}
                      </td>

                      <td>
                        {item.package?.name}
                      </td>

                      <td>
                        KES {item.amount}
                      </td>

                      <td>
                        KES {item.profit}
                      </td>

                      <td>
                        {item.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* =======================
              TRANSACTIONS
          ======================= */}

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

                      <td>
                        {trx.user?.fullName ||
                          trx.user?.name}
                      </td>

                      <td>
                        {trx.type}
                      </td>

                      <td>
                        KES {trx.amount}
                      </td>

                      <td>
                        {trx.status}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

          {/* =======================
              WITHDRAWALS
          ======================= */}

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

                      <td>
                        {item.user?.fullName ||
                          item.user?.name}
                      </td>

                      <td>
                        KES {item.amount}
                      </td>

                      <td>
                        {item.status}
                      </td>

                      <td>

                        {item.status === "pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() =>
                                updateWithdrawal(
                                  item._id,
                                  "approved"
                                )
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                updateWithdrawal(
                                  item._id,
                                  "rejected"
                                )
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
