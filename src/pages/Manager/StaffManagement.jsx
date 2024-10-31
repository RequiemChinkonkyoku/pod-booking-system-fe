import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Manager/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Manager/Sidebar";
import { Modal, Button, Form } from "react-bootstrap";

export const ManagerStaffManagement = () => {
  const [users, setUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStaffAndAreaData = async () => {
      try {
        const userResponse = await axios.get("/Users");
        const usersWithAreas = await Promise.all(
          userResponse.data.map(async (user) => {
            if (user.roleId === 2) {
              // Only staff members
              try {
                const staffAreaResponse = await axios.get(
                  `/StaffArea/Staff/${user.id}`
                );
                const areaResponse = await axios.get(
                  `/Areas/${staffAreaResponse.data.areaId}`
                );
                return {
                  ...user,
                  areaId: staffAreaResponse.data.areaId,
                  areaName: areaResponse.data.name,
                };
              } catch (error) {
                console.error(
                  `Error fetching area for staff ID ${user.id}:`,
                  error
                );
                return { ...user, areaId: null, areaName: "N/A" }; // Default if no area assigned
              }
            }
            return user;
          })
        );
        setUsers(usersWithAreas);
      } catch (error) {
        console.error("Error fetching users or areas:", error);
      }
    };

    fetchStaffAndAreaData();
    // Fetch areas
    axios.get("/Areas").then((response) => {
      setAreas(response.data);
    });
  }, []);

  const getAreaName = (areaId) => {
    const area = areas.find((a) => a.id === areaId);
    return area ? area.name : "N/A";
  };

  // Open Modal and set initial data
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setSelectedAreaId(user.areaId || ""); // Set current area ID if available, else empty
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setSelectedAreaId("");
  };

  // Handle area selection
  const handleAreaChange = (e) => {
    setSelectedAreaId(e.target.value);
  };

  // Submit area assignment
  const handleSaveArea = async () => {
    const requestBody = {
      staffId: selectedUser.id,
      areaId: parseInt(selectedAreaId, 10),
    }; // Ensure areaId is an integer

    try {
      if (selectedUser.areaId) {
        // If the areaId exists, perform PUT to update the record
        await axios.put("/StaffArea", requestBody);
      } else {
        // If no areaId, perform POST to create the record
        await axios.post("/StaffArea", requestBody);
      }

      // Update the user list with the new area assignment
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                areaId: requestBody.areaId,
                areaName: getAreaName(requestBody.areaId),
              }
            : user
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error saving area:", error);
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
                              <th>Area</th>
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
                                      ? "table-danger"
                                      : user.status == "0"
                                      ? "table-warning"
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
                                  <td>{user.areaName || "N/A"}</td>
                                  <td className="td-actions text-right">
                                    {/* Edit Button */}
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() => handleOpenEditModal(user)}
                                    >
                                      <i className="material-icons">edit</i>
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

      {/* Edit Area Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Assign Area to Staff</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Area</Form.Label>
              <Form.Control
                as="select"
                value={selectedAreaId}
                onChange={handleAreaChange}
              >
                <option value="">Select an area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveArea}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
