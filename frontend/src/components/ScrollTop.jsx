import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollTop() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  if (!visible) return null;

  return (

    <button
      className="btn btn-primary rounded-circle shadow"
      style={{
        position: "fixed",
        right: "20px",
        bottom: "165px",
        width: "50px",
        height: "50px",
        zIndex: 9999
      }}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        })
      }
    >
      <FaArrowUp />
    </button>

  );

}