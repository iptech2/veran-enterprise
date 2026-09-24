import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Wallet() {
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
      console.log(
        err.response?.data || err.message
      );
    }
  };

  // ==========================================
  // LOAD MANUAL DEPOSIT HISTORY
  // ==========================================
  const loadManualDeposits = async () => {
    try {
      const res = await api.get(
        "/manual-deposits/my"
      );

      setManualDeposits(res.data || []);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );
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
  // STK DEPOSIT
  // ==========================================
  const deposit = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid deposit amount.");
    }

    if (!phone) {
      return alert("Enter your M-Pesa phone number.");
    }

    try {
      setLoading(true);

      const res = await api.post(
        "/wallet/deposit",
        {
          amount: Number(amount),
          phone: phone.trim(),
        }
      );

      alert(
        res.data.message ||
          "Payment request sent."
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
          "Deposit failed."
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
        "Enter a valid deposit amount."
      );
    }

    if (!manualPhone) {
      return alert(
        "Enter the M-Pesa phone number used for payment."
      );
    }

    try {
      setManualLoading(true);

      const res = await api.post(
        "/manual-deposits",
        {
          amount: Number(manualAmount),
          phone: manualPhone.trim(),
        }
      );

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
        "Enter a valid withdrawal amount."
      );
    }

    if (!withdrawPhone) {
      return alert(
        "Enter your M-Pesa phone number."
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

      const res = await api.post(
        "/withdrawals",
        {
          amount: Number(withdrawAmount),
          phone: withdrawPhone.trim(),
        }
      );

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
          "Withdrawal failed."
      );
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container py-5">

        {/* ==========================================
            WALLET BALANCE
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-5">
          <div className="card-body p-4">

            <p className="text-muted mb-1">
              Available Wallet Balance
            </p>

            <h1 className="fw-bold text-success mb-0">
              KES {Number(balance).toLocaleString()}
            </h1>

          </div>
        </div>


        {/* ==========================================
            STK DEPOSIT
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-5">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-2">

              <div>
                <h4 className="fw-bold mb-1">
                  Deposit Money
                </h4>

                <p className="text-muted mb-0">
                  Deposit money directly into your
                  Veran Enterprise wallet.
                </p>
              </div>

              <span className="badge bg-warning text-dark">
                Temporarily Unavailable
              </span>

            </div>


            <div className="row mt-4">

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


            <div className="alert alert-warning border-0 rounded-3 mt-4 mb-0">

              <strong>
                STK Push Temporarily Unavailable
              </strong>

              <p className="mb-0 mt-1 small">
                We're making a few improvements to
                our M-Pesa payment service. You can
                use the manual deposit option below
                instead.
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            MANUAL DEPOSIT
        ========================================== */}

        <div
          id="manual-deposit"
          className="card border-0 shadow-sm rounded-4 mb-5"
        >

          <div className="card-body p-4">

            <h4 className="fw-bold mb-1">
              Manual M-Pesa Deposit
            </h4>

            <p className="text-muted mb-4">
              Pay using M-Pesa Buy Goods and Services,
              then submit your payment details below.
            </p>


            <div className="alert alert-info border-0 rounded-3">

              <h6 className="fw-bold">
                M-Pesa Payment Instructions
              </h6>

              <p className="mb-1">
                <strong>Buy Goods and Services Till:</strong>
              </p>

              <h4 className="fw-bold mb-3">
                9207399
              </h4>

              <ol className="mb-0">

                <li>
                  Open M-Pesa on your phone.
                </li>

                <li>
                  Select <strong>Lipa na M-Pesa</strong>.
                </li>

                <li>
                  Select <strong>Buy Goods and Services</strong>.
                </li>

                <li>
                  Enter Till Number{" "}
                  <strong>9207399</strong>.
                </li>

                <li>
                  Enter the amount you want to deposit.
                </li>

                <li>
                  Complete the M-Pesa payment.
                </li>

                <li>
                  Submit the amount and phone number
                  used for the payment below.
                </li>

              </ol>

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
              >
                {manualLoading
                  ? "Submitting Deposit..."
                  : "Submit Manual Deposit"}
              </button>

            </div>


            <div className="alert alert-warning border-0 rounded-3 mt-4 mb-0">

              <strong>
                Important:
              </strong>

              <p className="mb-0 mt-1 small">
                Your wallet will only be credited after
                an administrator verifies and approves
                your payment. Do not submit false payment
                information.
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            MANUAL DEPOSIT HISTORY
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-5">

          <div className="card-body p-4">

            <h4 className="fw-bold mb-3">
              Manual Deposit History
            </h4>


            {manualDeposits.length === 0 ? (

              <div className="alert alert-info mb-0">
                No manual deposit requests yet.
              </div>

            ) : (

              manualDeposits.map((item) => (

                <div
                  key={item._id}
                  className="border rounded-3 p-3 mb-3"
                >

                  <div className="row">

                    <div className="col-md-4">

                      <p className="mb-1">
                        <strong>Amount:</strong>
                      </p>

                      <p className="text-success fw-bold">
                        KES{" "}
                        {Number(
                          item.amount
                        ).toLocaleString()}
                      </p>

                    </div>


                    <div className="col-md-4">

                      <p className="mb-1">
                        <strong>Phone:</strong>
                      </p>

                      <p>
                        {item.phone}
                      </p>

                    </div>


                    <div className="col-md-4">

                      <p className="mb-1">
                        <strong>Status:</strong>
                      </p>

                      <span
                        className={`badge ${
                          item.status === "approved"
                            ? "bg-success"
                            : item.status ===
                              "rejected"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {item.status
                          ?.charAt(0)
                          .toUpperCase() +
                          item.status?.slice(1)}
                      </span>

                    </div>

                  </div>


                  <hr />


                  <p className="mb-1">
                    <strong>Till:</strong>{" "}
                    {item.tillNumber}
                  </p>

                  <p className="mb-1">
                    <strong>Reference:</strong>{" "}
                    {item.reference}
                  </p>

                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {item.createdAt
                      ? new Date(
                          item.createdAt
                        ).toLocaleString()
                      : "-"}
                  </p>


                  {item.adminNote && (

                    <p className="mb-0 mt-2 text-muted">
                      <strong>Admin Note:</strong>{" "}
                      {item.adminNote}
                    </p>

                  )}

                </div>

              ))

            )}

          </div>

        </div>


        {/* ==========================================
            WITHDRAW MONEY
        ========================================== */}

        <div className="card border-0 shadow-sm rounded-4 mb-5">

          <div className="card-body p-4">

            <h4 className="fw-bold mb-1">
              Withdraw Money
            </h4>

            <p className="text-muted mb-4">
              Request a withdrawal from your wallet
              to your M-Pesa number.
            </p>


            <div className="row">

              {/* Withdrawal Amount */}

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

              </div>


              {/* Withdrawal Phone */}

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
                processed by Veran Enterprise. Make sure
                the M-Pesa phone number and amount are
                correct before submitting.
              </p>

            </div>

          </div>

        </div>


        {/* ==========================================
            WALLET NOTICE
        ========================================== */}

        <div className="alert alert-light border rounded-4">

          <h6 className="fw-bold">
            Wallet Security
          </h6>

          <p className="mb-0 small text-muted">
            Keep your account information accurate and
            secure. Veran Enterprise may review deposits,
            withdrawals, and other wallet transactions
            to protect users and prevent fraudulent
            activity.
          </p>

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
            backgroundColor:
              "rgba(0,0,0,0.6)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content border-0 shadow-lg rounded-4">

              <div className="modal-header border-0">

                <h5 className="modal-title fw-bold">
                  STK Push Temporarily Unavailable
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowStkUnavailable(false)
                  }
                />

              </div>


              <div className="modal-body">

                <div className="text-center mb-4">

                  <div
                    className="rounded-circle bg-warning d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      fontSize: "32px",
                    }}
                  >
                    ⚠️
                  </div>

                  <h5 className="fw-bold">
                    M-Pesa STK Push is currently
                    unavailable
                  </h5>

                  <p className="text-muted">
                    We're making a few improvements to
                    our M-Pesa payment service.
                  </p>

                </div>


                <div className="alert alert-info rounded-3">

                  <strong>
                    You can still deposit manually.
                  </strong>

                  <p className="mb-0 mt-2">
                    Pay through M-Pesa Buy Goods and
                    Services using:
                  </p>

                  <h4 className="fw-bold mt-2 mb-0">
                    Till 9207399
                  </h4>

                </div>


                <h6 className="fw-bold">
                  How to deposit
                </h6>

                <ol className="small">

                  <li>
                    Open M-Pesa.
                  </li>

                  <li>
                    Select Lipa na M-Pesa.
                  </li>

                  <li>
                    Select Buy Goods and Services.
                  </li>

                  <li>
                    Enter Till Number{" "}
                    <strong>9207399</strong>.
                  </li>

                  <li>
                    Enter your deposit amount.
                  </li>

                  <li>
                    Complete the payment.
                  </li>

                  <li>
                    Submit your payment details
                    under Manual Deposit.
                  </li>

                </ol>

              </div>


              <div className="modal-footer border-0">

                <button
                  type="button"
                  className="btn btn-primary rounded-3"
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