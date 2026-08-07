import Navbar from "../components/Navbar";

export default function Terms() {
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Terms & Conditions
          </h1>

          <p className="text-muted">
            Please read these terms carefully before using Veran Enterprise.
          </p>
        </div>

        <div className="card shadow border-0">
          <div className="card-body">

            <h4>1. Acceptance of Terms</h4>

            <p>
              By creating an account or using Veran Enterprise,
              you agree to comply with these Terms and Conditions.
            </p>

            <hr />

            <h4>2. User Responsibilities</h4>

            <ul>
              <li>Provide accurate registration information.</li>
              <li>Keep your password secure.</li>
              <li>Do not share your account with others.</li>
              <li>Comply with all applicable laws and regulations.</li>
            </ul>

            <hr />

            <h4>3. Deposits</h4>

            <p>
              Deposits made through M-Pesa are credited only after
              successful confirmation from Safaricom.
            </p>

            <hr />

            <h4>4. Withdrawals</h4>

            <p>
              Withdrawal requests are reviewed before processing.
              Processing times may vary depending on verification
              and operational requirements.
            </p>

            <hr />

            <h4>5. Investment Risk</h4>

            <p>
              Investments may involve financial risk. Users are
              encouraged to understand available investment packages
              before committing funds.
            </p>

            <hr />

            <h4>6. Account Suspension</h4>

            <p>
              Veran Enterprise reserves the right to suspend or
              terminate accounts involved in fraudulent, abusive,
              or illegal activities.
            </p>

            <hr />

            <h4>7. Limitation of Liability</h4>

            <p>
              Veran Enterprise shall not be responsible for losses
              resulting from incorrect information supplied by users,
              network failures, or third-party service interruptions.
            </p>

            <hr />

            <h4>8. Changes to These Terms</h4>

            <p>
              These Terms & Conditions may be updated periodically.
              Continued use of the platform indicates acceptance of
              any revisions.
            </p>

            <hr />

            <h4>9. Contact</h4>

            <p>
              Email:
              <strong> veranenterprise@gmail.com</strong>
            </p>

          </div>
        </div>

      </div>
    </>
  );
}