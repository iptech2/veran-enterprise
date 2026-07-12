// import { useEffect, useState } from "react";
// import AdminSidebar from "../components/AdminSidebar";
// import api from "../services/api";

// export default function AdminPackages() {
//   const [packages, setPackages] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     roi: "",
//     duration: "",
//     minAmount: "",
//     maxAmount: "",
//     isActive: true,
//   });

//   const [editingId, setEditingId] = useState(null);

//   const loadPackages = async () => {
//     try {
//       const res = await api.get("/packages/admin");
//       setPackages(res.data);
//     } catch (err) {
//       alert("Failed to load packages");
//     }
//   };

//   useEffect(() => {
//     loadPackages();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm({
//       ...form,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const savePackage = async () => {
//     try {
//       if (editingId) {
//         await api.put(`/packages/${editingId}`, form);
//         alert("Package updated");
//       } else {
//         await api.post("/packages", form);
//         alert("Package created");
//       }

//       setEditingId(null);

//       setForm({
//         name: "",
//         roi: "",
//         duration: "",
//         minAmount: "",
//         maxAmount: "",
//         isActive: true,
//       });

//       loadPackages();
//     } catch (err) {
//       alert(err.response?.data?.message || "Operation failed");
//     }
//   };

//   const editPackage = (pkg) => {
//     setEditingId(pkg._id);

//     setForm({
//       name: pkg.name,
//       roi: pkg.roi,
//       duration: pkg.duration,
//       minAmount: pkg.minAmount,
//       maxAmount: pkg.maxAmount,
//       isActive: pkg.isActive,
//     });
//   };

//   const deletePackage = async (id) => {
//     if (!window.confirm("Delete this package?")) return;

//     try {
//       await api.delete(`/packages/${id}`);

//       alert("Package deleted");

//       loadPackages();
//     } catch (err) {
//       alert(err.response?.data?.message || "Delete failed");
//     }
//   };

//   return (
//     <div className="d-flex">
//       <AdminSidebar />

//       <div className="container-fluid p-4">

//         <h2 className="mb-4">
//           Package Management
//         </h2>

//         <div className="card mb-4 shadow">
//           <div className="card-body">

//             <div className="row">

//               <div className="col-md-4">
//                 <input
//                   className="form-control mb-2"
//                   placeholder="Package Name"
//                   name="name"
//                   value={form.name}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-2">
//                 <input
//                   className="form-control mb-2"
//                   placeholder="ROI"
//                   name="roi"
//                   value={form.roi}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-2">
//                 <input
//                   className="form-control mb-2"
//                   placeholder="Days"
//                   name="duration"
//                   value={form.duration}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-2">
//                 <input
//                   className="form-control mb-2"
//                   placeholder="Minimum"
//                   name="minAmount"
//                   value={form.minAmount}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="col-md-2">
//                 <input
//                   className="form-control mb-2"
//                   placeholder="Maximum"
//                   name="maxAmount"
//                   value={form.maxAmount}
//                   onChange={handleChange}
//                 />
//               </div>

//             </div>

//             <div className="form-check mb-3">
//               <input
//                 type="checkbox"
//                 className="form-check-input"
//                 name="isActive"
//                 checked={form.isActive}
//                 onChange={handleChange}
//               />

//               <label className="form-check-label">
//                 Active Package
//               </label>
//             </div>

//             <button
//               className="btn btn-success"
//               onClick={savePackage}
//             >
//               {editingId ? "Update Package" : "Create Package"}
//             </button>

//           </div>
//         </div>

//         <div className="card shadow">

//           <div className="card-header">
//             <h4>All Packages</h4>
//           </div>

//           <div className="table-responsive">

//             <table className="table table-bordered">

//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>ROI</th>
//                   <th>Duration</th>
//                   <th>Minimum</th>
//                   <th>Maximum</th>
//                   <th>Status</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>

//                 {packages.map((pkg) => (
//                   <tr key={pkg._id}>

//                     <td>{pkg.name}</td>
//                     <td>{pkg.roi}%</td>
//                     <td>{pkg.duration} Days</td>
//                     <td>KES {pkg.minAmount}</td>
//                     <td>KES {pkg.maxAmount}</td>

//                     <td>
//                       {pkg.isActive ? (
//                         <span className="badge bg-success">
//                           Active
//                         </span>
//                       ) : (
//                         <span className="badge bg-danger">
//                           Disabled
//                         </span>
//                       )}
//                     </td>

//                     <td>

//                       <button
//                         className="btn btn-warning btn-sm me-2"
//                         onClick={() => editPackage(pkg)}
//                       >
//                         Edit
//                       </button>

//                       <button
//                         className="btn btn-danger btn-sm"
//                         onClick={() => deletePackage(pkg._id)}
//                       >
//                         Delete
//                       </button>

//                     </td>

//                   </tr>
//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";

export default function AdminPackages() {
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
    isActive: true,
  });

  /* ===========================
      LOAD PACKAGES
  =========================== */

  const loadPackages = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/packages");

      setPackages(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Failed to load packages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, []);

  /* ===========================
      HANDLE INPUT
  =========================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* ===========================
      SAVE PACKAGE
  =========================== */

  const savePackage = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(
          `/admin/packages/${editingId}`,
          formData
        );

        alert("Package updated successfully");
      } else {
        await api.post(
          "/admin/packages",
          formData
        );

        alert("Package created successfully");
      }

      resetForm();

      loadPackages();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Operation failed"
      );
    }
  };

  /* ===========================
      EDIT
  =========================== */

  const editPackage = (pkg) => {
    setEditingId(pkg._id);

    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      roi: pkg.roi,
      duration: pkg.duration,
      minAmount: pkg.minAmount,
      maxAmount: pkg.maxAmount,
      isActive: pkg.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ===========================
      DELETE
  =========================== */

  const deletePackage = async (id) => {
    if (
      !window.confirm(
        "Delete this package?"
      )
    )
      return;

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

  /* ===========================
      TOGGLE STATUS
  =========================== */

  const toggleStatus = async (pkg) => {
    try {
      await api.put(
        `/admin/packages/${pkg._id}`,
        {
          ...pkg,
          isActive: !pkg.isActive,
        }
      );

      loadPackages();
    } catch (err) {
      alert("Failed");
    }
  };

  /* ===========================
      RESET FORM
  =========================== */

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      roi: "",
      duration: "",
      minAmount: "",
      maxAmount: "",
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="d-flex">
        <AdminSidebar />

        <div className="container-fluid p-5">
          <h3>Loading packages...</h3>
        </div>
      </div>
    );
  }
    return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="container-fluid p-4">

        <h2 className="mb-4">
          Package Management
        </h2>

        {/* PACKAGE FORM */}

        <div className="card shadow mb-4">
          <div className="card-header">
            <h4>
              {editingId ? "Edit Package" : "Create Package"}
            </h4>
          </div>

          <div className="card-body">

            <form onSubmit={savePackage}>

              <div className="row">

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Package Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    ROI (%)
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="roi"
                    value={formData.roi}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Minimum Amount
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Maximum Amount
                  </label>

                  <input
                    type="number"
                    className="form-control"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12 mb-3">
                  <div className="form-check">

                    <input
                      className="form-check-input"
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />

                    <label className="form-check-label">
                      Package Active
                    </label>

                  </div>
                </div>

              </div>

              <button
                className="btn btn-primary me-2"
                type="submit"
              >
                {editingId ? "Update Package" : "Create Package"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </form>

          </div>
        </div>

        {/* PACKAGE TABLE */}

        <div className="card shadow">

          <div className="card-header">
            <h4>Available Packages</h4>
          </div>

          <div className="table-responsive">

            <table className="table table-hover align-middle">

              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>ROI</th>
                  <th>Duration</th>
                  <th>Min</th>
                  <th>Max</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {packages.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No packages found.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg._id}>

                      <td>{pkg.name}</td>

                      <td>{pkg.roi}%</td>

                      <td>{pkg.duration} Days</td>

                      <td>KES {pkg.minAmount}</td>

                      <td>KES {pkg.maxAmount}</td>

                      <td>
                        <span
                          className={
                            pkg.isActive
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {pkg.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>

                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => editPackage(pkg)}
                        >
                          Edit
                        </button>

                        <button
                          className={
                            pkg.isActive
                              ? "btn btn-secondary btn-sm me-2"
                              : "btn btn-success btn-sm me-2"
                          }
                          onClick={() => toggleStatus(pkg)}
                        >
                          {pkg.isActive ? "Deactivate" : "Activate"}
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deletePackage(pkg._id)}
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