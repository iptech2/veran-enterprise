import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <h2>Admin Panel</h2>

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{u.role}</td>
                <td>{u.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}