import Navbar from "../components/Navbar";

export default function Privacy() {
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Privacy Policy
          </h1>

          <p className="text-muted">
            Your privacy is important to us. This policy explains how
            Veran Enterprise collects, uses, and protects your
            personal information.
          </p>
        </div>

        <div className="card shadow border-0">

          <div className="card-body">

            <h4>1. Information We Collect</h4>

            <p>
              We may collect the following information when you use
              Veran Enterprise:
            </p>

            <ul>
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>M-Pesa Transaction Details</li>
              <li>Investment Records</li>
              <li>Withdrawal Requests</li>
            </ul>

            <hr />

            <h4>2. How We Use Your Information</h4>

            <ul>
              <li>To create and manage your account.</li>
              <li>To process deposits and withdrawals.</li>
              <li>To improve our services.</li>
              <li>To communicate important account updates.</li>
              <li>To prevent fraud and unauthorized access.</li>
            </ul>

            <hr />

            <h4>3. Data Security</h4>

            <p>
              We use appropriate technical and organizational measures
              to safeguard your personal information from unauthorized
              access, alteration, or disclosure.
            </p>

            <hr />

            <h4>4. Sharing of Information</h4>

            <p>
              We do not sell or rent your personal information to third
              parties. Information may only be shared where required by
              law or with trusted service providers necessary for
              operating the platform.
            </p>

            <hr />

            <h4>5. Cookies</h4>

            <p>
              Our website may use cookies to improve user experience,
              remember preferences, and analyze website performance.
            </p>

            <hr />

            <h4>6. Your Rights</h4>

            <ul>
              <li>Access your personal information.</li>
              <li>Request corrections to inaccurate information.</li>
              <li>Request deletion of your account where applicable.</li>
              <li>Contact us regarding any privacy concerns.</li>
            </ul>

            <hr />

            <h4>7. Contact Us</h4>

            <p>
              If you have any questions regarding this Privacy Policy,
              please contact us.
            </p>

            <p>
              <strong>Email:</strong><br />
              <a
                href="mailto:veranenterprise@gmail.com"
                className="text-decoration-none"
              >
                veranenterprise@gmail.com
              </a>
            </p>

            <p>
              <strong>WhatsApp:</strong><br />
              <a
                href="https://wa.me/qr/JSXNIJSUMUP7A1"
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none"
              >
                Chat with Support
              </a>
            </p>

            <hr />

            <p className="text-muted mb-0">
              Last Updated: August 2026
            </p>

          </div>

        </div>

      </div>
    </>
  );
}