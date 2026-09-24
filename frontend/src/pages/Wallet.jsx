// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import api from "../services/api";

// export default function Wallet() {
//   const [balance, setBalance] = useState(0);
//   const [amount, setAmount] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [checkingPayment, setCheckingPayment] = useState(false);

//   // ==========================
//   // LOAD WALLET BALANCE
//   // ==========================
//   const loadWallet = async () => {
//     try {
//       const res = await api.get("/wallet/balance");
//       setBalance(Number(res.data.balance) || 0);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//     }
//   };

//   useEffect(() => {
//     loadWallet();
//   }, []);

//   // ==========================
//   // DEPOSIT
//   // ==========================
//   const deposit = async () => {
//     if (!amount || Number(amount) <= 0) {
//       return alert("Enter a valid amount.");
//     }

//     if (!phone) {
//       return alert("Enter phone number.");
//     }

//     try {
//       setLoading(true);

//       const previousBalance = balance;

//       const res = await api.post("/wallet/deposit", {
//         amount: Number(amount),
//         phone,
//       });

//       alert(res.data.message || "STK Push sent. Complete payment on your phone.");

//       setCheckingPayment(true);

//       let attempts = 0;

//       const interval = setInterval(async () => {
//         attempts++;

//         try {
//           const wallet = await api.get("/wallet/balance");

//           const newBalance = Number(wallet.data.balance);

//           setBalance(newBalance);

//           if (newBalance > previousBalance) {
//             clearInterval(interval);

//             setCheckingPayment(false);

//             setAmount("");
//             setPhone("");

//             alert("Deposit successful!");
//           }

//           if (attempts >= 12) {
//             clearInterval(interval);
//             setCheckingPayment(false);
//           }
//         } catch (err) {
//           console.log(err);
//         }
//       }, 5000);

//     } catch (err) {
//       alert(err.response?.data?.message || "Deposit failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================
//   // WITHDRAW
//   // ==========================
//   const withdraw = async () => {
//     if (!amount || Number(amount) <= 0) {
//       return alert("Enter amount.");
//     }

//     try {
//       const res = await api.post("/wallet/withdraw", {
//         amount: Number(amount),
//       });

//       alert(res.data.message);

//       setAmount("");

//       loadWallet();

//     } catch (err) {
//       alert(err.response?.data?.message || "Withdrawal failed");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-4">

//         <div className="card shadow border-0 p-4 mb-4">

//           <h4>Wallet Balance</h4>

//           <h1 className="text-success">
//             KES {balance.toLocaleString()}
//           </h1>

//           {checkingPayment && (
//             <div className="alert alert-info mt-3">
//               Waiting for M-Pesa confirmation...
//             </div>
//           )}

//         </div>

//         <div className="card shadow border-0 p-4">

//           <h4 className="mb-4">Deposit Money</h4>

//           <input
//             type="number"
//             className="form-control mb-3"
//             placeholder="Amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />

//           <input
//             className="form-control mb-3"
//             placeholder="07XXXXXXXX"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />

//           <div className="d-grid">

//             <button
//               className="btn btn-success"
//               disabled={loading || checkingPayment}
//               onClick={deposit}
//             >
//               {loading ? "Sending STK..." : "Deposit with M-Pesa"}
//             </button>

//           </div>

//           <hr />

//         </div>

//       </div>
//     </>
//   );
// }


import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Wallet() {
  const [balance, setBalance] = useState(0);

  // ==========================
  // STK DEPOSIT
  // ==========================
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // STK unavailable popup
  const [showStkUnavailable, setShowStkUnavailable] = useState(false);

  // ==========================
  // MANUAL DEPOSIT
  // ==========================
  const [manualAmount, setManualAmount] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualDeposits, setManualDeposits] = useState([]);

  // ==========================
  // LOAD WALLET BALANCE
  // ==========================
  const loadWallet = async () => {
    try {
      const res = await api.get("/wallet/balance");

      setBalance(Number(res.data.balance) || 0);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ==========================
  // LOAD MANUAL DEPOSITS
  // ==========================
  const loadManualDeposits = async () => {
    try {
      const res = await api.get("/manual-deposits/my");

      setManualDeposits(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================
  useEffect(() => {
    loadWallet();
    loadManualDeposits();
  }, []);

  // ==========================
  // STK PUSH DEPOSIT
  // ==========================
  const deposit = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount.");
    }

    if (!phone) {
      return alert("Enter phone number.");
    }

    try {
      setLoading(true);

      const previousBalance = balance;

      const res = await api.post("/wallet/deposit", {
        amount: Number(amount),
        phone,
      });

      alert(
        res.data.message ||
          "STK Push sent. Complete payment on your phone."
      );

      setCheckingPayment(true);

      let attempts = 0;

      const interval = setInterval(async () => {
        attempts++;

        try {
          const wallet = await api.get("/wallet/balance");

          const newBalance = Number(wallet.data.balance);

          setBalance(newBalance);

          if (newBalance > previousBalance) {
            clearInterval(interval);

            setCheckingPayment(false);

            setAmount("");
            setPhone("");

            alert("Deposit successful!");
          }

          if (attempts >= 12) {
            clearInterval(interval);
            setCheckingPayment(false);
          }
        } catch (err) {
          console.log(err);
        }
      }, 5000);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Deposit failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // STK PUSH CURRENTLY UNAVAILABLE
  // ==========================
  const handleStkDeposit = () => {
    setShowStkUnavailable(true);
  };

  // ==========================
  // GO TO MANUAL DEPOSIT
  // ==========================
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

  // ==========================
  // MANUAL M-PESA DEPOSIT
  // ==========================
  const submitManualDeposit = async () => {
    if (!manualAmount || Number(manualAmount) <= 0) {
      return alert("Enter a valid amount.");
    }

    if (!manualPhone) {
      return alert(
        "Enter the phone number used for the M-Pesa payment."
      );
    }

    try {
      setManualLoading(true);

      const res = await api.post("/manual-deposits", {
        amount: Number(manualAmount),
        phone: manualPhone.trim(),
        tillNumber: "9207399",
      });

      alert(
        res.data.message ||
          "Manual deposit submitted for verification."
      );

      setManualAmount("");
      setManualPhone("");

      loadManualDeposits();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to submit manual deposit."
      );
    } finally {
      setManualLoading(false);
    }
  };

  // ==========================
  // WITHDRAW
  // ==========================
  const withdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter amount.");
    }

    try {
      const res = await api.post("/wallet/withdraw", {
        amount: Number(amount),
      });

      alert(res.data.message);

      setAmount("");

      loadWallet();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Withdrawal failed"
      );
    }
  };

  // ==========================
  // STATUS BADGE
  // ==========================
  const getStatusClass = (status) => {
    if (status === "approved") {
      return "bg-success";
    }

    if (status === "rejected") {
      return "bg-danger";
    }

    return "bg-warning text-dark";
  };

  return (
    <>
      <Navbar />

      <div
        className="container py-4"
        style={{ maxWidth: "1100px" }}
      >

        {/* ==========================
            WALLET BALANCE
        ========================== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center">

              <div>
                <p className="text-muted mb-1">
                  Available Wallet Balance
                </p>

                <h1 className="fw-bold text-success mb-0">
                  KES {balance.toLocaleString()}
                </h1>
              </div>

              <div
                className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center"
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                <span
                  className="text-success fw-bold"
                  style={{ fontSize: "24px" }}
                >
                  K
                </span>
              </div>

            </div>

            {checkingPayment && (
              <div className="alert alert-info mt-4 mb-0 rounded-3">
                <strong>
                  Waiting for M-Pesa confirmation...
                </strong>
                <br />
                Please complete the payment on your phone.
              </div>
            )}

          </div>

        </div>

        {/* ==========================
            STK PUSH
        ========================== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-1">

                <h4 className="fw-bold mb-0">
                  Deposit with M-Pesa
                </h4>

                <span className="badge bg-warning text-dark">
                  Temporarily Unavailable
                </span>

              </div>

              <p className="text-muted mb-0">
                STK Push is temporarily unavailable.
                You can still deposit using our manual
                M-Pesa option below.
              </p>
            </div>

            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Amount
                </label>

                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                />

              </div>

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  M-Pesa Phone Number
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="07XXXXXXXX"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="d-grid">

              <button
                className="btn btn-success btn-lg rounded-3"
                disabled={loading || checkingPayment}
                onClick={handleStkDeposit}
              >
                Deposit with M-Pesa
              </button>

            </div>

          </div>

        </div>

        {/* ==========================
            MANUAL M-PESA
        ========================== */}
        <div
          id="manual-deposit"
          className="card border-0 shadow rounded-4 mb-4 overflow-hidden"
        >

          {/* Header */}
          <div
            className="p-4 text-white"
            style={{
              background:
                "linear-gradient(135deg, #198754, #146c43)",
            }}
          >

            <div className="d-flex align-items-center">

              <div
                className="bg-white bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "52px",
                  height: "52px",
                }}
              >
                <span
                  className="fw-bold text-white"
                  style={{ fontSize: "22px" }}
                >
                  M
                </span>
              </div>

              <div>
                <h4 className="fw-bold mb-1">
                  Manual M-Pesa Deposit
                </h4>

                <p className="mb-0 opacity-75">
                  Make a manual payment and submit it
                  for verification.
                </p>
              </div>

            </div>

          </div>

          <div className="card-body p-4">

            {/* VERAN ENTERPRISE TILL */}
            <div
              className="border rounded-4 p-4 mb-4 text-center"
              style={{
                backgroundColor: "#f8f9fa",
              }}
            >

              <p className="text-muted mb-1">
                PAY TO
              </p>

              <h4 className="fw-bold mb-2">
                VERAN ENTERPRISE
              </h4>

              <p className="text-muted mb-1">
                M-Pesa Till Number
              </p>

              <h1
                className="fw-bold text-success mb-2"
                style={{
                  letterSpacing: "3px",
                }}
              >
                9207399
              </h1>

              <p className="small text-muted mb-0">
                Use this Till Number when making your
                manual M-Pesa payment.
              </p>

            </div>

            {/* INSTRUCTIONS */}
            <div className="alert alert-info rounded-3">

              <strong>
                How to deposit manually:
              </strong>

              <ol className="mb-0 mt-2">

                <li>
                  Open M-Pesa on your phone.
                </li>

                <li>
                  Select{" "}
                  <strong>Lipa na M-Pesa</strong>.
                </li>

                <li>
                  Select{" "}
                  <strong>
                    Buy Goods and Services
                  </strong>.
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
                  Enter the phone number used for payment
                  below and submit the request.
                </li>

              </ol>

            </div>

            {/* FORM */}
            <div className="row">

              <div className="col-md-6 mb-3">

                <label className="form-label fw-semibold">
                  Amount Paid
                </label>

                <div className="input-group input-group-lg">

                  <span className="input-group-text">
                    KES
                  </span>

                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount"
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
                  M-Pesa Phone Number
                </label>

                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="07XXXXXXXX"
                  value={manualPhone}
                  onChange={(e) =>
                    setManualPhone(
                      e.target.value
                    )
                  }
                />

                <small className="text-muted">
                  Enter the number used to make the
                  M-Pesa payment.
                </small>

              </div>

            </div>

            <div className="d-grid mt-2">

              <button
                className="btn btn-primary btn-lg rounded-3"
                disabled={manualLoading}
                onClick={submitManualDeposit}
              >
                {manualLoading
                  ? "Submitting Deposit..."
                  : "Submit Deposit for Verification"}
              </button>

            </div>

            <div className="text-center mt-3">

              <small className="text-muted">
                Your wallet will be credited after
                Veran Enterprise verifies your payment.
              </small>

            </div>

          </div>

        </div>

        {/* ==========================
            MANUAL DEPOSIT HISTORY
        ========================== */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>
                <h4 className="fw-bold mb-1">
                  Deposit Requests
                </h4>

                <p className="text-muted mb-0">
                  Track your manual M-Pesa deposits.
                </p>
              </div>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={loadManualDeposits}
              >
                Refresh
              </button>

            </div>

            {manualDeposits.length === 0 ? (

              <div className="text-center py-4">

                <div
                  className="mb-3 mx-auto rounded-circle bg-light d-flex align-items-center justify-content-center"
                  style={{
                    width: "60px",
                    height: "60px",
                  }}
                >
                  <span className="text-muted">
                    —
                  </span>
                </div>

                <p className="text-muted mb-0">
                  You have no manual deposit requests.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>
                      <th>Amount</th>
                      <th>Phone</th>
                      <th>Till</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {manualDeposits.map((deposit) => (

                      <tr key={deposit._id}>

                        <td className="fw-semibold">
                          KES{" "}
                          {Number(
                            deposit.amount
                          ).toLocaleString()}
                        </td>

                        <td>
                          {deposit.phone}
                        </td>

                        <td>
                          {deposit.tillNumber}
                        </td>

                        <td>
                          <small className="text-muted">
                            {deposit.reference}
                          </small>
                        </td>

                        <td>

                          <span
                            className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                              deposit.status
                            )}`}
                          >
                            {deposit.status}
                          </span>

                        </td>

                        <td>
                          <small className="text-muted">
                            {new Date(
                              deposit.createdAt
                            ).toLocaleString()}
                          </small>
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

        {/* ==========================
            WITHDRAW
        ========================== */}
        <div className="card border-0 shadow-sm rounded-4 mb-5">

          <div className="card-body p-4">

            <h4 className="fw-bold mb-3">
              Withdraw Money
            </h4>

            <div className="row">

              <div className="col-md-8 mb-3">

                <input
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="Enter withdrawal amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                />

              </div>

              <div className="col-md-4 mb-3">

                <button
                  className="btn btn-danger btn-lg w-100 rounded-3"
                  onClick={withdraw}
                >
                  Withdraw
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          STK PUSH UNAVAILABLE POPUP
      ===================================================== */}

      {showStkUnavailable && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            zIndex: 1055,
          }}
        >

          <div className="modal-dialog modal-dialog-centered px-3">

            <div
              className="modal-content border-0 shadow-lg rounded-4 overflow-hidden"
            >

              {/* POPUP TOP */}
              <div
                className="text-center text-white p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #198754, #146c43)",
                }}
              >

                <div
                  className="mx-auto mb-3 rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
                  style={{
                    width: "72px",
                    height: "72px",
                    fontSize: "34px",
                  }}
                >
                  ⚡
                </div>

                <h4 className="fw-bold mb-1">
                  STK Push Temporarily Unavailable
                </h4>

                <p className="mb-0 opacity-75">
                  We're making a few improvements to
                  our M-Pesa payment service.
                </p>

              </div>

              {/* POPUP BODY */}
              <div className="modal-body p-4">

                <p className="text-muted text-center mb-4">
                  Don't worry — you can still deposit
                  money into your Veran Enterprise wallet
                  using our secure manual M-Pesa payment
                  option.
                </p>

                {/* TILL */}
                <div
                  className="text-center border rounded-4 p-3 mb-4"
                  style={{
                    backgroundColor: "#f8f9fa",
                  }}
                >

                  <small className="text-muted d-block mb-1">
                    VERAN ENTERPRISE BUY GOODS TILL
                  </small>

                  <h2
                    className="fw-bold text-success mb-1"
                    style={{
                      letterSpacing: "4px",
                    }}
                  >
                    9207399
                  </h2>

                  <small className="text-muted">
                    Available for manual deposits
                  </small>

                </div>

                {/* QUICK INSTRUCTIONS */}
                <div className="mb-4">

                  <div className="d-flex mb-3">

                    <div
                      className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{
                        width: "30px",
                        height: "30px",
                      }}
                    >
                      1
                    </div>

                    <div>
                      <strong>
                        Pay via M-Pesa
                      </strong>

                      <div className="small text-muted">
                        Lipa na M-Pesa → Buy Goods and
                        Services → Till 9207399
                      </div>
                    </div>

                  </div>

                  <div className="d-flex">

                    <div
                      className="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                      style={{
                        width: "30px",
                        height: "30px",
                      }}
                    >
                      2
                    </div>

                    <div>
                      <strong>
                        Submit your payment
                      </strong>

                      <div className="small text-muted">
                        Enter the amount and phone number
                        used for the payment.
                      </div>
                    </div>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="d-grid gap-2">

                  <button
                    type="button"
                    className="btn btn-success btn-lg rounded-3"
                    onClick={goToManualDeposit}
                  >
                    Continue with Manual Deposit
                  </button>

                  <button
                    type="button"
                    className="btn btn-light border rounded-3"
                    onClick={() =>
                      setShowStkUnavailable(false)
                    }
                  >
                    Maybe Later
                  </button>

                </div>

                <p className="text-center text-muted small mt-3 mb-0">
                  Thank you for your patience and for
                  using Veran Enterprise.
                </p>

              </div>

            </div>

          </div>

        </div>
      )}

    </>
  );
}
