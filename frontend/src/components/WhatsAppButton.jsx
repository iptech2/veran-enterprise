import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppButton() {

  return (

    <a
      href="https://wa.me/qr/JSXNIJSUMUP7A1"
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-success rounded-circle shadow-lg"
      style={{
        position: "fixed",
        bottom: "90px",
        right: "20px",
        width: "60px",
        height: "60px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "30px",
        zIndex: 9999
      }}
    >
      <FaWhatsapp />
    </a>

  );

}