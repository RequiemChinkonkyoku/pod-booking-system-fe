// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <>
      <div
        class="sidebar"
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
                    <Link className="nav-link" to="/customerDashboard">
                      <i className="material-icons">dashboard</i>
                      <p> Profile </p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <ul className="nav">
            <li className="nav-item ">
              <Link className="nav-link" to="/customerBookAPod">
                <i className="material-icons">content_paste</i>
                <p>Book a POD</p>
              </Link>
            </li>
          </ul>
          <ul className="nav">
            <li className="nav-item ">
              <Link className="nav-link" to="/customerBookings">
                <i className="material-icons">date_range</i>
                <p>Your Bookings</p>
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
