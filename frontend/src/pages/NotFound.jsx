import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ minHeight: "80vh" }}
      >
        <div className="text-center">

          <h1
            className="display-1 fw-bold text-primary"
            style={{ fontSize: "120px" }}
          >
            404
          </h1>

          <h2 className="fw-bold mb-3">
            Page Not Found
          </h2>

          <p className="text-muted mb-4">
            Sorry, the page you are looking for does not exist
            or may have been moved.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">

            <Link
              to="/dashboard"
              className="btn btn-primary"
            >
              Dashboard
            </Link>

            <Link
              to="/"
              className="btn btn-outline-secondary"
            >
              Home
            </Link>

          </div>

        </div>
      </div>
    </>
  );
}