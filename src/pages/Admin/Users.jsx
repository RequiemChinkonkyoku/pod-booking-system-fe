import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";

const Users = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");

  const [users, setUsers] = React.useState([]);
  React.useEffect(() => {
    axios.get("/Users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(`https://localhost:44314/Users/Email?email=${email}`);
  };

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
                        <h4 className="card-title">Users</h4>
                      </div>
                      <div className="card-body table-full-width table-hover">
                        <div className="table-responsive">
                          <table className="table">
                            {/* Table Head */}
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Membership</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user) => (
                                <tr
                                  className={`${
                                    user.roleId == "1"
                                      ? "" // Customer
                                      : user.roleId == "2"
                                      ? "table-success" // Staff
                                      : user.roleId == "3"
                                      ? "table-info" // Manager
                                      : user.roleId == "4"
                                      ? "table-secondary" // Admin
                                      : "" // Default
                                  } ${
                                    user.status == "-1"
                                      ? "table-danger" // Deactivated
                                      : user.status == "0"
                                      ? "table-warning" // Inactive
                                      : user.status == "1"
                                      ? "" // Active, no additional class
                                      : ""
                                  }`}
                                >
                                  <td className="text-center">{user.id}</td>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td>
                                    {user.roleId == "1"
                                      ? "Customer"
                                      : user.roleId == "2"
                                      ? "Staff"
                                      : user.roleId == "3"
                                      ? "Manager"
                                      : user.roleId == "4"
                                      ? "Admin"
                                      : "N/A"}
                                  </td>
                                  <td>
                                    {user.status == "-1"
                                      ? "Deactivated"
                                      : user.status == "0"
                                      ? "Inactive"
                                      : user.status == "1"
                                      ? "Active"
                                      : "N/A"}
                                  </td>
                                  <td>{user.membershipId}</td>
                                  <td class="td-actions text-right">
                                    <button
                                      type="button"
                                      rel="tooltip"
                                      class="btn btn-success"
                                      data-original-title=""
                                      title=""
                                    >
                                      <i class="material-icons">edit</i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div className="col-md-6">
                    <div className="card ">
                      <div className="card-header card-header-rose card-header-icon">
                        <div className="card-icon">
                          <i className="material-icons">mail_outline</i>
                        </div>
                        <h4 className="card-title">Add a new STAFF account</h4>
                      </div>
                      <div className="card-body ">
                        <form role="form" onSubmit={handleCreate}>
                          <div className="form-group bmd-form-group">
                            <label htmlFor="exampleEmail">Email Address</label>
                            <input
                              className="form-control"
                              id="exampleEmail"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="card-footer ">
                            <button
                              className="btn btn-fill btn-rose"
                              type="submit"
                            >
                              Submit
                            </button>
                          </div>
                        </form>
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
