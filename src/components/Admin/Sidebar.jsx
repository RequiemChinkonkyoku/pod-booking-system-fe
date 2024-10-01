// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div
        className="sidebar"
        data-background-color="black"
        data-color="rose"
        data-image="../assets/img/sidebar-1.jpg"
      >
        <div className="logo">
          <a className="simple-text logo-mini">P</a>
          <a className="simple-text logo-normal">POD B.SYSTEM</a>
        </div>
        <div
          className="sidebar-wrapper ps-container ps-theme-default"
          data-ps-id="8e0dc3c4-0764-9be2-00bc-a242848f1e7e"
        >
          <div className="user">
            <div className="user-info">
              <div className="collapse show">
                <ul className="nav">
                  <li className="nav-item ">
                    <a className="nav-link" href="../examples/dashboard.html">
                      <i className="material-icons">dashboard</i>
                      <p> Profile </p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="nav">
            <li className="nav-item ">
              <Link className="nav-link" to="/adminUsers">
                <i className="material-icons">grid_on</i>
                <p>Users</p>
              </Link>
            </li>
          </ul>
          <div
            className="ps-scrollbar-x-rail"
            style={{
              bottom: "0px",
              left: "0px",
            }}
          >
            <div
              className="ps-scrollbar-x"
              style={{
                left: "0px",
                width: "0px",
              }}
              tabIndex="0"
            />
          </div>
          <div
            className="ps-scrollbar-y-rail"
            style={{
              right: "0px",
              top: "0px",
            }}
          >
            <div
              className="ps-scrollbar-y"
              style={{
                height: "0px",
                top: "0px",
              }}
              tabIndex="0"
            />
          </div>
        </div>
        <div
          className="sidebar-background"
          style={{
            backgroundImage: "url(../assets/img/sidebar-1.jpg)",
          }}
        />
      </div>
    </>
  );
};

export default Sidebar;
