import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">

      <div className="container-fluid">

        <div>
          <h4 className="fw-bold mb-0">
            Veran Enterprise
          </h4>

          <small className="text-muted">
            Admin Control Panel
          </small>
        </div>

        <div className="d-flex align-items-center">

          <div className="text-end me-3">

            <div className="fw-semibold">
              {user.fullName || user.name || "Administrator"}
            </div>

            <small className="text-muted">
              {user.email}
            </small>

          </div>

          <button
            className="btn btn-outline-danger"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}