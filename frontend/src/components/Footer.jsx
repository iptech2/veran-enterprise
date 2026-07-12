import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light mt-auto pt-5 pb-4">
      <div className="container">

        <div className="row text-center text-md-start">

          {/* BRAND */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Veran Enterprise</h5>
            <p className="small text-secondary">
              Smart investment & financial growth platform.
            </p>
          </div>

          {/* LINKS */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Navigation</h6>
            <div className="d-flex flex-column gap-1">
              <Link className="text-light text-decoration-none" to="/">
                Login
              </Link>
              <Link className="text-light text-decoration-none" to="/register">
                Register
              </Link>
              <Link className="text-light text-decoration-none" to="/dashboard">
                Dashboard
              </Link>
            </div>
          </div>

          {/* LEGAL */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Legal</h6>
            <div className="d-flex flex-column gap-1">
              <a href="#" className="text-light text-decoration-none">
                Terms & Conditions
              </a>
              <a href="#" className="text-light text-decoration-none">
                Privacy Policy
              </a>
            </div>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center small text-secondary">
          © {year} Veran Enterprise. All rights reserved.
        </div>

      </div>
    </footer>
  );
}