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

    const selected = packages.find(
      (pkg) => pkg._id === selectedPackage
    );

    if (selected) {
      if (
        Number(amount) <
        Number(selected.minAmount)
      ) {
        return alert(
          `Minimum investment for ${selected.name} is KES ${Number(
            selected.minAmount
          ).toLocaleString()}.`
        );
      }

      if (
        Number(amount) >
        Number(selected.maxAmount)
      ) {
        return alert(
          `Maximum investment for ${selected.name} is KES ${Number(
            selected.maxAmount
          ).toLocaleString()}.`
        );
      }

      if (Number(amount) > Number(balance)) {
        return alert(
          "Insufficient wallet balance. Please deposit funds before investing."
        );
      }
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

      const res = await api.post(
        "/investments/create",
        {
          packageId: selectedPackage,
          amount: Number(amount),
        }
      );

      alert(
        res.data.message ||
          "Investment successful"
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

  /* ===========================
      PACKAGE COLORS
  ============================ */

  const packageStyles = [
    {
      gradient:
        "linear-gradient(135deg, #0d6efd, #084298)",
      light:
        "linear-gradient(135deg, #e7f1ff, #f5f9ff)",
      icon: "🚀",
      badge: "Starter",
      shadow: "rgba(13, 110, 253, 0.25)",
    },
    {
      gradient:
        "linear-gradient(135deg, #198754, #0f5132)",
      light:
        "linear-gradient(135deg, #e9f7ef, #f6fffa)",
      icon: "📈",
      badge: "Growth",
      shadow: "rgba(25, 135, 84, 0.25)",
    },
    {
      gradient:
        "linear-gradient(135deg, #6f42c1, #432874)",
      light:
        "linear-gradient(135deg, #f1ebff, #faf8ff)",
      icon: "💎",
      badge: "Premium",
      shadow: "rgba(111, 66, 193, 0.25)",
    },
    {
      gradient:
        "linear-gradient(135deg, #fd7e14, #b94700)",
      light:
        "linear-gradient(135deg, #fff1e6, #fffaf5)",
      icon: "🔥",
      badge: "Advanced",
      shadow: "rgba(253, 126, 20, 0.25)",
    },
    {
      gradient:
        "linear-gradient(135deg, #d63384, #84235a)",
      light:
        "linear-gradient(135deg, #ffeaf4, #fff8fb)",
      icon: "🌟",
      badge: "Elite",
      shadow: "rgba(214, 51, 132, 0.25)",
    },
  ];

  const getPackageStyle = (index) => {
    return packageStyles[
      index % packageStyles.length
    ];
  };

  /* ===========================
      STATUS BADGE
  ============================ */

  const getInvestmentStatus = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-success";

      case "completed":
        return "bg-primary";

      case "pending":
        return "bg-warning text-dark";

      case "cancelled":
      case "rejected":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  return (
    <>
      <Navbar />

      <div
        className="container-fluid px-3 px-md-4 px-lg-5 py-4"
        style={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #ffffff 45%)",
          minHeight: "100vh",
        }}
      >

        {/* =========================================
            DASHBOARD HEADER
        ========================================== */}

        <div className="container-fluid mb-4">

          <div className="row align-items-center">

            <div className="col-md-8">

              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 mb-2">
                VERAN ENTERPRISE
              </span>

              <h1 className="fw-bold mb-2">
                Investment Dashboard
              </h1>

              <p className="text-muted mb-0">
                Manage your wallet, explore investment
                packages and track your investments.
              </p>

            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">

              <span className="text-muted small">
                Your funds at a glance
              </span>

            </div>

          </div>

        </div>


        {/* =========================================
            WALLET SUMMARY
        ========================================== */}

        <div className="container-fluid mb-5">

          <div
            className="card border-0 rounded-4 overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, #0f5132, #198754, #20c997)",
              boxShadow:
                "0 15px 40px rgba(25, 135, 84, 0.20)",
            }}
          >

            <div className="card-body p-4 p-md-5 text-white">

              <div className="row align-items-center">

                <div className="col-md-7">

                  <div className="d-flex align-items-center mb-3">

                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center me-3"
                      style={{
                        width: "55px",
                        height: "55px",
                        background:
                          "rgba(255,255,255,0.18)",
                        fontSize: "25px",
                      }}
                    >
                      💰
                    </div>

                    <div>

                      <p className="mb-0 opacity-75">
                        Available Wallet Balance
                      </p>

                      <h1 className="fw-bold mb-0">
                        KES{" "}
                        {Number(
                          balance
                        ).toLocaleString()}
                      </h1>

                    </div>

                  </div>

                  <p className="mb-0 opacity-75">
                    Use your available balance to
                    invest in one of our packages.
                  </p>

                </div>


                <div className="col-md-5 text-md-end mt-4 mt-md-0">

                  <div
                    className="d-inline-block rounded-4 p-3"
                    style={{
                      background:
                        "rgba(255,255,255,0.12)",
                    }}
                  >

                    <small className="d-block opacity-75">
                      Account Status
                    </small>

                    <strong>
                      ✓ Active
                    </strong>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =========================================
            INVESTMENT SECTION
        ========================================== */}

        <div className="container-fluid mb-5">

          <div className="text-center mb-5">

            <span className="badge bg-dark rounded-pill px-3 py-2 mb-3">
              INVESTMENT OPTIONS
            </span>

            <h2 className="fw-bold">
              Choose Your Investment Package
            </h2>

            <p className="text-muted mx-auto mb-0"
              style={{ maxWidth: "650px" }}
            >
              Select a package that matches your
              investment amount and preferred duration.
            </p>

          </div>


          {/* INVESTMENT AMOUNT */}

          <div
            className="card border-0 shadow-sm rounded-4 mb-5 mx-auto"
            style={{ maxWidth: "850px" }}
          >

            <div className="card-body p-4">

              <label className="form-label fw-bold">
                How much would you like to invest?
              </label>

              <div className="input-group input-group-lg">

                <span className="input-group-text fw-bold">
                  KES
                </span>

                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter investment amount"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                />

              </div>

              <div className="d-flex justify-content-between mt-2">

                <small className="text-muted">
                  Available: KES{" "}
                  {Number(
                    balance
                  ).toLocaleString()}
                </small>

                {selectedPackage && (

                  <small className="text-success fw-semibold">
                    Package selected ✓
                  </small>

                )}

              </div>

            </div>

          </div>


          {/* =========================================
              PACKAGE CARDS
          ========================================== */}

          {packages.length === 0 ? (

            <div className="alert alert-warning border-0 rounded-4 shadow-sm text-center py-4">

              <h5 className="fw-bold">
                No investment packages found
              </h5>

              <p className="mb-0">
                Investment packages are currently
                unavailable.
              </p>

            </div>

          ) : (

            <div className="row g-4">

              {packages.map((pkg, index) => {

                const style =
                  getPackageStyle(index);

                const selected =
                  selectedPackage === pkg._id;

                return (

                  <div
                    className="col-sm-6 col-lg-4 col-xl-3"
                    key={pkg._id}
                  >

                    <div
                      className="h-100 position-relative"
                      style={{
                        transform: selected
                          ? "translateY(-8px)"
                          : "translateY(0)",
                        transition:
                          "all 0.25s ease",
                      }}
                    >

                      {/* SELECTED BADGE */}

                      {selected && (

                        <div
                          className="position-absolute top-0 start-50 translate-middle badge rounded-pill px-3 py-2 text-white"
                          style={{
                            background:
                              style.gradient,
                            zIndex: 5,
                          }}
                        >
                          ✓ Selected
                        </div>

                      )}


                      <div
                        className="card h-100 border-0 overflow-hidden"
                        onClick={() =>
                          setSelectedPackage(
                            pkg._id
                          )
                        }
                        style={{
                          cursor: "pointer",
                          borderRadius: "22px",
                          background:
                            style.light,
                          boxShadow: selected
                            ? `0 18px 45px ${style.shadow}`
                            : "0 8px 25px rgba(0,0,0,0.08)",
                          border: selected
                            ? `3px solid transparent`
                            : "3px solid transparent",
                          transition:
                            "all 0.25s ease",
                        }}
                      >

                        {/* PACKAGE HEADER */}

                        <div
                          className="p-4 text-white position-relative overflow-hidden"
                          style={{
                            background:
                              style.gradient,
                            minHeight: "150px",
                          }}
                        >

                          <div
                            className="position-absolute"
                            style={{
                              width: "140px",
                              height: "140px",
                              borderRadius: "50%",
                              background:
                                "rgba(255,255,255,0.08)",
                              top: "-60px",
                              right: "-40px",
                            }}
                          />

                          <div
                            className="position-absolute"
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              background:
                                "rgba(255,255,255,0.07)",
                              bottom: "-30px",
                              left: "-20px",
                            }}
                          />

                          <div className="position-relative">

                            <div className="d-flex justify-content-between align-items-start">

                              <div
                                className="rounded-3 d-flex align-items-center justify-content-center"
                                style={{
                                  width: "48px",
                                  height: "48px",
                                  background:
                                    "rgba(255,255,255,0.16)",
                                  fontSize: "24px",
                                }}
                              >
                                {style.icon}
                              </div>

                              <span className="badge bg-white text-dark rounded-pill">
                                {style.badge}
                              </span>

                            </div>


                            <h4 className="fw-bold mt-3 mb-0">
                              {pkg.name}
                            </h4>

                          </div>

                        </div>


                        {/* PACKAGE BODY */}

                        <div className="card-body p-4">

                          {/* ROI */}

                          <div className="text-center mb-4">

                            <small className="text-muted d-block mb-1">
                              RETURN ON INVESTMENT
                            </small>

                            <div
                              className="fw-bold"
                              style={{
                                fontSize: "42px",
                                background:
                                  style.gradient,
                                WebkitBackgroundClip:
                                  "text",
                                WebkitTextFillColor:
                                  "transparent",
                              }}
                            >
                              {pkg.roi}%
                            </div>

                          </div>


                          {/* PACKAGE DETAILS */}

                          <div className="mb-4">

                            <div className="d-flex justify-content-between align-items-center border-bottom py-2">

                              <span className="text-muted">
                                Duration
                              </span>

                              <strong>
                                {pkg.duration} Days
                              </strong>

                            </div>


                            <div className="d-flex justify-content-between align-items-center border-bottom py-2">

                              <span className="text-muted">
                                Minimum
                              </span>

                              <strong>
                                KES{" "}
                                {Number(
                                  pkg.minAmount
                                ).toLocaleString()}
                              </strong>

                            </div>


                            <div className="d-flex justify-content-between align-items-center py-2">

                              <span className="text-muted">
                                Maximum
                              </span>

                              <strong>
                                KES{" "}
                                {Number(
                                  pkg.maxAmount
                                ).toLocaleString()}
                              </strong>

                            </div>

                          </div>


                          {/* SELECT BUTTON */}

                          <button
                            type="button"
                            className="btn w-100 rounded-3 fw-semibold"
                            style={{
                              background:
                                selected
                                  ? style.gradient
                                  : "white",
                              color: selected
                                ? "white"
                                : "#212529",
                              border: selected
                                ? "none"
                                : "1px solid #dee2e6",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();

                              setSelectedPackage(
                                pkg._id
                              );
                            }}
                          >
                            {selected
                              ? "✓ Package Selected"
                              : "Select Package"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}


          {/* =========================================
              INVEST BUTTON
          ========================================== */}

          <div className="text-center mt-5">

            <button
              type="button"
              className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow"
              onClick={invest}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "🚀 Invest Now"}
            </button>

            <p className="text-muted small mt-3 mb-0">
              Select a package and enter an amount
              within its investment range.
            </p>

          </div>

        </div>


        {/* =========================================
            MY INVESTMENTS
        ========================================== */}

        <div className="container-fluid">

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body p-4 p-md-5">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                  <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 mb-2">
                    PORTFOLIO
                  </span>

                  <h3 className="fw-bold mb-1">
                    My Investments
                  </h3>

                  <p className="text-muted mb-0">
                    Track your active and completed
                    investments.
                  </p>

                </div>


                <span className="badge bg-light text-dark border px-3 py-2">
                  {investments.length}{" "}
                  {investments.length === 1
                    ? "Investment"
                    : "Investments"}
                </span>

              </div>


              {investments.length === 0 ? (

                <div className="text-center py-5">

                  <div
                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "75px",
                      height: "75px",
                      fontSize: "32px",
                    }}
                  >
                    📊
                  </div>

                  <h5 className="fw-bold">
                    No investments yet
                  </h5>

                  <p className="text-muted mb-0">
                    Choose an investment package
                    above to get started.
                  </p>

                </div>

              ) : (

                <div className="row g-4">

                  {investments.map((inv) => (

                    <div
                      className="col-md-6 col-xl-4"
                      key={inv._id}
                    >

                      <div className="border rounded-4 p-4 h-100">

                        <div className="d-flex justify-content-between align-items-start mb-3">

                          <div>

                            <small className="text-muted">
                              Package
                            </small>

                            <h5 className="fw-bold mb-0">
                              {inv.package?.name ||
                                "Package"}
                            </h5>

                          </div>

                          <span
                            className={`badge ${getInvestmentStatus(
                              inv.status
                            )} rounded-pill`}
                          >
                            {formatStatus(
                              inv.status
                            )}
                          </span>

                        </div>


                        <div className="mb-3">

                          <small className="text-muted d-block">
                            Investment Amount
                          </small>

                          <h4 className="fw-bold mb-0">
                            KES{" "}
                            {Number(
                              inv.amount || 0
                            ).toLocaleString()}
                          </h4>

                        </div>


                        <div className="row g-2">

                          <div className="col-6">

                            <div className="bg-light rounded-3 p-3">

                              <small className="text-muted d-block">
                                ROI
                              </small>

                              <strong className="text-success">
                                {inv.roi}%
                              </strong>

                            </div>

                          </div>


                          <div className="col-6">

                            <div className="bg-light rounded-3 p-3">

                              <small className="text-muted d-block">
                                Profit
                              </small>

                              <strong className="text-success">
                                KES{" "}
                                {Number(
                                  inv.profit || 0
                                ).toLocaleString()}
                              </strong>

                            </div>

                          </div>

                        </div>


                        <hr />


                        <div className="small">

                          <div className="d-flex justify-content-between mb-2">

                            <span className="text-muted">
                              Start
                            </span>

                            <strong>
                              {inv.startDate
                                ? new Date(
                                    inv.startDate
                                  ).toLocaleDateString()
                                : "-"}
                            </strong>

                          </div>


                          <div className="d-flex justify-content-between">

                            <span className="text-muted">
                              End
                            </span>

                            <strong>
                              {inv.endDate
                                ? new Date(
                                    inv.endDate
                                  ).toLocaleDateString()
                                : "-"}
                            </strong>

                          </div>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

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
            backgroundColor:
              "rgba(0, 0, 0, 0.7)",
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
                  Providing false information or
                  attempting to obtain money through
                  fraudulent means may result in the
                  suspension or closure of your account.
                  Transactions associated with suspected
                  fraudulent activity may be withheld
                  while they are reviewed, subject to
                  applicable law and our verification
                  procedures.
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
