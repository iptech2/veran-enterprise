import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Register() {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        phone,
        password,
        referralCode,
      });

      alert(res.data.message);

      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setReferralCode("");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "85vh" }}
      >
        <div
          className="card shadow p-4"
          style={{ width: "430px" }}
        >
          <h3 className="text-center mb-4">
            Create Account
          </h3>

          <form onSubmit={handleRegister}>

            <input
              className="form-control mb-3"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <input
              type="email"
              className="form-control mb-3"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="form-control mb-3"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              className="form-control mb-4"
              placeholder="Referral Code (Optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />

            <button
              className="btn btn-success w-100"
            >
              Register
            </button>

          </form>

          <div className="text-center mt-3">
            Already have an account?
            <Link to="/" className="ms-2">
              Login
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
