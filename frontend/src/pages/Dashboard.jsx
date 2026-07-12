import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [packages, setPackages] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===========================
      LOAD DASHBOARD
  ============================ */

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res = await api.get("/dashboard");

      console.log("Dashboard:", res.data);

      setBalance(Number(res.data.walletBalance) || 0);

      setPackages(
        Array.isArray(res.data.packages)
          ? res.data.packages
          : []
      );

      setInvestments(
        Array.isArray(res.data.investments)
          ? res.data.investments
          : []
      );
    } catch (err) {
      console.log(
        "Dashboard Error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /* ===========================
      CREATE INVESTMENT
  ============================ */

  const invest = async () => {
    if (!selectedPackage) {
      return alert("Please select a package.");
    }

    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount.");
    }

    try {
      setLoading(true);

      const res = await api.post("/investments/create", {
        packageId: selectedPackage,
        amount: Number(amount),
      });

      alert(res.data.message || "Investment successful");

      setAmount("");
      setSelectedPackage("");

      await loadDashboard();
    } catch (err) {
      alert(err.response?.data?.message || "Investment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        {/* WALLET */}

        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <h4>Wallet Balance</h4>

            <h2 className="text-success">
              KES {balance.toLocaleString()}
            </h2>

          </div>
        </div>

        {/* CREATE INVESTMENT */}

        <div className="card shadow-sm mb-4">

          <div className="card-body">

            <h4 className="mb-3">
              Invest Now
            </h4>

            <input
              type="number"
              className="form-control mb-3"
              placeholder="Enter Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className="row">

              {packages.length === 0 ? (

                <div className="col-12">
                  <div className="alert alert-warning">
                    No investment packages found.
                  </div>
                </div>

              ) : (

                packages.map((pkg) => (

                  <div
                    className="col-md-4 mb-3"
                    key={pkg._id}
                  >
                    <div
                      className={`card h-100 ${
                        selectedPackage === pkg._id
                          ? "border-success border-3"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedPackage(pkg._id)}
                    >
                      <div className="card-body">

                        <h5>{pkg.name}</h5>

                        <p>
                          ROI:
                          <strong> {pkg.roi}%</strong>
                        </p>

                        <p>
                          Duration:
                          <strong> {pkg.duration} Days</strong>
                        </p>

                        <p>
                          Minimum:
                          <strong> KES {pkg.minAmount}</strong>
                        </p>

                        <p>
                          Maximum:
                          <strong> KES {pkg.maxAmount}</strong>
                        </p>

                        {selectedPackage === pkg._id && (
                          <span className="badge bg-success">
                            Selected
                          </span>
                        )}

                      </div>
                    </div>
                  </div>

                ))

              )}

            </div>

            <button
              className="btn btn-success w-100"
              onClick={invest}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Invest Now"}
            </button>

          </div>

        </div>

        {/* MY INVESTMENTS */}

        <div className="card shadow-sm">

          <div className="card-body">

            <h4>My Investments</h4>

            {investments.length === 0 ? (

              <div className="alert alert-info mt-3">
                No investments found.
              </div>

            ) : (

              investments.map((inv) => (

                <div
                  key={inv._id}
                  className="border rounded p-3 mb-3"
                >
                  <h5>
                    {inv.package?.name || "Package"}
                  </h5>

                  <p>
                    Amount:
                    <strong> KES {inv.amount}</strong>
                  </p>

                  <p>
                    ROI:
                    <strong> {inv.roi}%</strong>
                  </p>

                  <p>
                    Profit:
                    <strong className="text-success">
                      {" "}
                      KES {inv.profit}
                    </strong>
                  </p>

                  <p>
                    Status:
                    <strong> {inv.status}</strong>
                  </p>

                  <p>
                    Start:
                    <strong>
                      {" "}
                      {new Date(
                        inv.startDate
                      ).toLocaleDateString()}
                    </strong>
                  </p>

                  <p>
                    End:
                    <strong>
                      {" "}
                      {new Date(
                        inv.endDate
                      ).toLocaleDateString()}
                    </strong>
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