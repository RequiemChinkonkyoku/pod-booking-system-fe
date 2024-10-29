import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";

const CustomerBookingDetails = () => {
  const location = useLocation();
  const bookingId = location.state;
  const navigate = useNavigate();

  const [booking, setBooking] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // state for selected products
  const [newProduct, setNewProduct] = useState({ quantity: 1, productId: "" }); // state for adding a new product
  const [showModal, setShowModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [updateProductId, setUpdateProductId] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

  // Fetch booking details
  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await axios.get(`/Booking/${bookingId.bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getBooking();
  }, [bookingId]);

  // Fetch schedules
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axios.get("/Schedules");
        setTimeSlots(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };
    fetchSchedules();
  }, []);

  // Fetch selected products
  useEffect(() => {
    fetchSelectedProduct();
  }, [bookingId]);
  const fetchSelectedProduct = async () => {
    try {
      const response = await axios.get(
        `/SelectedProduct/Booking/${bookingId.bookingId}`
      );
      setSelectedProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching selected products:", error);
    }
  };
  const handleAddProduct = async (quantity, productId) => {
    try {
      await axios.post("/SelectedProduct", {
        quantity,
        bookingId: booking.id,
        productId,
      });
      fetchSelectedProducts();
    } catch (error) {
      console.error("Error adding selected product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/SelectedProduct/${deleteProductId}`);
      fetchSelectedProducts();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`/SelectedProduct/${updateProductId}`, {
        quantity: newQuantity,
        productId: updateProductId,
      });
      fetchSelectedProducts();
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Helper function to format time slots
  const getSchedule = (scheduleId) => {
    const schedule = timeSlots.find((slot) => slot.id === scheduleId);
    if (schedule) {
      const startTimeFormatted = format(
        new Date(`1970-01-01T${schedule.startTime}`),
        "hh:mm a"
      );
      const endTimeFormatted = format(
        new Date(`1970-01-01T${schedule.endTime}`),
        "hh:mm a"
      );
      return `${startTimeFormatted} - ${endTimeFormatted}`;
    }
    return "Loading...";
  };

  // Cancel booking function
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/cancel-booking/${bookingId.bookingId}`);
      setShowModal(false);
      alert("Booking has been canceled successfully!");
      navigate("/customer/Bookings");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling the booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <>
      <Head />
      <body>
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel ps-container ps-theme-default">
            <Navbar />
            <div className="content">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12">
                    {/* Booking Details */}
                    <div className="card">
                      <div className="card-header card-header-rose card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Booking details</h4>
                        </div>
                      </div>
                      <div className="card-body">
                        <form
                          method="get"
                          action="/"
                          className="form-horizontal"
                        >
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              ID
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {booking.id}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              BOOKING PRICE
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {booking.bookingPrice} VND
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              BOOKING STATUS
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label
                                  className={`bmd-label-floating ${
                                    booking.bookingStatusId === 1
                                      ? "text-danger"
                                      : booking.bookingStatusId === 2
                                      ? "text-warning"
                                      : booking.bookingStatusId === 3
                                      ? "text-primary"
                                      : booking.bookingStatusId === 4
                                      ? "text-success"
                                      : booking.bookingStatusId === 5
                                      ? "text-info"
                                      : "text-muted"
                                  }`}
                                >
                                  {booking.bookingStatusId === 1
                                    ? "Cancelled"
                                    : booking.bookingStatusId === 2
                                    ? "Pending"
                                    : booking.bookingStatusId === 3
                                    ? "Reserved"
                                    : booking.bookingStatusId === 4
                                    ? "On-going"
                                    : booking.bookingStatusId === 5
                                    ? "Completed"
                                    : "Unknown Status"}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              CREATED TIME
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {booking.createdTime
                                    ? format(
                                        parseISO(booking.createdTime),
                                        "hh:mm:ss a, MMMM dd, yyyy"
                                      )
                                    : "Loading..."}
                                </label>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Slot Details */}
                    <div className="card">
                      <div className="card-header card-header-info card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Slot details</h4>
                        </div>
                      </div>
                      <div className="card-body">
                        {booking.bookingDetails?.length > 0 ? (
                          booking.bookingDetails.map((detail, index) => (
                            <div key={detail.id} className="mb-4">
                              <div className="row">
                                <label className="col-sm-2 col-form-label">
                                  SLOT #{index + 1}
                                </label>
                                <div className="col-sm-10">
                                  <div className="form-group bmd-form-group disabled readonly">
                                    <label className="bmd-label-floating text-muted">
                                      {/* ID: {detail.slot.id} */}
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <label className="col-sm-2 col-form-label">
                                  ARRIVAL DATE
                                </label>
                                <div className="col-sm-10">
                                  <div className="form-group bmd-form-group disabled readonly">
                                    <label className="bmd-label-floating text-muted">
                                      {format(
                                        parseISO(detail.slot.arrivalDate),
                                        "MMMM dd, yyyy"
                                      )}
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <label className="col-sm-2 col-form-label">
                                  DURATION
                                </label>
                                <div className="col-sm-10">
                                  <div className="form-group bmd-form-group disabled readonly">
                                    <label className="bmd-label-floating text-muted">
                                      {getSchedule(detail.slot.scheduleId)}
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <label className="col-sm-2 col-form-label">
                                  POD ID
                                </label>
                                <div className="col-sm-10">
                                  <div className="form-group bmd-form-group disabled readonly">
                                    <label className="bmd-label-floating text-muted">
                                      {detail.slot.podId}
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No slot details available.</p>
                        )}
                      </div>
                    </div>
                    {/* Selected Products Table */}
                    <div className="card">
                      <div className="card-header card-header-info card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Selected Products</h4>
                        </div>
                      </div>
                      <div className="card-body">
                        {selectedProducts.length > 0 ? (
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Product ID</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProducts.map((product) => (
                                <tr key={product.id}>
                                  <td>{product.productId}</td>
                                  <td>{product.quantity}</td>
                                  <td>
                                    <button
                                      className="btn btn-danger btn-sm"
                                      onClick={() => {
                                        setDeleteProductId(product.id);
                                        setShowDeleteModal(true);
                                      }}
                                    >
                                      Delete
                                    </button>
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => {
                                        setUpdateProductId(product.id);
                                        setNewQuantity(product.quantity);
                                        setShowUpdateModal(true);
                                      }}
                                    >
                                      Update
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <p>No selected products available.</p>
                        )}
                      </div>
                    </div>

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Delete Product</h5>
                              <button
                                type="button"
                                className="close"
                                onClick={() => setShowDeleteModal(false)}
                              >
                                <span>&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <p>
                                Are you sure you want to delete this product?
                              </p>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowDeleteModal(false)}
                              >
                                No
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleDeleteProduct}
                              >
                                Yes, Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Update Quantity Modal */}
                    {showUpdateModal && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Update Quantity</h5>
                              <button
                                type="button"
                                className="close"
                                onClick={() => setShowUpdateModal(false)}
                              >
                                <span>&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <label>New Quantity:</label>
                              <input
                                type="number"
                                className="form-control"
                                value={newQuantity}
                                onChange={(e) => setNewQuantity(e.target.value)}
                              />
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowUpdateModal(false)}
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleUpdateProduct}
                              >
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Add Selected Product Form */}
                    <div className="card">
                      <div className="card-header card-header-rose card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Add Product to Booking</h4>
                        </div>
                      </div>
                      <form
                        onSubmit={handleAddProduct}
                        className="form-horizontal"
                      >
                        <div className="card-body">
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Product ID
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={newProduct.productId}
                                  onChange={(e) =>
                                    setNewProduct({
                                      ...newProduct,
                                      productId: e.target.value,
                                    })
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              Quantity
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group">
                                <input
                                  type="number"
                                  className="form-control"
                                  value={newProduct.quantity}
                                  onChange={(e) =>
                                    setNewProduct({
                                      ...newProduct,
                                      quantity: e.target.value,
                                    })
                                  }
                                  min="1"
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer">
                          <button
                            type="submit"
                            className="btn btn-fill btn-rose"
                          >
                            Add Product
                          </button>
                        </div>
                      </form>
                    </div>
                    {/* Cancel Booking Button */}
                    {booking.bookingStatusId === 2 ||
                    booking.bookingStatusId === 3 ? (
                      <button
                        className="btn btn-danger"
                        onClick={() => setShowModal(true)}
                      >
                        Cancel Booking
                      </button>
                    ) : null}

                    {/* Modal for Cancel Confirmation */}
                    {showModal && (
                      <div
                        className="modal fade show"
                        tabIndex="-1"
                        role="dialog"
                        style={{
                          display: "block",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      >
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Cancel Booking</h5>
                              <button
                                type="button"
                                className="close"
                                onClick={() => setShowModal(false)}
                              >
                                <span>&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <p>
                                Are you sure you want to cancel this booking?
                              </p>
                            </div>
                            <div className="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                              >
                                No
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleCancelBooking}
                                disabled={cancelLoading}
                              >
                                {cancelLoading
                                  ? "Cancelling..."
                                  : "Yes, Cancel"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
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

export default CustomerBookingDetails;
