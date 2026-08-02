// import { useState } from "react";
// import api from "../services/api";

// export default function Deposit() {
//   const [phone, setPhone] = useState("");
//   const [amount, setAmount] = useState("");

//   const pay = async () => {
//     try {
//       const res = await api.post("/mpesa/stkpush", {
//         phone,
//         amount,
//       });

//       alert(res.data.message);
//     } catch (err) {
//       alert(err.response?.data?.message);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h3>Deposit via M-Pesa</h3>

//       <input
//         className="form-control mb-2"
//         placeholder="Phone (07XXXXXXXX)"
//         onChange={(e) => setPhone(e.target.value)}
//       />

//       <input
//         className="form-control mb-2"
//         placeholder="Amount"
//         type="number"
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <button className="btn btn-success" onClick={pay}>
//         Pay with M-Pesa
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../services/api";

export default function Deposit() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    try {
      setLoading(true);

      const res = await api.post("/wallet/deposit", {
        phone,
        amount,
      });

      alert(res.data.message);

    } catch (err) {
      console.log(err.response?.data || err);

      alert(
        err.response?.data?.message ||
        "Failed to initiate payment."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Deposit via M-Pesa</h3>

      <input
        className="form-control mb-3"
        placeholder="07XXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button
        className="btn btn-success"
        disabled={loading}
        onClick={pay}
      >
        {loading ? "Sending STK..." : "Pay with M-Pesa"}
      </button>
    </div>
  );
}