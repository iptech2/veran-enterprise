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
  const [withdrawingInvestmentId, setWithdrawingInvestmentId] =
    useState(null);

  // Fraud warning
  const [showFraudWarning, setShowFraudWarning] = useState(false);
  const [fraudAcknowledged, setFraudAcknowledged] = useState(false);

  // Locked investment acknowledgement
  const [lockedAcknowledged, setLockedAcknowledged] = useState(false);

  /* ===========================
      LOAD DASHBOARD
  =========================== */

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
      SELECTED PACKAGE
  =========================== */

  const selectedPackageData = packages.find(
    (pkg) => pkg._id === selectedPackage
  );

  const selectedIsLocked =
    selectedPackageData?.investmentType === "locked_profit";

  /* ===========================
      SELECTED PACKAGE CALCULATIONS
  =========================== */

  const enteredAmount = Number(amount) || 0;

  const selectedDuration =
    Number(selectedPackageData?.duration) || 0;

  const selectedRoi =
    Number(selectedPackageData?.roi) || 0;

  const estimatedTotalProfit =
    enteredAmount > 0 && selectedRoi > 0
      ? (enteredAmount * selectedRoi) / 100
      : 0;

  const selectedDailyProfit =
    selectedPackageData?.dailyProfit !== undefined
      ? Number(selectedPackageData.dailyProfit) || 0
      : selectedIsLocked &&
        enteredAmount > 0 &&
        selectedDuration > 0
      ? estimatedTotalProfit / selectedDuration
      : 0;

  const estimatedFinalAmount =
    enteredAmount + estimatedTotalProfit;

  const selectedWithdrawalDays =
    Array.isArray(
      selectedPackageData?.profitWithdrawalDays
    )
      ? selectedPackageData.profitWithdrawalDays
          .map(Number)
          .filter(
            (day) =>
              !isNaN(day) &&
              day > 0 &&
              day <= selectedDuration
          )
          .sort((a, b) => a - b)
      : [];

  /* ===========================
      INVESTMENT BUTTON
  =========================== */

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

    if (!selected) {
      return alert("Selected package could not be found.");
    }

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

    setFraudAcknowledged(false);
    setLockedAcknowledged(false);
    setShowFraudWarning(true);
  };

  /* ===========================
      CONFIRM INVESTMENT
  =========================== */

  const confirmInvestment = async () => {
    if (!fraudAcknowledged) {
      return alert(
        "Please confirm that you understand and agree to the fraud warning before continuing."
      );
    }

    if (selectedIsLocked && !lockedAcknowledged) {
      return alert(
        "Please confirm that you understand the locked investment terms before continuing."
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
      setLockedAcknowledged(false);

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
      WITHDRAW LOCKED PROFIT
  =========================== */

  const withdrawProfit = async (investmentId) => {
    if (!investmentId) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to withdraw your available investment profit?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setWithdrawingInvestmentId(investmentId);

      const res = await api.post(
        `/investments/${investmentId}/withdraw-profit`
      );

      alert(
        res.data.message ||
          "Profit withdrawn successfully."
      );

      await loadDashboard();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Profit withdrawal failed."
      );
    } finally {
      setWithdrawingInvestmentId(null);
    }
  };

  /* ===========================
      PACKAGE COLORS
  =========================== */

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
  =========================== */

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

  /* ===========================
      PACKAGE CARD
  =========================== */

  const renderPackageCard = (pkg, index) => {
    const style = getPackageStyle(index);

    const selected =
      selectedPackage === pkg._id;

    const isLockedProfit =
      pkg.investmentType === "locked_profit";

    const withdrawalDays =
      Array.isArray(pkg.profitWithdrawalDays)
        ? pkg.profitWithdrawalDays
            .map(Number)
            .filter(
              (day) =>
                !isNaN(day) &&
                day > 0 &&
                day <= Number(pkg.duration)
            )
            .sort((a, b) => a - b)
        : [];

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
            transition: "all 0.25s ease",
          }}
        >
          {selected && (
            <div
              className="position-absolute top-0 start-50 translate-middle badge rounded-pill px-3 py-2 text-white"
              style={{
                background: isLockedProfit
                  ? "linear-gradient(135deg, #ffc107, #b58100)"
                  : style.gradient,
                zIndex: 5,
              }}
            >
              ✓ Selected
            </div>
          )}

          <div
            className="card h-100 border-0 overflow-hidden"
            onClick={() =>
              setSelectedPackage(pkg._id)
            }
            style={{
              cursor: "pointer",
              borderRadius: "22px",
              background: isLockedProfit
                ? "linear-gradient(135deg, #fff8df, #fffdf5)"
                : style.light,
              boxShadow: selected
                ? `0 18px 45px ${
                    isLockedProfit
                      ? "rgba(255,193,7,0.30)"
                      : style.shadow
                  }`
                : isLockedProfit
                ? "0 8px 25px rgba(255,193,7,0.12)"
                : "0 8px 25px rgba(0,0,0,0.08)",
              transition: "all 0.25s ease",
              border: isLockedProfit
                ? "2px solid rgba(255,193,7,0.35)"
                : "none",
            }}
          >

            {/* PACKAGE HEADER */}

            <div
              className="p-4 text-white position-relative overflow-hidden"
              style={{
                background: isLockedProfit
                  ? "linear-gradient(135deg, #ffc107, #b58100)"
                  : style.gradient,
                minHeight: "165px",
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
                    {isLockedProfit
                      ? "🔒"
                      : style.icon}
                  </div>

                  <div className="d-flex flex-column align-items-end gap-1">

                    <span className="badge bg-white text-dark rounded-pill">
                      {isLockedProfit
                        ? "Growth Plus"
                        : style.badge}
                    </span>

                    <span
                      className={`badge ${
                        isLockedProfit
                          ? "bg-dark"
                          : "bg-success"
                      } rounded-pill`}
                    >
                      {isLockedProfit
                        ? "🔒 LOCKED PROFIT"
                        : "STANDARD"}
                    </span>

                  </div>

                </div>

                <h4 className="fw-bold mt-3 mb-0">
                  {pkg.name}
                </h4>

              </div>
            </div>

            {/* PACKAGE BODY */}

            <div className="card-body p-4">

              <div className="text-center mb-4">

                <small className="text-muted d-block mb-1">
                  {isLockedProfit
                    ? "EXPECTED ROI"
                    : "RETURN ON INVESTMENT"}
                </small>

                <div
                  className="fw-bold"
                  style={{
                    fontSize: "42px",
                    background: isLockedProfit
                      ? "linear-gradient(135deg, #ffc107, #8a6500)"
                      : style.gradient,
                    WebkitBackgroundClip:
                      "text",
                    WebkitTextFillColor:
                      "transparent",
                  }}
                >
                  {pkg.roi}%
                </div>

              </div>

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

              {/* WITHDRAWAL DAYS */}

              {isLockedProfit &&
                withdrawalDays.length > 0 && (
                  <div className="border rounded-3 p-3 mb-3 bg-white">

                    <div className="small fw-bold mb-2">
                      📅 Profit Withdrawal Days
                    </div>

                    <div className="small text-muted mb-2">
                      Eligible profit becomes available
                      according to these checkpoints:
                    </div>

                    <div className="d-flex flex-wrap gap-2">

                      {withdrawalDays.map((day) => (
                        <span
                          key={day}
                          className="badge bg-warning text-dark rounded-pill px-3 py-2"
                        >
                          Day {day}
                        </span>
                      ))}

                    </div>

                  </div>
                )}

              <button
                type="button"
                className="btn w-100 rounded-3 fw-semibold"
                style={{
                  background: selected
                    ? isLockedProfit
                      ? "linear-gradient(135deg, #ffc107, #b58100)"
                      : style.gradient
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

                  window.scrollTo({
                    top:
                      document.getElementById(
                        "investmentAmount"
                      )?.offsetTop - 100 || 0,
                    behavior: "smooth",
                  });
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
  };

  /* ===========================
      PACKAGE SEPARATION
  =========================== */

  const standardPackages = packages.filter(
    (pkg) =>
      pkg.investmentType !== "locked_profit"
  );

  const lockedPackages = packages.filter(
    (pkg) =>
      pkg.investmentType === "locked_profit"
  );

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

        <div
          id="packages"
          className="container-fluid mb-5"
        >

          <div className="text-center mb-5">

            <span className="badge bg-dark rounded-pill px-3 py-2 mb-3">
              INVESTMENT OPTIONS
            </span>

            <h2 className="fw-bold">
              Choose Your Investment Package
            </h2>

            <p
              className="text-muted mx-auto mb-0"
              style={{ maxWidth: "750px" }}
            >
              Veran offers two different investment
              structures. Standard packages return your
              principal and profit at maturity, while
              Growth Plus packages lock your principal
              and release eligible profit according to
              scheduled checkpoints.
            </p>

          </div>

          {/* =========================================
              INVESTMENT AMOUNT
          ========================================== */}

          <div
            id="investmentAmount"
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

                {selectedPackageData && (
                  <small
                    className={
                      selectedIsLocked
                        ? "text-warning fw-semibold"
                        : "text-success fw-semibold"
                    }
                  >
                    {selectedIsLocked
                      ? "🔒 Growth Plus / Locked package selected"
                      : "✓ Standard package selected"}
                  </small>
                )}

              </div>

              {/* SELECTED PACKAGE LIVE EXAMPLE */}

              {selectedPackageData &&
                enteredAmount > 0 && (
                  <div
                    className={`mt-4 border rounded-4 p-4 ${
                      selectedIsLocked
                        ? "border-warning"
                        : "border-primary"
                    }`}
                    style={{
                      background: selectedIsLocked
                        ? "#fffaf0"
                        : "#f8fbff",
                    }}
                  >

                    <div className="d-flex justify-content-between align-items-center mb-3">

                      <div>
                        <small className="text-muted">
                          Selected Package
                        </small>

                        <h5 className="fw-bold mb-0">
                          {selectedPackageData.name}
                        </h5>
                      </div>

                      <span
                        className={`badge ${
                          selectedIsLocked
                            ? "bg-warning text-dark"
                            : "bg-primary"
                        } rounded-pill`}
                      >
                        {selectedIsLocked
                          ? "🔒 Growth Plus"
                          : "🟢 Standard"}
                      </span>

                    </div>

                    <div className="row g-3">

                      <div className="col-6 col-md-3">

                        <small className="text-muted d-block">
                          Investment
                        </small>

                        <strong>
                          KES{" "}
                          {enteredAmount.toLocaleString()}
                        </strong>

                      </div>

                      <div className="col-6 col-md-3">

                        <small className="text-muted d-block">
                          ROI
                        </small>

                        <strong className="text-success">
                          {selectedRoi}%
                        </strong>

                      </div>

                      <div className="col-6 col-md-3">

                        <small className="text-muted d-block">
                          Duration
                        </small>

                        <strong>
                          {selectedDuration} Days
                        </strong>

                      </div>

                      <div className="col-6 col-md-3">

                        <small className="text-muted d-block">
                          Est. Profit
                        </small>

                        <strong className="text-success">
                          KES{" "}
                          {estimatedTotalProfit.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>

                      </div>

                    </div>

                    <hr />

                    {selectedIsLocked ? (

                      <div className="small">

                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            Principal during investment
                          </span>

                          <strong className="text-warning">
                            🔒 Locked
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            Illustrative daily profit
                          </span>

                          <strong className="text-success">
                            KES{" "}
                            {selectedDailyProfit.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                          </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            Profit checkpoints
                          </span>

                          <strong>
                            {selectedWithdrawalDays.length > 0
                              ? selectedWithdrawalDays
                                  .map(
                                    (day) =>
                                      `Day ${day}`
                                  )
                                  .join(", ")
                              : "Package schedule"}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>
                            At maturity
                          </span>

                          <strong className="text-success">
                            Principal returned
                          </strong>
                        </div>

                      </div>

                    ) : (

                      <div className="small">

                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            Investment
                          </span>

                          <strong>
                            KES{" "}
                            {enteredAmount.toLocaleString()}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <span>
                            Estimated profit
                          </span>

                          <strong className="text-success">
                            KES{" "}
                            {estimatedTotalProfit.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                        </div>

                        <div className="d-flex justify-content-between">
                          <span>
                            Estimated amount at maturity
                          </span>

                          <strong>
                            KES{" "}
                            {estimatedFinalAmount.toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}
                          </strong>
                        </div>

                      </div>

                    )}

                  </div>
                )}

            </div>

          </div>

          <div className="text-center mx-auto mb-5" style={{ maxWidth: "850px", marginTop: "-1.5rem" }}>
            <button
              type="button"
              className={`btn ${
                selectedIsLocked ? "btn-warning" : "btn-success"
              } btn-lg w-100 rounded-3 fw-bold shadow-sm`}
              onClick={invest}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : selectedIsLocked
                ? "🔒 Invest in Growth Plus"
                : "🚀 Invest Now"}
            </button>
          </div>

          {/* =========================================
              STANDARD PACKAGES
          ========================================== */}

          <div className="mb-5">

            <div className="d-flex align-items-center mb-3">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #0d6efd, #084298)",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                📈
              </div>

              <div>

                <h3 className="fw-bold mb-0">
                  Standard Packages
                </h3>

                <p className="text-muted mb-0">
                  Standard investment options where
                  principal and earned profit are
                  returned at maturity.
                </p>

              </div>

            </div>

            <div
              className="alert alert-primary border-0 rounded-4 mb-4 p-4"
              style={{
                background:
                  "linear-gradient(135deg, #e7f1ff, #f5f9ff)",
              }}
            >
              <h5 className="fw-bold mb-3">🟢 How Standard Investment Works</h5>
              <ol className="mb-3 ps-3">
                <li className="mb-2"><strong>Choose:</strong> Select this package and enter an amount within the allowed range.</li>
                <li className="mb-2"><strong>Invest:</strong> Your selected amount is deducted from your available wallet balance.</li>
                <li className="mb-2"><strong>Earn:</strong> Your investment earns profit according to this package's <strong>30% ROI</strong>.</li>
                <li className="mb-2"><strong>Wait:</strong> Keep the investment until the <strong>15-day</strong> investment period reaches maturity.</li>
                <li><strong>Maturity:</strong> At maturity, your principal and earned profit are returned to your wallet.</li>
              </ol>
              <div className="bg-white border rounded-3 p-3">
                <div className="fw-bold mb-2">Example: Investing KES 1,000</div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Investment</span><strong>KES 1,000</strong></div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Estimated profit</span><strong>KES 300.00</strong></div>
                <div className="d-flex justify-content-between pt-2"><span>At maturity</span><strong className="text-success">KES 1,300.00</strong></div>
              </div>
              <small className="text-muted d-block mt-2">Illustrative example based on the stated 30% ROI and 15-day duration. Actual returns depend on the package terms.</small>
            </div>

            {standardPackages.length === 0 ? (

              <div className="alert alert-light border rounded-4 text-center py-4">
                No standard packages are currently
                available.
              </div>

            ) : (

              <div className="row g-4">

                {standardPackages.map(
                  (pkg, index) =>
                    renderPackageCard(
                      pkg,
                      index
                    )
                )}

              </div>

            )}

          </div>

          {/* =========================================
              LOCKED PROFIT PACKAGES
          ========================================== */}

          <div className="mb-5">

            <div className="d-flex align-items-center mb-3">

              <div
                className="rounded-circle d-flex align-items-center justify-content-center me-3"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #ffc107, #b58100)",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                🔒
              </div>

              <div>

                <h3 className="fw-bold mb-0">
                  Growth Plus / Locked Profit Packages
                </h3>

                <p className="text-muted mb-0">
                  Structured investments with locked
                  principal, daily profit accumulation
                  and scheduled profit availability.
                </p>

              </div>

            </div>

            <div
              className="alert alert-warning border-0 rounded-4 mb-4 p-4"
              style={{
                background:
                  "linear-gradient(135deg, #fff3cd, #fffaf0)",
              }}
            >
              <h5 className="fw-bold mb-3">🔒 How Growth Plus / Locked Profit Works</h5>
              <ol className="mb-3 ps-3">
                <li className="mb-2"><strong>Choose:</strong> Select the Growth Plus package and enter an amount within its allowed range.</li>
                <li className="mb-2"><strong>Invest:</strong> The investment amount is deducted from your wallet.</li>
                <li className="mb-2"><strong>Principal is locked:</strong> Your original investment cannot be withdrawn during the investment period.</li>
                <li className="mb-2"><strong>Daily profit:</strong> Profit accumulates as the investment progresses according to the package terms.</li>
                <li className="mb-2"><strong>Profit checkpoints:</strong> Eligible profit becomes available on the configured withdrawal days.</li>
                <li className="mb-2"><strong>Missed checkpoint:</strong> If you do not withdraw at an earlier checkpoint, eligible profit can accumulate for a later checkpoint.</li>
                <li><strong>Maturity:</strong> When the investment reaches maturity, your original principal is automatically returned to your wallet.</li>
              </ol>
              <div className="bg-white border rounded-3 p-3">
                <div className="fw-bold mb-2">Example: Investing KES 1,000</div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Starting principal</span><strong>KES 1,000</strong></div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Duration</span><strong>30 Days</strong></div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Estimated total profit</span><strong>KES 600.00</strong></div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Illustrative daily profit</span><strong>KES 20.00</strong></div>
                <div className="d-flex justify-content-between border-bottom py-2"><span>Principal during investment</span><strong className="text-warning">🔒 Locked</strong></div>
                <div className="d-flex justify-content-between pt-2"><span>At maturity</span><strong className="text-success">Principal returned</strong></div>
              </div>
              <small className="text-muted d-block mt-2"><strong>Important:</strong> The daily profit shown above is an illustration based on the package ROI and duration. Your actual investment record will show the exact daily profit calculated by Veran.</small>
            </div>

            {lockedPackages.length === 0 ? (

              <div className="alert alert-light border rounded-4 text-center py-4">
                No Growth Plus / locked profit
                packages are currently available.
              </div>

            ) : (

              <div className="row g-4">

                {lockedPackages.map(
                  (pkg, index) =>
                    renderPackageCard(
                      pkg,
                      index
                    )
                )}

              </div>

            )}

          </div>

          {/* =========================================
              INVEST NOW BUTTON
          ========================================== */}

          <div className="text-center mb-5">

            <button
              type="button"
              className={
                selectedIsLocked
                  ? "btn btn-warning btn-lg px-5 py-3 rounded-pill fw-bold shadow"
                  : "btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow"
              }
              onClick={invest}
              disabled={loading}
            >

              {loading
                ? "Processing..."
                : selectedIsLocked
                ? "🔒 Invest in Growth Plus"
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

                  {investments.map((inv) => {

                    const isLockedProfit =
                      inv.package?.investmentType ===
                      "locked_profit";

                    const daysCompleted =
                      Number(
                        inv.daysCompleted || 0
                      );

                    const duration =
                      Number(
                        inv.duration || 30
                      );

                    const progress =
                      duration > 0
                        ? Math.min(
                            100,
                            (daysCompleted /
                              duration) *
                              100
                          )
                        : 0;

                    const profitAvailable =
                      Number(
                        inv.profitAvailable || 0
                      );

                    const profitEarned =
                      Number(
                        inv.profitEarned || 0
                      );

                    const profitWithdrawn =
                      Number(
                        inv.profitWithdrawn || 0
                      );

                    const dailyProfit =
                      Number(
                        inv.dailyProfit || 0
                      );

                    const totalProfit =
                      Number(
                        inv.profit || 0
                      );

                    const isWithdrawing =
                      withdrawingInvestmentId ===
                      inv._id;

                    const withdrawalDays =
                      Array.isArray(
                        inv.package
                          ?.profitWithdrawalDays
                      )
                        ? inv.package.profitWithdrawalDays
                            .map(Number)
                            .filter(
                              (day) =>
                                !isNaN(day) &&
                                day > 0 &&
                                day <= duration
                            )
                            .sort(
                              (a, b) => a - b
                            )
                        : [];

                    const lastWithdrawalDay =
                      Number(
                        inv.lastProfitWithdrawalDay ||
                          0
                      );

                    const currentAvailableDay =
                      [...withdrawalDays]
                        .reverse()
                        .find(
                          (day) =>
                            daysCompleted >= day &&
                            day >
                              lastWithdrawalDay
                        ) || 0;

                    return (

                      <div
                        className="col-md-6 col-xl-4"
                        key={inv._id}
                      >

                        <div
                          className="border rounded-4 p-4 h-100"
                          style={{
                            borderColor:
                              isLockedProfit
                                ? "rgba(255,193,7,0.4)"
                                : undefined,
                            background:
                              isLockedProfit
                                ? "linear-gradient(135deg, #fffdf5, #ffffff)"
                                : "white",
                          }}
                        >

                          {/* HEADER */}

                          <div className="d-flex justify-content-between align-items-start mb-3">

                            <div>

                              <small className="text-muted">
                                Package
                              </small>

                              <h5 className="fw-bold mb-0">
                                {inv.package?.name ||
                                  "Package"}
                              </h5>

                              {isLockedProfit ? (

                                <span className="badge bg-warning text-dark rounded-pill mt-2">
                                  🔒 Growth Plus / Locked
                                </span>

                              ) : (

                                <span className="badge bg-primary rounded-pill mt-2">
                                  🟢 Standard
                                </span>

                              )}

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

                          {/* INVESTMENT AMOUNT */}

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

                          {/* ROI + PROFIT */}

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
                                  {totalProfit.toLocaleString(
                                    undefined,
                                    {
                                      minimumFractionDigits:
                                        2,
                                      maximumFractionDigits:
                                        2,
                                    }
                                  )}
                                </strong>

                              </div>

                            </div>

                          </div>

                          <hr />

                          {/* DATES */}

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

                          {/* =================================
                              LOCKED PROFIT INVESTMENT
                          ================================= */}

                          {isLockedProfit && (

                            <>

                              <hr />

                              {/* PROGRESS */}

                              <div className="mb-3">

                                <div className="d-flex justify-content-between align-items-center mb-2">

                                  <span className="text-muted small">
                                    Investment Progress
                                  </span>

                                  <strong className="small">
                                    {daysCompleted} /{" "}
                                    {duration} Days
                                  </strong>

                                </div>

                                <div
                                  className="progress"
                                  style={{
                                    height: "10px",
                                    borderRadius:
                                      "10px",
                                  }}
                                >

                                  <div
                                    className="progress-bar bg-success"
                                    role="progressbar"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  />

                                </div>

                              </div>

                              {/* PROFIT INFORMATION */}

                              <div className="bg-light rounded-3 p-3 mb-3">

                                <div className="d-flex justify-content-between mb-2">

                                  <span className="text-muted">
                                    Daily Profit
                                  </span>

                                  <strong className="text-success">
                                    KES{" "}
                                    {dailyProfit.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits:
                                          2,
                                        maximumFractionDigits:
                                          2,
                                      }
                                    )}
                                  </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                  <span className="text-muted">
                                    Profit Earned
                                  </span>

                                  <strong>
                                    KES{" "}
                                    {profitEarned.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits:
                                          2,
                                        maximumFractionDigits:
                                          2,
                                      }
                                    )}
                                  </strong>

                                </div>

                                <div className="d-flex justify-content-between mb-2">

                                  <span className="text-muted">
                                    Profit Withdrawn
                                  </span>

                                  <strong>
                                    KES{" "}
                                    {profitWithdrawn.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits:
                                          2,
                                        maximumFractionDigits:
                                          2,
                                      }
                                    )}
                                  </strong>

                                </div>

                                <div className="d-flex justify-content-between">

                                  <span className="text-muted">
                                    Available Profit
                                  </span>

                                  <strong className="text-primary">
                                    KES{" "}
                                    {profitAvailable.toLocaleString(
                                      undefined,
                                      {
                                        minimumFractionDigits:
                                          2,
                                        maximumFractionDigits:
                                          2,
                                      }
                                    )}
                                  </strong>

                                </div>

                              </div>

                              {/* WITHDRAWAL SCHEDULE */}

                              {withdrawalDays.length > 0 && (

                                <div className="border rounded-3 p-3 mb-3">

                                  <div className="small fw-bold mb-3">
                                    📅 Profit Withdrawal Schedule
                                  </div>

                                  <div className="d-flex flex-column gap-2">

                                    {withdrawalDays.map(
                                      (day) => {

                                        const reached =
                                          daysCompleted >=
                                          day;

                                        const withdrawn =
                                          lastWithdrawalDay >=
                                          day;

                                        const isCurrentAvailable =
                                          currentAvailableDay ===
                                          day;

                                        const isAccumulated =
                                          reached &&
                                          day <
                                            currentAvailableDay &&
                                          !withdrawn;

                                        const isUpcoming =
                                          !reached;

                                        let badgeClass =
                                          "bg-light text-dark border";

                                        let label =
                                          `Day ${day}`;

                                        let statusText =
                                          "Upcoming";

                                        if (
                                          withdrawn
                                        ) {
                                          badgeClass =
                                            "bg-success text-white";

                                          if (
                                            day ===
                                            lastWithdrawalDay
                                          ) {
                                            label =
                                              `✓ Day ${day}`;

                                            statusText =
                                              "Withdrawn";
                                          } else {
                                            label =
                                              `✓ Day ${day}`;

                                            statusText =
                                              "Included";
                                          }
                                        } else if (
                                          isCurrentAvailable
                                        ) {
                                          badgeClass =
                                            "bg-primary text-white";

                                          label =
                                            `💰 Day ${day}`;

                                          statusText =
                                            "Available";
                                        } else if (
                                          isAccumulated
                                        ) {
                                          badgeClass =
                                            "bg-warning text-dark";

                                          label =
                                            `↗ Day ${day}`;

                                          statusText =
                                            "Accumulated";
                                        } else if (
                                          isUpcoming
                                        ) {
                                          badgeClass =
                                            "bg-light text-dark border";

                                          label =
                                            `🔒 Day ${day}`;

                                          statusText =
                                            "Upcoming";
                                        }

                                        return (
                                          <div
                                            key={day}
                                            className="d-flex align-items-center justify-content-between"
                                          >

                                            <span
                                              className={`badge rounded-pill ${badgeClass}`}
                                            >
                                              {label}
                                            </span>

                                            <small
                                              className={
                                                withdrawn
                                                  ? "text-success fw-semibold"
                                                  : isCurrentAvailable
                                                  ? "text-primary fw-semibold"
                                                  : isAccumulated
                                                  ? "text-warning fw-semibold"
                                                  : "text-muted"
                                              }
                                            >
                                              {statusText}
                                            </small>

                                          </div>
                                        );
                                      }
                                    )}

                                  </div>

                                  {currentAvailableDay > 0 &&
                                    currentAvailableDay >
                                      withdrawalDays[0] &&
                                    lastWithdrawalDay <
                                      currentAvailableDay && (

                                      <div className="alert alert-warning border-0 rounded-3 small mt-3 mb-0">

                                        <strong>
                                          💡 Accumulated Profit
                                        </strong>

                                        <br />

                                        You did not withdraw
                                        at an earlier checkpoint.
                                        The eligible profit has
                                        accumulated and is included
                                        in your current available
                                        profit.

                                      </div>
                                    )}

                                </div>
                              )}

                              {/* PRINCIPAL LOCK */}

                              {inv.status === "active" ? (

                                <div className="alert alert-warning border-0 rounded-3 small mb-3">

                                  🔒{" "}
                                  <strong>
                                    Principal Locked
                                  </strong>

                                  <br />

                                  Your original investment
                                  remains locked until the
                                  investment reaches maturity.

                                  <br />

                                  <strong>
                                    It will automatically be
                                    returned to your wallet
                                    when the investment matures.
                                  </strong>

                                </div>

                              ) : (

                                <div className="alert alert-success border-0 rounded-3 small mb-3">

                                  ✅{" "}
                                  <strong>
                                    Investment Matured
                                  </strong>

                                  <br />

                                  Your original principal
                                  has been returned to your
                                  wallet at maturity.

                                </div>

                              )}

                              {/* WITHDRAW PROFIT */}

                              {profitAvailable > 0 ? (

                                <button
                                  type="button"
                                  className="btn btn-success w-100 rounded-3 fw-bold"
                                  disabled={
                                    isWithdrawing
                                  }
                                  onClick={() =>
                                    withdrawProfit(
                                      inv._id
                                    )
                                  }
                                >

                                  {isWithdrawing
                                    ? "Processing..."
                                    : `💰 Withdraw KES ${profitAvailable.toLocaleString(
                                        undefined,
                                        {
                                          minimumFractionDigits:
                                            2,
                                          maximumFractionDigits:
                                            2,
                                        }
                                      )}`}

                                </button>

                              ) : (

                                <div className="alert alert-info border-0 rounded-3 small mb-0">

                                  {inv.status ===
                                  "completed" ? (

                                    <>
                                      ✅{" "}
                                      <strong>
                                        Investment completed.
                                      </strong>

                                      <br />

                                      Your principal has
                                      been returned to your
                                      wallet. Any remaining
                                      eligible profit can
                                      still be withdrawn.
                                    </>

                                  ) : Number(
                                      inv.nextProfitWithdrawalDay ||
                                        0
                                    ) > 0 ? (

                                    <>
                                      📅{" "}
                                      <strong>
                                        Next profit
                                        withdrawal:
                                      </strong>{" "}
                                      Day{" "}
                                      {
                                        inv.nextProfitWithdrawalDay
                                      }
                                    </>

                                  ) : (

                                    <>
                                      ℹ️ No further profit
                                      withdrawal is
                                      scheduled.
                                    </>

                                  )}

                                </div>
                              )}

                            </>

                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =========================================
          INVESTMENT CONFIRMATION / FRAUD MODAL
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
                  background: selectedIsLocked
                    ? "linear-gradient(135deg, #ffc107, #8a6500)"
                    : "linear-gradient(135deg, #dc3545, #a71d2a)",
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
                  {selectedIsLocked
                    ? "🔒"
                    : "⚠️"}
                </div>

                <h4 className="fw-bold mb-1">

                  {selectedIsLocked
                    ? "Confirm Growth Plus Investment"
                    : "Confirm Standard Investment"}

                </h4>

                <p className="mb-0 opacity-75">

                  {selectedIsLocked
                    ? "Please understand the locked investment terms before continuing."
                    : "Please review your investment details before confirming."}

                </p>

              </div>

              {/* BODY */}

              <div className="modal-body p-4">

                {/* INVESTMENT SUMMARY */}

                {selectedPackageData && (

                  <div
                    className="border rounded-4 p-3 mb-4"
                    style={{
                      background:
                        selectedIsLocked
                          ? "#fffaf0"
                          : "#f8f9fa",
                    }}
                  >

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <span className="text-muted">
                        Package
                      </span>

                      <strong>
                        {selectedPackageData.name}
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <span className="text-muted">
                        Investment
                      </span>

                      <strong>
                        KES{" "}
                        {Number(
                          amount || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <span className="text-muted">
                        Duration
                      </span>

                      <strong>
                        {selectedPackageData.duration}{" "}
                        Days
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <span className="text-muted">
                        ROI
                      </span>

                      <strong className="text-success">
                        {selectedPackageData.roi}%
                      </strong>

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-2">

                      <span className="text-muted">
                        Estimated Profit
                      </span>

                      <strong className="text-success">
                        KES{" "}
                        {estimatedTotalProfit.toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </strong>

                    </div>

                    {!selectedIsLocked && (
                      <div className="d-flex justify-content-between align-items-center">

                        <span className="text-muted">
                          Estimated Maturity Amount
                        </span>

                        <strong>
                          KES{" "}
                          {estimatedFinalAmount.toLocaleString(
                            undefined,
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </strong>

                      </div>
                    )}

                    {selectedIsLocked && (
                      <>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <span className="text-muted">
                            Principal
                          </span>

                          <strong className="text-warning">
                            🔒 Locked
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">

                          <span className="text-muted">
                            Profit Schedule
                          </span>

                          <strong>
                            {selectedWithdrawalDays.length > 0
                              ? selectedWithdrawalDays
                                  .map(
                                    (day) =>
                                      `Day ${day}`
                                  )
                                  .join(", ")
                              : "Package schedule"}
                          </strong>

                        </div>

                        <div className="d-flex justify-content-between align-items-center">

                          <span className="text-muted">
                            Maturity
                          </span>

                          <strong className="text-success">
                            Principal returned
                          </strong>

                        </div>

                      </>
                    )}

                  </div>
                )}

                {/* STANDARD TERMS */}

                {!selectedIsLocked && (
                  <div className="alert alert-primary border-0 rounded-3 mb-4">

                    <strong>
                      🟢 Standard Investment
                    </strong>

                    <ul className="mb-0 mt-2 ps-3 small">

                      <li>
                        Your investment remains active
                        until the package reaches maturity.
                      </li>

                      <li>
                        Profit is calculated according
                        to the selected package ROI.
                      </li>

                      <li>
                        At maturity, your principal and
                        earned profit are returned to your
                        wallet.
                      </li>

                    </ul>

                  </div>
                )}

                {/* LOCKED PACKAGE TERMS */}

                {selectedIsLocked && (

                  <div className="alert alert-warning border-0 rounded-3 mb-4">

                    <strong>
                      🔒 Growth Plus / Locked Profit Terms
                    </strong>

                    <ul className="mb-0 mt-2 ps-3 small">

                      <li>
                        Your principal cannot be
                        withdrawn during the investment
                        period.
                      </li>

                      <li>
                        Profit accumulates according to
                        the selected package terms.
                      </li>

                      <li>
                        Eligible profit becomes available
                        according to the configured
                        withdrawal schedule.
                      </li>

                      <li>
                        If you skip an earlier withdrawal
                        checkpoint, eligible profit can
                        accumulate for a later checkpoint.
                      </li>

                      <li>
                        At maturity, your original
                        principal is automatically returned
                        to your wallet.
                      </li>

                    </ul>

                  </div>
                )}

                {/* FRAUD WARNING */}

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
                        Make sure the investment amount,
                        package and investment type are
                        correct. Only continue if you
                        understand the transaction you
                        are making.
                      </div>

                    </div>

                  </div>

                </div>

                {/* LOCKED ACKNOWLEDGEMENT */}

                {selectedIsLocked && (

                  <div className="form-check border border-warning rounded-3 p-3 mb-3">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="lockedInvestmentAcknowledgement"
                      checked={
                        lockedAcknowledged
                      }
                      onChange={(e) =>
                        setLockedAcknowledged(
                          e.target.checked
                        )
                      }
                    />

                    <label
                      className="form-check-label ms-2"
                      htmlFor="lockedInvestmentAcknowledgement"
                    >
                      I understand that my principal
                      will remain locked until maturity,
                      that profit is subject to the
                      package withdrawal schedule, and
                      that my principal will be returned
                      to my wallet at maturity.
                    </label>

                  </div>
                )}

                {/* FRAUD ACKNOWLEDGEMENT */}

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
                    className={
                      selectedIsLocked
                        ? "btn btn-warning btn-lg rounded-3 fw-bold"
                        : "btn btn-danger btn-lg rounded-3"
                    }
                    disabled={
                      !fraudAcknowledged ||
                      (selectedIsLocked &&
                        !lockedAcknowledged) ||
                      loading
                    }
                    onClick={confirmInvestment}
                  >

                    {loading
                      ? "Processing..."
                      : selectedIsLocked
                      ? "🔒 Confirm Growth Plus Investment"
                      : "I Understand — Continue Investment"}

                  </button>

                  <button
                    type="button"
                    className="btn btn-light border rounded-3"
                    disabled={loading}
                    onClick={() => {
                      setShowFraudWarning(false);
                      setFraudAcknowledged(false);
                      setLockedAcknowledged(false);
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