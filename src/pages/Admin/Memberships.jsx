import axios from "../../utils/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";
import { useAuth } from "../../contexts/AuthContext";

import Navbar from "../../components/Admin/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Admin/Sidebar";
import { Modal, Button } from "react-bootstrap";
import { SquareBottomDashedScissors } from "lucide-react";

const Memberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [currentMembership, setCurrentMembership] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pointsRequirement, setPointsRequirement] = useState("");

    useEffect(() => {
        getMembership();
    }, []);

    const getMembership = async () => {
        const response = await axios.get("/Membership");
        console.log(response.data);
        setMemberships(response.data);
    };

    const handleOpenEditModal = (membership) => {
        setCurrentMembership(membership);
        setEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setCurrentMembership(null);
        setEditModalVisible(false);
    };

    const handleOpenDeleteModal = (membership) => {
        setCurrentMembership(membership);
        setDeleteModalVisible(true);
    };

    const handleCloseDeleteModal = () => {
        setCurrentMembership(null);
        setDeleteModalVisible(false);
    };

    const handleEditMembership = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/Membership/${currentMembership.id}`, {
                name: currentMembership.name,
                description: currentMembership.description,
                discount: currentMembership.discount,
                pointsRequirement: currentMembership.pointsRequirement
            });
            handleCloseEditModal();
            axios.get("/Membership").then((response) => {
                setMemberships(response.data);
            });
        } catch (error) {
            console.error("Failed to update membership:", error);
        }
    };

    const handleDeleteMembership = async () => {
        try {
            await axios.put(`/Membership/toggle/${currentMembership.id}`);
            handleCloseDeleteModal();
            axios.get("/Membership").then((response) => {
                setMemberships(response.data);
            });
        } catch (error) {
            console.error("Failed to toggle membership:", error);
        }
    };

    const handleCreateMembership = async (e) => {
        e.preventDefault();

        const createData = {
            name: name,
            description: description,
            discount: discount,
            pointsRequirement: pointsRequirement
        };

        try {
            await axios.post("/Membership", createData);
            setName("");
            setDescription("");
            setDiscount("");
            setPointsRequirement("");
            axios.get("/Membership").then((response) => {
                setMemberships(response.data);
            });
        } catch (error) {
            console.error("Failed to create Membership:", error);
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
                                                <i className="material-icons">card_membership</i>
                                            </div>
                                            <h4 className="card-title">Memberships</h4>
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
                                                            <th>Discount</th>
                                                            <th>Points Requirement</th>
                                                            <th className="text-right">Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {memberships.map((membership) => (
                                                            <tr key={membership.id}>
                                                                <td className="text-center">{membership.id}</td>
                                                                <td>{membership.name}</td>
                                                                <td>{membership.description}</td>
                                                                <td>{membership.status}</td>
                                                                <td>{membership.discount}</td>
                                                                <td>{membership.pointsRequirement}</td>
                                                                <td className="td-actions text-right">
                                                                    {/* Edit Button */}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success"
                                                                        onClick={() => handleOpenEditModal(membership)}
                                                                    >
                                                                        <i className="material-icons">edit</i>
                                                                    </button>
                                                                    {/* Delete Button */}
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={() =>
                                                                            handleOpenDeleteModal(membership)
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

                        <div className="row">
                            <div className="col-md-12">
                                <div className="card">
                                    <div className="card-header card-header-rose card-header-text">
                                        <div className="card-text">
                                            <h4 className="card-title">CREATE NEW MEMBERSHIP</h4>
                                        </div>
                                    </div>
                                    <form
                                        role="form"
                                        onSubmit={handleCreateMembership}
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
                                                            onChange={(e) =>
                                                                setName(e.target.value)
                                                            }
                                                            required
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
                                                            onChange={(e) =>
                                                                setDescription(e.target.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">
                                                    Discount
                                                </label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={discount}
                                                            onChange={(e) =>
                                                                setDiscount(e.target.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">
                                                    Points Requirement
                                                </label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group">
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={pointsRequirement}
                                                            onChange={(e) =>
                                                                setPointsRequirement(e.target.value)
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <button type="submit" className="btn btn-fill btn-rose">
                                                Create Membership
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <Modal show={editModalVisible} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Membership</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditMembership}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMembership?.name || ""}
                                onChange={(e) =>
                                    setCurrentMembership({
                                        ...currentMembership,
                                        name: e.target.value
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMembership?.description || ""}
                                onChange={(e) =>
                                    setCurrentMembership({
                                        ...currentMembership,
                                        description: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                className="form-control"
                                value={currentMembership?.status || ""}
                                onChange={(e) =>
                                    setCurrentMembership({
                                        ...currentMembership,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Discount</label>
                            <input
                                type="number"
                                className="form-control"
                                value={currentMembership?.discount || "0"}
                                onChange={(e) =>
                                    setCurrentMembership({
                                        ...currentMembership,
                                        discount: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Points Requiement</label>
                            <input
                                type="text"
                                className="form-control"
                                value={currentMembership?.pointsRequirement || "0"}
                                onChange={(e) =>
                                    setCurrentMembership({
                                        ...currentMembership,
                                        pointsRequirement: e.target.value
                                    })
                                }
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
                    <Modal.Title>Toggle Membership</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Are you sure you want to {currentMembership ? (currentMembership.status == "1" ? "disable" : "enable") : ("")} the membership{" "} {currentMembership ? currentMembership.name : ""}?
                    </p>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Cancel
                    </Button>
                    <Button
                        variant={currentMembership ? (currentMembership.status == "1" ? "danger" : "success") : ("")}
                        onClick={handleDeleteMembership}>
                        {currentMembership ? (currentMembership.status == "1" ? "Disable" : "Enable") : ("")}
                    </Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Memberships;