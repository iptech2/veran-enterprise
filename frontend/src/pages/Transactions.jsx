import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const res = await api.get("/transactions");

      console.log(res.data);

      setTransactions(res.data || []);
    } catch (err) {
      console.log(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const badgeColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "failed":
      case "rejected":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <div className="card shadow">

          <div className="card-header bg-dark text-white">
            <h4 className="mb-0">Transaction History</h4>
          </div>

          <div className="card-body">

            {loading ? (
              <p>Loading...</p>
            ) : transactions.length === 0 ? (
              <div className="alert alert-info">
                No transactions found.
              </div>
            ) : (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>

                  {transactions.map((tx) => (

                    <tr key={tx._id}>

                      <td className="text-capitalize">
                        {tx.type}
                      </td>

                      <td>
                        KES {Number(tx.amount).toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={`badge bg-${badgeColor(
                            tx.status
                          )}`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td>
                        {tx.reference || "-"}
                      </td>

                      <td>
                        {new Date(
                          tx.createdAt
                        ).toLocaleString()}
                      </td>

                    </tr>

                  ))}

                </tbody>
              </table>
            )}

          </div>

        </div>

      </div>
    </>
  );
}