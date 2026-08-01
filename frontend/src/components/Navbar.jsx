// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

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

//   return (
//     <>
//       {/* Overlay */}

//       {menuOpen && (
//         <div
//           onClick={closeMenu}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,.45)",
//             zIndex: 1040,
//           }}
//         />
//       )}

//       <nav className="navbar navbar-dark bg-dark shadow-sm">

//         <div className="container-fluid px-3">

//           <Link
//             className="navbar-brand fw-bold"
//             to={user.role === "admin" ? "/admin" : "/dashboard"}
//           >
//             Veran Enterprise
//           </Link>

//           {token && (
//             <button
//               className="btn btn-outline-light d-lg-none"
//               onClick={() => setMenuOpen(!menuOpen)}
//             >
//               ☰
//             </button>
//           )}

//           {/* Desktop Menu */}

//           <div className="d-none d-lg-flex align-items-center">

//             {!token ? (
//               <>
//                 <Link className="nav-link text-white" to="/">
//                   Login
//                 </Link>

//                 <Link className="nav-link text-white" to="/register">
//                   Register
//                 </Link>
//               </>
//             ) : (
//               <>
//                 {user.role === "admin" ? (
//                   <>
//                     <Link className="nav-link text-white" to="/admin">Dashboard</Link>
//                     <Link className="nav-link text-white" to="/admin/users">Users</Link>
//                     <Link className="nav-link text-white" to="/admin/packages">Packages</Link>
//                     <Link className="nav-link text-white" to="/admin/investments">Investments</Link>
//                     <Link className="nav-link text-white" to="/admin/deposits">Deposits</Link>
//                     <Link className="nav-link text-white" to="/admin/withdrawals">Withdrawals</Link>
//                     <Link className="nav-link text-white" to="/admin/transactions">Transactions</Link>
//                     <Link className="nav-link text-white" to="/admin/referrals">Referrals</Link>
//                     <Link className="nav-link text-white" to="/admin/profile">Profile</Link>
//                   </>
//                 ) : (
//                   <>
//                     <Link className="nav-link text-white" to="/dashboard">Dashboard</Link>
//                     <Link className="nav-link text-white" to="/wallet">Wallet</Link>
//                     <Link className="nav-link text-white" to="/withdraw">Withdraw</Link>
//                     <Link className="nav-link text-white" to="/transactions">Transactions</Link>
//                     <Link className="nav-link text-white" to="/referrals">Referrals</Link>
//                     <Link className="nav-link text-white" to="/profile">Profile</Link>
//                   </>
//                 )}

//                 <button
//                   className="btn btn-danger btn-sm ms-3"
//                   onClick={logout}
//                 >
//                   Logout
//                 </button>
//               </>
//             )}

//           </div>

//         </div>
//       </nav>

//       {/* Mobile Sidebar */}

//       <div
//         className="bg-dark text-white"
//         style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           width: "260px",
//           height: "100vh",
//           zIndex: 1050,
//           transform: menuOpen
//             ? "translateX(0)"
//             : "translateX(-100%)",
//           transition: ".3s",
//           overflowY: "auto",
//         }}
//       >

//         <div className="p-4 border-bottom">

//           <h4 className="fw-bold">
//             Veran Enterprise
//           </h4>

//         </div>

//         <div className="nav flex-column p-3">

//           {!token ? (
//             <>
//               <Link className="nav-link text-white" to="/" onClick={closeMenu}>
//                 Login
//               </Link>

//               <Link className="nav-link text-white" to="/register" onClick={closeMenu}>
//                 Register
//               </Link>
//             </>
//           ) : (
//             <>
//               {user.role === "admin" ? (
//                 <>
//                   <Link className="nav-link text-white" to="/admin" onClick={closeMenu}>📊 Dashboard</Link>
//                   <Link className="nav-link text-white" to="/admin/users" onClick={closeMenu}>👥 Users</Link>
//                   <Link className="nav-link text-white" to="/admin/packages" onClick={closeMenu}>📦 Packages</Link>
//                   <Link className="nav-link text-white" to="/admin/investments" onClick={closeMenu}>💰 Investments</Link>
//                   <Link className="nav-link text-white" to="/admin/deposits" onClick={closeMenu}>💳 Deposits</Link>
//                   <Link className="nav-link text-white" to="/admin/withdrawals" onClick={closeMenu}>🏦 Withdrawals</Link>
//                   <Link className="nav-link text-white" to="/admin/transactions" onClick={closeMenu}>📜 Transactions</Link>
//                   <Link className="nav-link text-white" to="/admin/referrals" onClick={closeMenu}>🎁 Referrals</Link>
//                   <Link className="nav-link text-white" to="/admin/profile" onClick={closeMenu}>👤 Profile</Link>
//                 </>
//               ) : (
//                 <>
//                   <Link className="nav-link text-white" to="/dashboard" onClick={closeMenu}>🏠 Dashboard</Link>
//                   <Link className="nav-link text-white" to="/wallet" onClick={closeMenu}>💰 Wallet</Link>
//                   <Link className="nav-link text-white" to="/withdraw" onClick={closeMenu}>💸 Withdraw</Link>
//                   <Link className="nav-link text-white" to="/transactions" onClick={closeMenu}>📜 Transactions</Link>
//                   <Link className="nav-link text-white" to="/referrals" onClick={closeMenu}>🎁 Referrals</Link>
//                   <Link className="nav-link text-white" to="/profile" onClick={closeMenu}>👤 Profile</Link>
//                 </>
//               )}

//               <button
//                 className="btn btn-danger mt-4"
//                 onClick={logout}
//               >
//                 Logout
//               </button>
//             </>
//           )}

//         </div>

//       </div>
//     </>
//   );
// }

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaBars,
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
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBuilding
} from "react-icons/fa";


export default function Navbar() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);


  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user") || "{}");


  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };


  const closeMenu = () => setMenuOpen(false);



  const adminLinks = [

    {
      name:"Dashboard",
      path:"/admin",
      icon:<FaChartLine/>
    },

    {
      name:"Users",
      path:"/admin/users",
      icon:<FaUsers/>
    },

    {
      name:"Packages",
      path:"/admin/packages",
      icon:<FaBox/>
    },

    {
      name:"Investments",
      path:"/admin/investments",
      icon:<FaMoneyBillWave/>
    },

    {
      name:"Deposits",
      path:"/admin/deposits",
      icon:<FaCreditCard/>
    },

    {
      name:"Withdrawals",
      path:"/admin/withdrawals",
      icon:<FaUniversity/>
    },

    {
      name:"Transactions",
      path:"/admin/transactions",
      icon:<FaReceipt/>
    },

    {
      name:"Referrals",
      path:"/admin/referrals",
      icon:<FaGift/>
    },

    {
      name:"Profile",
      path:"/admin/profile",
      icon:<FaUser/>
    }

  ];



  const userLinks = [

    {
      name:"Dashboard",
      path:"/dashboard",
      icon:<FaHome/>
    },

    {
      name:"Wallet",
      path:"/wallet",
      icon:<FaWallet/>
    },

    {
      name:"Withdraw",
      path:"/withdraw",
      icon:<FaMoneyBillWave/>
    },

    {
      name:"Transactions",
      path:"/transactions",
      icon:<FaHistory/>
    },

    {
      name:"Referrals",
      path:"/referrals",
      icon:<FaGift/>
    },

    {
      name:"Profile",
      path:"/profile",
      icon:<FaUser/>
    }

  ];



  const links = user.role === "admin"
    ? adminLinks
    : userLinks;



  return (

    <>


      {/* Overlay */}

      {
        menuOpen && (

          <div

            onClick={closeMenu}

            style={{

              position:"fixed",

              inset:0,

              background:"rgba(0,0,0,.45)",

              zIndex:1040

            }}

          />

        )
      }



      <nav className="navbar navbar-dark bg-dark shadow-sm">


        <div className="container-fluid px-3">


          <Link

            className="navbar-brand fw-bold d-flex align-items-center gap-2"

            to={
              user.role === "admin"
              ? "/admin"
              : "/dashboard"
            }

          >

            <FaBuilding/>

            Veran Enterprise

          </Link>





          {
            token && (

              <button

                className="btn btn-outline-light d-lg-none"

                onClick={()=>setMenuOpen(!menuOpen)}

              >

                <FaBars/>

              </button>

            )
          }





          {/* Desktop Menu */}


          <div className="d-none d-lg-flex align-items-center gap-2">


          {

          !token ?

          (

            <>


            <Link

              className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 px-3"

              to="/"

            >

              <FaSignInAlt/>

              Login

            </Link>



            <Link

              className="btn btn-primary btn-sm d-flex align-items-center gap-2 px-3"

              to="/register"

            >

              <FaUserPlus/>

              Register

            </Link>


            </>


          )

          :

          (

            <>


            {
              links.map((item,index)=>(

                <Link

                  key={index}

                  className="text-white text-decoration-none d-flex align-items-center gap-2 px-2 py-2 rounded"

                  style={{
                    fontSize:"14px"
                  }}

                  to={item.path}

                >

                  {item.icon}

                  {item.name}

                </Link>

              ))
            }



            <button

              className="btn btn-danger btn-sm d-flex align-items-center gap-2 ms-2"

              onClick={logout}

            >

              <FaSignOutAlt/>

              Logout

            </button>


            </>

          )

          }


          </div>


        </div>


      </nav>







      {/* Mobile Sidebar */}


      <div

        className="bg-dark text-white"

        style={{

          position:"fixed",

          top:0,

          left:0,

          width:"260px",

          height:"100vh",

          zIndex:1050,

          transform:

          menuOpen

          ?

          "translateX(0)"

          :

          "translateX(-100%)",


          transition:".3s",

          overflowY:"auto"

        }}

      >



        <div className="p-4 border-bottom">


          <h4 className="fw-bold d-flex align-items-center gap-2">

            <FaBuilding/>

            Veran Enterprise

          </h4>


        </div>





        <div className="nav flex-column p-3">


        {

        !token ?

        (

          <>


          <Link

            className="nav-link text-white d-flex gap-3 align-items-center"

            to="/"

            onClick={closeMenu}

          >

            <FaSignInAlt/>

            Login

          </Link>



          <Link

            className="nav-link text-white d-flex gap-3 align-items-center"

            to="/register"

            onClick={closeMenu}

          >

            <FaUserPlus/>

            Register

          </Link>


          </>

        )

        :

        (

          <>


          {

            links.map((item,index)=>(

              <Link

                key={index}

                className="nav-link text-white d-flex gap-3 align-items-center mb-2"

                to={item.path}

                onClick={closeMenu}

              >

                {item.icon}

                {item.name}

              </Link>

            ))

          }



          <button

            className="btn btn-danger mt-4 d-flex justify-content-center align-items-center gap-2"

            onClick={logout}

          >

            <FaSignOutAlt/>

            Logout

          </button>


          </>

        )

        }


        </div>


      </div>



    </>

  );

}