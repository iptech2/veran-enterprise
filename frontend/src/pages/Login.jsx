import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const cleanIdentifier = identifier.trim();

      const isEmail = cleanIdentifier.includes("@");

      const res = await api.post("/auth/login", {
        email: isEmail ? cleanIdentifier : undefined,
        phone: !isEmail ? cleanIdentifier : undefined,
        password,
      });

      const { token, user } = res.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // Save login session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirect immediately
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {
      console.error("Login error:", err);

      alert(
        err.response?.data?.message ||
        "Login failed. Please check your details and try again."
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
          className="card shadow p-4"
          style={{ width: "360px" }}
        >
          <h3 className="text-center mb-3">
            Login
          </h3>

          <form onSubmit={handleLogin}>

            <input
              type="text"
              className="form-control mb-2"
              placeholder="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              disabled={loading}
            />

            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
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