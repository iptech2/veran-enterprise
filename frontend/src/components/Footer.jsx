// import { Link } from "react-router-dom";

// export default function Footer() {

//   const year = new Date().getFullYear();

//   return (

//     <>

//       {/* DESKTOP FOOTER */}
//       <footer className="bg-dark text-light mt-auto pt-5 pb-4 d-none d-md-block">

//         <div className="container">

//           <div className="row text-center text-md-start">


//             {/* BRAND */}

//             <div className="col-md-4 mb-4">

//               <h5 className="fw-bold">
//                 Veran Enterprise
//               </h5>

//               <p className="small text-secondary">
//                 Smart investment and financial growth platform.
//               </p>

//             </div>



//             {/* NAVIGATION */}

//             <div className="col-md-4 mb-4">

//               <h6 className="fw-bold">
//                 Navigation
//               </h6>

//               <div className="d-flex flex-column gap-2">


//                 <Link 
//                   to="/"
//                   className="text-light text-decoration-none"
//                 >
//                   Home
//                 </Link>


//                 <Link 
//                   to="/register"
//                   className="text-light text-decoration-none"
//                 >
//                   Register
//                 </Link>


//                 <Link 
//                   to="/dashboard"
//                   className="text-light text-decoration-none"
//                 >
//                   Dashboard
//                 </Link>


//                 <Link 
//                   to="/dashboard"
//                   className="text-light text-decoration-none"
//                 >
//                   Investments
//                 </Link>


//                 <Link 
//                   to="/profile"
//                   className="text-light text-decoration-none"
//                 >
//                   Profile
//                 </Link>


//                 <Link 
//                   to=""
//                   className="text-light text-decoration-none"
//                 >
//                   Contact
//                 </Link>


//               </div>

//             </div>




//             {/* LEGAL */}

//             <div className="col-md-4 mb-4">


//               <h6 className="fw-bold">
//                 Legal
//               </h6>


//               <div className="d-flex flex-column gap-2">


//                 <Link
//                   to=""
//                   className="text-light text-decoration-none"
//                 >
//                   Terms & Conditions
//                 </Link>


//                 <Link
//                   to=""
//                   className="text-light text-decoration-none"
//                 >
//                   Privacy Policy
//                 </Link>


//                 <Link
//                   to=""
//                   className="text-light text-decoration-none"
//                 >
//                   Support
//                 </Link>


//               </div>


//             </div>


//           </div>


//           <hr className="border-secondary"/>


//           <div className="text-center small text-secondary">

//             © {year} Veran Enterprise. All rights reserved.

//           </div>


//         </div>


//       </footer>





//       {/* MOBILE FIXED FOOTER */}

//       <div 
//         className="
//           d-md-none
//           fixed-bottom
//           bg-dark
//           text-light
//           shadow-lg
//         "
//       >

//         <div className="d-flex justify-content-around align-items-center py-2">


//           <Link 
//             to="/"
//             className="text-light text-center"
//           >

//             <i className="bi bi-house fs-4"></i>

//           </Link>



//           <Link 
//             to="/dashboard"
//             className="text-light text-center"
//           >

//             <i className="bi bi-speedometer2 fs-4"></i>

//           </Link>




//           <Link 
//             to="/dashboard"
//             className="text-light text-center"
//           >

//             <i className="bi bi-graph-up-arrow fs-4"></i>

//           </Link>





//           <Link 
//             to="/profile"
//             className="text-light text-center"
//           >

//             <i className="bi bi-person-circle fs-4"></i>

//           </Link>





//           <Link 
//             to="/support"
//             className="text-light text-center"
//           >

//             <i className="bi bi-question-circle fs-4"></i>

//           </Link>



//         </div>


//       </div>



//     </>

//   );

// }

import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const token = localStorage.getItem("token");

  return (
    <>
      {/* ================= DESKTOP FOOTER ================= */}

      <footer className="bg-dark text-light mt-auto pt-5 pb-4 d-none d-md-block">
        <div className="container">
          <div className="row text-center text-md-start">

            {/* BRAND */}

            <div className="col-md-4 mb-4">
              <h5 className="fw-bold">
                Veran Enterprise
              </h5>

              <p className="small text-secondary">
                Smart investment and financial growth platform.
              </p>
            </div>

            {/* NAVIGATION */}

            <div className="col-md-4 mb-4">

              <h6 className="fw-bold">
                Navigation
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/dashboard"
                  className="text-light text-decoration-none"
                >
                  Dashboard
                </Link>

                <Link
                  to="/wallet"
                  className="text-light text-decoration-none"
                >
                  Wallet
                </Link>

                <Link
                  to="/transactions"
                  className="text-light text-decoration-none"
                >
                  Transactions
                </Link>

                <Link
                  to="/profile"
                  className="text-light text-decoration-none"
                >
                  Profile
                </Link>

              </div>

            </div>

            {/* LEGAL */}

            <div className="col-md-4 mb-4">

              <h6 className="fw-bold">
                Legal
              </h6>

              <div className="d-flex flex-column gap-2">

                <Link
                  to="/contact"
                  className="text-light text-decoration-none"
                >
                  Contact
                </Link>

                <Link
                  to="/support"
                  className="text-light text-decoration-none"
                >
                  Support
                </Link>

                <Link
                  to="/terms"
                  className="text-light text-decoration-none"
                >
                  Terms & Conditions
                </Link>

                <Link
                  to="/privacy"
                  className="text-light text-decoration-none"
                >
                  Privacy Policy
                </Link>

              </div>

            </div>

          </div>

          <hr className="border-secondary" />

          <div className="text-center small text-secondary">
            © {year} Veran Enterprise. All rights reserved.
          </div>

        </div>

      </footer>

      {/* ================= MOBILE FOOTER ================= */}

      <div
        className="d-md-none fixed-bottom bg-dark border-top shadow-lg"
        style={{ zIndex: 1050 }}
      >
        <div className="d-flex justify-content-around py-2">

          {/* Dashboard */}

          <Link
            to="/dashboard"
            className="text-light text-center text-decoration-none"
          >
            <i className="bi bi-house-door-fill fs-4"></i>
            <div style={{ fontSize: 11 }}>
              Dashboard
            </div>
          </Link>

          {/* Profile */}

          <Link
            to="/profile"
            className="text-light text-center text-decoration-none"
          >
            <i className="bi bi-person-circle fs-4"></i>
            <div style={{ fontSize: 11 }}>
              Profile
            </div>
          </Link>

          {!token ? (
            <>
              {/* Login */}

              <Link
                to="/"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-box-arrow-in-right fs-4"></i>
                <div style={{ fontSize: 11 }}>
                  Login
                </div>
              </Link>

              {/* Register */}

              <Link
                to="/register"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-person-plus-fill fs-4"></i>
                <div style={{ fontSize: 11 }}>
                  Register
                </div>
              </Link>
            </>
          ) : (
            <>
              {/* Wallet */}

              <Link
                to="/wallet"
                className="text-light text-center text-decoration-none"
              >
                <i className="bi bi-wallet2 fs-4"></i>
                <div style={{ fontSize: 11 }}>
                  Wallet
                </div>
              </Link>

              {/* Logout */}

              <Link
                to="/"
                className="text-light text-center text-decoration-none"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                }}
              >
                <i className="bi bi-box-arrow-right fs-4"></i>
                <div style={{ fontSize: 11 }}>
                  Logout
                </div>
              </Link>
            </>
          )}

        </div>
      </div>
    </>
  );
}