import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ toggleSidebar }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3">

      <div className="container-fluid">

        {/* Mobile Menu Button */}

        <button
          className="btn btn-outline-dark d-lg-none me-3"
          onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Logo */}

        <div>

          <h4 className="fw-bold mb-0">
            Veran Enterprise
          </h4>

          <small className="text-muted">
            Admin Control Panel
          </small>

        </div>

        {/* Right Side */}

        <div className="d-flex align-items-center ms-auto">

          <div className="text-end me-3 d-none d-md-block">

            <div className="fw-semibold">
              {user.fullName || user.name || "Administrator"}
            </div>

            <small className="text-muted">
              {user.email}
            </small>

          </div>

          <button
            className="btn btn-danger btn-sm"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}