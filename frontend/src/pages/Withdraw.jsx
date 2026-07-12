import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      const wallet = await api.get("/wallet/balance");
      setBalance(wallet.data.balance || 0);

      const history = await api.get("/withdrawals");
      setWithdrawals(history.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitWithdrawal = async () => {
    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount.");
    }

    if (!phone) {
      return alert("Enter your M-Pesa phone number.");
    }

    try {
      setLoading(true);

      const res = await api.post("/withdrawals", {
        amount: Number(amount),
        phone,
      });

      alert(res.data.message);

      setAmount("");
      setPhone("");

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h3>Withdraw Funds</h3>

            <h4 className="text-success">
              Wallet Balance: KES {balance.toLocaleString()}
            </h4>

            <input
              type="number"
              className="form-control mt-3"
              placeholder="Withdrawal Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="text"
              className="form-control mt-3"
              placeholder="M-Pesa Phone (2547XXXXXXXX)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              className="btn btn-danger mt-3 w-100"
              onClick={submitWithdrawal}
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request Withdrawal"}
            </button>
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">

            <h4>Withdrawal History</h4>

            {withdrawals.length === 0 ? (
              <div className="alert alert-info mt-3">
                No withdrawals yet.
              </div>
            ) : (
              withdrawals.map((item) => (
                <div
                  key={item._id}
                  className="border rounded p-3 mb-3"
                >
                  <p>
                    <strong>Amount:</strong> KES {item.amount}
                  </p>

                  <p>
                    <strong>Phone:</strong> {item.phone}
                  </p>

                  <p>
                    <strong>Status:</strong> {item.status}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(item.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </>
  );
}