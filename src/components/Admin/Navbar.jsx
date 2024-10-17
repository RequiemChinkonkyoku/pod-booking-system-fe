import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as needed

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const handleLogout = async (e) => {
    e.preventDefault(); // Prevent the default anchor behavior
    try {
      await logout();
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleProfileDropdown = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotificationsDropdown = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute">
      <div className="container-fluid">
        <div className="navbar-wrapper">
          <div className="navbar-minimize">
            {/* Commented out minimize button */}
          </div>
          <a className="navbar-brand" href="#pablo">
            ...PAGENAME...
          </a>
        </div>
        <button
          aria-controls="navigation-index"
          aria-expanded="false"
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
        >
          <span className="sr-only">Toggle navigation</span>
          <span className="navbar-toggler-icon icon-bar" />
          <span className="navbar-toggler-icon icon-bar" />
          <span className="navbar-toggler-icon icon-bar" />
        </button>
        <div className="collapse navbar-collapse justify-content-end">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#pablo">
                <i className="material-icons">dashboard</i>
                <p className="d-lg-none d-md-block">Stats</p>
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                aria-expanded={isNotificationsOpen}
                aria-haspopup="true"
                className="nav-link"
                onClick={toggleNotificationsDropdown}
                href="#"
                id="navbarDropdownMenuLink"
              >
                <i className="material-icons">notifications</i>
                <span className="notification">5</span>
                <p className="d-lg-none d-md-block">Some Actions</p>
              </a>
              {isNotificationsOpen && (
                <div
                  aria-labelledby="navbarDropdownMenuLink"
                  className="dropdown-menu dropdown-menu-right show"
                >
                  <a className="dropdown-item" href="#">
                    Mike John responded to your email
                  </a>
                  <a className="dropdown-item" href="#">
                    You have 5 new tasks
                  </a>
                  <a className="dropdown-item" href="#">
                    You're now friend with Andrew
                  </a>
                  <a className="dropdown-item" href="#">
                    Another Notification
                  </a>
                  <a className="dropdown-item" href="#">
                    Another One
                  </a>
                </div>
              )}
            </li>
            <li className="nav-item dropdown">
              <a
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
                className="nav-link"
                onClick={toggleProfileDropdown}
                href="#"
                id="navbarDropdownProfile"
              >
                <i className="material-icons">person</i>
                <p className="d-lg-none d-md-block">Account</p>
              </a>
              {isProfileOpen && (
                <div
                  aria-labelledby="navbarDropdownProfile"
                  className="dropdown-menu dropdown-menu-right show"
                >
                  <Link className="dropdown-item" to="/admin/profile">
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/admin/settings">
                    Settings
                  </Link>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#" onClick={handleLogout}>
                    Log out
                  </a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
