import { useState } from "react";
import api from "../services/api";

export default function Deposit() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const pay = async () => {
    try {
      const res = await api.post("/mpesa/stkpush", {
        phone,
        amount,
      });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Deposit via M-Pesa</h3>

      <input
        className="form-control mb-2"
        placeholder="Phone (07XXXXXXXX)"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Amount"
        type="number"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="btn btn-success" onClick={pay}>
        Pay with M-Pesa
      </button>
    </div>
  );
}