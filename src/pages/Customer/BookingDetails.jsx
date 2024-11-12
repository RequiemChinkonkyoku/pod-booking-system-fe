import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import ProductMenu from "../../components/Customer/ProductMenu";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../css/CustomerBookingDetails.css";
import { toast, ToastContainer } from "react-toastify";

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
  const [review, setReview] = useState([]);
  const [formReview, setFormReview] = useState({
    rating: 0,
    text: "",
    bookingId: bookingId.bookingId,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [pods, setPods] = useState([]);
  const [podTypes, setPodTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);

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

  // Add these fetch functions after existing useEffects
  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const [podsRes, podTypesRes, areasRes] = await Promise.all([
          axios.get("/Pods"),
          axios.get("/PodType"),
          axios.get("/Areas"),
        ]);
        setPods(podsRes.data);
        setPodTypes(podTypesRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error("Error fetching pod data:", error);
      }
    };
    fetchPodData();
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
      toast.error("Quantity must be at least 1");
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

      toast.success("Quantity updated successfully!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Add this function with your other handlers
  const handleRemoveProduct = async (productId) => {
    try {
      await axios.delete(`/SelectedProduct/${productId}`);
      await fetchSelectedProduct(); // Refresh the list
      toast.success("Product removed successfully");
    } catch (error) {
      console.error("Error removing product:", error);
      toast.error("Failed to remove product");
    }
  };

  // Add handler functions
  const handleRemoveClick = (productId) => {
    setProductToRemove(productId);
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    if (productToRemove) {
      await handleRemoveProduct(productToRemove);
      setShowRemoveModal(false);
      setProductToRemove(null);
    }
  };

  // Update the handleCancelBooking function
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/cancel-booking/${bookingId.bookingId}`);
      setShowCancelModal(false);
      toast.success("Booking canceled successfully!");
      navigate("/customer/Bookings");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking. Please try again."); // Replace alert with toast
    } finally {
      setCancelLoading(false);
    }
  };

  const navigateToPayment = () => {
    const paymentData = {
      orderType: "Payment",
      bookingId: booking.id,
      amount: booking.actualPrice,
      userId: booking.userId,
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
        } else if (
          transactionData.success &&
          transactionData.transactionExists
        ) {
          console.log(transactionData.transaction);

          setMethod(transactionData.transaction.method);
          console.log(transactionData.transaction.method);
        } else {
          console.error(transactionData.message);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTransaction();
  }, [booking]);

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

  const fetchReview = async () => {
    try {
      const response = await axios.get(
        `/Reviews/Booking/${bookingId.bookingId}`
      );
      setReview(response.data);
    } catch (error) {
      // Check if error is due to no existing review (status code 500)
      if (error.response && error.response.status === 500) {
        setReview(null); // Set review to null to show the form
      } else {
        console.error("Error fetching review:", error);
      }
    }
  };

  useEffect(() => {
    fetchReview();
  }, [bookingId]);

  const handleReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Update review
        await axios.put(`/Reviews/${review.id}`, formReview);
      } else {
        // Create new review
        await axios.post("/Reviews", formReview);
      }
      await fetchReview(); // Re-fetch the review to display the latest data
      setIsEditing(false); // Exit editing mode after submission
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Enter editing mode and pre-fill the form with existing review data
  const handleEdit = () => {
    setFormReview({ ...review }); // Populate the form with existing review data
    setIsEditing(true);
  };

  return (
    <div className="app">
      <main className="main-content">
        <div className="content">
          <div className="booking-details-container">
            {/* Left Column: Booking Info */}
            <div className="booking-info-column">
              {/* Booking Summary Card */}
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Booking Summary</h4>
                </div>
                <div className="details-card-body">
                  {/* Pod Information - Show Once */}
                  {booking.bookingDetails?.[0] && (
                    <>
                      {(() => {
                        const detail = booking.bookingDetails[0];
                        const pod = pods.find(
                          (p) => p.id === detail.slot.podId
                        );
                        const podType = podTypes.find(
                          (pt) => pt.id === pod?.podTypeId
                        );
                        const area = areas.find((a) => a.id === pod?.areaId);

                        return (
                          <div className="mb-4">
                            <div className="info-row">
                              <span className="info-label">Pod</span>
                              <span className="info-value">
                                <strong>{pod?.name}</strong> -{" "}
                                {pod?.description}
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Type</span>
                              <span className="info-value">
                                <span className="pod-type-badge">
                                  {podType?.name} -{" "}
                                  {podType?.price.toLocaleString()} VND/hour
                                </span>
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Area</span>
                              <span className="info-value">
                                {area?.name} ({area?.location})
                                <div className="text-muted small">
                                  {area?.description}
                                </div>
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Status</span>
                              <span
                                className={`status-badge status-${getStatusText(
                                  booking.bookingStatusId
                                ).toLowerCase()}`}
                              >
                                {getStatusText(booking.bookingStatusId)}
                              </span>
                            </div>
                            <div className="info-row">
                              <span className="info-label">Price Details</span>
                              <div className="info-value">
                                <div>
                                  Original:{" "}
                                  {booking.bookingPrice?.toLocaleString()} VND
                                </div>
                                <div>Discount: {booking.discount}%</div>
                                <div className="text-primary fw-bold">
                                  Final: {booking.actualPrice?.toLocaleString()}{" "}
                                  VND
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    {booking.bookingStatusId === 2 && (
                      <button
                        className="btn btn-primary"
                        onClick={navigateToPayment}
                      >
                        Proceed to Payment
                      </button>
                    )}
                    {(booking.bookingStatusId === 2 ||
                      booking.bookingStatusId === 3) && (
                      <button
                        className="btn-cancel"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Add this after Booking Summary card in the booking-info-column */}
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Payment Information</h4>
                </div>
                <div className="details-card-body">
                  <div className="info-row">
                    <span className="info-label">Payment Method</span>
                    <span className="info-value">
                      {method && Object.keys(method).length > 0 ? (
                        <span
                          className={`payment-method ${(
                            method.name || ""
                          ).toLowerCase()}`}
                        >
                          {method.name}
                        </span>
                      ) : (
                        <span className="text-muted">
                          No successful payment
                        </span>
                      )}
                    </span>
                  </div>

                  {booking.bookingStatusId === 2 && (
                    <div className="action-buttons">
                      <button
                        className="btn btn-primary"
                        onClick={navigateToPayment}
                      >
                        Select Payment Method
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Slot Details Card */}
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Booking Slots</h4>
                </div>
                <div className="details-card-body">
                  {booking.bookingDetails
                    ?.sort((a, b) => {
                      const scheduleA = timeSlots.find(
                        (slot) => slot.id === a.slot.scheduleId
                      );
                      const scheduleB = timeSlots.find(
                        (slot) => slot.id === b.slot.scheduleId
                      );
                      if (!scheduleA || !scheduleB) return 0;
                      return (
                        new Date(
                          `1970-01-01T${scheduleA.startTime}`
                        ).getTime() -
                        new Date(`1970-01-01T${scheduleB.startTime}`).getTime()
                      );
                    })
                    .map((detail, index) => (
                      <div key={detail.id} className="slot-item">
                        <h5>Slot #{index + 1}</h5>
                        <div className="info-row">
                          <span className="info-label">Date</span>
                          <span className="info-value">
                            {format(
                              parseISO(detail.slot.arrivalDate),
                              "MMMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Time</span>
                          <span className="info-value">
                            {getSchedule(detail.slot.scheduleId)}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Right Column: Products */}
            <div className="product-menu-column">
              {/* Selected Products Card */}
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Selected Products</h4>
                </div>
                <div className="details-card-body">
                  {selectedProducts.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            {(booking.bookingStatusId === 4 ||
                              booking.bookingStatusId === 3) && (
                              <th>Actions</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {selectedProducts.map((product) => (
                            <tr key={product.id}>
                              <td>{product.name}</td>
                              <td>{product.price.toLocaleString()} VND</td>
                              <td>
                                {editingProduct === product.id ? (
                                  <div className="input-group input-group-sm">
                                    <input
                                      type="number"
                                      className="form-control"
                                      defaultValue={product.quantity}
                                      min="1"
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
                                  product.quantity
                                )}
                              </td>
                              <td>
                                {(
                                  product.price * product.quantity
                                ).toLocaleString()}{" "}
                                VND
                              </td>
                              {booking.bookingStatusId === 3 && (
                                <td>
                                  <div className="d-flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline-primary"
                                      onClick={() =>
                                        setEditingProduct(product.id)
                                      }
                                      disabled={updating}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveClick(product.id)
                                      }
                                      disabled={updating}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3" className="text-end">
                              <strong>Total:</strong>
                            </td>
                            <td colSpan="2">
                              <strong>
                                {selectedProducts
                                  .reduce(
                                    (sum, product) =>
                                      sum + product.price * product.quantity,
                                    0
                                  )
                                  .toLocaleString()}{" "}
                                VND
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted text-center my-3">
                      No products selected yet
                    </p>
                  )}
                </div>
              </div>

              {/* Product Menu */}
              {(booking.bookingStatusId === 4 ||
                booking.bookingStatusId === 3) && (
                <ProductMenu
                  booking={booking}
                  onAddProducts={handleAddProducts}
                />
              )}

              <div className="details-card">
                <div className="details-card-header">
                  <h4>{review ? "Your Review" : "Leave a review here"}</h4>
                </div>

                {review && !isEditing ? (
                  // Display the review if it exists and is not in editing mode
                  <div className="details-card-body">
                    <p>Rating: {review.rating}</p>
                    <p>{review.text}</p>
                    <button onClick={handleEdit}>Update Review</button>
                  </div>
                ) : (
                  // Display the form if there is no review or if in editing mode
                  <form onSubmit={handleReview} className="review-form">
                    <label>
                      Rating:
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={formReview.rating}
                        onChange={(e) =>
                          setFormReview({
                            ...formReview,
                            rating: e.target.value,
                          })
                        }
                        required
                      />
                    </label>
                    <label>
                      Review:
                      <textarea
                        value={formReview.text}
                        onChange={(e) =>
                          setFormReview({ ...formReview, text: e.target.value })
                        }
                        required
                      />
                    </label>
                    <button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Submitting..."
                        : isEditing
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Cancel Modal */}
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
                        This action cannot be undone. All selected products will
                        be removed.
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

            {/* Remove Modal */}
            {showRemoveModal && (
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
                      <h5 className="modal-title">Remove Product</h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setShowRemoveModal(false)}
                      >
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to remove this product?</p>
                      <p className="text-muted small">
                        This will remove the product from your booking.
                      </p>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowRemoveModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={confirmRemove}
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm mr-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Removing...
                          </>
                        ) : (
                          "Confirm Remove"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          limit={3}
        />
      </main>
    </div>
  );
};

export default CustomerBookingDetails;
