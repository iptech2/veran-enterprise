// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/");
//   };

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
//       <div className="container">

//         <Link
//           className="navbar-brand fw-bold"
//           to={user?.role === "admin" ? "/admin" : "/dashboard"}
//         >
//           Veran Enterprise
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div
//           className="collapse navbar-collapse"
//           id="navbarNav"
//         >
//           <ul className="navbar-nav ms-auto">

//             {!token ? (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/">
//                     Login
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             ) : (
//               <>
//                 {/* USER LINKS */}

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/dashboard">
//                     Dashboard
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/wallet">
//                     Wallet
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/withdraw">
//                     Withdraw
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/transactions">
//                     Transactions
//                   </Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link" to="/referrals">
//                     🎁 Referrals
//                   </Link>
//                 </li>
//                 <li className="nav-item">
//        <Link className="nav-link" to="/profile">
//     👤 Profile
//   </Link>
// </li>

//                 {/* ADMIN LINKS */}

//                 {/* {user?.role === "admin" && (
//                   <>
//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning fw-bold"
//                         to="/admin"
//                       >
//                         Admin Dashboard
//                       </Link>
//                     </li>

//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning"
//                         to="/admin/packages"
//                       >
//                         Packages
//                       </Link>
//                     </li>

//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning"
//                         to="/admin/users"
//                       >
//                         Users
//                       </Link>
//                     </li>

//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning"
//                         to="/admin/investments"
//                       >
//                         Investments
//                       </Link>
//                     </li>

//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning"
//                         to="/admin/transactions"
//                       >
//                         Transactions
//                       </Link>
//                     </li>

//                     <li className="nav-item">
//                       <Link
//                         className="nav-link text-warning"
//                         to="/admin/withdrawals"
//                       >
//                         Withdrawals
//                       </Link>
//                     </li>
//                   </>
//                 )} */}

//                 <>
//   {user?.role === "admin" ? (
//     <>
//       <li className="nav-item">
//         <Link className="nav-link" to="/admin">
//           📊 Dashboard
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/users">
//           👥 Users
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/packages">
//           📦 Packages
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/investments">
//           💼 Investments
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/deposits">
//           💳 Deposits
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/withdrawals">
//           💸 Withdrawals
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/transactions">
//           📜 Transactions
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/admin/referrals">
//           🎁 Referrals
//         </Link>
//       </li>
//     </>
//   ) : (
//     <>
//       <li className="nav-item">
//         <Link className="nav-link" to="/dashboard">
//           🏠 Dashboard
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/wallet">
//           💰 Wallet
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/withdraw">
//           💸 Withdraw
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/transactions">
//           📜 Transactions
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/referrals">
//           🎁 Referrals
//         </Link>
//       </li>

//       <li className="nav-item">
//         <Link className="nav-link" to="/profile">
//           👤 Profile
//         </Link>
//       </li>
//     </>
//   )}

//   <li className="nav-item ms-lg-3">
//     <button
//       className="btn btn-danger btn-sm"
//       onClick={logout}
//     >
//       Logout
//     </button>
//   </li>
// </>

//                 {/* <li className="nav-item ms-lg-3">
//                   <button
//                     className="btn btn-danger btn-sm"
//                     onClick={logout}
//                   >
//                     Logout
//                   </button>
//                 </li> */}
//               </>
//             )}

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }



import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">

        <Link
          className="navbar-brand fw-bold"
          to={user.role === "admin" ? "/admin" : "/dashboard"}
        >
          Veran Enterprise
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === "admin" ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        📊 Dashboard
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">
                        👥 Users
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/packages">
                        📦 Packages
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/investments">
                        💼 Investments
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/deposits">
                        💳 Deposits
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/withdrawals">
                        💸 Withdrawals
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/transactions">
                        📜 Transactions
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/referrals">
                        🎁 Referrals
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        🏠 Dashboard
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/wallet">
                        💰 Wallet
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/withdraw">
                        💸 Withdraw
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/transactions">
                        📜 Transactions
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/referrals">
                        🎁 Referrals
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/profile">
                        👤 Profile
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item ms-lg-3">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>

      </div>
    </nav>
  );
}