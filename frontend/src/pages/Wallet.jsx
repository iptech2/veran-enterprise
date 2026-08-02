import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

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

  useEffect(() => {
    loadWallet();
  }, []);

  // ==========================
  // DEPOSIT
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

      alert(res.data.message || "STK Push sent. Complete payment on your phone.");

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
      alert(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
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
      alert(err.response?.data?.message || "Withdrawal failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card shadow border-0 p-4 mb-4">

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

        <div className="card shadow border-0 p-4">

          <h4 className="mb-4">Deposit Money</h4>

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

          <div className="d-grid">

            <button
              className="btn btn-success"
              disabled={loading || checkingPayment}
              onClick={deposit}
            >
              {loading ? "Sending STK..." : "Deposit with M-Pesa"}
            </button>

          </div>

          <hr />
{/* 
          <h5>Withdraw</h5>

          <button
            className="btn btn-danger w-100"
            onClick={withdraw}
          >
            Request Withdrawal
          </button> */}

        </div>

      </div>
    </>
  );
}