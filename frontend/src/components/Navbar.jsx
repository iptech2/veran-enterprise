import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaHistory,
  FaGift,
  FaUser,
  FaUsers,
  FaBox,
  FaChartLine,
  FaCreditCard,
  FaUniversity,
  FaReceipt,
  FaBuilding,
  FaEnvelope,
  FaWhatsapp,
  FaQuestionCircle,
  FaInfoCircle,
  FaFileContract,
  FaShieldAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =====================================================
  // VERAN WHATSAPP CHANNEL
  // =====================================================

  const whatsappChannel =
    "https://whatsapp.com/channel/0029VbE1fZ50AgWFhmH4VO3e";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartLine />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Packages",
      path: "/admin/packages",
      icon: <FaBox />,
    },
    {
      name: "Investments",
      path: "/admin/investments",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Deposits",
      path: "/admin/deposits",
      icon: <FaCreditCard />,
    },
    {
      name: "Withdrawals",
      path: "/admin/withdrawals",
      icon: <FaUniversity />,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <FaReceipt />,
    },
    {
      name: "Referrals",
      path: "/admin/referrals",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUser />,
    },
  ];

  const userLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: <FaWallet />,
    },
    {
      name: "Withdraw",
      path: "/withdraw",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <FaHistory />,
    },
    {
      name: "Referrals",
      path: "/referrals",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  const links =
    user.role === "admin"
      ? adminLinks
      : userLinks;

  return (
    <>
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 1040,
          }}
        />
      )}

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
        style={{ zIndex: 1030 }}
      >
        <div className="container">

          {/* BRAND */}

          <Link
            to={
              token
                ? user.role === "admin"
                  ? "/admin"
                  : "/dashboard"
                : "/"
            }
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
          >
            <FaBuilding />
            Veran Enterprise
          </Link>

          {/* MOBILE MENU BUTTON */}

          <button
            className="btn btn-outline-light d-lg-none"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end">

            {!token ? (
              <>
                <NavLink
                  className="nav-link text-white"
                  to="/login"
                >
                  Login
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/register"
                >
                  Register
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/about"
                >
                  About
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/contact"
                >
                  Contact
                </NavLink>

                {/* WHATSAPP CHANNEL */}

                <a
                  href={whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-white d-flex align-items-center gap-2"
                >
                  <FaWhatsapp className="text-success" />
                  WhatsApp Channel
                </a>
              </>
            ) : (
              <>
                {links.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 ${
                        isActive
                          ? "text-warning fw-bold"
                          : "text-white"
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}

                {/* WHATSAPP CHANNEL */}

                <a
                  href={whatsappChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link text-white d-flex align-items-center gap-2"
                >
                  <FaWhatsapp className="text-success" />
                  WhatsApp
                </a>

                {/* USER DROPDOWN */}

                <div className="dropdown ms-3">
                  <button
                    className="btn btn-outline-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user.fullName
                      ? user.fullName
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                      >
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/contact"
                      >
                        Contact
                      </Link>
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>

                  </ul>
                </div>
              </>
            )}

          </div>
        </div>
      </nav>

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}

      <div
        className="bg-dark text-white shadow-lg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 290,
          height: "100vh",
          zIndex: 1050,
          overflowY: "auto",
          transform: menuOpen
            ? "translateX(0)"
            : "translateX(-100%)",
          transition: ".35s ease",
        }}
      >

        {/* SIDEBAR HEADER */}

        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">

          <div>

            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaBuilding />
              Veran Enterprise
            </h5>

            {token && (
              <small className="text-secondary">
                Welcome {user.fullName}
              </small>
            )}

          </div>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={closeMenu}
          >
            <FaTimes />
          </button>

        </div>

        <div className="p-3">

          {/* =================================================
              AUTH LINKS
          ================================================= */}

          {!token ? (

            <>
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="nav-link text-white py-3"
              >
                <FaSignInAlt className="me-3" />
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMenu}
                className="nav-link text-white py-3"
              >
                <FaUserPlus className="me-3" />
                Register
              </NavLink>
            </>

          ) : (

            <>
              {links.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link py-3 rounded px-2 mb-1 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-white"
                    }`
                  }
                >
                  <span className="me-3">
                    {item.icon}
                  </span>

                  {item.name}
                </NavLink>

              ))}
            </>

          )}

          {/* =================================================
              INFORMATION
          ================================================= */}

          <hr className="border-secondary my-4" />

          <h6 className="text-uppercase text-secondary mb-3">
            Information
          </h6>

          {/* CONTACT */}

          <a
            href="mailto:veranenterprise@gmail.com"
            className="nav-link text-white py-2"
          >
            <FaEnvelope className="me-3" />
            Contact Us
          </a>

          {/* WHATSAPP SUPPORT */}

          <a
            href="https://wa.me/qr/JSXNIJSUMUP7A1"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-white py-2"
          >
            <FaWhatsapp className="me-3 text-success" />
            WhatsApp Support
          </a>

          {/* WHATSAPP CHANNEL */}

          <a
            href={whatsappChannel}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link text-white py-2"
          >
            <FaWhatsapp className="me-3 text-success" />
            WhatsApp Channel
          </a>

          {/* ABOUT */}

          <NavLink
            to="/about"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaInfoCircle className="me-3" />
            About
          </NavLink>

          {/* FAQ */}

          <NavLink
            to="/faq"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaQuestionCircle className="me-3" />
            FAQ
          </NavLink>

          {/* TERMS */}

          <NavLink
            to="/terms"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaFileContract className="me-3" />
            Terms & Conditions
          </NavLink>

          {/* PRIVACY */}

          <NavLink
            to="/privacy"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaShieldAlt className="me-3" />
            Privacy Policy
          </NavLink>

          {/* =================================================
              LOGOUT
          ================================================= */}

          {token && (

            <>
              <hr className="border-secondary my-4" />

              <button
                onClick={logout}
                className="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </>

          )}

        </div>

        {/* SIDEBAR FOOTER */}

        <div className="text-center text-secondary small py-3 border-top">
          © {new Date().getFullYear()} Veran Enterprise
        </div>

      </div>
    </>
  );
}
