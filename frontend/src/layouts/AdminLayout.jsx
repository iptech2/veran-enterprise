import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">

      <AdminSidebar />

      <div
        className="flex-grow-1"
        style={{
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <AdminNavbar />

        <div className="container-fluid p-4">
          {children}
        </div>
      </div>

    </div>
  );
}