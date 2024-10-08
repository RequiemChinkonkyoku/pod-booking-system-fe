import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap

const Users = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Track the currently selected user for editing or deleting
  const [editModalVisible, setEditModalVisible] = useState(false); // Edit modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Delete modal visibility

  // Fetch all users on component mount
  useEffect(() => {
    axios.get("/Users").then((response) => {
      setUsers(response.data);
    });
  }, []);

  // Create new user with the provided email
  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(`/Users/Email?email=${email}`);
    axios.get("/Users").then((response) => {
      setUsers(response.data);
    });
    setEmail("");
  };

  // Open edit modal and set current user data
  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setEditModalVisible(true);
  };

  // Close edit modal and reset current user data
  const handleCloseEditModal = () => {
    setCurrentUser(null);
    setEditModalVisible(false);
  };

  // Open delete modal and set current user data
  const handleOpenDeleteModal = (user) => {
    setCurrentUser(user);
    setDeleteModalVisible(true);
  };

  // Close delete modal and reset current user data
  const handleCloseDeleteModal = () => {
    setCurrentUser(null);
    setDeleteModalVisible(false);
  };

  // Handle editing a user
  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Users/${currentUser.id}`, currentUser); // Update user details
      handleCloseEditModal(); // Close modal after successful update
      axios.get("/Users").then((response) => {
        setUsers(response.data); // Refresh user list
      });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/Users/${currentUser.id}`); // Delete the selected user
      handleCloseDeleteModal(); // Close modal after successful delete
      axios.get("/Users").then((response) => {
        setUsers(response.data); // Refresh user list
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
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
                                key={user.id}
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
                                    onClick={() => handleOpenDeleteModal(user)}
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

              {/* New User Creation Form */}
              <div className="row">
                <div className="col-md-6">
                  <div className="card ">
                    <div className="card-header card-header-rose card-header-icon">
                      <div className="card-icon">
                        <i className="material-icons">mail_outline</i>
                      </div>
                      <h4 className="card-title">Add a new STAFF account</h4>
                    </div>
                    <div className="card-body">
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
                        <div className="card-footer">
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

      {/* Edit Modal */}
      <Modal show={editModalVisible} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditUser}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={currentUser?.name || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={currentUser?.email || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                className="form-control"
                value={currentUser?.status || ""}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, status: e.target.value })
                }
              >
                <option value="-1">Deactivated</option>
                <option value="0">Inactive</option>
                <option value="1">Active</option>
              </select>
            </div>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={deleteModalVisible} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the user{" "}
            {currentUser ? currentUser.name : ""}?
          </p>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Users;
