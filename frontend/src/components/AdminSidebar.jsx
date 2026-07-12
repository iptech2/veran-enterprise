import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
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
    <div
      className="bg-dark text-white d-flex flex-column shadow"
      style={{
        width: "260px",
        minHeight: "100vh",
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
          <Link className={active("/admin")} to="/admin">
            📊 Dashboard
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            className={active("/admin/users")}
            to="/admin/users"
          >
            👥 Users
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            className={active("/admin/packages")}
            to="/admin/packages"
          >
            📦 Packages
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            className={active("/admin/investments")}
            to="/admin/investments"
          >
            💰 Investments
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            className={active("/admin/transactions")}
            to="/admin/transactions"
          >
            💳 Transactions
          </Link>
        </li>

        <li className="nav-item mb-2">
          <Link
            className={active("/admin/withdrawals")}
            to="/admin/withdrawals"
          >
            🏦 Withdrawals
          </Link>
        </li>

        {/* NEW */}
        <li className="nav-item mb-2">
          <Link
            className={active("/admin/referrals")}
            to="/admin/referrals"
          >
            🎁 Referrals
          </Link>
        </li>

        <li className="nav-item mb-2">
  <Link
    className={active("/admin/deposits")}
    to="/admin/deposits"
  >
    💵 Deposits
  </Link>
</li>
<li className="nav-item">
  <Link className="nav-link" to="/admin/profile">
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
  );
}