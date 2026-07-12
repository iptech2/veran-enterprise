// import { useEffect, useState } from "react";
// import Navbar from "../components/Navbar";
// import api from "../services/api";

// export default function Wallet() {
//   const [balance, setBalance] = useState(0);
//   const [amount, setAmount] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [checkingPayment, setCheckingPayment] = useState(false);

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

//   const deposit = async () => {
//     if (!amount || Number(amount) <= 0) {
//       return alert("Enter a valid amount.");
//     }

//     if (!phone) {
//       return alert("Enter phone number.");
//     }

//     try {
//       setLoading(true);

//       await api.post("/wallet/deposit", {
//         amount: Number(amount),
//         phone,
//       });

//       alert("STK Push sent. Complete payment on your phone.");

//       setCheckingPayment(true);

//       // Poll wallet every 5 seconds for 1 minute
//       let attempts = 0;

//       const interval = setInterval(async () => {
//         attempts++;

//         try {
//           const res = await api.get("/wallet/balance");

//           const newBalance = Number(res.data.balance);

//           if (newBalance !== balance) {
//             setBalance(newBalance);

//             clearInterval(interval);

//             setCheckingPayment(false);

//             alert("Deposit successful! Wallet updated.");

//             setAmount("");
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

//   const withdraw = async () => {
//     try {
//       await api.post("/wallet/withdraw", {
//         amount: Number(amount),
//       });

//       await loadWallet();

//       setAmount("");

//       alert("Withdrawal request submitted.");

//     } catch (err) {
//       alert(err.response?.data?.message || "Withdrawal failed");
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-4">

//         <div className="card p-4 bg-dark text-white mb-3">
//           <h4>Wallet Balance</h4>

//           <h2>KES {balance.toLocaleString()}</h2>

//           {checkingPayment && (
//             <p className="text-warning mt-2">
//               Waiting for M-Pesa confirmation...
//             </p>
//           )}
//         </div>

//         <div className="card p-3">

//           <input
//             type="number"
//             className="form-control mb-3"
//             placeholder="Enter amount"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />

//           <input
//             className="form-control mb-3"
//             placeholder="07XXXXXXXX"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//           />

//           <div className="d-flex gap-2">

//             <button
//               className="btn btn-success"
//               onClick={deposit}
//               disabled={loading || checkingPayment}
//             >
//               {loading ? "Sending..." : "Deposit"}
//             </button>

//             <button
//               className="btn btn-danger"
//               onClick={withdraw}
//             >
//               Withdraw
//             </button>

//             <button
//               className="btn btn-primary"
//               onClick={loadWallet}
//             >
//               Refresh
//             </button>

//           </div>

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
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  // ===========================
  // LOAD WALLET
  // ===========================
  const loadWallet = async () => {
    try {
      const res = await api.get("/wallet/balance");
      setBalance(Number(res.data.balance) || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  // ===========================
  // DEPOSIT
  // ===========================
  const deposit = async () => {
    try {
      if (!amount || Number(amount) <= 0) {
        return alert("Enter a valid amount.");
      }

      if (!phone) {
        return alert("Enter phone number.");
      }

      setLoading(true);

      await api.post("/wallet/deposit", {
        amount: Number(amount),
        phone,
      });

      alert("STK Push sent. Complete payment on your phone.");

      setCheckingPayment(true);

      // Check balance every 5 seconds
      let count = 0;

      const interval = setInterval(async () => {
        count++;

        await loadWallet();

        if (count >= 12) {
          clearInterval(interval);
          setCheckingPayment(false);
        }
      }, 5000);

      setAmount("");

    } catch (err) {
      alert(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // WITHDRAW
  // ===========================
  const withdraw = async () => {
    try {
      await api.post("/wallet/withdraw", {
        amount: Number(amount),
      });

      alert("Withdrawal request submitted.");

      setAmount("");

      loadWallet();

    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card shadow p-4 mb-4">

          <h4>Wallet Balance</h4>

          <h1 className="text-success">
            KES {balance.toLocaleString()}
          </h1>

          {checkingPayment && (
            <div className="alert alert-info mt-3">
              Waiting for M-Pesa confirmation...
            </div>
          )}

        </div>

        <div className="card shadow p-4">

          <h5 className="mb-3">
            Deposit / Withdraw
          </h5>

          <input
            type="number"
            className="form-control mb-3"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <input
            className="form-control mb-3"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="d-flex gap-2">

            <button
              className="btn btn-success flex-fill"
              disabled={loading}
              onClick={deposit}
            >
              {loading ? "Sending..." : "Deposit"}
            </button>
{/* 
            <button
              className="btn btn-danger flex-fill"
              onClick={withdraw}
            >
              Withdraw
            </button> */}

          </div>

        </div>

      </div>
    </>
  );
}