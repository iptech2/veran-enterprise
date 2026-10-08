import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Wallet() {
  // ==========================================
  // CONSTANTS
  // ==========================================
  const TILL_NUMBER = "9207399";

  // ==========================================
  // WALLET
  // ==========================================
  const [balance, setBalance] = useState(0);

  // ==========================================
  // STK DEPOSIT
  // ==========================================
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // STK unavailable popup
  const [showStkUnavailable, setShowStkUnavailable] = useState(false);

  // ==========================================
  // MANUAL DEPOSIT
  // ==========================================
  const [manualAmount, setManualAmount] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualDeposits, setManualDeposits] = useState([]);

  // Copy Till
  const [copiedTill, setCopiedTill] = useState(false);

  // ==========================================
  // WITHDRAWAL
  // ==========================================
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawPhone, setWithdrawPhone] = useState("");
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // ==========================================
  // LOAD WALLET
  // ==========================================
  const loadWallet = async () => {
    try {
      const res = await api.get("/wallet/balance");
      setBalance(res.data.balance || 0);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ==========================================
  // LOAD MANUAL DEPOSIT HISTORY
  // ==========================================
  const loadManualDeposits = async () => {
    try {
      const res = await api.get("/manual-deposits/my");
      setManualDeposits(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================
  useEffect(() => {
    loadWallet();
    loadManualDeposits();
  }, []);

  // ==========================================
  // COPY TILL NUMBER
  // ==========================================
  const copyTillNumber = async () => {
    try {
      await navigator.clipboard.writeText(TILL_NUMBER);

      setCopiedTill(true);

      setTimeout(() => {
        setCopiedTill(false);
      }, 2000);
    } catch (err) {
      alert(`Till Number: ${TILL_NUMBER}`);
    }
  };

  // ==========================================
  // STK DEPOSIT
  // ==========================================
  const deposit = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Please enter a valid deposit amount.");
    }

    if (!phone.trim()) {
      return alert("Please enter your M-Pesa phone number.");
    }

    try {
      setLoading(true);

      const res = await api.post("/wallet/deposit", {
        amount: Number(amount),
        phone: phone.trim(),
      });

      alert(
        res.data.message ||
          "Payment request sent successfully."
      );

      setCheckingPayment(true);

      setTimeout(() => {
        setCheckingPayment(false);
        loadWallet();
      }, 5000);

      setAmount("");
      setPhone("");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Deposit failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STK BUTTON
  // ==========================================
  const handleStkDeposit = () => {
    setShowStkUnavailable(true);
  };

  // ==========================================
  // GO TO MANUAL DEPOSIT
  // ==========================================
  const goToManualDeposit = () => {
    setShowStkUnavailable(false);

    setTimeout(() => {
      document
        .getElementById("manual-deposit")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 150);
  };

  // ==========================================
  // MANUAL DEPOSIT
  // ==========================================
  const submitManualDeposit = async () => {
    if (
      !manualAmount ||
      Number(manualAmount) <= 0
    ) {
      return alert(
        "Please enter a valid deposit amount."
      );
    }

    if (!manualPhone.trim()) {
      return alert(
        "Please enter the M-Pesa phone number used for payment."
      );
    }

    try {
      setManualLoading(true);

      const res = await api.post("/manual-deposits", {
        amount: Number(manualAmount),
        phone: manualPhone.trim(),
      });

      alert(
        res.data.message ||
          "Manual deposit submitted successfully."
      );

      setManualAmount("");
      setManualPhone("");

      await loadManualDeposits();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to submit manual deposit."
      );
    } finally {
      setManualLoading(false);
    }
  };

  // ==========================================
  // WITHDRAWAL
  // ==========================================
  const withdraw = async () => {
    if (
      !withdrawAmount ||
      Number(withdrawAmount) <= 0
    ) {
      return alert(
        "Please enter a valid withdrawal amount."
      );
    }

    if (!withdrawPhone.trim()) {
      return alert(
        "Please enter your M-Pesa phone number."
      );
    }

    if (
      Number(withdrawAmount) > Number(balance)
    ) {
      return alert(
        "Insufficient wallet balance."
      );
    }

    try {
      setWithdrawLoading(true);

      const res = await api.post("/withdrawals", {
        amount: Number(withdrawAmount),
        phone: withdrawPhone.trim(),
      });

      alert(
        res.data.message ||
          "Withdrawal request submitted successfully."
      );

      setWithdrawAmount("");
      setWithdrawPhone("");

      await loadWallet();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Withdrawal failed. Please try again."
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  // ==========================================
  // STATUS HELPERS
  // ==========================================
  const getStatusBadge = (status) => {
    if (status === "approved") {
      return "bg-success";
    }

    if (status === "rejected") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  const getStatusText = (status) => {
    if (!status) return "Pending";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  return (
    <>
      <Navbar />

      {/* ==========================================
          PAGE
      ========================================== */}

      <div
        style={{
          backgroundColor: "#f6f9f7",
          minHeight: "100vh",
        }}
      >
        <div className="container py-4 py-md-5">

          {/* ==========================================
              PAGE HEADER
          ========================================== */}

          <div className="mb-4">
            <h2
              className="fw-bold mb-1"
              style={{ color: "#0f5132" }}
            >
              My Wallet
            </h2>

            <p className="text-muted mb-0">
              Manage your balance, deposits and withdrawals.
            </p>
          </div>

          {/* ==========================================
              WALLET BALANCE
          ========================================== */}

          <div
            className="card border-0 shadow rounded-4 mb-5 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0f5132 0%, #198754 65%, #20c997 100%)",
              color: "white",
            }}
          >
            <div className="card-body p-4 p-md-5">

              <div className="d-flex justify-content-between align-items-start">

                <div>

                  <p className="mb-2 opacity-75">
                    Available Wallet Balance
                  </p>

                  <h1 className="fw-bold mb-2">
                    KES{" "}
                    {Number(balance).toLocaleString()}
                  </h1>

                  <small className="opacity-75">
                    Available funds in your Veran wallet
                  </small>

                </div>

                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor:
                      "rgba(255,255,255,0.15)",
                    fontSize: "28px",
                  }}
                >
                  💰
                </div>

              </div>

            </div>
          </div>

          {/* ==========================================
              DEPOSIT
          ========================================== */}

          <div
            className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden"
            style={{
              borderTop: "4px solid #198754",
            }}
          >

            <div className="card-body p-4 p-md-5">

              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">

                <div>

                  <h4
                    className="fw-bold mb-1"
                    style={{ color: "#0f5132" }}
                  >
                    Deposit Money
                  </h4>

                  <p className="text-muted mb-0">
                    Add money to your Veran Enterprise wallet.
                  </p>

                </div>

                <span className="badge bg-warning text-dark px-3 py-2">
                  STK Temporarily Unavailable
                </span>

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Deposit Amount
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text">
                      KES
                    </span>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) =>
                        setAmount(e.target.value)
                      }
                    />

                  </div>

                </div>

                <div className="col-md-6 mb-3">

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

                </div>

              </div>

              <div className="d-grid">

                <button
                  type="button"
                  className="btn btn-success btn-lg rounded-3"
                  onClick={handleStkDeposit}
                  disabled={
                    loading || checkingPayment
                  }
                >
                  {checkingPayment
                    ? "Checking Payment..."
                    : "Deposit via M-Pesa STK"}
                </button>

              </div>

              <div
                className="alert border-0 rounded-3 mt-4 mb-0"
                style={{
                  backgroundColor: "#fff3cd",
                  color: "#664d03",
                }}
              >

                <div className="d-flex gap-2">

                  <span>⚠️</span>

                  <div>

                    <strong>
                      M-Pesa STK Push is temporarily unavailable
                    </strong>

                    <p className="mb-0 mt-1 small">
                      You can still fund your wallet using
                      the manual M-Pesa deposit option below.
                    </p>

                  </div>

                </div>

              </div>

            </div>
          </div>

          {/* ==========================================
              MANUAL DEPOSIT
          ========================================== */}

          <div
            id="manual-deposit"
            className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden"
            style={{
              borderTop: "4px solid #ffc107",
            }}
          >

            <div className="card-body p-4 p-md-5">

              <div className="mb-4">

                <h4
                  className="fw-bold mb-1"
                  style={{ color: "#0f5132" }}
                >
                  Manual M-Pesa Deposit
                </h4>

                <p className="text-muted mb-0">
                  Pay using M-Pesa Buy Goods and Services,
                  then submit your payment details below.
                </p>

              </div>

              {/* ==========================================
                  TILL PAYMENT CARD
              ========================================== */}

              <div
                className="rounded-4 p-4 mb-4 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #0f5132 0%, #198754 100%)",
                  color: "white",
                }}
              >

                <span
                  className="badge rounded-pill mb-2"
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#212529",
                  }}
                >
                  M-PESA PAYMENT
                </span>

                <p className="mb-1 opacity-75">
                  Veran Enterprise Buy Goods & Services
                </p>

                <h6 className="fw-semibold mb-2">
                  Till Number
                </h6>

                <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">

                  <h1 className="fw-bold mb-0">
                    {TILL_NUMBER}
                  </h1>

                  <button
                    type="button"
                    className={`btn ${
                      copiedTill
                        ? "btn-success"
                        : "btn-light"
                    } px-4 rounded-pill fw-semibold`}
                    onClick={copyTillNumber}
                  >
                    {copiedTill
                      ? "✓ Till Number Copied"
                      : "📋 Copy Till Number"}
                  </button>

                </div>

                <small className="d-block mt-3 opacity-75">
                  Tap the button above to copy the Till Number.
                </small>

              </div>

              {/* ==========================================
                  PAYMENT INSTRUCTIONS
              ========================================== */}

              <div
                className="rounded-4 p-4 mb-4"
                style={{
                  backgroundColor: "#fff9e6",
                  border: "1px solid #ffe69c",
                }}
              >

                <h6
                  className="fw-bold mb-3"
                  style={{ color: "#664d03" }}
                >
                  How to Deposit
                </h6>

                <ol className="mb-0">

                  <li className="mb-2">
                    Open <strong>M-Pesa</strong> on your phone.
                  </li>

                  <li className="mb-2">
                    Select <strong>Lipa na M-Pesa</strong>.
                  </li>

                  <li className="mb-2">
                    Select{" "}
                    <strong>
                      Buy Goods and Services
                    </strong>.
                  </li>

                  <li className="mb-2">
                    Enter Till Number{" "}
                    <strong>{TILL_NUMBER}</strong>.
                  </li>

                  <li className="mb-2">
                    Enter the amount you want to deposit.
                  </li>

                  <li className="mb-2">
                    Confirm and complete the M-Pesa payment.
                  </li>

                  <li>
                    Return here and submit the amount and
                    phone number used for the payment.
                  </li>

                </ol>

              </div>

              {/* ==========================================
                  MANUAL DEPOSIT FORM
              ========================================== */}

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Deposit Amount
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text">
                      KES
                    </span>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter amount paid"
                      value={manualAmount}
                      onChange={(e) =>
                        setManualAmount(
                          e.target.value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    M-Pesa Phone Used
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="2547XXXXXXXX"
                    value={manualPhone}
                    onChange={(e) =>
                      setManualPhone(
                        e.target.value
                      )
                    }
                  />

                  <small className="text-muted">
                    Enter the phone number that made
                    the M-Pesa payment.
                  </small>

                </div>

              </div>

              <div className="d-grid">

                <button
                  type="button"
                  className="btn btn-primary btn-lg rounded-3"
                  onClick={submitManualDeposit}
                  disabled={manualLoading}
                  style={{
                    backgroundColor: "#0f5132",
                    borderColor: "#0f5132",
                  }}
                >
                  {manualLoading
                    ? "Submitting Deposit..."
                    : "Submit Manual Deposit"}
                </button>

              </div>

              <div
                className="alert border-0 rounded-3 mt-4 mb-0"
                style={{
                  backgroundColor: "#e8f5e9",
                  color: "#0f5132",
                }}
              >

                <strong>
                  Important:
                </strong>

                <p className="mb-0 mt-1 small">
                  Your wallet will be credited after the
                  payment has been reviewed and approved.
                  Please make sure the amount and phone
                  number you submit match your M-Pesa payment.
                </p>

              </div>

            </div>
          </div>

          {/* ==========================================
              DEPOSIT HISTORY
          ========================================== */}

          <div className="card border-0 shadow-sm rounded-4 mb-5">

            <div className="card-body p-4 p-md-5">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                  <h4
                    className="fw-bold mb-1"
                    style={{ color: "#0f5132" }}
                  >
                    Deposit History
                  </h4>

                  <p className="text-muted mb-0">
                    Track your manual deposit requests.
                  </p>

                </div>

                <span className="badge bg-light text-dark border px-3 py-2">
                  {manualDeposits.length}{" "}
                  {manualDeposits.length === 1
                    ? "Request"
                    : "Requests"}
                </span>

              </div>

              {manualDeposits.length === 0 ? (

                <div className="text-center py-5">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#e8f5e9",
                      fontSize: "26px",
                    }}
                  >
                    📋
                  </div>

                  <h6 className="fw-bold">
                    No deposit requests yet
                  </h6>

                  <p className="text-muted small mb-0">
                    Your manual deposit requests will
                    appear here.
                  </p>

                </div>

              ) : (

                manualDeposits.map((item) => (

                  <div
                    key={item._id}
                    className="border rounded-4 p-3 p-md-4 mb-3"
                  >

                    <div className="row g-3">

                      <div className="col-md-4">

                        <small className="text-muted d-block">
                          Amount
                        </small>

                        <h5
                          className="fw-bold mb-0"
                          style={{
                            color: "#198754",
                          }}
                        >
                          KES{" "}
                          {Number(
                            item.amount
                          ).toLocaleString()}
                        </h5>

                      </div>

                      <div className="col-md-4">

                        <small className="text-muted d-block">
                          M-Pesa Phone
                        </small>

                        <p className="fw-semibold mb-0">
                          {item.phone || "-"}
                        </p>

                      </div>

                      <div className="col-md-4">

                        <small className="text-muted d-block mb-1">
                          Status
                        </small>

                        <span
                          className={`badge ${getStatusBadge(
                            item.status
                          )} px-3 py-2`}
                        >
                          {getStatusText(item.status)}
                        </span>

                      </div>

                    </div>

                    <hr />

                    <div className="row g-2 small">

                      <div className="col-md-4">
                        <strong>Till:</strong>{" "}
                        {item.tillNumber ||
                          TILL_NUMBER}
                      </div>

                      <div className="col-md-4">
                        <strong>Reference:</strong>{" "}
                        {item.reference || "-"}
                      </div>

                      <div className="col-md-4">
                        <strong>Date:</strong>{" "}
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleString()
                          : "-"}
                      </div>

                    </div>

                    {item.adminNote && (

                      <div
                        className="rounded-3 p-3 mt-3 small"
                        style={{
                          backgroundColor: "#f8f9fa",
                        }}
                      >

                        <strong>
                          Admin Note:
                        </strong>{" "}
                        {item.adminNote}

                      </div>

                    )}

                  </div>

                ))

              )}

            </div>
          </div>

          {/* ==========================================
              WITHDRAWAL
          ========================================== */}

          <div
            className="card border-0 shadow-sm rounded-4 mb-5 overflow-hidden"
            style={{
              borderTop: "4px solid #dc3545",
            }}
          >

            <div className="card-body p-4 p-md-5">

              <div className="mb-4">

                <h4
                  className="fw-bold mb-1"
                  style={{ color: "#842029" }}
                >
                  Withdraw Money
                </h4>

                <p className="text-muted mb-0">
                  Request a withdrawal from your wallet
                  to your M-Pesa number.
                </p>

              </div>

              <div className="row">

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    Withdrawal Amount
                  </label>

                  <div className="input-group input-group-lg">

                    <span className="input-group-text">
                      KES
                    </span>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      placeholder="Enter amount"
                      value={withdrawAmount}
                      onChange={(e) =>
                        setWithdrawAmount(
                          e.target.value
                        )
                      }
                    />

                  </div>

                  <small className="text-muted">
                    Available: KES{" "}
                    {Number(
                      balance
                    ).toLocaleString()}
                  </small>

                </div>

                <div className="col-md-6 mb-3">

                  <label className="form-label fw-semibold">
                    M-Pesa Phone Number
                  </label>

                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="2547XXXXXXXX"
                    value={withdrawPhone}
                    onChange={(e) =>
                      setWithdrawPhone(
                        e.target.value
                      )
                    }
                  />

                  <small className="text-muted">
                    Enter the M-Pesa number where you
                    want to receive the withdrawal.
                  </small>

                </div>

              </div>

              <div className="d-grid mt-2">

                <button
                  type="button"
                  className="btn btn-danger btn-lg rounded-3"
                  onClick={withdraw}
                  disabled={withdrawLoading}
                >
                  {withdrawLoading
                    ? "Submitting Withdrawal..."
                    : "Request Withdrawal"}
                </button>

              </div>

              <div className="alert alert-warning border-0 rounded-3 mt-4 mb-0">

                <strong>
                  Withdrawal Notice
                </strong>

                <p className="mb-0 mt-1 small">
                  Withdrawal requests are reviewed and
                  processed by Veran Enterprise. Please
                  verify the amount and M-Pesa number
                  before submitting.
                </p>

              </div>

            </div>
          </div>

          {/* ==========================================
              SECURITY
          ========================================== */}

          <div
            className="rounded-4 p-4 mb-4"
            style={{
              backgroundColor: "#e8f5e9",
              border: "1px solid #c8e6c9",
            }}
          >

            <div className="d-flex gap-3">

              <div style={{ fontSize: "25px" }}>
                🔐
              </div>

              <div>

                <h6
                  className="fw-bold mb-1"
                  style={{ color: "#0f5132" }}
                >
                  Wallet Security
                </h6>

                <p className="mb-0 small text-muted">
                  Keep your account information accurate
                  and secure. Deposit and withdrawal
                  transactions may be reviewed to help
                  protect users and prevent fraudulent
                  activity.
                </p>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ==========================================
          STK UNAVAILABLE MODAL
      ========================================== */}

      {showStkUnavailable && (

        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content border-0 shadow-lg rounded-4">

              <div className="modal-header border-0 px-4 pt-4">

                <h5
                  className="modal-title fw-bold"
                  style={{ color: "#0f5132" }}
                >
                  STK Push Unavailable
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowStkUnavailable(false)
                  }
                />

              </div>

              <div className="modal-body px-4">

                <div className="text-center mb-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#fff3cd",
                      fontSize: "30px",
                    }}
                  >
                    ⚠️
                  </div>

                  <h5 className="fw-bold">
                    M-Pesa STK Push is temporarily unavailable
                  </h5>

                  <p className="text-muted mb-0">
                    We're currently making improvements
                    to our M-Pesa payment service.
                  </p>

                </div>

                {/* MODAL TILL */}

                <div
                  className="rounded-4 p-4 text-center mb-4"
                  style={{
                    background:
                      "linear-gradient(135deg, #0f5132 0%, #198754 100%)",
                    color: "white",
                  }}
                >

                  <small className="opacity-75">
                    You can still deposit manually using
                  </small>

                  <h6 className="fw-bold mt-2 mb-2">
                    Buy Goods and Services Till
                  </h6>

                  <h2 className="fw-bold mb-3">
                    {TILL_NUMBER}
                  </h2>

                  <button
                    type="button"
                    className={`btn ${
                      copiedTill
                        ? "btn-success"
                        : "btn-light"
                    } rounded-pill px-4 fw-semibold`}
                    onClick={copyTillNumber}
                  >
                    {copiedTill
                      ? "✓ Copied"
                      : "📋 Copy Till Number"}
                  </button>

                </div>

                <h6
                  className="fw-bold"
                  style={{ color: "#0f5132" }}
                >
                  Quick Deposit Steps
                </h6>

                <ol className="small">

                  <li className="mb-2">
                    Open M-Pesa.
                  </li>

                  <li className="mb-2">
                    Select{" "}
                    <strong>
                      Lipa na M-Pesa
                    </strong>.
                  </li>

                  <li className="mb-2">
                    Select{" "}
                    <strong>
                      Buy Goods and Services
                    </strong>.
                  </li>

                  <li className="mb-2">
                    Enter Till Number{" "}
                    <strong>{TILL_NUMBER}</strong>.
                  </li>

                  <li className="mb-2">
                    Enter your deposit amount.
                  </li>

                  <li className="mb-2">
                    Confirm and complete the payment.
                  </li>

                  <li>
                    Submit the payment details under
                    Manual Deposit.
                  </li>

                </ol>

              </div>

              <div className="modal-footer border-0 px-4 pb-4">

                <button
                  type="button"
                  className="btn btn-success rounded-3 px-4"
                  onClick={goToManualDeposit}
                >
                  Continue with Manual Deposit
                </button>

                <button
                  type="button"
                  className="btn btn-light rounded-3"
                  onClick={() =>
                    setShowStkUnavailable(false)
                  }
                >
                  Maybe Later
                </button>

              </div>

            </div>

          </div>

        </div>

      )}
    </>
  );
}