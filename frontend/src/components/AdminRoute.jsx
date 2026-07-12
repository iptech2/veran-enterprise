// import { Navigate } from "react-router-dom";

// export default function AdminRoute({ children }) {
//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!token) {
//     return <Navigate to="/" replace />;
//   }

//   if (user?.role !== "admin") {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// }

import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch (err) {
    user = null;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

