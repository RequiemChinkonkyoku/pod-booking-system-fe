import React, { useState, useEffect } from "react";
import axios from "../../utils/axiosConfig";
import {
  Modal,
  Button,
  Form,
  Container,
  Row,
  Col,
  Pagination,
  Card,
} from "react-bootstrap";
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
  const [filteredPods, setFilteredPods] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [podsPerPage] = useState(5);
  const [filterPodType, setFilterPodType] = useState("");
  const [filterArea, setFilterArea] = useState("");

  const [areaName, setAreaName] = useState("");
  const [areaDesc, setAreaDesc] = useState("");
  const [areaLocation, setAreaLocation] = useState("");

  useEffect(() => {
    fetchPods();
    fetchPodTypes();
    fetchAreas();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [pods, filterPodType, filterArea]);

  const fetchPods = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/Pods");
      console.log("Fetched pods:", response.data);
      const activePods = response.data.filter((pod) => pod.status !== 0);
      const sortedPods = activePods.sort((a, b) => b.id - a.id);
      setPods(sortedPods);
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
    setCurrentPod({ ...pod });
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

  const checkDuplicateName = async (name, id = null) => {
    try {
      const response = await axios.get("/Pods");
      return response.data.some(
        (pod) =>
          pod.name.toLowerCase() === name.toLowerCase() &&
          pod.id !== id &&
          pod.status === 1
      );
    } catch (error) {
      console.error("Failed to check for duplicate names:", error);
      return false;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!name || !description || !selectedPodType || !selectedArea) {
        toast.error("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      const response = await axios.get("/Pods");
      const existingInactivePod = response.data.find(
        (pod) =>
          pod.name.toLowerCase() === name.toLowerCase() && pod.status === 0
      );

      let newPod;
      if (existingInactivePod) {
        const updateResponse = await axios.put(
          `/Pods/${existingInactivePod.id}`,
          {
            name,
            description,
            podTypeId: parseInt(selectedPodType, 10),
            areaId: parseInt(selectedArea, 10),
            status: 1,
          }
        );
        newPod = updateResponse.data;
        toast.success("New pod created successfully!");
      } else {
        const isDuplicate = await checkDuplicateName(name);
        if (isDuplicate) {
          toast.error(
            "An active pod with this name already exists. Please choose a different name."
          );
          setIsLoading(false);
          return;
        }

        const createResponse = await axios.post("/Pods", {
          name,
          description,
          podTypeId: parseInt(selectedPodType, 10),
          areaId: parseInt(selectedArea, 10),
          status: 1,
        });
        newPod = createResponse.data;
        toast.success("New pod created successfully!");
      }

      setPods((prevPods) => [newPod, ...prevPods]);
      setName("");
      setDescription("");
      setSelectedPodType("");
      setSelectedArea("");
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to create/reactivate pod:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      toast.error(
        `Failed to create/reactivate pod: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateArea = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/Areas", {
        name: areaName,
        description: areaDesc,
        location: areaLocation,
      });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPod = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const isDuplicate = await checkDuplicateName(name, currentPod.id);
      if (isDuplicate) {
        toast.error(
          "An active pod with this name already exists. Please choose a different name."
        );
        setIsLoading(false);
        return;
      }

      const response = await axios.put(`/Pods/${currentPod.id}`, {
        name: name || currentPod.name,
        description: description || currentPod.description,
        podTypeId: parseInt(selectedPodType, 10) || currentPod.podTypeId,
        areaId: parseInt(selectedArea, 10) || currentPod.areaId,
        status: currentPod.status,
      });
      console.log("Edit pod response:", response);
      handleCloseEditModal();
      await fetchPods();
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

  const applyFilters = () => {
    let filtered = pods;
    if (filterPodType) {
      filtered = filtered.filter(
        (pod) => pod.podTypeId.toString() === filterPodType
      );
    }
    if (filterArea) {
      filtered = filtered.filter((pod) => pod.areaId.toString() === filterArea);
    }
    setFilteredPods(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "podType") {
      setFilterPodType(value);
    } else if (filterType === "area") {
      setFilterArea(value);
    }
  };

  const resetFilters = () => {
    setFilterPodType("");
    setFilterArea("");
  };

  // Get current pods
  const indexOfLastPod = currentPage * podsPerPage;
  const indexOfFirstPod = indexOfLastPod - podsPerPage;
  const currentPods = filteredPods.slice(indexOfFirstPod, indexOfLastPod);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate pagination items
  const paginationItems = () => {
    const totalPages = Math.ceil(filteredPods.length / podsPerPage);
    let items = [];

    if (totalPages <= 7) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        );
      }
    } else {
      items.push(
        <Pagination.Item
          key={1}
          active={1 === currentPage}
          onClick={() => paginate(1)}
        >
          1
        </Pagination.Item>
      );

      if (currentPage > 3) {
        items.push(<Pagination.Ellipsis key="ellipsis1" />);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let number = start; number <= end; number++) {
        items.push(
          <Pagination.Item
            key={number}
            active={number === currentPage}
            onClick={() => paginate(number)}
          >
            {number}
          </Pagination.Item>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(<Pagination.Ellipsis key="ellipsis2" />);
      }

      items.push(
        <Pagination.Item
          key={totalPages}
          active={totalPages === currentPage}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
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
              <Row className="mb-4">
                <Col md={12}>
                  <Card className="filter-card">
                    <Card.Header className="card-header-primary">
                      <h4 className="card-title">Filter Pods</h4>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={5}>
                          <Form.Group>
                            <Form.Label>Pod Type</Form.Label>
                            <Form.Control
                              as="select"
                              value={filterPodType}
                              onChange={(e) =>
                                handleFilterChange("podType", e.target.value)
                              }
                              className="form-control-modern"
                            >
                              <option value="">All Pod Types</option>
                              {podTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.name}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md={5}>
                          <Form.Group>
                            <Form.Label>Area</Form.Label>
                            <Form.Control
                              as="select"
                              value={filterArea}
                              onChange={(e) =>
                                handleFilterChange("area", e.target.value)
                              }
                              className="form-control-modern"
                            >
                              <option value="">All Areas</option>
                              {areas.map((area) => (
                                <option key={area.id} value={area.id}>
                                  {area.name}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                          <Button
                            variant="outline-primary"
                            onClick={resetFilters}
                            className="w-100 reset-filter-btn"
                          >
                            Reset Filters
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <div className="card">
                    <div className="card-header card-header-primary">
                      <h4 className="card-title">Pod Management Dashboard</h4>
                      <p className="card-category">
                        Oversee and manage your active pod inventory
                      </p>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead className="text-primary">
                            <tr>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Pod Type</th>
                              <th>Area</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentPods.map((pod) => (
                              <tr key={pod.id}>
                                <td>{pod.name}</td>
                                <td>{pod.description}</td>
                                <td>
                                  {
                                    podTypes.find(
                                      (type) => type.id === pod.podTypeId
                                    )?.name
                                  }
                                </td>
                                <td>
                                  {
                                    areas.find((area) => area.id === pod.areaId)
                                      ?.name
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
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    className="btn-modern"
                                    onClick={() => handleOpenDeleteModal(pod)}
                                  >
                                    <i className="material-icons">
                                      power_settings_new
                                    </i>
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="d-flex justify-content-center align-items-center mt-4">
                        <Pagination className="mb-0">
                          <Pagination.First
                            onClick={() => paginate(1)}
                            disabled={currentPage === 1}
                          />
                          <Pagination.Prev
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                          />
                          {paginationItems()}
                          <Pagination.Next
                            onClick={() => paginate(currentPage + 1)}
                            disabled={
                              currentPage ===
                              Math.ceil(filteredPods.length / podsPerPage)
                            }
                          />
                          <Pagination.Last
                            onClick={() =>
                              paginate(
                                Math.ceil(filteredPods.length / podsPerPage)
                              )
                            }
                            disabled={
                              currentPage ===
                              Math.ceil(filteredPods.length / podsPerPage)
                            }
                          />
                        </Pagination>
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

              <Row className="mt-4">
                <Col md={12}>
                  <div className="card">
                    <div className="card-header card-header-primary">
                      <h4 className="card-title">Add New Area</h4>
                      <p className="card-category">Create a new area</p>
                    </div>
                    <div className="card-body">
                      <Form onSubmit={handleCreateArea}>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Area Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={areaName}
                                onChange={(e) => setAreaName(e.target.value)}
                                placeholder="Enter area name"
                                className="form-control-modern"
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Description</Form.Label>
                              <Form.Control
                                type="text"
                                value={areaDesc}
                                onChange={(e) => setAreaDesc(e.target.value)}
                                placeholder="Enter area description"
                                className="form-control-modern"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label>Location</Form.Label>
                              <Form.Control
                                type="text"
                                value={areaLocation}
                                onChange={(e) =>
                                  setAreaLocation(e.target.value)
                                }
                                placeholder="Enter area location"
                                className="form-control-modern"
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Button
                          type="submit"
                          variant="primary"
                          className="mt-3 btn-modern"
                          disabled={isLoading}
                        >
                          {isLoading ? "Creating..." : "Create New Area"}
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
            {currentPod ? currentPod.name : ""}"? This pod will no longer be
            visible in the system.
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
