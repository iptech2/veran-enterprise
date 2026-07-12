import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/forgot-password", {
        email,
      });

      alert(res.data.message);
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">

      <div
        className="card shadow mx-auto"
        style={{ maxWidth: 450 }}
      >

        <div className="card-body">

          <h3 className="text-center mb-4">
            Forgot Password
          </h3>

          <form onSubmit={submit}>

            <div className="mb-3">

              <label>Email Address</label>

              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />

            </div>

            <button
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>

          <div className="text-center mt-3">

            <Link to="/">
              Back to Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}