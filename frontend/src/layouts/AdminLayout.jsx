import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "../components/Footer";

export default function AdminLayout({ children }) {
  return (
    <div className="d-flex">

      {/* ADMIN SIDEBAR */}
      <AdminSidebar />


      {/* MAIN CONTENT */}
      <div
        className="flex-grow-1"
        style={{
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >

        {/* ADMIN NAVBAR */}
        <AdminNavbar />


        {/* PAGE CONTENT */}
        <div className="container-fluid p-4 pb-5">

          {children}

        </div>


        {/* GLOBAL FOOTER */}
        <Footer />


      </div>

    </div>
  );
}