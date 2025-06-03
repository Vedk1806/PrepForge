import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBolt, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_id");
    alert("Logged out successfully.");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    fontWeight: location.pathname === path ? "bold" : "normal",
    borderBottom: location.pathname === path ? "2px solid white" : "none",
    paddingBottom: "2px",
    cursor: "pointer",
  });

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4 py-2"
      style={{
        backgroundColor: "#6c63ff",
        color: "white",
        flexWrap: "wrap",
      }}
    >
      <div className="d-flex align-items-center gap-2">
        <FaBolt size={20} />
        <Link to="/" style={{ ...linkStyle("/"), fontSize: "20px" }}>
          <strong>PrepForge</strong>
        </Link>
      </div>

      <div className="d-flex align-items-center gap-4">
        {isLoggedIn ? (
          <>
            <Link to="/" style={linkStyle("/")}>Home</Link>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaTachometerAlt /> Dashboard
            </Link>            
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
              style={{ cursor: "pointer" }}
            >
              <FaSignOutAlt className="me-1" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle("/login")}>
              <FaSignInAlt className="me-1" />
              Login
            </Link>
            <Link to="/signup" style={linkStyle("/signup")}>
              <FaUserPlus className="me-1" />
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
