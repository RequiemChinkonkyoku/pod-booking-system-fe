// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

const Dashboard = () => {
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
                <div class="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="card">
                      <div className="card-header card-header-text card-header-warning">
                        <div className="card-text">
                          <h4 className="card-title">Employees Stats</h4>
                          <p className="card-category">
                            New employees on 15th September, 2016
                          </p>
                        </div>
                      </div>
                      <div className="card-body table-responsive">
                        <table className="table table-hover">
                          <thead className="text-warning">
                            <tr>
                              <th>ID</th>
                              <th>Name</th>
                              <th>Salary</th>
                              <th>Country</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>Dakota Rice</td>
                              <td>$36,738</td>
                              <td>Niger</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Minerva Hooper</td>
                              <td>$23,789</td>
                              <td>Curaçao</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>Sage Rodriguez</td>
                              <td>$56,142</td>
                              <td>Netherlands</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>Philip Chaney</td>
                              <td>$38,735</td>
                              <td>Korea, South</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default Dashboard;
