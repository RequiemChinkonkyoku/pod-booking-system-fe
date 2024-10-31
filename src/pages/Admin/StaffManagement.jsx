import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap

export const StaffManagement = () => {
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    // Fetch users
    axios.get("/Users").then((response) => {
      setUsers(response.data);
    });

    // Fetch areas
    axios.get("/Areas").then((response) => {
      setAreas(response.data);
    });
  }, []);

  const getAreaName = (areaId) => {
    const area = areas.find((a) => a.id === areaId);
    return area ? area.name : "N/A"; // Returns area name or "N/A" if not found
  };

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel ps-container ps-theme-default">
          <Navbar />
          <div className="content">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">assignment</i>
                      </div>
                      <h4 className="card-title">Staff Members</h4>
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
                              <th>AREA</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Filtered Rows */}
                            {users
                              .filter((user) => user.roleId === 2) // Only staff members
                              .map((user) => (
                                <tr
                                  className={`table-success ${
                                    user.status == "-1"
                                      ? "table-danger" // Deactivated
                                      : user.status == "0"
                                      ? "table-warning" // Inactive
                                      : ""
                                  }`}
                                  key={user.id}
                                >
                                  <td className="text-center">{user.id}</td>
                                  <td>{user.name}</td>
                                  <td>{user.email}</td>
                                  <td>Staff</td>
                                  <td>
                                    {user.status == "-1"
                                      ? "Deactivated"
                                      : user.status == "0"
                                      ? "Inactive"
                                      : user.status == "1"
                                      ? "Active"
                                      : "N/A"}
                                  </td>
                                  <td>{getAreaName(user.areaId)}</td>{" "}
                                  <td className="td-actions text-right">
                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() => handleOpenEditModal(user)}
                                    >
                                      <i className="material-icons">edit</i>
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() =>
                                        handleOpenDeleteModal(user)
                                      }
                                    >
                                      <i className="material-icons">close</i>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
