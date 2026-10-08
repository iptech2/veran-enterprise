import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const token = localStorage.getItem("token");

  const whatsappChannel =
    "https://whatsapp.com/channel/0029VbE1fZ50AgWFhmH4VO3e";

  const whatsappSupport =
    "https://wa.me/qr/JSXNIJSUMUP7A1";

  // =====================================================
  // PAYMENT PARTNERS
  // =====================================================

  const paymentPartners = [
    {
      name: "M-Pesa",
      image: "/partners/mpesa.png",
    },
    {
      name: "Airtel Money",
      image: "/partners/airtel-money.png",
    },
    {
      name: "Pesapal",
      image: "/partners/pesapal.png",
    },
    {
      name: "Visa",
      image: "/partners/visa.png",
    },
    {
      name: "Mastercard",
      image: "/partners/mastercard.png",
    },
  ];

  return (
    <>
      {/* =====================================================
          DESKTOP FOOTER
      ===================================================== */}

      <footer
        className="bg-dark text-light mt-auto pt-5 pb-4 d-none d-md-block"
      >
        <div className="container">

          <div className="row text-center text-md-start">

            {/* =================================================
                BRAND
            ================================================= */}

            <div className="col-lg-3 col-md-6 mb-4">

              <h5 className="fw-bold text-white mb-3">
                Veran Enterprise
              </h5>

              <p className="small text-secondary">
                A convenient platform for managing your wallet,
                investments and financial activities.
              </p>

              {/* WHATSAPP CHANNEL */}

              <a
                href={whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-success text-decoration-none d-inline-flex align-items-center gap-2 mt-2"
              >
                <i className="bi bi-whatsapp fs-5"></i>

                <span>
                  Follow us on WhatsApp Channel
                </span>
              </a>

            </div>

            {/* =================================================
                NAVIGATION
            ================================================= */}

            <div className="col-lg-2 col-md-6 mb-4">

              <h6 className="fw-bold text-white mb-3">
                Navigation
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/dashboard"
                  className="text-light text-decoration-none small"
                >
                  Dashboard
                </Link>

                <Link
                  to="/wallet"
                  className="text-light text-decoration-none small"
                >
                  Wallet
                </Link>

                <Link
                  to="/transactions"
                  className="text-light text-decoration-none small"
                >
                  Transactions
                </Link>

                <Link
                  to="/profile"
                  className="text-light text-decoration-none small"
                >
                  Profile
                </Link>

              </div>

            </div>

            {/* =================================================
                PAYMENT PARTNERS
            ================================================= */}

            <div className="col-lg-3 col-md-6 mb-4">

              <h6 className="fw-bold text-white mb-3">
                Payment Partners
              </h6>

              <p className="small text-secondary mb-3">
                Convenient payment services supported or available
                through the platform.
              </p>

              <div className="d-flex flex-wrap gap-2">

                {paymentPartners.map((partner) => (
                  <div
                    key={partner.name}
                    className="bg-white rounded-3 d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      width: "72px",
                      height: "48px",
                      padding: "6px",
                    }}
                    title={partner.name}
                  >

                    <img
                      src={partner.image}
                      alt={partner.name}
                      className="img-fluid"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "36px",
                        objectFit: "contain",
                      }}
                    />

                  </div>
                ))}

              </div>

              <small className="text-secondary d-block mt-3">
                Available payment options may vary.
              </small>

            </div>

            {/* =================================================
                LEGAL & CONTACT
            ================================================= */}

            <div className="col-lg-4 col-md-6 mb-4">

              <h6 className="fw-bold text-white mb-3">
                Legal & Contact
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/contact"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-envelope me-2"></i>
                  Contact
                </Link>

                <Link
                  to="/support"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-headset me-2"></i>
                  Support
                </Link>

                {/* WHATSAPP SUPPORT */}

                <a
                  href={whatsappSupport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-whatsapp me-2 text-success"></i>
                  WhatsApp Support
                </a>

                {/* WHATSAPP CHANNEL */}

                <a
                  href={whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-megaphone me-2 text-success"></i>
                  WhatsApp Channel
                </a>

                <Link
                  to="/terms"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Terms & Conditions
                </Link>

                <Link
                  to="/privacy"
                  className="text-light text-decoration-none small"
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Privacy Policy
                </Link>

              </div>

            </div>

          </div>

          {/* =================================================
              PAYMENT INFORMATION
          ================================================= */}

          <div
            className="rounded-4 p-3 mt-2 mb-4"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >

            <div className="row align-items-center">

              <div className="col-md-8">

                <div className="d-flex align-items-center gap-2">

                  <i
                    className="bi bi-shield-check text-success fs-4"
                  ></i>

                  <div>

                    <div className="fw-semibold">
                      Secure Payment Information
                    </div>

                    <small className="text-secondary">
                      Always verify the payment instructions displayed
                      on the Veran platform before making a deposit.
                    </small>

                  </div>

                </div>

              </div>

              <div className="col-md-4 text-md-end mt-3 mt-md-0">

                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    backgroundColor: "#ffc107",
                    color: "#212529",
                  }}
                >
                  Veran Enterprise
                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              COPYRIGHT
          ================================================= */}

          <hr className="border-secondary" />

          <div className="text-center small text-secondary">
            © {year} Veran Enterprise. All rights reserved.
          </div>

        </div>
      </footer>

      {/* =====================================================
          MOBILE FOOTER
      ===================================================== */}

      <div
        className="d-md-none fixed-bottom bg-dark border-top shadow-lg"
        style={{
          zIndex: 1050,
        }}
      >

        <div
          className="d-flex justify-content-around align-items-center py-2"
          style={{
            overflowX: "auto",
          }}
        >

          {/* DASHBOARD */}

          <Link
            to="/dashboard"
            className="text-light text-center text-decoration-none"
          >
            <i className="bi bi-house-door-fill fs-4"></i>

            <div style={{ fontSize: 11 }}>
              Dashboard
            </div>
          </Link>

          {/* INVEST NOW */}

          <Link
            to="/dashboard#packages"
            className="text-light text-center text-decoration-none"
          >
            <i className="bi bi-graph-up-arrow fs-4"></i>

            <div style={{ fontSize: 11 }}>
              Invest
            </div>
          </Link>

          {/* PROFILE */}

          <Link
            to="/profile"
            className="text-light text-center text-decoration-none"
          >
            <i className="bi bi-person-circle fs-4"></i>

            <div style={{ fontSize: 11 }}>
              Profile
            </div>
          </Link>

          {/* WHATSAPP */}

          <a
            href={whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-success text-center text-decoration-none"
          >
            <i className="bi bi-whatsapp fs-4"></i>

            <div style={{ fontSize: 11 }}>
              WhatsApp
            </div>
          </a>

          {!token ? (
            <>
              {/* LOGIN */}

              <Link
                to="/login"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-box-arrow-in-right fs-4"></i>

                <div style={{ fontSize: 11 }}>
                  Login
                </div>
              </Link>

              {/* REGISTER */}

              <Link
                to="/register"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-person-plus-fill fs-4"></i>

                <div style={{ fontSize: 11 }}>
                  Register
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* WALLET */}

              <Link
                to="/wallet"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-wallet2 fs-4"></i>

                <div style={{ fontSize: 11 }}>
                  Wallet
                </div>
              </Link>

              {/* LOGOUT */}

              <Link
                to="/"
                className="text-light text-center text-decoration-none"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                }}
              >
                <i className="bi bi-box-arrow-right fs-4"></i>

                <div style={{ fontSize: 11 }}>
                  Logout
                </div>
              </Link>
            </>
          )}

        </div>
      </div>
    </>
  );
}
