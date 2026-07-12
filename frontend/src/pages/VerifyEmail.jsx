import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        setStatus("loading");

        const res = await axios.get(
          `http://localhost:5000/api/auth/verify/${token}`
        );

        setStatus("success");
        setMessage(res.data.message);

        // auto redirect after 3 seconds
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
        <div>
          <h3>Verifying your email...</h3>
          <p>Please wait...</p>
        </div>
      )}

      {status === "success" && (
        <div>
          <h2 className="text-success">✅ {message}</h2>
          <p>You will be redirected to login...</p>
        </div>
      )}

      {status === "error" && (
        <div>
          <h2 className="text-danger">❌ {message}</h2>
          <p>Please try registering again.</p>
        </div>
      )}

    </div>
  );
}