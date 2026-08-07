// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// import {
//   FaBars,
//   FaHome,
//   FaWallet,
//   FaMoneyBillWave,
//   FaHistory,
//   FaGift,
//   FaUser,
//   FaUsers,
//   FaBox,
//   FaChartLine,
//   FaCreditCard,
//   FaUniversity,
//   FaReceipt,
//   FaSignOutAlt,
//   FaSignInAlt,
//   FaUserPlus,
//   FaBuilding
// } from "react-icons/fa";


// export default function Navbar() {

//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);


//   const token = localStorage.getItem("token");

//   const user = JSON.parse(localStorage.getItem("user") || "{}");


//   const logout = () => {

//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/");

//   };


//   const closeMenu = () => setMenuOpen(false);



//   const adminLinks = [

//     {
//       name:"Dashboard",
//       path:"/admin",
//       icon:<FaChartLine/>
//     },

//     {
//       name:"Users",
//       path:"/admin/users",
//       icon:<FaUsers/>
//     },

//     {
//       name:"Packages",
//       path:"/admin/packages",
//       icon:<FaBox/>
//     },

//     {
//       name:"Investments",
//       path:"/admin/investments",
//       icon:<FaMoneyBillWave/>
//     },

//     {
//       name:"Deposits",
//       path:"/admin/deposits",
//       icon:<FaCreditCard/>
//     },

//     {
//       name:"Withdrawals",
//       path:"/admin/withdrawals",
//       icon:<FaUniversity/>
//     },

//     {
//       name:"Transactions",
//       path:"/admin/transactions",
//       icon:<FaReceipt/>
//     },

//     {
//       name:"Referrals",
//       path:"/admin/referrals",
//       icon:<FaGift/>
//     },

//     {
//       name:"Profile",
//       path:"/admin/profile",
//       icon:<FaUser/>
//     }

//   ];



//   const userLinks = [

//     {
//       name:"Dashboard",
//       path:"/dashboard",
//       icon:<FaHome/>
//     },

//     {
//       name:"Wallet",
//       path:"/wallet",
//       icon:<FaWallet/>
//     },

//     {
//       name:"Withdraw",
//       path:"/withdraw",
//       icon:<FaMoneyBillWave/>
//     },

//     {
//       name:"Transactions",
//       path:"/transactions",
//       icon:<FaHistory/>
//     },

//     {
//       name:"Referrals",
//       path:"/referrals",
//       icon:<FaGift/>
//     },

//     {
//       name:"Profile",
//       path:"/profile",
//       icon:<FaUser/>
//     }

//   ];



//   const links = user.role === "admin"
//     ? adminLinks
//     : userLinks;



//   return (

//     <>


//       {/* Overlay */}

//       {
//         menuOpen && (

//           <div

//             onClick={closeMenu}

//             style={{

//               position:"fixed",

//               inset:0,

//               background:"rgba(0,0,0,.45)",

//               zIndex:1040

//             }}

//           />

//         )
//       }



//       <nav className="navbar navbar-dark bg-dark shadow-sm">


//         <div className="container-fluid px-3">


//           <Link

//             className="navbar-brand fw-bold d-flex align-items-center gap-2"

//             to={
//               user.role === "admin"
//               ? "/admin"
//               : "/dashboard"
//             }

//           >

//             <FaBuilding/>

//             Veran Enterprise

//           </Link>





//           {
//             token && (

//               <button

//                 className="btn btn-outline-light d-lg-none"

//                 onClick={()=>setMenuOpen(!menuOpen)}

//               >

//                 <FaBars/>

//               </button>

//             )
//           }





//           {/* Desktop Menu */}


//           <div className="d-none d-lg-flex align-items-center gap-2">


//           {

//           !token ?

//           (

//             <>


//             <Link

//               className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 px-3"

//               to="/"

//             >

//               <FaSignInAlt/>

//               Login

//             </Link>



//             <Link

//               className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"

//               to="/register"

//             >

//               <FaUserPlus/>

//               Register

//             </Link>


//             </>


//           )

//           :

//           (

//             <>


//             {
//               links.map((item,index)=>(

//                 <Link

//                   key={index}

//                   className="text-white text-decoration-none d-flex align-items-center gap-2 px-2 py-2 rounded"

//                   style={{
//                     fontSize:"14px"
//                   }}

//                   to={item.path}

//                 >

//                   {item.icon}

//                   {item.name}

//                 </Link>

//               ))
//             }



//             <button

//               className="btn btn-danger btn-sm d-flex align-items-center gap-2 ms-2"

//               onClick={logout}

//             >

//               <FaSignOutAlt/>

//               Logout

//             </button>


//             </>

//           )

//           }


//           </div>


//         </div>


//       </nav>







//       {/* Mobile Sidebar */}


//       <div

//         className="bg-dark text-white"

//         style={{

//           position:"fixed",

//           top:0,

//           left:0,

//           width:"260px",

//           height:"100vh",

//           zIndex:1050,

//           transform:

//           menuOpen

//           ?

//           "translateX(0)"

//           :

//           "translateX(-100%)",


//           transition:".3s",

//           overflowY:"auto"

//         }}

//       >



//         <div className="p-4 border-bottom">


//           <h4 className="fw-bold d-flex align-items-center gap-2">

//             <FaBuilding/>

//             Veran Enterprise

//           </h4>


//         </div>





//         <div className="nav flex-column p-3">


//         {

//         !token ?

//         (

//           <>


//           <Link

//             className="nav-link text-white d-flex gap-3 align-items-center"

//             to="/"

//             onClick={closeMenu}

//           >

//             <FaSignInAlt/>

//             Login

//           </Link>



//           <Link

//             className="nav-link text-white d-flex gap-3 align-items-center"

//             to="/register"

//             onClick={closeMenu}

//           >

//             <FaUserPlus/>

//             Register

//           </Link>


//           </>

//         )

//         :

//         (

//           <>


//           {

//             links.map((item,index)=>(

//               <Link

//                 key={index}

//                 className="nav-link text-white d-flex gap-3 align-items-center mb-2"

//                 to={item.path}

//                 onClick={closeMenu}

//               >

//                 {item.icon}

//                 {item.name}

//               </Link>

//             ))

//           }



//           <button

//             className="btn btn-danger mt-4 d-flex justify-content-center align-items-center gap-2"

//             onClick={logout}

//           >

//             <FaSignOutAlt/>

//             Logout

//           </button>


//           </>

//         )

//         }


//         </div>


//       </div>



//     </>

//   );

// }

import { useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaWallet,
  FaMoneyBillWave,
  FaHistory,
  FaGift,
  FaUser,
  FaUsers,
  FaBox,
  FaChartLine,
  FaCreditCard,
  FaUniversity,
  FaReceipt,
  FaBuilding,
  FaEnvelope,
  FaWhatsapp,
  FaQuestionCircle,
  FaInfoCircle,
  FaFileContract,
  FaShieldAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FaChartLine />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FaUsers />,
    },
    {
      name: "Packages",
      path: "/admin/packages",
      icon: <FaBox />,
    },
    {
      name: "Investments",
      path: "/admin/investments",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Deposits",
      path: "/admin/deposits",
      icon: <FaCreditCard />,
    },
    {
      name: "Withdrawals",
      path: "/admin/withdrawals",
      icon: <FaUniversity />,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: <FaReceipt />,
    },
    {
      name: "Referrals",
      path: "/admin/referrals",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      path: "/admin/profile",
      icon: <FaUser />,
    },
  ];

  const userLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Wallet",
      path: "/wallet",
      icon: <FaWallet />,
    },
    {
      name: "Withdraw",
      path: "/withdraw",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: <FaHistory />,
    },
    {
      name: "Referrals",
      path: "/referrals",
      icon: <FaGift />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaUser />,
    },
  ];

  const links =
    user.role === "admin"
      ? adminLinks
      : userLinks;

  return (
    <>
      {menuOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.45)",
            zIndex: 1040,
          }}
        />
      )}

      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top"
        style={{ zIndex: 1030 }}
      >
        <div className="container">

          <Link
            to={
              user.role === "admin"
                ? "/admin"
                : "/dashboard"
            }
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
          >
            <FaBuilding />
            Veran Enterprise
          </Link>

          <button
            className="btn btn-outline-light d-lg-none"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

          <div className="collapse navbar-collapse d-none d-lg-flex justify-content-end">

            {!token ? (
              <>
                <NavLink
                  className="nav-link text-white"
                  to="/"
                >
                  Login
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/register"
                >
                  Register
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/about"
                >
                  About
                </NavLink>

                <NavLink
                  className="nav-link text-white"
                  to="/contact"
                >
                  Contact
                </NavLink>
              </>
            ) : (
              <>
                {links.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link d-flex align-items-center gap-2 ${
                        isActive
                          ? "text-warning fw-bold"
                          : "text-white"
                      }`
                    }
                  >
                    {item.icon}
                    {item.name}
                  </NavLink>
                ))}

                <div className="dropdown ms-3">
                  <button
                    className="btn btn-outline-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                  >
                    {user.fullName
                      ? user.fullName
                          .charAt(0)
                          .toUpperCase()
                      : "U"}
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end">

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/profile"
                      >
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="dropdown-item"
                        to="/contact"
                      >
                        Contact
                      </Link>
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>

                  </ul>
                </div>
                              </>
            )}

          </div>

        </div>
      </nav>

      {/* ================= MOBILE SIDEBAR ================= */}

      <div
        className="bg-dark text-white shadow-lg"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 290,
          height: "100vh",
          zIndex: 1050,
          overflowY: "auto",
          transform: menuOpen
            ? "translateX(0)"
            : "translateX(-100%)",
          transition: ".35s ease",
        }}
      >

        <div className="d-flex justify-content-between align-items-center p-4 border-bottom">

          <div>

            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
              <FaBuilding />
              Veran Enterprise
            </h5>

            {token && (
              <small className="text-secondary">
                Welcome {user.fullName}
              </small>
            )}

          </div>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={closeMenu}
          >
            <FaTimes />
          </button>

        </div>

        <div className="p-3">

          {!token ? (

            <>
              <NavLink
                to="/"
                onClick={closeMenu}
                className="nav-link text-white py-3"
              >
                <FaSignInAlt className="me-3" />
                Login
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMenu}
                className="nav-link text-white py-3"
              >
                <FaUserPlus className="me-3" />
                Register
              </NavLink>

            </>

          ) : (

            <>
              {links.map((item) => (

                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `nav-link py-3 rounded px-2 mb-1 ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-white"
                    }`
                  }
                >
                  <span className="me-3">
                    {item.icon}
                  </span>

                  {item.name}
                </NavLink>

              ))}
            </>

          )}

          <hr className="border-secondary my-4" />

          <h6 className="text-uppercase text-secondary mb-3">
            Information
          </h6>

          <a
            href="mailto:veranenterprise@gmail.com"
            className="nav-link text-white py-2"
          >
            <FaEnvelope className="me-3" />
            Contact Us
          </a>

          <a
            href="https://wa.me/qr/JSXNIJSUMUP7A1"
            target="_blank"
            rel="noreferrer"
            className="nav-link text-white py-2"
          >
            <FaWhatsapp className="me-3 text-success" />
            WhatsApp Support
          </a>

          <NavLink
            to="/about"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaInfoCircle className="me-3" />
            About
          </NavLink>

          <NavLink
            to="/faq"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaQuestionCircle className="me-3" />
            FAQ
          </NavLink>

          <NavLink
            to="/terms"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaFileContract className="me-3" />
            Terms & Conditions
          </NavLink>

          <NavLink
            to="/privacy"
            onClick={closeMenu}
            className="nav-link text-white py-2"
          >
            <FaShieldAlt className="me-3" />
            Privacy Policy
          </NavLink>

          {token && (

            <>
              <hr className="border-secondary my-4" />

              <button
                onClick={logout}
                className="btn btn-danger w-100 d-flex justify-content-center align-items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>

            </>

          )}

        </div>

        <div className="text-center text-secondary small py-3 border-top">
          © {new Date().getFullYear()} Veran Enterprise
        </div>

      </div>

    </>
  );
}