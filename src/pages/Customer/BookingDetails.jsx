import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import ProductMenu from "../../components/Customer/ProductMenu";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import { MehOutlined } from "@ant-design/icons";

const CustomerBookingDetails = () => {
  const location = useLocation();
  const bookingId = location.state;
  const navigate = useNavigate();

  const [booking, setBooking] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [transaction, setTransaction] = useState([]);
  const [method, setMethod] = useState({});

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/Products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch selected products
  const fetchSelectedProduct = async () => {
    try {
      const response = await axios.get(
        `/SelectedProduct/Booking/${bookingId.bookingId}`
      );

      // Combine selected products with product details
      const selectedProductsWithDetails = response.data.map(
        (selectedProduct) => {
          const productDetails = products.find(
            (p) => p.id === selectedProduct.productId
          );
          return {
            ...selectedProduct,
            name: productDetails?.name || "Product not found",
            price: selectedProduct.productPrice || productDetails?.price || 0,
            description: productDetails?.description || "",
            unit: productDetails?.unit || "VND",
          };
        }
      );

      setSelectedProducts(selectedProductsWithDetails);
    } catch (error) {
      console.error("Error fetching selected products:", error);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      fetchSelectedProduct();
    }
  }, [bookingId, products]);

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

  // Handle adding products
  const handleAddProducts = async (cartItems) => {
    try {
      for (const item of cartItems) {
        await axios.post("/SelectedProduct", {
          quantity: item.quantity,
          bookingId: bookingId.bookingId,
          productId: item.id,
        });
      }
      fetchSelectedProduct();
    } catch (error) {
      console.error("Error adding products:", error);
    }
  };

  const handleQuantityUpdate = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    setUpdating(true);
    try {
      // Find the current product to get its details
      const currentProduct = selectedProducts.find((p) => p.id === productId);

      if (!currentProduct) {
        throw new Error("Product not found");
      }

      // Make the API call with all required fields
      await axios.put(`/SelectedProduct/${productId}`, {
        quantity: newQuantity,
        productId: currentProduct.productId,
        productPrice: currentProduct.price,
        bookingId: booking.id,
      });

      // Update the local state
      const updatedProducts = selectedProducts.map((product) =>
        product.id === productId
          ? { ...product, quantity: newQuantity }
          : product
      );
      setSelectedProducts(updatedProducts);
      setEditingProduct(null);

      alert("Quantity updated successfully!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Cancel booking function
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/cancel-booking/${bookingId.bookingId}`);
      setShowCancelModal(false);
      alert("Booking has been canceled successfully!");
      navigate("/customer/Bookings");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Error cancelling the booking. Please try again.");
    } finally {
      setCancelLoading(false);
    }
  };

  const navigateToPayment = () => {
    const paymentData = {
      orderType: 'Payment',
      bookingId: booking.id,
      amount: booking.actualPrice,
      userId: booking.userId
    };

    navigate("/customer/SelectPayment", { state: paymentData });
  };

  useEffect(() => {
    const getTransaction = async () => {
      try {
        const response = await axios.get(`/Transaction/booking/${booking.id}`);
        const transactionData = response.data;

        if (transactionData.success && !transactionData.transactionExists) {
          console.log(transactionData.message);
        } else if (transactionData.success && transactionData.transactionExists) {
          console.log(transactionData.transaction);


          setMethod(transactionData.transaction.method);
          console.log(transactionData.transaction.method);
        } else {
          console.error(transactionData.message);
        }
      }
      catch (error) {
        console.error(error);
      };
    };

    getTransaction();
  }, [booking]);
  const getStatusClass = (statusId) => {
    switch (statusId) {
      case 1:
        return "text-danger";
      case 2:
        return "text-warning";
      case 3:
        return "text-primary";
      case 4:
        return "text-success";
      case 5:
        return "text-info";
      default:
        return "text-muted";
    }
  };

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 1:
        return "Cancelled";
      case 2:
        return "Pending";
      case 3:
        return "Reserved";
      case 4:
        return "On-going";
      case 5:
        return "Completed";
      default:
        return "Unknown Status";
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
                  {/* Booking Details Card */}
                  <div className="card">
                    <div className="card-header card-header-rose card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">Booking Details</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">ID</label>
                        <div className="col-sm-10">
                          <span className="form-control-plaintext">
                            {booking.id}
                          </span>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          BOOKING PRICE
                        </label>
                        <div className="col-sm-10">
                          <span className="form-control-plaintext">
                            {booking.bookingPrice?.toLocaleString()} VND
                          </span>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <label className="col-sm-2 col-form-label">
                          STATUS
                        </label>
                        <div className="col-sm-10">
                          <span
                            className={`form-control-plaintext ${getStatusClass(
                              booking.bookingStatusId
                            )}`}
                          >
                            {getStatusText(booking.bookingStatusId)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Slot Details Card */}
                  <div className="card mt-4">
                    <div className="card-header card-header-info card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">Slot Details</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      {booking.bookingDetails?.map((detail, index) => (
                        <div key={detail.id} className="mb-4">
                          <h5 className="font-weight-bold">
                            Slot #{index + 1}
                          </h5>
                          <div className="row">
                            <div className="col-md-4">
                              <p>
                                <strong>Arrival Date:</strong>{" "}
                                {format(
                                  parseISO(detail.slot.arrivalDate),
                                  "MMMM dd, yyyy"
                                )}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p>
                                <strong>Duration:</strong>{" "}
                                {getSchedule(detail.slot.scheduleId)}
                              </p>
                            </div>
                            <div className="col-md-4">
                              <p>
                                <strong>Pod ID:</strong> {detail.slot.podId}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Payment Info</h4>
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <label className="col-sm-2 col-form-label">
                            Payment Method
                          </label>
                          <div className="col-sm-10">
                            <div className="form-group bmd-form-group disabled readonly">
                              <label className="bmd-label-floating text-muted">

                                {method && Object.keys(method).length > 0 ? (
                                  console.log(method),
                                  method.name
                                ) : "No successful payment"}

                              </label>
                            </div>
                          </div>
                        </div>
                        {booking.bookingStatusId === 2 ||
                          booking.bookingStatusId === 3 ? (
                          <button class="btn btn-dribbble"
                            onClick={navigateToPayment}>
                            Select Payment
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {/* Selected Products Table */}
                  <div className="card mt-4">
                    <div className="card-header card-header-info card-header-text">
                      <div className="card-text">
                        <h4 className="card-title">Selected Products</h4>
                      </div>
                    </div>
                    <div className="card-body">
                      {selectedProducts.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Product Name</th>
                                <th>Description</th>
                                <th>Unit Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                {booking.bookingStatusId === 4 && (
                                  <th>Actions</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProducts.map((product) => (
                                <tr key={product.id}>
                                  <td>
                                    <span className="font-weight-medium">
                                      {product.name}
                                    </span>
                                  </td>
                                  <td>
                                    <small className="text-muted">
                                      {product.description ||
                                        "No description available"}
                                    </small>
                                  </td>
                                  <td>{product.price?.toLocaleString()} VND</td>
                                  <td>
                                    {editingProduct === product.id ? (
                                      <div
                                        className="input-group input-group-sm"
                                        style={{ width: "120px" }}
                                      >
                                        <input
                                          type="number"
                                          className="form-control"
                                          defaultValue={product.quantity}
                                          min="1"
                                          ref={(input) =>
                                            input && input.focus()
                                          }
                                          onKeyPress={(e) => {
                                            if (e.key === "Enter") {
                                              handleQuantityUpdate(
                                                product.id,
                                                parseInt(e.target.value)
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                    ) : (
                                      <span className="badge badge-info">
                                        {product.quantity}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <strong>
                                      {(
                                        product.price * product.quantity
                                      ).toLocaleString()}{" "}
                                      VND
                                    </strong>
                                  </td>
                                  {booking.bookingStatusId === 4 && (
                                    <td>
                                      {editingProduct === product.id ? (
                                        <div className="btn-group btn-group-sm">
                                          <button
                                            className="btn btn-success btn-sm"
                                            onClick={(e) => {
                                              const input = e.target
                                                .closest("tr")
                                                .querySelector("input");
                                              const newQuantity = parseInt(
                                                input.value
                                              );
                                              handleQuantityUpdate(
                                                product.id,
                                                newQuantity
                                              );
                                            }}
                                            disabled={updating}
                                          >
                                            {updating ? (
                                              <span
                                                className="spinner-border spinner-border-sm"
                                                role="status"
                                                aria-hidden="true"
                                              ></span>
                                            ) : (
                                              <i className="material-icons">
                                                check
                                              </i>
                                            )}
                                          </button>
                                          <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                              setEditingProduct(null)
                                            }
                                            disabled={updating}
                                          >
                                            <i className="material-icons">
                                              close
                                            </i>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          className="btn btn-info btn-sm"
                                          onClick={() =>
                                            setEditingProduct(product.id)
                                          }
                                        >
                                          <i className="material-icons">edit</i>
                                        </button>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-light">
                                <td colSpan="3" className="text-right">
                                  <strong>Total Items:</strong>
                                </td>
                                <td>
                                  <strong>
                                    {selectedProducts.reduce(
                                      (sum, product) => sum + product.quantity,
                                      0
                                    )}
                                  </strong>
                                </td>
                                <td>
                                  <strong className="text-primary">
                                    {selectedProducts
                                      .reduce(
                                        (total, product) =>
                                          total +
                                          product.price * product.quantity,
                                        0
                                      )
                                      .toLocaleString()}{" "}
                                    VND
                                  </strong>
                                </td>
                                {booking.bookingStatusId === 4 && <td></td>}
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-muted mb-0">
                            No products selected yet.
                          </p>
                          {booking.bookingStatusId === 4 && (
                            <small className="text-muted">
                              You can add products from the menu below.
                            </small>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Product Menu */}
                  {booking.bookingStatusId === 4 && (
                    <ProductMenu
                      booking={booking}
                      onAddProducts={handleAddProducts}
                    />
                  )}

                  {/* Cancel Booking Button */}
                  {(booking.bookingStatusId === 2 ||
                    booking.bookingStatusId === 3) && (
                      <button
                        className="btn btn-danger mt-3"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Booking
                      </button>
                    )}

                  {/* Cancel Booking Modal */}
                  {showCancelModal && (
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
                            <h5 className="modal-title">Cancel Booking</h5>
                            <button
                              type="button"
                              className="close"
                              onClick={() => setShowCancelModal(false)}
                            >
                              <span>&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <p>Are you sure you want to cancel this booking?</p>
                            <p className="text-muted small">
                              This action cannot be undone. All selected
                              products will be removed.
                            </p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowCancelModal(false)}
                            >
                              No, Keep Booking
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={handleCancelBooking}
                              disabled={cancelLoading}
                            >
                              {cancelLoading ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm mr-2"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Cancelling...
                                </>
                              ) : (
                                "Yes, Cancel Booking"
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div >
              </div >
            </div >
          </div >
        </div >
      </div >
    </>
  );
};

export default CustomerBookingDetails;
