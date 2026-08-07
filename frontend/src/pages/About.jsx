import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">
            About Veran Enterprise
          </h1>

          <p className="lead text-muted">
            Empowering individuals through secure digital investments and financial growth.
          </p>
        </div>

        <div className="row g-4">

          <div className="col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body">

                <h3>Who We Are</h3>

                <p>
                  Veran Enterprise is a modern investment platform
                  designed to provide safe, transparent and reliable
                  investment opportunities.
                </p>

                <p>
                  Our platform enables users to deposit funds,
                  invest in carefully designed packages,
                  monitor earnings in real time,
                  and withdraw profits securely.
                </p>

              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow h-100">
              <div className="card-body">

                <h3>Our Mission</h3>

                <p>
                  To provide innovative financial solutions that help
                  people grow their wealth through technology,
                  transparency and trust.
                </p>

              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow text-center h-100">
              <div className="card-body">

                <h2>🔒</h2>

                <h5>Secure</h5>

                <p>
                  Your investments and personal information are protected using industry security standards.
                </p>

              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow text-center h-100">
              <div className="card-body">

                <h2>⚡</h2>

                <h5>Fast</h5>

                <p>
                  Instant M-Pesa deposits and efficient account management.
                </p>

              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow text-center h-100">
              <div className="card-body">

                <h2>📈</h2>

                <h5>Growth</h5>

                <p>
                  Helping investors achieve consistent financial growth.
                </p>

              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}