// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

const CustomerDashboard = () => {
  return (
    <>
      <Head />
      <body>
        <div class="wrapper">
          <Sidebar />
          <div class="main-panel ps-container ps-theme-default">
            <Navbar />
            <div class="content">
              <div class="container-fluid">
                <div class="row"></div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default CustomerDashboard;
