import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollTop from "../components/ScrollTop";

export default function Home() {
  const whatsappChannel =
    "https://whatsapp.com/channel/0029VbE1fZ50AgWFhmH4VO3e";

  return (
    <>
      <Navbar />

      {/* ==========================================
          HERO
      ========================================== */}

      <section
        className="text-white py-5"
        style={{
          background:
            "linear-gradient(135deg, #071f14 0%, #0f5132 55%, #198754 100%)",
        }}
      >
        <div className="container py-4 py-md-5">
          <div className="row align-items-center g-5">

            {/* HERO TEXT */}

            <div className="col-lg-6">
              <span
                className="badge rounded-pill px-3 py-2 mb-3"
                style={{
                  backgroundColor: "#ffc107",
                  color: "#212529",
                }}
              >
                VERAN ENTERPRISE
              </span>

              <h1 className="display-4 fw-bold mb-4">
                Invest Smart.
                <br />
                Grow With Confidence.
              </h1>

              <p className="lead text-white-50 mb-4">
                Manage your investments, fund your wallet through
                available payment options and monitor your investment
                activities from one convenient platform.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="btn btn-lg px-4 rounded-pill fw-semibold"
                  style={{
                    backgroundColor: "#ffc107",
                    borderColor: "#ffc107",
                    color: "#212529",
                  }}
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg px-4 rounded-pill"
                >
                  Login
                </Link>
              </div>

              <div className="mt-4 d-flex flex-wrap gap-4 small text-white-50">
                <span>✓ Simple registration</span>
                <span>✓ Convenient payments</span>
                <span>✓ Easy wallet management</span>
              </div>
            </div>

            {/* HERO IMAGE */}

            <div className="col-lg-6 text-center">
              <div
                className="p-4 p-md-5 rounded-5"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <img
                  src="/logo.png"
                  className="img-fluid"
                  alt="Veran Enterprise"
                  style={{
                    maxHeight: "320px",
                    objectFit: "contain",
                  }}
                />

                <div
                  className="mt-3 fw-semibold"
                  style={{ color: "#ffc107" }}
                >
                  Build. Invest. Grow.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          QUICK FEATURES
      ========================================== */}

      <section className="py-4">
        <div className="container">
          <div className="row g-3">

            <div className="col-md-4">
              <div
                className="rounded-4 p-4 h-100"
                style={{
                  backgroundColor: "#e8f5e9",
                }}
              >
                <div className="fs-3 mb-2">💳</div>

                <h6
                  className="fw-bold"
                  style={{ color: "#0f5132" }}
                >
                  Flexible Payments
                </h6>

                <p className="small text-muted mb-0">
                  Convenient payment options are available to make
                  wallet funding easier.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="rounded-4 p-4 h-100"
                style={{
                  backgroundColor: "#fff8e1",
                }}
              >
                <div className="fs-3 mb-2">📊</div>

                <h6
                  className="fw-bold"
                  style={{ color: "#664d03" }}
                >
                  Track Your Activity
                </h6>

                <p className="small text-muted mb-0">
                  Keep track of your wallet and investment activities
                  from your dashboard.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="rounded-4 p-4 h-100"
                style={{
                  backgroundColor: "#eef4ff",
                }}
              >
                <div className="fs-3 mb-2">🔐</div>

                <h6
                  className="fw-bold"
                  style={{ color: "#084298" }}
                >
                  Account Security
                </h6>

                <p className="small text-muted mb-0">
                  Manage your account through a secure platform.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          WHY CHOOSE US
      ========================================== */}

      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">
            <span
              className="badge rounded-pill px-3 py-2 mb-2"
              style={{
                backgroundColor: "#e8f5e9",
                color: "#0f5132",
              }}
            >
              WHY VERAN
            </span>

            <h2
              className="fw-bold"
              style={{ color: "#0f5132" }}
            >
              Why Choose Veran Enterprise?
            </h2>

            <p className="text-muted">
              A simple platform designed to make managing your
              investment activities easier.
            </p>
          </div>

          <div className="row g-4">

            {/* CARD 1 */}

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "4px solid #198754",
                }}
              >
                <div className="card-body text-center p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#e8f5e9",
                      fontSize: "30px",
                    }}
                  >
                    🔒
                  </div>

                  <h4
                    className="fw-bold"
                    style={{ color: "#0f5132" }}
                  >
                    Secure Platform
                  </h4>

                  <p className="text-muted mb-0">
                    Manage your account, wallet and investment
                    activities from one centralized platform.
                  </p>

                </div>
              </div>
            </div>

            {/* CARD 2 */}

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "4px solid #ffc107",
                }}
              >
                <div className="card-body text-center p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#fff8e1",
                      fontSize: "30px",
                    }}
                  >
                    💳
                  </div>

                  <h4
                    className="fw-bold"
                    style={{ color: "#664d03" }}
                  >
                    Convenient Payments
                  </h4>

                  <p className="text-muted mb-0">
                    Access available payment services for convenient
                    wallet funding and transactions.
                  </p>

                </div>
              </div>
            </div>

            {/* CARD 3 */}

            <div className="col-md-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "4px solid #20c997",
                }}
              >
                <div className="card-body text-center p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "70px",
                      height: "70px",
                      backgroundColor: "#e6fcf5",
                      fontSize: "30px",
                    }}
                  >
                    📈
                  </div>

                  <h4
                    className="fw-bold"
                    style={{ color: "#087f5b" }}
                  >
                    Investment Options
                  </h4>

                  <p className="text-muted mb-0">
                    Explore available investment packages and choose
                    options that fit your plans.
                  </p>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          HOW IT WORKS
      ========================================== */}

      <section
        className="py-5"
        style={{
          backgroundColor: "#f6f9f7",
        }}
      >
        <div className="container">

          <div className="text-center mb-5">

            <span
              className="badge rounded-pill px-3 py-2 mb-2"
              style={{
                backgroundColor: "#0f5132",
                color: "white",
              }}
            >
              SIMPLE PROCESS
            </span>

            <h2
              className="fw-bold"
              style={{ color: "#0f5132" }}
            >
              How It Works
            </h2>

            <p className="text-muted">
              Get started in a few simple steps.
            </p>

          </div>

          <div className="row g-4 text-center">

            {/* STEP 1 */}

            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#0f5132",
                      color: "white",
                      fontSize: "22px",
                    }}
                  >
                    1
                  </div>

                  <h5 className="fw-bold">
                    Create Account
                  </h5>

                  <p className="text-muted small mb-0">
                    Register for your Veran Enterprise account and
                    complete the required verification.
                  </p>

                </div>
              </div>
            </div>

            {/* STEP 2 */}

            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#198754",
                      color: "white",
                      fontSize: "22px",
                    }}
                  >
                    2
                  </div>

                  <h5 className="fw-bold">
                    Fund Wallet
                  </h5>

                  <p className="text-muted small mb-0">
                    Add funds to your wallet using an available
                    payment option.
                  </p>

                </div>
              </div>
            </div>

            {/* STEP 3 */}

            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#ffc107",
                      color: "#212529",
                      fontSize: "22px",
                    }}
                  >
                    3
                  </div>

                  <h5 className="fw-bold">
                    Choose a Package
                  </h5>

                  <p className="text-muted small mb-0">
                    Review the available packages and select one
                    that matches your plans.
                  </p>

                </div>
              </div>
            </div>

            {/* STEP 4 */}

            <div className="col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body p-4">

                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "#20c997",
                      color: "white",
                      fontSize: "22px",
                    }}
                  >
                    4
                  </div>

                  <h5 className="fw-bold">
                    Monitor & Manage
                  </h5>

                  <p className="text-muted small mb-0">
                    Monitor your investment activities and manage
                    eligible wallet transactions.
                  </p>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          PAYMENT PARTNERS & SERVICES
      ========================================== */}

      <section
        className="py-5"
        style={{
          backgroundColor: "#f8faf9",
        }}
      >
        <div className="container">

          <div className="text-center mb-5">

            <span
              className="badge rounded-pill px-3 py-2 mb-2"
              style={{
                backgroundColor: "#e8f5e9",
                color: "#0f5132",
              }}
            >
              PAYMENT SERVICES
            </span>

            <h2
              className="fw-bold"
              style={{ color: "#0f5132" }}
            >
              Our Payment Partners & Services
            </h2>

            <p
              className="text-muted mx-auto"
              style={{ maxWidth: "650px" }}
            >
              Veran Enterprise supports convenient payment options
              to make funding your wallet easier and more accessible.
            </p>

          </div>

          <div className="row g-4 justify-content-center">

            {/* M-PESA */}

            <div className="col-6 col-md-4 col-lg-2">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 text-center"
                style={{
                  borderTop: "4px solid #198754",
                }}
              >
                <div className="card-body p-3">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#e8f5e9",
                      fontSize: "30px",
                    }}
                  >
                    📱
                  </div>

                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#0f5132" }}
                  >
                    M-Pesa
                  </h6>

                  <small className="text-muted">
                    Mobile Money
                  </small>

                </div>
              </div>
            </div>

            {/* AIRTEL MONEY */}

            <div className="col-6 col-md-4 col-lg-2">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 text-center"
                style={{
                  borderTop: "4px solid #dc3545",
                }}
              >
                <div className="card-body p-3">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#fff0f0",
                      fontSize: "30px",
                    }}
                  >
                    📲
                  </div>

                  <h6 className="fw-bold mb-1 text-danger">
                    Airtel Money
                  </h6>

                  <small className="text-muted">
                    Mobile Money
                  </small>

                </div>
              </div>
            </div>

            {/* PESAPAL */}

            <div className="col-6 col-md-4 col-lg-2">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 text-center"
                style={{
                  borderTop: "4px solid #0d6efd",
                }}
              >
                <div className="card-body p-3">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#eef4ff",
                      fontSize: "30px",
                    }}
                  >
                    💳
                  </div>

                  <h6 className="fw-bold mb-1 text-primary">
                    Pesapal
                  </h6>

                  <small className="text-muted">
                    Payment Services
                  </small>

                </div>
              </div>
            </div>

            {/* VISA */}

            <div className="col-6 col-md-4 col-lg-2">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 text-center"
                style={{
                  borderTop: "4px solid #084298",
                }}
              >
                <div className="card-body p-3">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#eef4ff",
                      fontSize: "30px",
                    }}
                  >
                    💳
                  </div>

                  <h6
                    className="fw-bold mb-1"
                    style={{ color: "#084298" }}
                  >
                    Visa
                  </h6>

                  <small className="text-muted">
                    Card Payments
                  </small>

                </div>
              </div>
            </div>

            {/* MASTERCARD */}

            <div className="col-6 col-md-4 col-lg-2">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 text-center"
                style={{
                  borderTop: "4px solid #212529",
                }}
              >
                <div className="card-body p-3">

                  <div
                    className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "#f1f3f5",
                      fontSize: "30px",
                    }}
                  >
                    💰
                  </div>

                  <h6 className="fw-bold mb-1">
                    Mastercard
                  </h6>

                  <small className="text-muted">
                    Card Payments
                  </small>

                </div>
              </div>
            </div>

          </div>

          {/* PAYMENT NOTE */}

          <div className="text-center mt-4">

            <div
              className="d-inline-flex align-items-center gap-2 px-4 py-3 rounded-pill"
              style={{
                backgroundColor: "#fff8e1",
                color: "#664d03",
              }}
            >
              <span>🔒</span>

              <small className="fw-semibold">
                Available payment options may vary depending on the
                services currently enabled on the Veran platform.
              </small>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          INVESTMENT PACKAGES
      ========================================== */}

      <section className="py-5">
        <div className="container">

          <div className="text-center mb-5">

            <span
              className="badge rounded-pill px-3 py-2 mb-2"
              style={{
                backgroundColor: "#fff8e1",
                color: "#664d03",
              }}
            >
              INVESTMENT OPTIONS
            </span>

            <h2
              className="fw-bold"
              style={{ color: "#0f5132" }}
            >
              Investment Packages
            </h2>

            <p className="text-muted">
              Explore our available investment options.
            </p>

          </div>

          <div className="row g-4">

            {/* STARTER */}

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "4px solid #20c997",
                }}
              >
                <div className="card-body text-center p-4">

                  <div className="mb-3 fs-1">
                    🌱
                  </div>

                  <h3
                    className="fw-bold"
                    style={{ color: "#0f5132" }}
                  >
                    Starter
                  </h3>

                  <p className="text-muted">
                    A starting option for new investors.
                  </p>

                  <h2
                    className="fw-bold my-4"
                    style={{ color: "#198754" }}
                  >
                    KES 1,000
                  </h2>

                  <ul className="list-unstyled text-start">

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Beginner friendly
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Clear investment terms
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Dashboard monitoring
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Wallet management
                    </li>

                  </ul>

                  <Link
                    to="/register"
                    className="btn btn-success w-100 mt-3 rounded-3"
                  >
                    Get Started
                  </Link>

                </div>
              </div>
            </div>

            {/* PREMIUM */}

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "5px solid #ffc107",
                }}
              >

                <div
                  className="text-center py-2 fw-bold"
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#212529",
                  }}
                >
                  MOST POPULAR
                </div>

                <div className="card-body text-center p-4">

                  <div className="mb-3 fs-1">
                    ⭐
                  </div>

                  <h3
                    className="fw-bold"
                    style={{ color: "#0f5132" }}
                  >
                    Premium
                  </h3>

                  <p className="text-muted">
                    Designed for investors seeking a larger
                    investment option.
                  </p>

                  <h2
                    className="fw-bold my-4"
                    style={{ color: "#198754" }}
                  >
                    KES 5,000
                  </h2>

                  <ul className="list-unstyled text-start">

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Higher investment limit
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Dashboard monitoring
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Wallet management
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Referral features where applicable
                    </li>

                  </ul>

                  <Link
                    to="/register"
                    className="btn btn-success w-100 mt-3 rounded-3"
                  >
                    Start Investing
                  </Link>

                </div>
              </div>
            </div>

            {/* ELITE */}

            <div className="col-lg-4">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden"
                style={{
                  borderTop: "4px solid #0f5132",
                }}
              >
                <div className="card-body text-center p-4">

                  <div className="mb-3 fs-1">
                    👑
                  </div>

                  <h3
                    className="fw-bold"
                    style={{ color: "#0f5132" }}
                  >
                    Elite
                  </h3>

                  <p className="text-muted">
                    An option for investors looking for a larger
                    investment range.
                  </p>

                  <h2
                    className="fw-bold my-4"
                    style={{ color: "#198754" }}
                  >
                    KES 10,000+
                  </h2>

                  <ul className="list-unstyled text-start">

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Larger investment range
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Dashboard monitoring
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Wallet management
                    </li>

                    <li className="mb-3">
                      <span className="text-success">✓</span>{" "}
                      Access to applicable features
                    </li>

                  </ul>

                  <Link
                    to="/register"
                    className="btn btn-success w-100 mt-3 rounded-3"
                  >
                    Join Now
                  </Link>

                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-4">

            <small className="text-muted">
              Investment terms, applicable returns and withdrawal
              conditions are subject to the package selected and
              the terms displayed on the platform.
            </small>

          </div>

        </div>
      </section>

      {/* ==========================================
          WHATSAPP CHANNEL
      ========================================== */}

      <section className="py-5">
        <div className="container">

          <div
            className="rounded-5 p-4 p-md-5 text-white shadow-sm"
            style={{
              background:
                "linear-gradient(135deg, #075e54 0%, #128c7e 100%)",
            }}
          >

            <div className="row align-items-center g-4">

              <div className="col-lg-8">

                <div className="d-flex align-items-center gap-3">

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "65px",
                      height: "65px",
                      backgroundColor: "rgba(255,255,255,0.15)",
                      fontSize: "32px",
                    }}
                  >
                    💬
                  </div>

                  <div>

                    <span
                      className="badge rounded-pill mb-2"
                      style={{
                        backgroundColor: "#ffc107",
                        color: "#212529",
                      }}
                    >
                      STAY CONNECTED
                    </span>

                    <h3 className="fw-bold mb-1">
                      Join Our WhatsApp Channel
                    </h3>

                  </div>

                </div>

                <p className="mt-4 mb-0 text-white-50">
                  Follow the official Veran Enterprise WhatsApp
                  Channel for updates, announcements, platform
                  information and other important communication.
                </p>

              </div>

              <div className="col-lg-4 text-lg-end">

                <a
                  href={whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-light btn-lg rounded-pill px-4 fw-semibold"
                >
                  💬 Join WhatsApp Channel
                </a>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==========================================
          BUILT AROUND SIMPLICITY
      ========================================== */}

      <section
        className="py-5"
        style={{
          backgroundColor: "#f6f9f7",
        }}
      >
        <div className="container">

          <div className="text-center mb-5">

            <h2
              className="fw-bold"
              style={{ color: "#0f5132" }}
            >
              Built Around Simplicity
            </h2>

            <p className="text-muted">
              Everything you need to manage your Veran account
              in one place.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="text-center p-4">

                <div className="fs-1 mb-3">
                  📱
                </div>

                <h5 className="fw-bold">
                  Convenient Access
                </h5>

                <p className="text-muted small mb-0">
                  Access your account and manage your activities
                  from your device.
                </p>

              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-4">

                <div className="fs-1 mb-3">
                  💰
                </div>

                <h5 className="fw-bold">
                  Wallet Management
                </h5>

                <p className="text-muted small mb-0">
                  Deposit, monitor your balance and submit eligible
                  withdrawal requests.
                </p>

              </div>
            </div>

            <div className="col-md-4">
              <div className="text-center p-4">

                <div className="fs-1 mb-3">
                  📊
                </div>

                <h5 className="fw-bold">
                  Clear Overview
                </h5>

                <p className="text-muted small mb-0">
                  Keep your investment and wallet information
                  organized through your dashboard.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          CALL TO ACTION
      ========================================== */}

      <section
        className="py-5 text-white"
        style={{
          background:
            "linear-gradient(135deg, #071f14 0%, #0f5132 60%, #198754 100%)",
        }}
      >
        <div className="container text-center py-3">

          <span
            className="badge rounded-pill px-3 py-2 mb-3"
            style={{
              backgroundColor: "#ffc107",
              color: "#212529",
            }}
          >
            GET STARTED TODAY
          </span>

          <h2 className="fw-bold display-5 mb-3">
            Ready to Get Started?
          </h2>

          <p className="lead text-white-50 mb-4">
            Create your Veran Enterprise account and explore
            the platform.
          </p>

          <div className="d-flex justify-content-center flex-wrap gap-3">

            <Link
              to="/register"
              className="btn btn-lg px-5 rounded-pill fw-semibold"
              style={{
                backgroundColor: "#ffc107",
                borderColor: "#ffc107",
                color: "#212529",
              }}
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="btn btn-outline-light btn-lg px-5 rounded-pill"
            >
              Login
            </Link>

          </div>

        </div>
      </section>

      {/* ==========================================
          FLOATING WHATSAPP BUTTON
      ========================================== */}

      <WhatsAppButton />

      {/* ==========================================
          SCROLL TOP
      ========================================== */}

      <ScrollTop />
    </>
  );
}