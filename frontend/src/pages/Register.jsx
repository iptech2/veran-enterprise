// import { useState, useEffect } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import api from "../services/api";
// import Navbar from "../components/Navbar";

// export default function Register() {
//   const [searchParams] = useSearchParams();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [referralCode, setReferralCode] = useState("");

//   const [showFraudWarning, setShowFraudWarning] = useState(false);
//   const [fraudAcknowledged, setFraudAcknowledged] = useState(false);
//   const [registering, setRegistering] = useState(false);

//   useEffect(() => {
//     const ref = searchParams.get("ref");

//     if (ref) {
//       setReferralCode(ref);
//     }
//   }, [searchParams]);

//   // Open fraud warning before registration
//   const handleRegister = (e) => {
//     e.preventDefault();

//     setFraudAcknowledged(false);
//     setShowFraudWarning(true);
//   };

//   // Continue with registration after acknowledgement
//   const confirmRegistration = async () => {
//     if (!fraudAcknowledged) {
//       alert(
//         "Please confirm that you understand and agree to the fraud warning before continuing."
//       );
//       return;
//     }

//     try {
//       setRegistering(true);

//       const res = await api.post("/auth/register", {
//         fullName,
//         email,
//         phone,
//         password,
//         referralCode,
//       });

//       alert(res.data.message);

//       setFullName("");
//       setEmail("");
//       setPhone("");
//       setPassword("");
//       setReferralCode("");

//       setShowFraudWarning(false);
//       setFraudAcknowledged(false);

//     } catch (err) {
//       alert(
//         err.response?.data?.message ||
//           "Registration failed"
//       );
//     } finally {
//       setRegistering(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div
//         className="container d-flex justify-content-center align-items-center"
//         style={{ minHeight: "85vh" }}
//       >
//         <div
//           className="card shadow p-4 border-0 rounded-4"
//           style={{ width: "430px" }}
//         >
//           <h3 className="text-center mb-4 fw-bold">
//             Create Account
//           </h3>

//           <form onSubmit={handleRegister}>

//             <input
//               className="form-control mb-3"
//               placeholder="Full Name"
//               value={fullName}
//               onChange={(e) =>
//                 setFullName(e.target.value)
//               }
//               required
//             />

//             <input
//               type="email"
//               className="form-control mb-3"
//               placeholder="Email Address"
//               value={email}
//               onChange={(e) =>
//                 setEmail(e.target.value)
//               }
//               required
//             />

//             <input
//               className="form-control mb-3"
//               placeholder="Phone Number"
//               value={phone}
//               onChange={(e) =>
//                 setPhone(e.target.value)
//               }
//               required
//             />

//             <input
//               type="password"
//               className="form-control mb-3"
//               placeholder="Password"
//               value={password}
//               onChange={(e) =>
//                 setPassword(e.target.value)
//               }
//               required
//             />

//             <input
//               className="form-control mb-4"
//               placeholder="Referral Code (Optional)"
//               value={referralCode}
//               onChange={(e) =>
//                 setReferralCode(e.target.value)
//               }
//             />

//             <button
//               type="submit"
//               className="btn btn-success w-100 rounded-3"
//             >
//               Register
//             </button>

//           </form>

//           <div className="text-center mt-3">
//             Already have an account?
//             <Link to="/" className="ms-2">
//               Login
//             </Link>
//           </div>

//         </div>
//       </div>

//       {/* =========================================
//           FRAUD WARNING MODAL
//       ========================================== */}
//       {showFraudWarning && (
//         <div
//           className="modal fade show d-block"
//           tabIndex="-1"
//           role="dialog"
//           aria-modal="true"
//           style={{
//             backgroundColor: "rgba(0, 0, 0, 0.7)",
//             zIndex: 1055,
//           }}
//         >
//           <div className="modal-dialog modal-dialog-centered px-3">
//             <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

//               {/* Header */}
//               <div
//                 className="text-white text-center p-4"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #dc3545, #a71d2a)",
//                 }}
//               >
//                 <div
//                   className="mx-auto mb-3 rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
//                   style={{
//                     width: "70px",
//                     height: "70px",
//                     fontSize: "32px",
//                   }}
//                 >
//                   ⚠️
//                 </div>

//                 <h4 className="fw-bold mb-1">
//                   Important Fraud Warning
//                 </h4>

//                 <p className="mb-0 opacity-75">
//                   Please read carefully before creating
//                   your Veran Enterprise account.
//                 </p>
//               </div>

//               {/* Body */}
//               <div className="modal-body p-4">

//                 <div className="alert alert-danger rounded-3 border-0">
//                   <strong>
//                     Fraud is strictly prohibited.
//                   </strong>
//                   <br />

//                   Veran Enterprise does not tolerate
//                   false information, impersonation,
//                   fraudulent transactions, or attempts
//                   to obtain money through deception.
//                 </div>

//                 <p className="text-muted">
//                   When creating and using your account,
//                   you must provide accurate information
//                   and use the platform honestly.
//                 </p>

//                 <p className="text-muted">
//                   Providing false information or attempting
//                   to obtain money through fraudulent means
//                   may result in the suspension or closure
//                   of your account. Transactions associated
//                   with suspected fraudulent activity may
//                   be withheld while they are reviewed,
//                   subject to applicable law and our
//                   verification procedures.
//                 </p>

//                 <p className="fw-semibold mb-3">
//                   By continuing, you confirm that the
//                   information you provide is truthful and
//                   that you understand our fraud policy.
//                 </p>

//                 {/* Acknowledgement */}
//                 <div className="form-check border rounded-3 p-3 mb-4">
//                   <input
//                     className="form-check-input"
//                     type="checkbox"
//                     id="fraudAcknowledgement"
//                     checked={fraudAcknowledged}
//                     onChange={(e) =>
//                       setFraudAcknowledged(
//                         e.target.checked
//                       )
//                     }
//                   />

//                   <label
//                     className="form-check-label ms-2"
//                     htmlFor="fraudAcknowledgement"
//                   >
//                     I understand and agree to provide
//                     accurate information and not engage
//                     in fraudulent activity.
//                   </label>
//                 </div>

//                 {/* Buttons */}
//                 <div className="d-grid gap-2">

//                   <button
//                     type="button"
//                     className="btn btn-danger btn-lg rounded-3"
//                     disabled={
//                       !fraudAcknowledged ||
//                       registering
//                     }
//                     onClick={confirmRegistration}
//                   >
//                     {registering
//                       ? "Creating Account..."
//                       : "I Understand — Create Account"}
//                   </button>

//                   <button
//                     type="button"
//                     className="btn btn-light border rounded-3"
//                     disabled={registering}
//                     onClick={() =>
//                       setShowFraudWarning(false)
//                     }
//                   >
//                     Cancel
//                   </button>

//                 </div>

//                 <p className="text-center text-muted small mt-3 mb-0">
//                   Your account remains subject to
//                   Veran Enterprise's terms, policies,
//                   and verification procedures.
//                 </p>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const countryCodes = [
  { name: "Kenya", code: "+254" },
  { name: "Uganda", code: "+256" },
  { name: "Tanzania", code: "+255" },
  { name: "Rwanda", code: "+250" },
  { name: "Burundi", code: "+257" },
  { name: "South Sudan", code: "+211" },
  { name: "Ethiopia", code: "+251" },
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "South Africa", code: "+27" },
  { name: "United Kingdom", code: "+44" },
  { name: "United States / Canada", code: "+1" },
];

const formatInternationalPhone = (phone, countryCode) => {
  const digits = phone.replace(/\D/g, "");
  const dialCode = countryCode.replace(/\D/g, "");

  let nationalNumber = digits;

  if (nationalNumber.startsWith("0")) {
    nationalNumber = nationalNumber.slice(1);
  } else if (nationalNumber.startsWith(dialCode)) {
    nationalNumber = nationalNumber.slice(dialCode.length);
  }

  return `+${dialCode}${nationalNumber}`;
};

export default function Register() {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+254");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState("");

  const [showFraudWarning, setShowFraudWarning] = useState(false);
  const [fraudAcknowledged, setFraudAcknowledged] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");

    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  // Open fraud warning before registration
  const handleRegister = (e) => {
    e.preventDefault();

    setFraudAcknowledged(false);
    setShowFraudWarning(true);
  };

  // Continue with registration after acknowledgement
  const confirmRegistration = async () => {
    if (!fraudAcknowledged) {
      alert(
        "Please confirm that you understand and agree to the fraud warning before continuing."
      );
      return;
    }

    const internationalPhone = formatInternationalPhone(
      phone,
      countryCode
    );

    const phoneDigits = internationalPhone.replace(/\D/g, "");

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      alert("Please enter a valid phone number.");
      return;
    }

    try {
      setRegistering(true);

      const res = await api.post("/auth/register", {
        fullName,
        email,
        phone: internationalPhone,
        password,
        referralCode,
      });

      alert(res.data.message);

      setFullName("");
      setEmail("");
      setPhone("");
      setCountryCode("+254");
      setPassword("");
      setShowPassword(false);
      setReferralCode("");

      setShowFraudWarning(false);
      setFraudAcknowledged(false);

    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setRegistering(false);
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
          className="card shadow p-4 border-0 rounded-4"
          style={{ width: "430px", maxWidth: "100%" }}
        >
          <h3 className="text-center mb-4 fw-bold">
            Create Account
          </h3>

          <form onSubmit={handleRegister}>
            <input
              type="text"
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

            {/* Country code and phone number */}
            <div className="row g-2 mb-3">
              <div className="col-5">
                <select
                  className="form-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  aria-label="Country calling code"
                  required
                >
                  {countryCodes.map((country) => (
                    <option
                      key={country.code}
                      value={country.code}
                    >
                      {country.code} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-7">
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password with show/hide button */}
            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <input
              type="text"
              className="form-control mb-4"
              placeholder="Referral Code (Optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />

            <button
              type="submit"
              className="btn btn-success w-100 rounded-3"
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

      {/* FRAUD WARNING MODAL */}
      {showFraudWarning && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1055,
          }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">

              <div
                className="text-white text-center p-4"
                style={{
                  background:
                    "linear-gradient(135deg, #dc3545, #a71d2a)",
                }}
              >
                <div
                  className="mx-auto mb-3 rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center"
                  style={{
                    width: "70px",
                    height: "70px",
                    fontSize: "32px",
                  }}
                >
                  ⚠️
                </div>

                <h4 className="fw-bold mb-1">
                  Important Fraud Warning
                </h4>

                <p className="mb-0 opacity-75">
                  Please read carefully before creating
                  your Veran Enterprise account.
                </p>
              </div>

              <div className="modal-body p-4">
                <div className="alert alert-danger rounded-3 border-0">
                  <strong>Fraud is strictly prohibited.</strong>
                  <br />

                  Veran Enterprise does not tolerate
                  false information, impersonation,
                  fraudulent transactions, or attempts
                  to obtain money through deception.
                </div>

                <p className="text-muted">
                  When creating and using your account,
                  you must provide accurate information
                  and use the platform honestly.
                </p>

                <p className="text-muted">
                  Providing false information or attempting
                  to obtain money through fraudulent means
                  may result in the suspension or closure
                  of your account. Transactions associated
                  with suspected fraudulent activity may
                  be withheld while they are reviewed,
                  subject to applicable law and our
                  verification procedures.
                </p>

                <p className="fw-semibold mb-3">
                  By continuing, you confirm that the
                  information you provide is truthful and
                  that you understand our fraud policy.
                </p>

                <div className="form-check border rounded-3 p-3 mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="fraudAcknowledgement"
                    checked={fraudAcknowledged}
                    onChange={(e) =>
                      setFraudAcknowledged(e.target.checked)
                    }
                  />

                  <label
                    className="form-check-label ms-2"
                    htmlFor="fraudAcknowledgement"
                  >
                    I understand and agree to provide
                    accurate information and not engage
                    in fraudulent activity.
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-lg rounded-3"
                    disabled={!fraudAcknowledged || registering}
                    onClick={confirmRegistration}
                  >
                    {registering
                      ? "Creating Account..."
                      : "I Understand — Create Account"}
                  </button>

                  <button
                    type="button"
                    className="btn btn-light border rounded-3"
                    disabled={registering}
                    onClick={() => setShowFraudWarning(false)}
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-center text-muted small mt-3 mb-0">
                  Your account remains subject to
                  Veran Enterprise's terms, policies,
                  and verification procedures.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
