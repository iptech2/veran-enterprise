import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const isEmail = identifier.includes("@");

      const res = await api.post("/auth/login", {
        email: isEmail ? identifier : undefined,
        phone: !isEmail ? identifier : undefined,
        password,
      });

      // Save login session
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Redirect according to role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
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
              className="form-control mb-2"
              placeholder="Email or Phone"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>
            <div className="text-center mt-3">
  <Link to="/forgot-password">
    Forgot Password?
  </Link>
</div>
          </form>
        </div>
      </div>
    </>
  );
}