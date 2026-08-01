import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const active = (path) =>
    location.pathname === path
      ? "nav-link bg-primary text-white rounded fw-bold"
      : "nav-link text-light";

  return (
    <>
      {/* Mobile Overlay */}

      {isOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 1040,
          }}
        />
      )}

      <div
        className="bg-dark text-white d-flex flex-column shadow"
        style={{
          width: "260px",
          minHeight: "100vh",

          position: window.innerWidth < 992 ? "fixed" : "sticky",
          top: 0,
          left: 0,

          zIndex: 1050,

          transform:
            window.innerWidth < 992
              ? isOpen
                ? "translateX(0)"
                : "translateX(-100%)"
              : "translateX(0)",

          transition: "0.3s",
        }}
      >
        {/* Logo */}

        <div className="text-center py-4 border-bottom border-secondary">

          <h3 className="fw-bold mb-1">
            Veran
          </h3>

          <small className="text-secondary">
            Enterprise Admin
          </small>

        </div>

        {/* Navigation */}

        <ul className="nav flex-column p-3 flex-grow-1">

          <li className="nav-item mb-2">
            <Link
              className={active("/admin")}
              to="/admin"
              onClick={toggleSidebar}
            >
              📊 Dashboard
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/users")}
              to="/admin/users"
              onClick={toggleSidebar}
            >
              👥 Users
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/packages")}
              to="/admin/packages"
              onClick={toggleSidebar}
            >
              📦 Packages
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/investments")}
              to="/admin/investments"
              onClick={toggleSidebar}
            >
              💰 Investments
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/deposits")}
              to="/admin/deposits"
              onClick={toggleSidebar}
            >
              💵 Deposits
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/transactions")}
              to="/admin/transactions"
              onClick={toggleSidebar}
            >
              💳 Transactions
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/withdrawals")}
              to="/admin/withdrawals"
              onClick={toggleSidebar}
            >
              🏦 Withdrawals
            </Link>
          </li>

          <li className="nav-item mb-2">
            <Link
              className={active("/admin/referrals")}
              to="/admin/referrals"
              onClick={toggleSidebar}
            >
              🎁 Referrals
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className={active("/admin/profile")}
              to="/admin/profile"
              onClick={toggleSidebar}
            >
              👤 Admin Profile
            </Link>
          </li>

        </ul>

        {/* Footer */}

        <div className="p-3 border-top border-secondary">

          <button
            className="btn btn-danger w-100"
            onClick={logout}
          >
            Logout
          </button>

        </div>
      </div>
    </>
  );
}