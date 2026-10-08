import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const token = localStorage.getItem("token");

  const whatsappChannel =
    "https://whatsapp.com/channel/0029VbE1fZ50AgWFhmH4VO3e";

  const whatsappSupport =
    "https://wa.me/qr/JSXNIJSUMUP7A1";

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}

      <footer className="bg-dark text-light mt-auto pt-5 pb-4 d-none d-md-block">
        <div className="container">
          <div className="row text-center text-md-start">

            {/* BRAND */}

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">
                Veran Enterprise
              </h5>

              <p className="small text-secondary">
                Smart investment and financial growth platform.
              </p>

              {/* WHATSAPP CHANNEL */}

              <a
                href={whatsappChannel}
                target="_blank"
                rel="noopener noreferrer"
                className="text-success text-decoration-none d-inline-flex align-items-center gap-2 mt-2"
              >
                <i className="bi bi-whatsapp fs-5"></i>
                <span>Follow us on WhatsApp Channel</span>
              </a>
            </div>

            {/* NAVIGATION */}

            <div className="col-md-4 mb-4">

              <h6 className="fw-bold">
                Navigation
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/dashboard"
                  className="text-light text-decoration-none"
                >
                  Dashboard
                </Link>

                <Link
                  to="/wallet"
                  className="text-light text-decoration-none"
                >
                  Wallet
                </Link>

                <Link
                  to="/transactions"
                  className="text-light text-decoration-none"
                >
                  Transactions
                </Link>

                <Link
                  to="/profile"
                  className="text-light text-decoration-none"
                >
                  Profile
                </Link>

              </div>

            </div>

            {/* LEGAL & CONTACT */}

            <div className="col-md-4 mb-4">

              <h6 className="fw-bold">
                Legal & Contact
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/contact"
                  className="text-light text-decoration-none"
                >
                  Contact
                </Link>

                <Link
                  to="/support"
                  className="text-light text-decoration-none"
                >
                  Support
                </Link>

                {/* WHATSAPP SUPPORT */}

                <a
                  href={whatsappSupport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  WhatsApp Support
                </a>

                {/* WHATSAPP CHANNEL */}

                <a
                  href={whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                >
                  <i className="bi bi-megaphone me-2"></i>
                  WhatsApp Channel
                </a>

                <Link
                  to="/terms"
                  className="text-light text-decoration-none"
                >
                  Terms & Conditions
                </Link>

                <Link
                  to="/privacy"
                  className="text-light text-decoration-none"
                >
                  Privacy Policy
                </Link>

              </div>

            </div>

          </div>

          <hr className="border-secondary" />

          <div className="text-center small text-secondary">
            © {year} Veran Enterprise. All rights reserved.
          </div>

        </div>
      </footer>

      {/* ================= MOBILE FOOTER ================= */}

      <div
        className="d-md-none fixed-bottom bg-dark border-top shadow-lg"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex justify-content-around py-2">

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
              Invest Now
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
            <i className="bi bi-megaphone me-2"></i>

            <div style={{ fontSize: 11 }}>
              WhatsApp 
            </div>
          </a>

          {!token ? (
            <>
              {/* LOGIN */}

              <Link
                to="/"
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