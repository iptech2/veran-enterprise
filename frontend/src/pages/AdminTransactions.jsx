// import { useEffect, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import api from "../services/api";

// export default function AdminTransactions() {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadTransactions = async () => {
//     try {
//       const res = await api.get("/admin/transactions");
//       setTransactions(res.data);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       alert("Failed to load transactions");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadTransactions();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex">
//         <AdminSidebar />
//         <div className="container-fluid p-5">
//           <h3>Loading Transactions...</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="d-flex">
//       <AdminSidebar />

//       <div className="container-fluid p-4">

//         <h2 className="mb-4">Transactions</h2>

//         <div className="card shadow">

//           <div className="card-header bg-dark text-white">
//             <h4 className="mb-0">All Transactions</h4>
//           </div>

//           <div className="table-responsive">

//             <table className="table table-hover table-striped">

//               <thead className="table-dark">
//                 <tr>
//                   <th>User</th>
//                   <th>Type</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                   <th>Description</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {transactions.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center">
//                       No transactions found.
//                     </td>
//                   </tr>
//                 ) : (
//                   transactions.map((trx) => (
//                     <tr key={trx._id}>

//                       <td>
//                         {trx.user?.fullName || "N/A"}
//                       </td>

//                       <td>
//                         <span
//                           className={
//                             trx.type === "deposit"
//                               ? "badge bg-success"
//                               : trx.type === "withdrawal"
//                               ? "badge bg-danger"
//                               : trx.type === "investment"
//                               ? "badge bg-primary"
//                               : trx.type === "profit"
//                               ? "badge bg-warning text-dark"
//                               : trx.type === "referral"
//                               ? "badge bg-info"
//                               : "badge bg-secondary"
//                           }
//                         >
//                           {trx.type}
//                         </span>
//                       </td>

//                       <td>
//                         KES {trx.amount.toLocaleString()}
//                       </td>

//                       <td>
//                         <span
//                           className={
//                             trx.status === "completed"
//                               ? "badge bg-success"
//                               : trx.status === "pending"
//                               ? "badge bg-warning text-dark"
//                               : trx.status === "approved"
//                               ? "badge bg-primary"
//                               : trx.status === "rejected"
//                               ? "badge bg-danger"
//                               : "badge bg-secondary"
//                           }
//                         >
//                           {trx.status}
//                         </span>
//                       </td>

//                       <td>{trx.description}</td>

//                       <td>
//                         {new Date(trx.createdAt).toLocaleString()}
//                       </td>

//                     </tr>
//                   ))
//                 )}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

export default function AdminTransactions() {

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // ==========================
  // LOAD TRANSACTIONS
  // ==========================

  const loadTransactions = async () => {
    try {
      const res = await api.get("/admin/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // ==========================
  // SUMMARY CARDS
  // ==========================

  const stats = useMemo(() => {

    return {

      total: transactions.length,

      deposits: transactions.filter(
        t => t.type === "deposit"
      ).length,

      withdrawals: transactions.filter(
        t => t.type === "withdrawal"
      ).length,

      profits: transactions.filter(
        t => t.type === "profit"
      ).length,

    };

  }, [transactions]);

  // ==========================
  // FILTER
  // ==========================

  const filteredTransactions = transactions.filter((trx) => {

    const keyword = search.toLowerCase();

    const searchMatch =
      trx.user?.fullName?.toLowerCase().includes(keyword) ||
      trx.user?.email?.toLowerCase().includes(keyword) ||
      trx.reference?.toLowerCase().includes(keyword);

    const typeMatch =
      typeFilter === "all"
        ? true
        : trx.type === typeFilter;

    const statusMatch =
      statusFilter === "all"
        ? true
        : trx.status === statusFilter;

    return searchMatch && typeMatch && statusMatch;

  });

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid p-5">
          <h3>Loading Transactions...</h3>
        </div>
      </div>
    );
  }

  return (

    <div className="d-flex">

      <AdminSidebar />

      <div className="container-fluid p-4">

        <h2 className="fw-bold mb-4">
          Transactions Management
        </h2>

        {/* SUMMARY */}

        <div className="row mb-4">

          <div className="col-md-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <h6>Total</h6>
                <h3>{stats.total}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <h6>Deposits</h6>
                <h3 className="text-success">
                  {stats.deposits}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <h6>Withdrawals</h6>
                <h3 className="text-danger">
                  {stats.withdrawals}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center border-0">
              <div className="card-body">
                <h6>Profits Paid</h6>
                <h3 className="text-warning">
                  {stats.profits}
                </h3>
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH */}

        <div className="card shadow mb-3">

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-5">

                <input
                  className="form-control"
                  placeholder="Search user or reference..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

              <div className="col-md-3">

                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(e.target.value)
                  }
                >

                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdrawal">Withdrawal</option>
                  <option value="investment">Investment</option>
                  <option value="profit">Profit</option>
                  <option value="referral">Referral</option>

                </select>

              </div>

              <div className="col-md-4">

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >

                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="card shadow">

          <div className="card-header bg-dark text-white d-flex justify-content-between">

            <strong>All Transactions</strong>

            <span className="badge bg-light text-dark">
              {filteredTransactions.length} Records
            </span>

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">

                <tr>

                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Date</th>

                </tr>

              </thead>

              <tbody>

                {filteredTransactions.length === 0 ? (

                  <tr>

                    <td colSpan="7" className="text-center">

                      No transactions found.

                    </td>

                  </tr>

                ) : (

                  filteredTransactions.map((trx) => (

                    <tr key={trx._id}>

                      <td>
                        {trx.user?.fullName}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            trx.type === "deposit"
                              ? "bg-success"
                              : trx.type === "withdrawal"
                              ? "bg-danger"
                              : trx.type === "investment"
                              ? "bg-primary"
                              : trx.type === "profit"
                              ? "bg-warning text-dark"
                              : trx.type === "referral"
                              ? "bg-info"
                              : "bg-secondary"
                          }`}
                        >
                          {trx.type}
                        </span>

                      </td>

                      <td>
                        KES {trx.amount.toLocaleString()}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            trx.status === "completed"
                              ? "bg-success"
                              : trx.status === "pending"
                              ? "bg-warning text-dark"
                              : trx.status === "approved"
                              ? "bg-primary"
                              : trx.status === "rejected"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {trx.status}
                        </span>

                      </td>

                      <td>{trx.reference || "-"}</td>

                      <td>{trx.description}</td>

                      <td>
                        {new Date(trx.createdAt).toLocaleString()}
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

  );

}