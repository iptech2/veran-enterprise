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

  // Fraud warning
  const [showFraudWarning, setShowFraudWarning] = useState(false);
  const [fraudAcknowledged, setFraudAcknowledged] = useState(false);

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
      INVESTMENT BUTTON
  ============================ */

  const invest = () => {
    if (!selectedPackage) {
      return alert("Please select a package.");
    }

    if (!amount || Number(amount) <= 0) {
      return alert("Enter a valid amount.");
    }

    // Show fraud warning before submitting investment
    setFraudAcknowledged(false);
    setShowFraudWarning(true);
  };

  /* ===========================
      CONFIRM INVESTMENT
  ============================ */

  const confirmInvestment = async () => {
    if (!fraudAcknowledged) {
      return alert(
        "Please confirm that you understand and agree to the fraud warning before continuing."
      );
    }

    try {
      setLoading(true);

      const res = await api.post("/investments/create", {
        packageId: selectedPackage,
        amount: Number(amount),
      });

      alert(
        res.data.message || "Investment successful"
      );

      setAmount("");
      setSelectedPackage("");
      setShowFraudWarning(false);
      setFraudAcknowledged(false);

      await loadDashboard();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Investment failed"
      );
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
              onChange={(e) =>
                setAmount(e.target.value)
              }
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
                      onClick={() =>
                        setSelectedPackage(pkg._id)
                      }
                    >
                      <div className="card-body">

                        <h5>{pkg.name}</h5>

                        <p>
                          ROI:
                          <strong> {pkg.roi}%</strong>
                        </p>

                        <p>
                          Duration:
                          <strong>
                            {" "}
                            {pkg.duration} Days
                          </strong>
                        </p>

                        <p>
                          Minimum:
                          <strong>
                            {" "}
                            KES {pkg.minAmount}
                          </strong>
                        </p>

                        <p>
                          Maximum:
                          <strong>
                            {" "}
                            KES {pkg.maxAmount}
                          </strong>
                        </p>

                        {selectedPackage ===
                          pkg._id && (
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
              type="button"
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
                    <strong>
                      {" "}
                      KES {inv.amount}
                    </strong>
                  </p>

                  <p>
                    ROI:
                    <strong>
                      {" "}
                      {inv.roi}%
                    </strong>
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
                    <strong>
                      {" "}
                      {inv.status}
                    </strong>
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

      {/* =========================================
          FRAUD WARNING MODAL
      ========================================== */}

      {showFraudWarning && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">

            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

              {/* HEADER */}

              <div
                className="text-white text-center p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #dc3545, #a71d2a)",
                }}
              >

                <div
                  className="mx-auto mb-3 rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
                  style={{
                    width: "70px",
                    height: "70px",
                    fontSize: "32px",
                  }}
                >
                  ⚠️
                </div>

                <h4 className="fw-bold mb-1">
                  Important Investment Warning
                </h4>

                <p className="mb-0 opacity-75">
                  Please read carefully before
                  confirming your investment.
                </p>

              </div>

              {/* BODY */}

              <div className="modal-body p-4">

                <div className="alert alert-danger border-0 rounded-3">

                  <strong>
                    Fraud is strictly prohibited.
                  </strong>

                  <br />

                  Veran Enterprise does not tolerate
                  false information, impersonation,
                  fraudulent transactions, or attempts
                  to obtain money through deception.

                </div>

                <p className="text-muted">
                  You are responsible for ensuring that
                  the information you provide and the
                  transactions you make on the platform
                  are genuine and accurate.
                </p>

                <p className="text-muted">
                  Providing false information or attempting
                  to obtain money through fraudulent means
                  may result in the suspension or closure
                  of your account. Transactions associated
                  with suspected fraudulent activity may
                  be withheld while they are reviewed,
                  subject to applicable law and our
                  verification procedures.
                </p>

                <div className="border rounded-3 p-3 mb-4 bg-light">

                  <div className="d-flex align-items-start">

                    <span className="me-2">
                      🔒
                    </span>

                    <div>
                      <strong>
                        Before you continue
                      </strong>

                      <div className="small text-muted mt-1">
                        Make sure the investment amount
                        and package selected are correct.
                        Only continue if you understand
                        the transaction you are making.
                      </div>
                    </div>

                  </div>

                </div>

                {/* ACKNOWLEDGEMENT */}

                <div className="form-check border rounded-3 p-3 mb-4">

                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="investmentFraudAcknowledgement"
                    checked={fraudAcknowledged}
                    onChange={(e) =>
                      setFraudAcknowledged(
                        e.target.checked
                      )
                    }
                  />

                  <label
                    className="form-check-label ms-2"
                    htmlFor="investmentFraudAcknowledgement"
                  >
                    I understand and confirm that
                    the information and transaction
                    I am submitting are genuine and
                    that I will not engage in fraudulent
                    activity.
                  </label>

                </div>

                {/* BUTTONS */}

                <div className="d-grid gap-2">

                  <button
                    type="button"
                    className="btn btn-danger btn-lg rounded-3"
                    disabled={
                      !fraudAcknowledged ||
                      loading
                    }
                    onClick={confirmInvestment}
                  >
                    {loading
                      ? "Processing..."
                      : "I Understand — Continue Investment"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-light border rounded-3"
                    disabled={loading}
                    onClick={() => {
                      setShowFraudWarning(false);
                      setFraudAcknowledged(false);
                    }}
                  >
                    Cancel
                  </button>

                </div>

                <p className="text-center text-muted small mt-3 mb-0">
                  Please review your investment details
                  carefully before confirming.
                </p>

              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
