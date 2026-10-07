import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import api from "../services/api";

export default function AdminPackages() {
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

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    roi: "",
    duration: "",
    minAmount: "",
    maxAmount: "",
    investmentType: "standard",
    profitWithdrawalDays: "10,20,30",
    isActive: true,
  });

  // ==========================
  // LOAD PACKAGES
  // ==========================

  const loadPackages = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/packages");

      setPackages(res.data);
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      alert("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ==========================
  // SAVE PACKAGE
  // ==========================

  const savePackage = async (e) => {
    e.preventDefault();

    try {
      // ----------------------------------
      // Validate duration
      // ----------------------------------

      const duration = Number(
        formData.duration
      );

      if (
        !duration ||
        duration <= 0
      ) {
        alert(
          "Please enter a valid duration."
        );

        return;
      }

      // ----------------------------------
      // Prepare withdrawal checkpoints
      // ----------------------------------

      let withdrawalDays = [];

      if (
        formData.investmentType ===
        "locked_profit"
      ) {
        withdrawalDays =
          formData.profitWithdrawalDays
            .split(",")
            .map((day) =>
              Number(day.trim())
            )
            .filter(
              (day) =>
                !isNaN(day) &&
                day > 0
            );

        // Remove duplicates
        withdrawalDays = [
          ...new Set(
            withdrawalDays
          ),
        ].sort(
          (a, b) => a - b
        );

        // ----------------------------------
        // Validate checkpoint days
        // ----------------------------------

        if (
          withdrawalDays.length ===
          0
        ) {
          alert(
            "Please enter at least one profit withdrawal day."
          );

          return;
        }

        const invalidDay =
          withdrawalDays.find(
            (day) =>
              day > duration
          );

        if (invalidDay) {
          alert(
            `Withdrawal Day ${invalidDay} cannot be greater than the package duration of ${duration} days.`
          );

          return;
        }
      }

      // ----------------------------------
      // Data sent to backend
      // ----------------------------------

      const packageData = {
        name: formData.name,
        description:
          formData.description,
        roi: Number(formData.roi),
        duration: duration,
        minAmount: Number(
          formData.minAmount
        ),
        maxAmount: Number(
          formData.maxAmount
        ),
        investmentType:
          formData.investmentType,
        profitWithdrawalDays:
          formData.investmentType ===
          "locked_profit"
            ? withdrawalDays
            : [],
        isActive:
          formData.isActive,
      };

      // ----------------------------------
      // Update
      // ----------------------------------

      if (editingId) {
        await api.put(
          `/admin/packages/${editingId}`,
          packageData
        );

        alert(
          "Package updated successfully"
        );
      }

      // ----------------------------------
      // Create
      // ----------------------------------

      else {
        await api.post(
          "/admin/packages",
          packageData
        );

        alert(
          "Package created successfully"
        );
      }

      resetForm();
      loadPackages();
    } catch (err) {
      console.log(
        err.response?.data || err.message
      );

      alert(
        err.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  // ==========================
  // EDIT PACKAGE
  // ==========================

  const editPackage = (pkg) => {
    setEditingId(pkg._id);

    const investmentType =
      pkg.investmentType ===
      "locked_profit"
        ? "locked_profit"
        : "standard";

    const withdrawalDays =
      Array.isArray(
        pkg.profitWithdrawalDays
      ) &&
      pkg.profitWithdrawalDays.length >
        0
        ? pkg.profitWithdrawalDays.join(
            ","
          )
        : "10,20,30";

    setFormData({
      name: pkg.name || "",

      description:
        pkg.description || "",

      roi:
        pkg.roi ?? "",

      duration:
        pkg.duration ?? "",

      minAmount:
        pkg.minAmount ?? "",

      maxAmount:
        pkg.maxAmount ?? "",

      investmentType,

      profitWithdrawalDays:
        withdrawalDays,

      isActive:
        pkg.isActive !== false,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================
  // DELETE
  // ==========================

  const deletePackage = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this package?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/admin/packages/${id}`
      );

      alert("Package deleted");

      loadPackages();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  // ==========================
  // TOGGLE STATUS
  // ==========================

  const toggleStatus = async (
    pkg
  ) => {
    try {
      await api.put(
        `/admin/packages/${pkg._id}`,
        {
          ...pkg,
          isActive:
            !pkg.isActive,
        }
      );

      loadPackages();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  // ==========================
  // RESET FORM
  // ==========================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      roi: "",
      duration: "",
      minAmount: "",
      maxAmount: "",
      investmentType:
        "standard",
      profitWithdrawalDays:
        "10,20,30",
      isActive: true,
    });
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar
          isOpen={sidebarOpen}
          toggleSidebar={
            toggleSidebar
          }
        />

        <div className="flex-grow-1">
          <AdminNavbar
            toggleSidebar={
              toggleSidebar
            }
          />

          <div className="container-fluid p-5">
            <h3>
              Loading packages...
            </h3>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // MAIN UI
  // ==========================

  return (
    <div className="d-flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={
          toggleSidebar
        }
      />

      <div className="flex-grow-1 bg-light">
        <AdminNavbar
          toggleSidebar={
            toggleSidebar
          }
        />

        <div className="container-fluid p-4">
          <h2 className="mb-4 fw-bold">
            Package Management
          </h2>

          {/* ==========================
              PACKAGE FORM
          ========================== */}

          <div className="card shadow mb-4">
            <div className="card-header">
              <h4>
                {editingId
                  ? "Edit Package"
                  : "Create Package"}
              </h4>
            </div>

            <div className="card-body">
              <form
                onSubmit={savePackage}
              >
                <div className="row">

                  {/* PACKAGE NAME */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Package Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={
                        formData.name
                      }
                      onChange={
                        handleChange
                      }
                      required
                    />
                  </div>

                  {/* ROI */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      ROI (%)
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="roi"
                      value={
                        formData.roi
                      }
                      onChange={
                        handleChange
                      }
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  {/* DURATION */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Duration (Days)
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="duration"
                      value={
                        formData.duration
                      }
                      onChange={
                        handleChange
                      }
                      min="1"
                      required
                    />
                  </div>

                  {/* MINIMUM */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Minimum Amount
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="minAmount"
                      value={
                        formData.minAmount
                      }
                      onChange={
                        handleChange
                      }
                      min="1"
                      required
                    />
                  </div>

                  {/* MAXIMUM */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Maximum Amount
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="maxAmount"
                      value={
                        formData.maxAmount
                      }
                      onChange={
                        handleChange
                      }
                      min="1"
                      required
                    />
                  </div>

                  {/* INVESTMENT TYPE */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Investment Type
                    </label>

                    <select
                      className="form-select"
                      name="investmentType"
                      value={
                        formData.investmentType
                      }
                      onChange={
                        handleChange
                      }
                    >
                      <option value="standard">
                        Standard
                      </option>

                      <option value="locked_profit">
                        Locked Profit
                      </option>
                    </select>

                    <small className="text-muted">
                      Standard returns
                      principal + profit
                      at maturity.
                      Locked Profit keeps
                      the principal locked
                      and allows scheduled
                      profit withdrawals.
                    </small>
                  </div>

                  {/* WITHDRAWAL DAYS */}

                  {formData.investmentType ===
                    "locked_profit" && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Profit Withdrawal Days
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        name="profitWithdrawalDays"
                        value={
                          formData.profitWithdrawalDays
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="10,20,30"
                      />

                      <small className="text-muted">
                        Enter checkpoint
                        days separated
                        by commas.
                        Example:
                        10,20,30
                      </small>
                    </div>
                  )}

                  {/* DESCRIPTION */}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                    />
                  </div>

                  {/* ACTIVE */}

                  <div className="col-12 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isActive"
                        checked={
                          formData.isActive
                        }
                        onChange={
                          handleChange
                        }
                      />

                      <label className="form-check-label">
                        Package Active
                      </label>
                    </div>
                  </div>
                </div>

                {/* BUTTONS */}

                <button
                  className="btn btn-primary me-2"
                  type="submit"
                >
                  {editingId
                    ? "Update Package"
                    : "Create Package"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      resetForm
                    }
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* ==========================
              PACKAGE TABLE
          ========================== */}

          <div className="card shadow">
            <div className="card-header bg-dark text-white d-flex justify-content-between">
              <strong>
                Available Packages
              </strong>

              <span className="badge bg-light text-dark">
                {packages.length}{" "}
                Packages
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>ROI</th>
                    <th>Duration</th>
                    <th>Profit Days</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {packages.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center"
                      >
                        No packages
                        found.
                      </td>
                    </tr>
                  ) : (
                    packages.map(
                      (pkg) => {
                        const isLockedProfit =
                          pkg.investmentType ===
                          "locked_profit";

                        return (
                          <tr
                            key={
                              pkg._id
                            }
                          >
                            <td>
                              <strong>
                                {
                                  pkg.name
                                }
                              </strong>
                            </td>

                            <td>
                              {isLockedProfit ? (
                                <span className="badge bg-warning text-dark">
                                  Locked
                                  Profit
                                </span>
                              ) : (
                                <span className="badge bg-primary">
                                  Standard
                                </span>
                              )}
                            </td>

                            <td>
                              {pkg.roi}%
                            </td>

                            <td>
                              {
                                pkg.duration
                              }{" "}
                              Days
                            </td>

                            <td>
                              {isLockedProfit
                                ? Array.isArray(
                                    pkg.profitWithdrawalDays
                                  ) &&
                                  pkg
                                    .profitWithdrawalDays
                                    .length >
                                    0
                                  ? pkg.profitWithdrawalDays.join(
                                      ", "
                                    )
                                  : "10, 20, 30"
                                : "-"}
                            </td>

                            <td>
                              KES{" "}
                              {Number(
                                pkg.minAmount
                              ).toLocaleString()}
                            </td>

                            <td>
                              KES{" "}
                              {Number(
                                pkg.maxAmount
                              ).toLocaleString()}
                            </td>

                            <td>
                              <span
                                className={
                                  pkg.isActive
                                    ? "badge bg-success"
                                    : "badge bg-danger"
                                }
                              >
                                {pkg.isActive
                                  ? "Active"
                                  : "Inactive"}
                              </span>
                            </td>

                            <td>
                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() =>
                                  editPackage(
                                    pkg
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className={
                                  pkg.isActive
                                    ? "btn btn-secondary btn-sm me-2"
                                    : "btn btn-success btn-sm me-2"
                                }
                                onClick={() =>
                                  toggleStatus(
                                    pkg
                                  )
                                }
                              >
                                {pkg.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  deletePackage(
                                    pkg._id
                                  )
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )
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

