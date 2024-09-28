// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

const Users = () => {
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
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header card-header-icon card-header-rose">
                        <div className="card-icon">
                          <i className="material-icons">assignment</i>
                        </div>
                        <h4 className="card-title">Example Table</h4>
                      </div>
                      <div className="card-body table-full-width table-hover">
                        <div className="table-responsive">
                          <table className="table">
                            {/* Table Head */}
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Role</th>
                                <th className="text-right">...</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="text-center">C0</td>
                                <td>Normal Customer</td>
                                <td>Active</td>
                                <td>Customer</td>
                                <td className="text-right">...</td>
                                <td class="td-actions text-right">
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-info"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">person</i>
                                    <div class="ripple-container"></div>
                                  </button> */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">edit</i>
                                  </button>
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-danger"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">close</i>
                                  </button> */}
                                </td>
                              </tr>
                              <tr className="table-success">
                                <td className="text-center">S0</td>
                                <td>Normal Staff</td>
                                <td>Active</td>
                                <td>Staff</td>
                                <td className="text-right">...</td>
                                <td class="td-actions text-right">
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-info"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">person</i>
                                    <div class="ripple-container"></div>
                                  </button> */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">edit</i>
                                  </button>
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-danger"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">close</i>
                                  </button> */}
                                </td>
                              </tr>
                              <tr className="table-info">
                                <td className="text-center">M0</td>
                                <td>Normal Manager</td>
                                <td>Active</td>
                                <td>Manager</td>
                                <td className="text-right">...</td>
                                <td class="td-actions text-right">
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-info"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">person</i>
                                    <div class="ripple-container"></div>    
                                  </button> */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">edit</i>
                                  </button>
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-danger"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">close</i>
                                  </button> */}
                                </td>
                              </tr>
                              <tr className="table-danger">
                                <td className="text-center">AX</td>
                                <td>Any User</td>
                                <td>Deactivated</td>
                                <td>Any</td>
                                <td className="text-right">...</td>
                                <td class="td-actions text-right">
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-info"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">person</i>
                                    <div class="ripple-container"></div>
                                  </button> */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">edit</i>
                                  </button>
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-danger"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">close</i>
                                  </button> */}
                                </td>
                              </tr>
                              <tr className="table-warning">
                                <td className="text-center">AY</td>
                                <td>Any User</td>
                                <td>Inactive</td>
                                <td>Any</td>
                                <td className="text-right">...</td>
                                <td class="td-actions text-right">
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-info"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">person</i>
                                    <div class="ripple-container"></div>
                                  </button> */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-success"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">edit</i>
                                  </button>
                                  {/* <button
                                    type="button"
                                    rel="tooltip"
                                    class="btn btn-danger"
                                    data-original-title=""
                                    title=""
                                  >
                                    <i class="material-icons">close</i>
                                  </button> */}
                                </td>
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
        </div>
      </body>
    </>
  );
};

export default Users;
