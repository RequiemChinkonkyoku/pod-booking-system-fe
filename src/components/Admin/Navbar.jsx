// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-transparent ">
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
                  aria-expanded="false"
                  aria-haspopup="true"
                  className="nav-link"
                  data-toggle="dropdown"
                  href="http://example.com"
                  id="navbarDropdownMenuLink"
                >
                  <i className="material-icons">notifications</i>
                  <span className="notification">5</span>
                  <p className="d-lg-none d-md-block">Some Actions</p>
                </a>
                <div
                  aria-labelledby="navbarDropdownMenuLink"
                  className="dropdown-menu dropdown-menu-right"
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
              </li>
              <li className="nav-item dropdown">
                <a
                  aria-expanded="false"
                  aria-haspopup="true"
                  className="nav-link"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownProfile"
                >
                  <i className="material-icons">person</i>
                  <p className="d-lg-none d-md-block">Account</p>
                </a>
                <div
                  aria-labelledby="navbarDropdownProfile"
                  className="dropdown-menu dropdown-menu-right"
                >
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    Log out
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
