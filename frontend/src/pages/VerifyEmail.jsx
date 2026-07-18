import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        setStatus("loading");

        const res = await api.get(`/auth/verify/${token}`);

        setStatus("success");
        setMessage(res.data.message);

        setTimeout(() => {
          navigate("/");
        }, 3000);

      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
          "Verification failed"
        );
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="container mt-5 text-center">

      {status === "loading" && (
        <>
          <h3>Verifying your email...</h3>
          <p>Please wait...</p>
        </>
      )}

      {status === "success" && (
        <>
          <h2 className="text-success">✅ {message}</h2>
          <p>Redirecting to login...</p>
        </>
      )}

      {status === "error" && (
        <>
          <h2 className="text-danger">❌ {message}</h2>
          <p>Please try again.</p>
        </>
      )}

    </div>
  );
}