import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {

    e.preventDefault();

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {

      setLoading(true);

      const res = await api.post(
        `/auth/reset-password/${token}`,
        {
          password,
        }
      );

      alert(res.data.message);

      navigate("/");

    } catch (err) {

      alert(
        err.response?.data?.message ||
          "Reset failed"
      );

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
            Reset Password
          </h3>

          <form onSubmit={submit}>

            <div className="mb-3">

              <label>New Password</label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e)=>
                  setPassword(e.target.value)
                }
                required
              />

            </div>

            <div className="mb-3">

              <label>Confirm Password</label>

              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e)=>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </div>

            <button
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Reset Password"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}