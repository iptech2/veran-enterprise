// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// /* ================= AUTH ================= */

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyEmail from "./pages/VerifyEmail";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

// /* ================= USER ================= */

// import Dashboard from "./pages/Dashboard";
// import Wallet from "./pages/Wallet";
// import Withdraw from "./pages/Withdraw";
// import Transactions from "./pages/Transactions";
// import Referrals from "./pages/Referrals";
// import Profile from "./pages/Profile";
// import About from "./pages/About";
// /* ================= ADMIN ================= */

// import AdminDashboard from "./pages/AdminDashboard";
// import AdminUsers from "./pages/AdminUsers";
// import AdminPackages from "./pages/AdminPackages";
// import AdminWithdrawals from "./pages/AdminWithdrawals";
// import AdminInvestments from "./pages/AdminInvestments";
// import AdminTransactions from "./pages/AdminTransactions";
// import AdminReferrals from "./pages/AdminReferrals";
// import AdminDeposits from "./pages/AdminDeposits";
// import AdminProfile from "./pages/AdminProfile";

// /* ================= ROUTE GUARDS ================= */

// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";


// /* ================= COMPONENTS ================= */

// import Footer from "./components/Footer";

// function App() {
//   return (
//     <Router>

//       <Routes>

//         {/* ================= AUTH ================= */}

//         <Route path="/" element={<Login />} />

//         <Route
//           path="/register"
//           element={<Register />}
//         />

//         <Route
//           path="/verify/:token"
//           element={<VerifyEmail />}
//         />

//         <Route
//   path="/forgot-password"
//   element={<ForgotPassword />}
// />

// <Route
//   path="/reset-password/:token"
//   element={<ResetPassword />}
// />

//         {/* ================= USER ================= */}

//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/wallet"
//           element={
//             <ProtectedRoute>
//               <Wallet />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/withdraw"
//           element={
//             <ProtectedRoute>
//               <Withdraw />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/transactions"
//           element={
//             <ProtectedRoute>
//               <Transactions />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/referrals"
//           element={
//             <ProtectedRoute>
//               <Referrals />
//             </ProtectedRoute>
//           }
//         />
        
//         <Route
//   path="/profile"
//   element={
//     <ProtectedRoute>
//       <Profile />
//     </ProtectedRoute>
//   }
// />

//         {/* ================= ADMIN ================= */}

//         <Route
//           path="/admin"
//           element={
//             <AdminRoute>
//               <AdminDashboard />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/users"
//           element={
//             <AdminRoute>
//               <AdminUsers />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/investments"
//           element={
//             <AdminRoute>
//               <AdminInvestments />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/transactions"
//           element={
//             <AdminRoute>
//               <AdminTransactions />
//             </AdminRoute>
//           }
//         />

//         <Route
//   path="/admin/deposits"
//   element={
//     <AdminRoute>
//       <AdminDeposits />
//     </AdminRoute>
//   }
// />

//         <Route
//           path="/admin/withdrawals"
//           element={
//             <AdminRoute>
//               <AdminWithdrawals />
//             </AdminRoute>
//           }
//         />

//         <Route
//           path="/admin/packages"
//           element={
//             <AdminRoute>
//               <AdminPackages />
//             </AdminRoute>
//           }
//         />
//         <Route
//   path="/admin/referrals"
//   element={
//     <AdminRoute>
//       <AdminReferrals />
//     </AdminRoute>
//   }
// />
// <Route
//   path="/admin/profile"
//   element={
//     <AdminRoute>
//       <AdminProfile />
//     </AdminRoute>
//   }
// />

//       </Routes>

//       <Footer />

//     </Router>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= PUBLIC ================= */

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

/* ================= AUTH ================= */

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ================= USER ================= */

import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import Referrals from "./pages/Referrals";
import Profile from "./pages/Profile";

/* ================= ADMIN ================= */

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminPackages from "./pages/AdminPackages";
import AdminWithdrawals from "./pages/AdminWithdrawals";
import AdminInvestments from "./pages/AdminInvestments";
import AdminTransactions from "./pages/AdminTransactions";
import AdminReferrals from "./pages/AdminReferrals";
import AdminDeposits from "./pages/AdminDeposits";
import AdminProfile from "./pages/AdminProfile";

/* ================= ROUTE GUARDS ================= */

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

/* ================= COMPONENTS ================= */

import Footer from "./components/Footer";

function App() {
  return (
    <Router>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/faq"
          element={<FAQ />}
        />

        <Route
          path="/terms"
          element={<Terms />}
        />

        <Route
          path="/privacy"
          element={<Privacy />}
        />

        {/* ================= AUTH ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/verify/:token"
          element={<VerifyEmail />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* ================= USER ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/withdraw"
          element={
            <ProtectedRoute>
              <Withdraw />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <Referrals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/packages"
          element={
            <AdminRoute>
              <AdminPackages />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/investments"
          element={
            <AdminRoute>
              <AdminInvestments />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/deposits"
          element={
            <AdminRoute>
              <AdminDeposits />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <AdminRoute>
              <AdminWithdrawals />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <AdminRoute>
              <AdminTransactions />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/referrals"
          element={
            <AdminRoute>
              <AdminReferrals />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfile />
            </AdminRoute>
          }
        />

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

      <Footer />

    </Router>
  );
}

export default App;