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

  // ==========================
  // MANUAL DEPOSIT
  // ==========================
  const [manualAmount, setManualAmount] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [tillNumber, setTillNumber] = useState("");
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

    if (!tillNumber) {
      return alert("Enter the Till Number.");
    }

    try {
      setManualLoading(true);

      const res = await api.post("/manual-deposits", {
        amount: Number(manualAmount),
        phone: manualPhone.trim(),
        tillNumber: tillNumber.trim(),
      });

      alert(
        res.data.message ||
          "Manual deposit submitted for verification."
      );

      setManualAmount("");
      setManualPhone("");
      setTillNumber("");

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

      <div className="container mt-4">

        {/* ==========================
            WALLET BALANCE
        ========================== */}
        <div className="card shadow border-0 p-4 mb-4">

          <h4>Wallet Balance</h4>

          <h1 className="text-success">
            KES {balance.toLocaleString()}
          </h1>

          {checkingPayment && (
            <div className="alert alert-info mt-3 mb-0">
              Waiting for M-Pesa confirmation...
            </div>
          )}

        </div>

        {/* ==========================
            STK PUSH DEPOSIT
        ========================== */}
        <div className="card shadow border-0 p-4 mb-4">

          <h4 className="mb-2">
            Deposit with M-Pesa
          </h4>

          <p className="text-muted">
            Receive an M-Pesa STK Push on your phone
            and complete the payment.
          </p>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
          />

          <div className="d-grid">

            <button
              className="btn btn-success"
              disabled={
                loading || checkingPayment
              }
              onClick={deposit}
            >
              {loading
                ? "Sending STK..."
                : "Deposit with M-Pesa"}
            </button>

          </div>

        </div>

        {/* ==========================
            MANUAL M-PESA DEPOSIT
        ========================== */}
        <div className="card shadow border-0 p-4 mb-4">

          <h4 className="mb-2">
            Manual M-Pesa Deposit
          </h4>

          <p className="text-muted">
            If STK Push is unavailable, pay manually
            to the Veran Enterprise Till Number and
            submit your payment details for verification.
          </p>

          <div className="alert alert-warning">
            <strong>Important:</strong> Your wallet
            will only be credited after an administrator
            verifies and approves the payment.
          </div>

          <label className="form-label">
            Amount
          </label>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Enter amount"
            value={manualAmount}
            onChange={(e) =>
              setManualAmount(e.target.value)
            }
          />

          <label className="form-label">
            Phone Used for M-Pesa Payment
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="07XXXXXXXX"
            value={manualPhone}
            onChange={(e) =>
              setManualPhone(e.target.value)
            }
          />

          <label className="form-label">
            Till Number
          </label>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter Till Number"
            value={tillNumber}
            onChange={(e) =>
              setTillNumber(e.target.value)
            }
          />

          <div className="d-grid">

            <button
              className="btn btn-primary"
              disabled={manualLoading}
              onClick={submitManualDeposit}
            >
              {manualLoading
                ? "Submitting..."
                : "Submit Manual Deposit"}
            </button>

          </div>

        </div>

        {/* ==========================
            MANUAL DEPOSIT HISTORY
        ========================== */}
        <div className="card shadow border-0 p-4 mb-4">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h4 className="mb-0">
              Manual Deposit Requests
            </h4>

            <button
              className="btn btn-sm btn-outline-primary"
              onClick={loadManualDeposits}
            >
              Refresh
            </button>

          </div>

          {manualDeposits.length === 0 ? (

            <div className="alert alert-light border mb-0">
              You have no manual deposit requests.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-bordered align-middle">

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

                      <td>
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
                        <small>
                          {deposit.reference}
                        </small>
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            deposit.status
                          )}`}
                        >
                          {deposit.status}
                        </span>
                      </td>

                      <td>
                        <small>
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

        {/* ==========================
            WITHDRAW
        ========================== */}
        <div className="card shadow border-0 p-4 mb-4">

          <h4 className="mb-3">
            Withdraw Money
          </h4>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />

          <div className="d-grid">

            <button
              className="btn btn-danger"
              onClick={withdraw}
            >
              Withdraw
            </button>

          </div>

        </div>

      </div>
    </>
  );
}