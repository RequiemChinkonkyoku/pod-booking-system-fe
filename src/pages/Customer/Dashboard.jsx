import axios from "../../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";
import { useAuth } from "../../contexts/AuthContext";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

const CustomerDashboard = () => {
  const [user, setUser] = useState({});
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/Users/Current");
      setUser(response.data);
      setName(response.data.name); // Set initial name from user data
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const updateUserName = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Users/${user.id}/Name?name=${name}`);
      alert("Name updated successfully!");
    } catch (error) {
      console.error("Failed to update name:", error);
      alert("Failed to update name.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    try {
      await axios.put(
        `/Users/${user.id}/Password?currentPassword=${currentPassword}&newPassword=${newPassword}`
      );
      alert("Password updated successfully!");
      setCurrentPassword(""); // Clear the fields after successful update
      setNewPassword("");
    } catch (error) {
      console.error("Failed to update password:", error);
      alert("Failed to update password.");
    }
  };

  const { logout } = useAuth();

  const deleteUserAccount = async () => {
    try {
      await axios.delete(`/Users/${user.id}`);
      alert("Account deactivated successfully.");
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to deactivate account:", error);
      // alert("Failed to deactivate account.");
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    deleteUserAccount();
    handleCloseModal(); // Close modal after deleting
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
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">perm_identity</i>
                      </div>
                      <h4 className="card-title">Your profile</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={updateUserName}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group bmd-form-group">
                              <label>
                                Email (cannot be changed, contact admin if
                                needed)
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                readOnly
                                disabled
                                value={user.email || ""}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group bmd-form-group">
                              <label>Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-rose pull-right"
                        >
                          Update Profile
                        </button>
                        <div className="clearfix"></div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change password section */}
              <div className="row">
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">perm_identity</i>
                      </div>
                      <h4 className="card-title">Change password</h4>
                    </div>
                    <div className="card-body">
                      <form onSubmit={updatePassword}>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group bmd-form-group">
                              <label>Current password</label>
                              <input
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) =>
                                  setCurrentPassword(e.target.value)
                                }
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <div className="form-group bmd-form-group">
                              <label>New password</label>
                              <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="btn btn-rose pull-right"
                        >
                          Change password
                        </button>
                        <div className="clearfix"></div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deactivate account button */}
              <div className="row">
                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn btn-danger pull-left"
                    onClick={handleOpenModal}
                  >
                    DEACTIVATE ACCOUNT
                  </button>
                </div>
              </div>

              {/* Confirmation Modal */}
              {isModalOpen && (
                <div className="modal" style={modalStyle}>
                  <div className="modal-content">
                    <h4>Confirm Deactivation</h4>
                    <p>Are you sure you want to deactivate your account?</p>
                    <button
                      className="btn btn-danger"
                      onClick={handleConfirmDelete}
                    >
                      Yes, Deactivate
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Simple inline modal styles (adjust as needed)
const modalStyle = {
  position: "fixed",
  zIndex: "1000",
  background: "rgba(0,0,0,0.5)",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default CustomerDashboard;
