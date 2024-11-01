import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import axios from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import Head from "../../components/Head";
import Sidebar from "../../components/Staff/Sidebar";
import Navbar from "../../components/Staff/Navbar";
import "../../css/AdminBookingDetails.css";

const StaffBookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state;

  const [booking, setBooking] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingResponse, schedulesResponse] = await Promise.all([
          axios.get(`/Booking/${bookingId.bookingId}`),
          axios.get("/Schedules"),
        ]);
        setBooking(bookingResponse.data);
        setTimeSlots(schedulesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const getSchedule = (scheduleId) => {
    const schedule = timeSlots.find((slot) => slot.id === scheduleId);
    if (schedule) {
      const startTimeFormatted = format(
        parseISO(`1970-01-01T${schedule.startTime}`),
        "hh:mm a"
      );
      const endTimeFormatted = format(
        parseISO(`1970-01-01T${schedule.endTime}`),
        "hh:mm a"
      );
      return `${startTimeFormatted} - ${endTimeFormatted}`;
    }
    return "Loading...";
  };

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/cancel-booking/${bookingId.bookingId}`);
      toast.success("Booking cancelled successfully");
      navigate("/staffAreaBookings");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
    }
  };

  const handleCheckinBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/checkin-booking/${bookingId.bookingId}`);
      toast.success("Booking checked in successfully");
      navigate("/staffAreaBookings");
    } catch (error) {
      console.error("Error checking in booking:", error);
      toast.error("Failed to check in booking");
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
    }
  };

  const handleCheckoutBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/finish-booking/${bookingId.bookingId}`);
      toast.success("Booking checked out successfully");
      navigate("/staffAreaBookings");
    } catch (error) {
      console.error("Error checking out booking:", error);
      toast.error("Failed to checkout booking");
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
    }
  };

  const getStatusText = (statusId) => {
    const statusMap = {
      1: "Cancelled",
      2: "Pending",
      3: "Reserved",
      4: "On-going",
      5: "Completed",
    };
    return statusMap[statusId] || "Unknown Status";
  };

  if (loading) {
    return (
      <>
        <div className="wrapper">
          <Sidebar />
          <div className="main-panel">
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head />
      <div className="wrapper">
        <Sidebar />
        <div className="main-panel">
          <Navbar />
          <div className="content">
            {/* Header Section */}
            <div className="header-section">
              <div className="header-left">
                {/* <button
                  onClick={() => navigate("/admin/bookings")}
                  className="back-button"
                >
                  <i className="material-icons">arrow_back</i>
                  Back to Bookings
                </button> */}
                <h1 className="booking-title">Booking #{booking.id}</h1>
              </div>
              {(booking.bookingStatusId === 2 ||
                booking.bookingStatusId === 3) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="cancel-booking-btn"
                >
                  <i className="material-icons">cancel</i>
                  Cancel Booking
                </button>
              )}
              {booking.bookingStatusId === 3 && (
                <button
                  onClick={() => setShowCheckinModal(true)}
                  className="checkout-booking-btn"
                >
                  <i className="material-icons">check</i>
                  Checkin
                </button>
              )}
              {booking.bookingStatusId === 4 && (
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="checkout-booking-btn"
                >
                  <i className="material-icons">check</i>
                  Checkout
                </button>
              )}
            </div>

            {/* Information Cards Grid */}
            <div className="info-grid">
              {/* Booking Information Card */}
              <div className="info-card">
                <h2 className="card-title">
                  <i className="material-icons">info</i>
                  Booking Information
                </h2>
                <div className="info-item">
                  <span className="info-label">Status</span>
                  <span
                    className={`status-badge status-${getStatusText(
                      booking.bookingStatusId
                    ).toLowerCase()}`}
                  >
                    {getStatusText(booking.bookingStatusId)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Booking Price</span>
                  <span className="info-value price-value">
                    {booking.bookingPrice?.toLocaleString()} VND
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Created Time</span>
                  <span className="info-value">
                    {booking.createdTime
                      ? format(parseISO(booking.createdTime), "PPpp")
                      : "N/A"}
                  </span>
                </div>
              </div>

              {/* Customer Information Card */}
              <div className="info-card">
                <h2 className="card-title">
                  <i className="material-icons">person</i>
                  Customer Information
                </h2>
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">
                    {booking.user.name || "N/A"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">
                    {booking.user.email || "N/A"}
                  </span>
                </div>
                {/* <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">
                    {booking.customerPhone || "N/A"}
                  </span>
                </div> */}
              </div>

              {/* Slot Details Card */}
              <div className="slot-details-card">
                <h2 className="card-title">
                  <i className="material-icons">schedule</i>
                  Slot Details
                </h2>
                <div className="table-container">
                  <table className="slots-table">
                    <thead>
                      <tr>
                        <th>Slot #</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Pod ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {booking.bookingDetails?.map((detail, index) => (
                        <tr key={detail.id}>
                          <td>{index + 1}</td>
                          <td>
                            {format(parseISO(detail.slot.arrivalDate), "PPP")}
                          </td>
                          <td>{getSchedule(detail.slot.scheduleId)}</td>
                          <td>{detail.slot.podId}</td>
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

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Cancel Booking</h3>
            <p className="modal-message">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelModal(false)}
                className="modal-cancel-btn"
                disabled={cancelLoading}
              >
                No, Keep it
              </button>
              <button
                onClick={handleCancelBooking}
                className="modal-confirm-btn"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <div className="spinner-small"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <i className="material-icons">cancel</i>
                    Yes, Cancel
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkin Confirmation Modal */}
      {showCheckinModal && (
        <div className="checkin-modal-overlay">
          <div className="checkin-modal-content">
            <h3 className="checkin-modal-title">Checkin</h3>
            <p className="checkin-modal-message">Are you ready to check out?</p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCheckinModal(false)}
                className="modal-cancel-btn"
                disabled={cancelLoading}
              >
                Not yet
              </button>
              <button
                onClick={handleCheckinBooking}
                className="checkin-modal-confirm-btn"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <div className="spinner-small"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <i className="material-icons">check</i>
                    Yes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Confirmation Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay">
          <div className="checkout-modal-content">
            <h3 className="checkout-modal-title">Checkout</h3>
            <p className="checkout-modal-message">
              Are you ready to check out?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="modal-cancel-btn"
                disabled={cancelLoading}
              >
                Not yet
              </button>
              <button
                onClick={handleCheckoutBooking}
                className="checkout-modal-confirm-btn"
                disabled={cancelLoading}
              >
                {cancelLoading ? (
                  <>
                    <div className="spinner-small"></div>
                    Cancelling...
                  </>
                ) : (
                  <>
                    <i className="material-icons">check</i>
                    Yes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StaffBookingDetails;
