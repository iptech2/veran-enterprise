import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOAD WALLET + WITHDRAWAL HISTORY
  // ==========================================
  const loadData = async () => {
    try {
      const wallet = await api.get("/wallet/balance");
      setBalance(wallet.data.balance || 0);

      const history = await api.get("/withdrawals");
      setWithdrawals(history.data || []);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // SUBMIT WITHDRAWAL
  // ==========================================
  const submitWithdrawal = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid withdrawal amount.");
    }

    if (Number(amount) > Number(balance)) {
      return alert(
        "Insufficient wallet balance. Please enter an amount within your available balance."
      );
    }

    if (!phone.trim()) {
      return alert("Enter your M-Pesa phone number.");
    }

    const confirmed = window.confirm(
      `Confirm withdrawal of KES ${Number(
        amount
      ).toLocaleString()} to M-Pesa number ${phone.trim()}?`
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      const res = await api.post("/withdrawals", {
        amount: Number(amount),
        phone: phone.trim(),
      });

      alert(
        res.data.message ||
          "Withdrawal request submitted successfully."
      );

      setAmount("");
      setPhone("");

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Withdrawal failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATUS BADGE
  // ==========================================
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
      case "completed":
        return "bg-success";

      case "rejected":
      case "failed":
        return "bg-danger";

      case "pending":
        return "bg-warning text-dark";

      default:
        return "bg-secondary";
    }
  };

  // ==========================================
  // FORMAT STATUS
  // ==========================================
  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">

        {/* ==========================================
            PAGE HEADER
        ========================================== */}

        <div className="text-center mb-5">

          <h1 className="fw-bold">
            Withdraw Funds
          </h1>

          <p className="text-muted mb-0">
            Request a withdrawal from your Veran
            Enterprise wallet to your M-Pesa number.
          </p>

        </div>


        {/* ==========================================
            BALANCE CARD
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="row align-items-center">

              <div className="col-md-7">

                <p className="text-muted mb-1">
                  Available Wallet Balance
                </p>

                <h2 className="fw-bold text-success mb-0">
                  KES{" "}
                  {Number(balance).toLocaleString()}
                </h2>

              </div>

              <div className="col-md-5 text-md-end mt-3 mt-md-0">

                <span className="badge bg-light text-dark border px-3 py-2">
                  Available for Withdrawal
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            WITHDRAWAL FORM
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4 p-md-5">

            <div className="mb-4">

              <h4 className="fw-bold mb-1">
                Request Withdrawal
              </h4>

              <p className="text-muted mb-0">
                Enter the amount and M-Pesa number
                where you want to receive your money.
              </p>

            </div>


            <div className="row">

              {/* ==================================
                  AMOUNT
              ================================== */}

              <div className="col-md-6 mb-4">

                <label className="form-label fw-semibold">
                  Withdrawal Amount
                </label>

                <div className="input-group input-group-lg">

                  <span className="input-group-text fw-semibold">
                    KES
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
                    min="1"
                    value={amount}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                  />

                </div>

                <small className="text-muted">
                  Maximum available: KES{" "}
                  {Number(balance).toLocaleString()}
                </small>

              </div>


              {/* ==================================
                  PHONE
              ================================== */}

              <div className="col-md-6 mb-4">

                <label className="form-label fw-semibold">
                  M-Pesa Phone Number
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="2547XXXXXXXX"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

                <small className="text-muted">
                  Enter the M-Pesa number that should
                  receive the withdrawal.
                </small>

              </div>

            </div>


            {/* ==================================
                QUICK AMOUNT BUTTONS
            ================================== */}

            <div className="mb-4">

              <label className="form-label fw-semibold">
                Quick Amount
              </label>

              <div className="d-flex flex-wrap gap-2">

                {[500, 1000, 2000, 5000].map(
                  (quickAmount) => (

                    <button
                      key={quickAmount}
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        if (
                          quickAmount <=
                          Number(balance)
                        ) {
                          setAmount(
                            quickAmount.toString()
                          );
                        } else {
                          alert(
                            "This amount is higher than your available wallet balance."
                          );
                        }
                      }}
                    >
                      KES{" "}
                      {quickAmount.toLocaleString()}
                    </button>

                  )
                )}

              </div>

            </div>


            {/* ==================================
                SUBMIT BUTTON
            ================================== */}

            <div className="d-grid">

              <button
                type="button"
                className="btn btn-danger btn-lg rounded-3"
                onClick={submitWithdrawal}
                disabled={
                  loading || Number(balance) <= 0
                }
              >
                {loading
                  ? "Submitting Withdrawal..."
                  : "Request Withdrawal"}
              </button>

            </div>


            {/* ==================================
                WITHDRAWAL NOTICE
            ================================== */}

            <div className="alert alert-warning border-0 rounded-3 mt-4 mb-0">

              <div className="d-flex">

                <div className="me-2">
                  ⚠️
                </div>

                <div>

                  <strong>
                    Withdrawal Notice
                  </strong>

                  <p className="mb-0 mt-1 small">
                    Make sure the amount and M-Pesa
                    phone number are correct before
                    submitting your request. Withdrawal
                    requests are reviewed and processed
                    by Veran Enterprise.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ==========================================
            WITHDRAWAL HISTORY
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-4 p-md-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h4 className="fw-bold mb-1">
                  Withdrawal History
                </h4>

                <p className="text-muted mb-0">
                  Track your previous withdrawal
                  requests.
                </p>

              </div>

              <span className="badge bg-light text-dark border px-3 py-2">
                {withdrawals.length}{" "}
                {withdrawals.length === 1
                  ? "Request"
                  : "Requests"}
              </span>

            </div>


            {withdrawals.length === 0 ? (

              <div className="text-center py-5">

                <div
                  className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                  style={{
                    width: "70px",
                    height: "70px",
                    fontSize: "30px",
                  }}
                >
                  💸
                </div>

                <h5 className="fw-bold">
                  No withdrawals yet
                </h5>

                <p className="text-muted mb-0">
                  Your withdrawal requests will
                  appear here.
                </p>

              </div>

            ) : (

              <div>

                {withdrawals.map((item) => (

                  <div
                    key={item._id}
                    className="border rounded-4 p-4 mb-3"
                  >

                    <div className="row align-items-center">

                      {/* Amount */}

                      <div className="col-md-4 mb-3 mb-md-0">

                        <small className="text-muted d-block">
                          Amount
                        </small>

                        <h5 className="fw-bold mb-0">
                          KES{" "}
                          {Number(
                            item.amount || 0
                          ).toLocaleString()}
                        </h5>

                      </div>


                      {/* Phone */}

                      <div className="col-md-4 mb-3 mb-md-0">

                        <small className="text-muted d-block">
                          M-Pesa Number
                        </small>

                        <span className="fw-semibold">
                          {item.phone || "-"}
                        </span>

                      </div>


                      {/* Status */}

                      <div className="col-md-4">

                        <small className="text-muted d-block mb-1">
                          Status
                        </small>

                        <span
                          className={`badge ${getStatusBadge(
                            item.status
                          )} px-3 py-2`}
                        >
                          {formatStatus(
                            item.status
                          )}
                        </span>

                      </div>

                    </div>


                    <hr />


                    <div className="row">

                      {/* Date */}

                      <div className="col-md-6">

                        <small className="text-muted d-block">
                          Request Date
                        </small>

                        <span>
                          {item.createdAt
                            ? new Date(
                                item.createdAt
                              ).toLocaleString()
                            : "-"}
                        </span>

                      </div>


                      {/* Reference */}

                      <div className="col-md-6 mt-3 mt-md-0">

                        <small className="text-muted d-block">
                          Reference
                        </small>

                        <span className="text-break">
                          {item.reference ||
                            item._id ||
                            "-"}
                        </span>

                      </div>

                    </div>


                    {/* Admin Note */}

                    {item.adminNote && (

                      <div className="alert alert-light border mt-3 mb-0">

                        <small className="text-muted d-block">
                          Admin Note
                        </small>

                        <span>
                          {item.adminNote}
                        </span>

                      </div>

                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>


        {/* ==========================================
            SECURITY NOTICE
        ========================================== */}

        <div className="alert alert-light border rounded-4 mt-4">

          <h6 className="fw-bold mb-2">
            🔐 Wallet Security
          </h6>

          <p className="text-muted small mb-0">
            Never share your password, PIN, or other
            account security information with anyone.
            Veran Enterprise will never ask you to
            disclose your M-Pesa PIN.
          </p>

        </div>

      </div>
    </>
  );
}
