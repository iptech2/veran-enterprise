import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollTop from "../components/ScrollTop";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className="bg-dark text-white py-5">

        <div className="container">

          <div className="row align-items-center">

            <div className="col-lg-6">

              <h1 className="display-4 fw-bold mb-4">
                Invest Smart.
                <br />
                Grow Your Wealth.
              </h1>

              <p className="lead text-light">
                Veran Enterprise provides a secure investment platform
                with instant M-Pesa deposits, transparent investment
                packages and easy withdrawals.
              </p>

              <div className="mt-4">

                <Link
                  to="/register"
                  className="btn btn-primary btn-lg me-3"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="btn btn-outline-light btn-lg"
                >
                  Login
                </Link>

              </div>

            </div>

            <div className="col-lg-6 text-center">

              <img
                src="/investment.png"
                className="img-fluid"
                alt="Investment"
              />

            </div>

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}

<section className="py-5">

  <div className="container">

    <div className="text-center mb-5">

      <h2 className="fw-bold">
        Why Choose Veran Enterprise?
      </h2>

      <p className="text-muted">
        A secure investment platform built for growth.
      </p>

    </div>

    <div className="row g-4">

      <div className="col-md-4">

        <div className="card border-0 shadow h-100">

          <div className="card-body text-center">

            <div className="display-5 mb-3">
              🔒
            </div>

            <h4>Secure Platform</h4>

            <p className="text-muted">
              Your account and investments are protected using modern
              security standards.
            </p>

          </div>

        </div>

      </div>

      <div className="col-md-4">

        <div className="card border-0 shadow h-100">

          <div className="card-body text-center">

            <div className="display-5 mb-3">
              💳
            </div>

            <h4>Instant M-Pesa</h4>

            <p className="text-muted">
              Deposit money instantly using secure M-Pesa STK Push.
            </p>

          </div>

        </div>

      </div>

      <div className="col-md-4">

        <div className="card border-0 shadow h-100">

          <div className="card-body text-center">

            <div className="display-5 mb-3">
              📈
            </div>

            <h4>Daily Growth</h4>

            <p className="text-muted">
              Invest in professionally designed packages and monitor
              your earnings in real time.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

<section className="bg-primary text-white py-5">

  <div className="container">

    <div className="row text-center">

      <div className="col-md-3">

        <h2 className="fw-bold">
          10K+
        </h2>

        <p>Registered Users</p>

      </div>

      <div className="col-md-3">

        <h2 className="fw-bold">
          KES 50M+
        </h2>

        <p>Total Investments</p>

      </div>

      <div className="col-md-3">

        <h2 className="fw-bold">
          24/7
        </h2>

        <p>Customer Support</p>

      </div>

      <div className="col-md-3">

        <h2 className="fw-bold">
          99%
        </h2>

        <p>Customer Satisfaction</p>

      </div>

    </div>

  </div>

</section>

<section className="py-5">

  <div className="container">

    <div className="text-center mb-5">

      <h2 className="fw-bold">
        How It Works
      </h2>

    </div>

    <div className="row g-4 text-center">

      <div className="col-lg-3">

        <h1>1️⃣</h1>

        <h4>Create Account</h4>

        <p>Register and verify your email.</p>

      </div>

      <div className="col-lg-3">

        <h1>2️⃣</h1>

        <h4>Deposit</h4>

        <p>Deposit securely using M-Pesa STK Push.</p>

      </div>

      <div className="col-lg-3">

        <h1>3️⃣</h1>

        <h4>Invest</h4>

        <p>Select an investment package that suits your goals.</p>

      </div>

      <div className="col-lg-3">

        <h1>4️⃣</h1>

        <h4>Earn & Withdraw</h4>

        <p>Track your returns and request withdrawals with ease.</p>

      </div>

    </div>

  </div>

</section>
{/* INVESTMENT PACKAGES */}

<section className="py-5 bg-light">

  <div className="container">

    <div className="text-center mb-5">

      <h2 className="fw-bold">
        Investment Packages
      </h2>

      <p className="text-muted">
        Choose an investment plan that matches your financial goals.
      </p>

    </div>

    <div className="row g-4">

      {/* Starter */}

      <div className="col-lg-4">

        <div className="card shadow border-0 h-100">

          <div className="card-body text-center">

            <h3 className="fw-bold text-primary">
              Starter
            </h3>

            <h2 className="my-4">
              KES 1,000
            </h2>

            <ul className="list-unstyled">

              <li className="mb-2">✔ Beginner Friendly</li>
              <li className="mb-2">✔ Secure Investment</li>
              <li className="mb-2">✔ Daily Earnings</li>
              <li className="mb-2">✔ Withdraw Anytime*</li>

            </ul>

            <a
              href="/register"
              className="btn btn-primary w-100 mt-3"
            >
              Get Started
            </a>

          </div>

        </div>

      </div>

      {/* Premium */}

      <div className="col-lg-4">

        <div className="card border-primary border-3 shadow-lg h-100">

          <div className="card-header bg-primary text-white text-center">

            MOST POPULAR

          </div>

          <div className="card-body text-center">

            <h3 className="fw-bold text-primary">
              Premium
            </h3>

            <h2 className="my-4">
              KES 5,000
            </h2>

            <ul className="list-unstyled">

              <li className="mb-2">✔ Higher Returns</li>
              <li className="mb-2">✔ Priority Support</li>
              <li className="mb-2">✔ Daily Earnings</li>
              <li className="mb-2">✔ Referral Bonuses</li>

            </ul>

            <a
              href="/register"
              className="btn btn-primary w-100 mt-3"
            >
              Start Investing
            </a>

          </div>

        </div>

      </div>

      {/* Elite */}

      <div className="col-lg-4">

        <div className="card shadow border-0 h-100">

          <div className="card-body text-center">

            <h3 className="fw-bold text-primary">
              Elite
            </h3>

            <h2 className="my-4">
              KES 10,000+
            </h2>

            <ul className="list-unstyled">

              <li className="mb-2">✔ Maximum Returns</li>
              <li className="mb-2">✔ VIP Support</li>
              <li className="mb-2">✔ Priority Withdrawals</li>
              <li className="mb-2">✔ Exclusive Benefits</li>

            </ul>

            <a
              href="/register"
              className="btn btn-primary w-100 mt-3"
            >
              Join Now
            </a>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
{/* TESTIMONIALS */}

<section className="py-5">

  <div className="container">

    <div className="text-center mb-5">

      <h2 className="fw-bold">
        What Our Investors Say
      </h2>

      <p className="text-muted">
        Trusted by investors across Kenya.
      </p>

    </div>

    <div className="row g-4">

      <div className="col-lg-4">

        <div className="card shadow border-0 h-100">

          <div className="card-body">

            ⭐⭐⭐⭐⭐

            <p className="mt-3">
              "The M-Pesa deposits are fast and my investment
              dashboard is easy to use."
            </p>

            <h6 className="mb-0">
              James K.
            </h6>

          </div>

        </div>

      </div>

      <div className="col-lg-4">

        <div className="card shadow border-0 h-100">

          <div className="card-body">

            ⭐⭐⭐⭐⭐

            <p className="mt-3">
              "Excellent customer support and a very simple
              investment process."
            </p>

            <h6 className="mb-0">
              Mercy A.
            </h6>

          </div>

        </div>

      </div>

      <div className="col-lg-4">

        <div className="card shadow border-0 h-100">

          <div className="card-body">

            ⭐⭐⭐⭐⭐

            <p className="mt-3">
              "I can monitor my investments anytime from my
              dashboard. Highly recommended."
            </p>

            <h6 className="mb-0">
              Brian N.
            </h6>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>
{/* CALL TO ACTION */}

<section
  className="py-5 text-white"
  style={{
    background:
      "linear-gradient(135deg,#0d6efd,#198754)"
  }}
>

  <div className="container text-center">

    <h2 className="fw-bold display-5 mb-3">
      Ready to Start Investing?
    </h2>

    <p className="lead mb-4">
      Join thousands of investors growing their wealth with
      Veran Enterprise.
    </p>

    <div className="d-flex justify-content-center flex-wrap gap-3">

      <Link
        to="/register"
        className="btn btn-light btn-lg px-4"
      >
        Create Account
      </Link>

      <Link
        to="/login"
        className="btn btn-outline-light btn-lg px-4"
      >
        Login
      </Link>

    </div>

  </div>

</section>
<WhatsAppButton />


<ScrollTop />
    </>
  );
}