import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { Modal, Button } from "react-bootstrap"; // Import Modal and Button from react-bootstrap

export const Pods = () => {
  const [pods, setPods] = useState([]);
  const [podTypes, setPodTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPodType, setSelectedPodType] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false); // Edit modal visibility
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // Delete modal visibility
  const [currentPod, setCurrentPod] = useState(null); // Track the currently selected pod

  // Fetch data for pods, pod types, and areas when the component mounts
  useEffect(() => {
    axios.get("/Pods").then((response) => {
      setPods(response.data);
    });

    axios.get("/PodType").then((response) => {
      setPodTypes(response.data);
    });

    axios.get("/Areas").then((response) => {
      setAreas(response.data);
    });
  }, []);

  // Handle dropdown changes
  const handlePodTypeChange = (e) => setSelectedPodType(e.target.value);
  const handleAreaChange = (e) => setSelectedArea(e.target.value);

  // Show or hide modals
  const handleOpenEditModal = (pod) => {
    setCurrentPod(pod);
    setName(pod.name); // Set the name and description with the current values
    setDescription(pod.description);
    setSelectedPodType(pod.podTypeId);
    setSelectedArea(pod.areaId);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setCurrentPod(null);
    setName("");
    setDescription("");
    setSelectedPodType("");
    setSelectedArea("");
    setEditModalVisible(false);
  };

  const handleOpenDeleteModal = (pod) => {
    setCurrentPod(pod);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setCurrentPod(null);
    setDeleteModalVisible(false);
  };

  // Handle create new pod
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/Pods", {
        name,
        description,
        podTypeId: selectedPodType,
        areaId: selectedArea,
      });
      setName(""); // Clear form fields on success
      setDescription("");
      setSelectedPodType("");
      setSelectedArea("");
      axios.get("/Pods").then((response) => {
        setPods(response.data); // Refresh the pod list
      });
    } catch (error) {
      console.error("Failed to create pod:", error);
    }
  };

  // Handle edit pod
  const handleEditPod = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/Pods/${currentPod.id}`, {
        name: name || currentPod.name,
        description: description || currentPod.description,
        podTypeId: selectedPodType || currentPod.podTypeId,
        areaId: selectedArea || currentPod.areaId,
      });
      handleCloseEditModal(); // Close the modal on success
      axios.get("/Pods").then((response) => {
        setPods(response.data); // Refresh the pod list
      });
    } catch (error) {
      console.error("Failed to update pod:", error);
    }
  };

  // Handle delete pod
  const handleDeletePod = async () => {
    try {
      await axios.delete(`/Pods?id=${currentPod.id}`);
      handleCloseDeleteModal(); // Close the modal on success
      axios.get("/Pods").then((response) => {
        setPods(response.data); // Refresh the pod list
      });
    } catch (error) {
      console.error("Failed to delete pod:", error);
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
              {/* Pod List Table */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-icon card-header-rose">
                      <div className="card-icon">
                        <i className="material-icons">assignment</i>
                      </div>
                      <h4 className="card-title">Pods</h4>
                    </div>
                    <div className="card-body table-full-width table-hover">
                      <div className="table-responsive">
                        <table className="table">
                          {/* Table Head */}
                          <thead>
                            <tr>
                              <th className="text-center">#</th>
                              <th>Name</th>
                              <th>Desc</th>
                              <th>Status</th>
                              <th>PodTypeId</th>
                              <th>AreaId</th>
                              <th className="text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pods.map((pod) => (
                              <tr key={pod.id}>
                                <td className="text-center">{pod.id}</td>
                                <td>{pod.name}</td>
                                <td>{pod.description}</td>
                                <td>{pod.status}</td>
                                <td>{pod.podTypeId}</td>
                                <td>{pod.areaId}</td>
                                <td className="td-actions text-right">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    className="btn btn-success"
                                    data-original-title=""
                                    title="Edit"
                                    onClick={() => handleOpenEditModal(pod)}
                                  >
                                    <i className="material-icons">edit</i>
                                  </button>
                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    rel="tooltip"
                                    className="btn btn-danger"
                                    data-original-title=""
                                    title="Delete"
                                    onClick={() => handleOpenDeleteModal(pod)}
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

              {/* New Pod Creation Form */}
              <div className="row">
                <div className="col-md-12">
                  <div className="card">
                    <div className="card-header card-header-rose card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">CREATE NEW POD</h4>
                      </div>
                    </div>
                    <form
                      role="form"
                      onSubmit={handleCreate}
                      className="form-horizontal"
                    >
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Name
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Description
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        {/* Dropdown for Pod Type */}
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Pod Type
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <select
                                className="form-control"
                                value={selectedPodType}
                                onChange={handlePodTypeChange}
                              >
                                <option value="" disabled>
                                  Select Pod Type
                                </option>
                                {podTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        {/* Dropdown for Area */}
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Area
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group">
                              <select
                                className="form-control"
                                value={selectedArea}
                                onChange={handleAreaChange}
                              >
                                <option value="" disabled>
                                  Select Area
                                </option>
                                {areas.map((area) => (
                                  <option key={area.id} value={area.id}>
                                    {area.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <button type="submit" className="btn btn-fill btn-rose">
                          Create
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

      {/* Edit Modal */}
      <Modal show={editModalVisible} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleEditPod}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
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
          <Modal.Title>Delete Pod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the pod{" "}
            {currentPod ? currentPod.name : ""}?
          </p>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePod}>
            Delete
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};
