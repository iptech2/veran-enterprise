// import { useEffect, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import api from "../services/api";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadUsers = async () => {
//     try {
//       const res = await api.get("/admin/users");
//       setUsers(res.data);
//     } catch (err) {
//       console.log(err.response?.data || err.message);
//       alert("Failed to load users");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const changeRole = async (id, role) => {
//     try {
//       await api.put(`/admin/users/${id}/role`, { role });
//       loadUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to update role");
//     }
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm("Delete this user?")) return;

//     try {
//       await api.delete(`/admin/users/${id}`);
//       loadUsers();
//     } catch (err) {
//       alert(err.response?.data?.message || "Failed to delete user");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="d-flex">
//         <AdminSidebar />
//         <div className="container-fluid p-5">
//           <h3>Loading users...</h3>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="d-flex">
//       <AdminSidebar />

//       <div className="container-fluid p-4">
//         <h2 className="mb-4">Users Management</h2>

//         <div className="card shadow">
//           <div className="card-body">

//             <div className="table-responsive">

//               <table className="table table-hover">

//                 <thead className="table-dark">
//                   <tr>
//                     <th>Name</th>
//                     <th>Email</th>
//                     <th>Phone</th>
//                     <th>Balance</th>
//                     <th>Role</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>

//                   {users.map((user) => (
//                     <tr key={user._id}>

//                       <td>{user.fullName}</td>

//                       <td>{user.email}</td>

//                       <td>{user.phone}</td>

//                       <td>KES {user.balance}</td>

//                       <td>
//                         <span
//                           className={
//                             user.role === "admin"
//                               ? "badge bg-success"
//                               : "badge bg-secondary"
//                           }
//                         >
//                           {user.role}
//                         </span>
//                       </td>

//                       <td>

//                         <button
//                           className="btn btn-warning btn-sm me-2"
//                           onClick={() =>
//                             changeRole(
//                               user._id,
//                               user.role === "admin"
//                                 ? "user"
//                                 : "admin"
//                             )
//                           }
//                         >
//                           Make {user.role === "admin" ? "User" : "Admin"}
//                         </button>

//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => deleteUser(user._id)}
//                         >
//                           Delete
//                         </button>

//                       </td>

//                     </tr>
//                   ))}

//                 </tbody>

//               </table>

//             </div>

//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }


import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await api.delete(`/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.fullName?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.phone?.includes(keyword);

      const matchesRole =
        roleFilter === "all"
          ? true
          : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="container-fluid p-5">
          <h3>Loading users...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">

      <AdminSidebar />

      <div className="container-fluid p-4">

        <h2 className="mb-4 fw-bold">
          Users Management
        </h2>

        {/* SEARCH */}

        <div className="card shadow mb-3">

          <div className="card-body">

            <div className="row g-3">

              <div className="col-md-8">

                <input
                  className="form-control"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

              </div>

              <div className="col-md-4">

                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) =>
                    setRoleFilter(e.target.value)
                  }
                >
                  <option value="all">
                    All Roles
                  </option>

                  <option value="user">
                    Users
                  </option>

                  <option value="admin">
                    Admins
                  </option>

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="card shadow">

          <div className="card-header bg-dark text-white d-flex justify-content-between">

            <strong>Registered Users</strong>

            <span className="badge bg-light text-dark">
              {filteredUsers.length} Users
            </span>

          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle mb-0">

              <thead className="table-dark">

                <tr>

                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Balance</th>
                  <th>Referrals</th>
                  <th>Earnings</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.length === 0 ? (

                  <tr>

                    <td colSpan="9" className="text-center">

                      No users found.

                    </td>

                  </tr>

                ) : (

                  filteredUsers.map((user) => (

                    <tr key={user._id}>

                      <td>{user.fullName}</td>

                      <td>{user.email}</td>

                      <td>{user.phone}</td>

                      <td>
                        KES {user.balance?.toLocaleString()}
                      </td>

                      <td>
                        {user.referralCount || 0}
                      </td>

                      <td>
                        KES {(user.referralEarnings || 0).toLocaleString()}
                      </td>

                      <td>

                        <span
                          className={`badge ${
                            user.role === "admin"
                              ? "bg-success"
                              : "bg-secondary"
                          }`}
                        >
                          {user.role}
                        </span>

                      </td>

                      <td>
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </td>

                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() =>
                            changeRole(
                              user._id,
                              user.role === "admin"
                                ? "user"
                                : "admin"
                            )
                          }
                        >
                          {user.role === "admin"
                            ? "Make User"
                            : "Make Admin"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deleteUser(user._id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}