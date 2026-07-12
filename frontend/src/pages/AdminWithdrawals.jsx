import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function AdminWithdrawals() {

  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  const [status, setStatus] = useState("paid");
  const [reference, setReference] = useState("");
  const [remarks, setRemarks] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // ============================
  // LOAD WITHDRAWALS
  // ============================

  const loadWithdrawals = async () => {

    try {

      const res = await api.get("/admin/withdrawals");

      setWithdrawals(res.data);

    } catch (err) {

      console.log(err);

      alert("Failed to load withdrawals.");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  // ============================
  // OPEN PROCESS MODAL
  // ============================

  const openModal = (withdrawal) => {

    setSelectedWithdrawal(withdrawal);

    setStatus("paid");

    setReference("");

    setRemarks("");

  };

  // ============================
  // CLOSE MODAL
  // ============================

  const closeModal = () => {

    setSelectedWithdrawal(null);

    setReference("");

    setRemarks("");

  };

  // ============================
  // PROCESS WITHDRAWAL
  // ============================

  const processWithdrawal = async () => {

    if (!selectedWithdrawal) return;

    try {

      await api.put(
        `/admin/withdrawals/${selectedWithdrawal._id}`,
        {
          status,
          reference,
          remarks,
        }
      );

      alert("Withdrawal updated successfully.");

      closeModal();

      loadWithdrawals();

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to process withdrawal."
      );

    }

  };

  // ============================
  // DASHBOARD CARDS
  // ============================

  const stats = useMemo(() => {

    return {

      pending: withdrawals.filter(
        (w) => w.status === "pending"
      ).length,

      paid: withdrawals.filter(
        (w) =>
          w.status === "paid" ||
          w.status === "approved"
      ).length,

      rejected: withdrawals.filter(
        (w) => w.status === "rejected"
      ).length,

      totalAmount: withdrawals.reduce(
        (sum, w) => sum + w.amount,
        0
      ),

    };

  }, [withdrawals]);

  // ============================
  // SEARCH
  // ============================

  // const filteredWithdrawals = withdrawals.filter((w) => {

  //   const keyword = search.toLowerCase();

  //   return (

  //     w.user?.fullName
  //       ?.toLowerCase()
  //       .includes(keyword) ||

  //     w.user?.email
  //       ?.toLowerCase()
  //       .includes(keyword) ||

  //     w.phone?.includes(keyword)

  //   );

  // });
  const filteredWithdrawals = withdrawals.filter((w) => {
  const keyword = search.toLowerCase();

  const matchesSearch =
    w.user?.fullName?.toLowerCase().includes(keyword) ||
    w.user?.email?.toLowerCase().includes(keyword) ||
    w.phone?.includes(keyword);

  const matchesStatus =
    filterStatus === "all"
      ? true
      : w.status === filterStatus;

  return matchesSearch && matchesStatus;
});

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="container mt-5">

          <h3>Loading Withdrawals...</h3>

        </div>
      </>
    );

  }
  return (
  <>
    <Navbar />

    <div className="container mt-4">

      <h2 className="fw-bold mb-4">
        Withdrawal Management
      </h2>

      {/* DASHBOARD */}

      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow text-center border-0">
            <div className="card-body">
              <h6>Pending</h6>
              <h3 className="text-warning">
                {stats.pending}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center border-0">
            <div className="card-body">
              <h6>Paid</h6>
              <h3 className="text-success">
                {stats.paid}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center border-0">
            <div className="card-body">
              <h6>Rejected</h6>
              <h3 className="text-danger">
                {stats.rejected}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center border-0">
            <div className="card-body">
              <h6>Total Requested</h6>
              <h4>
                KES {stats.totalAmount.toLocaleString()}
              </h4>
            </div>
          </div>
        </div>

      </div>

      {/* SEARCH */}

      {/* <div className="card shadow mb-3">

        <div className="card-body">

          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

      </div> */}

      <div className="card shadow mb-3">

  <div className="card-body">

    <div className="row g-3">

      <div className="col-md-8">

        <input
          type="text"
          className="form-control"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      <div className="col-md-4">

        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

      </div>

    </div>

  </div>

</div>

      {/* TABLE */}

      <div className="card shadow">

        {/* <div className="card-header bg-dark text-white">
          Withdrawal Requests
        </div> */}
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
  <span>Withdrawal Requests</span>
  <span className="badge bg-light text-dark">
    {filteredWithdrawals.length} Record(s)
  </span>
</div>

        <div className="table-responsive">

          <table className="table table-hover align-middle mb-0">

            <thead className="table-dark">

              <tr>

                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredWithdrawals.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center"
                  >
                    No withdrawal requests found.
                  </td>

                </tr>

              ) : (

                filteredWithdrawals.map((w) => (

                  <tr key={w._id}>

                    <td>{w.user?.fullName}</td>

                    <td>{w.user?.email}</td>

                    <td>{w.phone}</td>

                    <td>
                      KES {w.amount.toLocaleString()}
                    </td>

                    <td>

                      <span
                        className={`badge ${
                          w.status === "pending"
                            ? "bg-warning text-dark"
                            : w.status === "paid" ||
                              w.status === "approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {w.status}
                      </span>

                    </td>

                    <td>
                      {new Date(
                        w.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>

                      {w.status === "pending" ? (

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            openModal(w)
                          }
                        >
                          Process
                        </button>

                      ) : (

                        <span className="text-muted">
                          Completed
                        </span>

                      )}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

    {/* MODAL */}

    {selectedWithdrawal && (

      <div
        className="modal fade show d-block"
        style={{
          background:
            "rgba(0,0,0,0.5)",
        }}
      >

        <div className="modal-dialog">

          <div className="modal-content">

            <div className="modal-header">

              <h5>
                Process Withdrawal
              </h5>

              <button
                className="btn-close"
                onClick={closeModal}
              />

            </div>

            <div className="modal-body">

              <div className="mb-3">

                <label>Status</label>

                <select
                  className="form-select"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="paid">
                    Paid
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>

                </select>

              </div>

              <div className="mb-3">

                <label>
                  M-Pesa Reference
                </label>

                <input
                  className="form-control"
                  value={reference}
                  onChange={(e) =>
                    setReference(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="mb-3">

                <label>Remarks</label>

                <textarea
                  rows="3"
                  className="form-control"
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="modal-footer">

              <button
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                className="btn btn-success"
                onClick={processWithdrawal}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      </div>

    )}

  </>
);
}