// import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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
    <>
      <nav className="navbar navbar-expand-lg navbar-transparent navbar-absolute">
        <div className="container-fluid">
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              {/* <button
                className="btn btn-just-icon btn-white btn-fab btn-round"
                id="minimizeSidebar"
              >
                <i className="material-icons text_align-center visible-on-sidebar-regular">
                  more_vert
                </i>
                <i className="material-icons design_bullet-list-67 visible-on-sidebar-mini">
                  view_list
                </i>
              </button> */}
            </div>
            {/* <a className="navbar-brand" href="#pablo">
              ...PAGENAME...
            </a> */}
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
                    <Link className="dropdown-item">Profile</Link>
                    <Link className="dropdown-item">Settings</Link>
                    <div className="dropdown-divider" />
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={handleLogout}
                    >
                      Log out
                    </a>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
