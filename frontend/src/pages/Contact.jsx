import Navbar from "../components/Navbar";
import {
  FaEnvelope,
  FaWhatsapp,
  FaClock,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Contact() {
  return (
    <>
      <Navbar />

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">
            Contact Us
          </h1>

          <p className="text-muted">
            We'd love to hear from you. Reach us using the details below.
          </p>
        </div>

        <div className="row g-4">

          {/* Contact Details */}

          <div className="col-lg-5">

            <div className="card shadow border-0 h-100">

              <div className="card-body">

                <h4 className="mb-4">
                  Contact Information
                </h4>

                <p>
                  <FaEnvelope className="text-primary me-3" />
                  <strong>Email</strong>
                </p>

                <p className="ms-4">
                  <a
                    href="mailto:veranenterprise@gmail.com"
                    className="text-decoration-none"
                  >
                    veranenterprise@gmail.com
                  </a>
                </p>

                <hr />

                <p>
                  <FaWhatsapp className="text-success me-3" />
                  <strong>WhatsApp</strong>
                </p>

                <p className="ms-4">
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

                <p>
                  <FaClock className="text-warning me-3" />
                  <strong>Working Hours</strong>
                </p>

                <p className="ms-4">
                  Monday - Saturday<br />
                  8:00 AM - 6:00 PM
                </p>

                <hr />

                <p>
                  <FaMapMarkerAlt className="text-danger me-3" />
                  <strong>Location</strong>
                </p>

                <p className="ms-4">
                  Kenya
                </p>

              </div>

            </div>

          </div>

          {/* Contact Form */}

          <div className="col-lg-7">

            <div className="card shadow border-0">

              <div className="card-body">

                <h4 className="mb-4">
                  Send us a Message
                </h4>

                <form>

                  <input
                    className="form-control mb-3"
                    placeholder="Your Name"
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Email Address"
                    type="email"
                  />

                  <input
                    className="form-control mb-3"
                    placeholder="Subject"
                  />

                  <textarea
                    rows="6"
                    className="form-control mb-3"
                    placeholder="Write your message..."
                  />

                  <button
                    className="btn btn-primary w-100"
                    type="button"
                  >
                    Send Message
                  </button>

                </form>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}