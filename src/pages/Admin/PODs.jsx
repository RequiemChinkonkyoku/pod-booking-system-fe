import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../css/AdminPODs.css";

export const Pods = () => {
  const [pods, setPods] = useState([]);
  const [podTypes, setPodTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPodType, setSelectedPodType] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentPod, setCurrentPod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showInactivePods, setShowInactivePods] = useState(false);

  useEffect(() => {
    fetchPods();
    fetchPodTypes();
    fetchAreas();
  }, []);

  const fetchPods = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/Pods");
      console.log("Fetched pods:", response.data);
      setPods(response.data);
    } catch (error) {
      console.error("Failed to fetch pods:", error);
      toast.error("Failed to fetch pods. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPodTypes = async () => {
    try {
      const response = await axios.get("/PodType");
      console.log("Fetched pod types:", response.data);
      setPodTypes(response.data);
    } catch (error) {
      console.error("Failed to fetch pod types:", error);
      toast.error("Failed to fetch pod types. Please try again.");
    }
  };

  const fetchAreas = async () => {
    try {
      const response = await axios.get("/Areas");
      console.log("Fetched areas:", response.data);
      setAreas(response.data);
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      toast.error("Failed to fetch areas. Please try again.");
    }
  };

  const handlePodTypeChange = (e) => setSelectedPodType(e.target.value);
  const handleAreaChange = (e) => setSelectedArea(e.target.value);

  const handleOpenEditModal = (pod) => {
    console.log("Opening edit modal for pod:", pod);
    setCurrentPod({ ...pod }); // Create a copy of the pod object
    setName(pod.name);
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
    console.log("Opening delete modal for pod:", pod);
    setCurrentPod(pod);
    setDeleteModalVisible(true);
  };

  const handleCloseDeleteModal = () => {
    setCurrentPod(null);
    setDeleteModalVisible(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/Pods", {
        name,
        description,
        podTypeId: selectedPodType,
        areaId: selectedArea,
      });
      console.log("Create pod response:", response);
      setName("");
      setDescription("");
      setSelectedPodType("");
      setSelectedArea("");
      fetchPods();
      toast.success("Pod created successfully!");
    } catch (error) {
      console.error("Failed to create pod:", error);
      toast.error("Failed to create pod. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPod = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.put(`/Pods/${currentPod.id}`, {
        name: name || currentPod.name,
        description: description || currentPod.description,
        podTypeId: selectedPodType || currentPod.podTypeId,
        areaId: selectedArea || currentPod.areaId,
        status: currentPod.status, // Preserve the current status
      });
      console.log("Edit pod response:", response);
      handleCloseEditModal();
      fetchPods();
      toast.success("Pod updated successfully!");
    } catch (error) {
      console.error("Failed to update pod:", error);
      toast.error("Failed to update pod. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePod = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to deactivate pod with id:", currentPod.id);
      const response = await axios.put(`/Pods/${currentPod.id}`, {
        ...currentPod,
        status: 0,
      });
      console.log("Deactivate response:", response);
      handleCloseDeleteModal();
      await fetchPods();
      toast.success("Pod deactivated successfully!");
    } catch (error) {
      console.error("Failed to deactivate pod:", error.response || error);
      toast.error(
        `Failed to deactivate pod: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowInactivePods = () => {
    setShowInactivePods(!showInactivePods);
  };

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="content">
            <Container fluid>
              <Row>
                <Col md={12}>
                  <div className="card">
                    <div className="card-header card-header-primary">
                      <h4 className="card-title">Pod Management Dashboard</h4>
                      <p className="card-category">
                        Oversee and manage your pod inventory with ease
                      </p>
                    </div>
                    <div className="card-body">
                      <Button
                        onClick={toggleShowInactivePods}
                        variant="secondary"
                        className="mb-3"
                      >
                        {showInactivePods
                          ? "Hide Inactive Pods"
                          : "Show Inactive Pods"}
                      </Button>
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="text-primary">
                            <tr>
                              {/* <th>ID</th> */}
                              <th>Name</th>
                              <th>Description</th>
                              <th>Status</th>
                              <th>Pod Type</th>
                              <th>Area</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pods
                              .filter(
                                (pod) => showInactivePods || pod.status !== 0
                              )
                              .map((pod) => (
                                <tr key={pod.id}>
                                  {/* <td>{pod.id}</td> */}
                                  <td>{pod.name}</td>
                                  <td>{pod.description}</td>
                                  <td>
                                    <span
                                      className={`badge ${
                                        pod.status === 1
                                          ? "bg-success"
                                          : "bg-warning text-dark"
                                      }`}
                                    >
                                      {pod.status === 1 ? "Active" : "Inactive"}
                                    </span>
                                  </td>
                                  <td>
                                    {
                                      podTypes.find(
                                        (type) => type.id === pod.podTypeId
                                      )?.name
                                    }
                                  </td>
                                  <td>
                                    {
                                      areas.find(
                                        (area) => area.id === pod.areaId
                                      )?.name
                                    }
                                  </td>
                                  <td>
                                    <Button
                                      variant="outline-info"
                                      size="sm"
                                      className="mr-2 btn-modern"
                                      onClick={() => handleOpenEditModal(pod)}
                                    >
                                      <i className="material-icons">edit</i>
                                    </Button>
                                    {pod.status === 1 && (
                                      <Button
                                        variant="outline-warning"
                                        size="sm"
                                        className="btn-modern"
                                        onClick={() =>
                                          handleOpenDeleteModal(pod)
                                        }
                                      >
                                        <i className="material-icons">
                                          power_settings_new
                                        </i>
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col md={12}>
                  <div className="card">
                    <div className="card-header card-header-primary">
                      <h4 className="card-title">Add New Pod</h4>
                      <p className="card-category">
                        Create a new pod entry in your inventory
                      </p>
                    </div>
                    <div className="card-body">
                      <Form onSubmit={handleCreate}>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Pod Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter pod name"
                                className="form-control-modern"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter pod description"
                                className="form-control-modern"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Pod Type</Form.Label>
                              <Form.Control
                                as="select"
                                value={selectedPodType}
                                onChange={handlePodTypeChange}
                                className="form-control-modern"
                              >
                                <option value="">Select Pod Type</option>
                                {podTypes.map((type) => (
                                  <option key={type.id} value={type.id}>
                                    {type.name}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Area</Form.Label>
                              <Form.Control
                                as="select"
                                value={selectedArea}
                                onChange={handleAreaChange}
                                className="form-control-modern"
                              >
                                <option value="">Select Area</option>
                                {areas.map((area) => (
                                  <option key={area.id} value={area.id}>
                                    {area.name}
                                  </option>
                                ))}
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button
                          type="submit"
                          variant="primary"
                          className="mt-3 btn-modern"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating..." : "Create New Pod"}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </div>

      <Modal show={editModalVisible} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Pod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditPod}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control-modern"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control-modern"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Pod Type</Form.Label>
              <Form.Control
                as="select"
                value={selectedPodType}
                onChange={handlePodTypeChange}
                className="form-control-modern"
              >
                {podTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Area</Form.Label>
              <Form.Control
                as="select"
                value={selectedArea}
                onChange={handleAreaChange}
                className="form-control-modern"
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              variant="secondary"
              onClick={handleCloseEditModal}
              className="btn-modern"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="btn-modern"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={deleteModalVisible} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Deactivate Pod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to deactivate the pod "
            {currentPod ? currentPod.name : ""}"?
          </p>
          <Button
            variant="warning"
            onClick={handleDeletePod}
            disabled={isLoading}
            className="btn-modern mr-2"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Deactivating...
              </>
            ) : (
              <>
                <i className="material-icons mr-2">power_settings_new</i>
                Deactivate
              </>
            )}
          </Button>
          <Button
            variant="secondary"
            onClick={handleCloseDeleteModal}
            className="btn-modern"
          >
            Cancel
          </Button>
        </Modal.Body>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Pods;
