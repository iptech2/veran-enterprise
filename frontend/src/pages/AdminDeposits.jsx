// import { useEffect, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import api from "../services/api";

// export default function AdminDeposits() {
//   const [deposits, setDeposits] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadDeposits = async () => {
//     try {
//       const res = await api.get("/admin/deposits");
//       setDeposits(res.data);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       alert("Failed to load deposits");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDeposits();
//   }, []);

//   if (loading) {
//     return (
//       <div className="d-flex">
//         <AdminSidebar />
//         <div className="container-fluid p-5">
//           <h3>Loading Deposits...</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="d-flex">
//       <AdminSidebar />

//       <div className="container-fluid p-4">

//         <h2 className="mb-4">M-Pesa Deposits</h2>

//         <div className="card shadow">

//           <div className="card-header bg-success text-white">
//             <h4 className="mb-0">
//               Deposit History
//             </h4>
//           </div>

//           <div className="table-responsive">

//             <table className="table table-striped table-hover">

//               <thead className="table-dark">
//                 <tr>
//                   <th>User</th>
//                   <th>Phone</th>
//                   <th>Amount</th>
//                   <th>Receipt</th>
//                   <th>Status</th>
//                   <th>Date</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {deposits.length === 0 ? (
//                   <tr>
//                     <td colSpan="6" className="text-center">
//                       No deposits found.
//                     </td>
//                   </tr>
//                 ) : (
//                   deposits.map((deposit) => (
//                     <tr key={deposit._id}>

//                       <td>
//                         {deposit.user?.fullName}
//                       </td>

//                       <td>
//                         {deposit.phone || "-"}
//                       </td>

//                       <td>
//                         KES {deposit.amount.toLocaleString()}
//                       </td>

//                       <td>
//                         {deposit.reference}
//                       </td>

//                       <td>
//                         <span
//                           className={
//                             deposit.status === "completed"
//                               ? "badge bg-success"
//                               : deposit.status === "pending"
//                               ? "badge bg-warning text-dark"
//                               : "badge bg-danger"
//                           }
//                         >
//                           {deposit.status}
//                         </span>
//                       </td>

//                       <td>
//                         {new Date(
//                           deposit.createdAt
//                         ).toLocaleString()}
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

export default function AdminDeposits() {
  const [deposits, setDeposits] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const loadDeposits = async () => {
    try {
      const res = await api.get("/admin/deposits");

      setDeposits(res.data.deposits);
      setStats(res.data.stats);

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load deposits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const filteredDeposits = useMemo(() => {
    return deposits.filter((deposit) => {

      const matchesSearch =
        deposit.user?.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        deposit.user?.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        deposit.reference
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "all"
          ? true
          : deposit.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [deposits, search, status]);

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid p-5">
          <h3>Loading Deposits...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="container-fluid p-4">

        <h2 className="mb-4">
          💵 M-Pesa Deposits
        </h2>

        <div className="row mb-4">

          <div className="col-md-3">
            <div className="card shadow text-center">
              <div className="card-body">
                <h6>Total Deposits</h6>
                <h4>
                  KES {(stats.completedAmount || 0).toLocaleString()}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center">
              <div className="card-body">
                <h6>Completed</h6>
                <h4 className="text-success">
                  {stats.completedTransactions || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center">
              <div className="card-body">
                <h6>Pending</h6>
                <h4 className="text-warning">
                  {stats.pendingTransactions || 0}
                </h4>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow text-center">
              <div className="card-body">
                <h6>Failed</h6>
                <h4 className="text-danger">
                  {stats.failedTransactions || 0}
                </h4>
              </div>
            </div>
          </div>

        </div>

        <div className="card shadow">

          <div className="card-header bg-success text-white">
            <div className="row">

              <div className="col-md-6">
                <input
                  className="form-control"
                  placeholder="Search user, email or receipt..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div className="col-md-3">
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

            </div>
          </div>

          <div className="table-responsive">

            <table className="table table-hover table-striped">

              <thead className="table-dark">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Amount</th>
                  <th>Receipt</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {filteredDeposits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No deposits found.
                    </td>
                  </tr>
                ) : (
                  filteredDeposits.map((deposit) => (
                    <tr key={deposit._id}>

                      <td>{deposit.user?.fullName}</td>

                      <td>{deposit.user?.email}</td>

                      <td>
                        KES {deposit.amount.toLocaleString()}
                      </td>

                      <td>{deposit.reference}</td>

                      <td>

                        <span
                          className={
                            deposit.status === "completed"
                              ? "badge bg-success"
                              : deposit.status === "pending"
                              ? "badge bg-warning text-dark"
                              : "badge bg-danger"
                          }
                        >
                          {deposit.status}
                        </span>

                      </td>

                      <td>
                        {new Date(
                          deposit.createdAt
                        ).toLocaleString()}
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