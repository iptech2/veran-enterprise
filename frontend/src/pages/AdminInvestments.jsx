import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminInvestments() {
  // ==========================
  // MOBILE SIDEBAR
  // ==========================

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // ==========================
  // STATE
  // ==========================

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================
  // LOAD INVESTMENTS
  // ==========================

  const loadInvestments = async () => {
    try {
      const res = await api.get("/admin/investments");
      setInvestments(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load investments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <div className="flex-grow-1">

          <AdminNavbar
            toggleSidebar={toggleSidebar}
          />

          <div className="container-fluid p-5">
            <h3>Loading Investments...</h3>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">

      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-grow-1 bg-light">

        <AdminNavbar
          toggleSidebar={toggleSidebar}
        />

        <div className="container-fluid p-4">

          <h2 className="mb-4 fw-bold">
            Investment Management
          </h2>

          <div className="card shadow">

            <div className="card-header bg-dark text-white d-flex justify-content-between">

              <strong>All Investments</strong>

              <span className="badge bg-light text-dark">
                {investments.length} Records
              </span>

            </div>

            <div className="table-responsive">

              <table className="table table-hover table-striped mb-0">

                <thead className="table-dark">

                  <tr>
                    <th>User</th>
                    <th>Package</th>
                    <th>Amount</th>
                    <th>Profit</th>
                    <th>Status</th>
                    <th>Start Date</th>
                  </tr>

                </thead>

                <tbody>

                  {investments.length === 0 ? (

                    <tr>

                      <td colSpan="6" className="text-center">
                        No investments found.
                      </td>

                    </tr>

                  ) : (

                    investments.map((item) => (

                      <tr key={item._id}>

                        <td>
                          {item.user?.fullName || item.user?.name}
                        </td>

                        <td>{item.package?.name}</td>

                        <td>
                          KES {item.amount.toLocaleString()}
                        </td>

                        <td className="text-success">
                          KES {item.profit.toLocaleString()}
                        </td>

                        <td>

                          <span
                            className={
                              item.status === "active"
                                ? "badge bg-success"
                                : item.status === "completed"
                                ? "badge bg-primary"
                                : "badge bg-secondary"
                            }
                          >
                            {item.status}
                          </span>

                        </td>

                        <td>
                          {new Date(item.createdAt).toLocaleDateString()}
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

    </div>
  );
}