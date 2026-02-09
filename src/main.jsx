import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import FaezehClinic from "./components/FaezehClinic.jsx";
import "./index.css";

function App() {
  useEffect(() => {
    const handleRoute = () => {
      const hash = window.location.hash || "";
      if (hash.startsWith("#/")) {
        const target = "#" + hash.slice(2);
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          // set hash so links become visible
          window.location.hash = target;
        }
      } else if (hash && hash.startsWith("#")) {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    };

    // On load, try to navigate to section
    handleRoute();
    window.addEventListener("hashchange", handleRoute);
    return () => window.removeEventListener("hashchange", handleRoute);
  }, []);

  return <FaezehClinic />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
