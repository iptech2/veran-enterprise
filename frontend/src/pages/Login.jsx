import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const cleanIdentifier = identifier.trim();

    if (!cleanIdentifier) {
      alert("Please enter your phone number or email address.");
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      return;
    }

    // Detect whether the user entered an email or phone number.
    const isEmail = cleanIdentifier.includes("@");

    const loginData = {
      ...(isEmail
        ? { email: cleanIdentifier.toLowerCase() }
        : { phone: cleanIdentifier }),
      password,
    };

    setLoading(true);

    try {
      const res = await api.post("/auth/login", loginData);

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // Save login session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect according to account role
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);

      alert(
        err.response?.data?.message ||
          "Login failed. Please check your phone number or email and password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <div
          className="card shadow p-4 border-0 rounded-4"
          style={{ width: "360px", maxWidth: "100%" }}
        >
          <h3 className="text-center mb-3 fw-bold">
            Login
          </h3>

          <form onSubmit={handleLogin}>
            {/* Phone number or email */}
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Phone Number (or Email Address)"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />

            {/* Password with show/hide */}
            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 rounded-3"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center mt-3">
              <Link to="/forgot-password">
                Forgot Password?
              </Link>
            </div>

            <div className="text-center mt-3">
              Don't have an account?{" "}
              <Link to="/register">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}