import Navbar from "../components/Navbar";

export default function FAQ() {
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Frequently Asked Questions
          </h1>

          <p className="text-muted">
            Find answers to the most common questions about Veran Enterprise.
          </p>
        </div>

        <div className="accordion" id="faqAccordion">

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                How do I create an account?
              </button>

            </h2>

            <div
              id="faq1"
              className="accordion-collapse collapse show"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Click the Register button, complete the registration form,
                verify your email address, then log in to access your dashboard.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                How do I deposit money?
              </button>

            </h2>

            <div
              id="faq2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Navigate to Wallet, enter your amount and M-Pesa number,
                then approve the STK Push on your phone.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                When is my wallet credited?
              </button>

            </h2>

            <div
              id="faq3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Immediately after Safaricom confirms a successful payment,
                your wallet balance updates automatically.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq4"
              >
                How do investments work?
              </button>

            </h2>

            <div
              id="faq4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Select an investment package, invest using your wallet
                balance and monitor your earnings directly from your dashboard.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq5"
              >
                How do I withdraw my earnings?
              </button>

            </h2>

            <div
              id="faq5"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Visit the Withdraw page, enter the amount you wish to
                withdraw and submit your request for approval.
              </div>
            </div>

          </div>

          <div className="accordion-item">

            <h2 className="accordion-header">

              <button
                className="accordion-button collapsed"
                data-bs-toggle="collapse"
                data-bs-target="#faq6"
              >
                How do I contact support?
              </button>

            </h2>

            <div
              id="faq6"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >
              <div className="accordion-body">
                Contact us via email at
                <strong> veranenterprise@gmail.com </strong>
                or through our official WhatsApp support.
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}