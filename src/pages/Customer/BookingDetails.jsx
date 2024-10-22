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
  const [showModal, setShowModal] = useState(false); // for modal visibility
  const [cancelLoading, setCancelLoading] = useState(false); // loading state for cancellation

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

  // Function to get the start and end times of the slots
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

  // Function to cancel the booking
  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await axios.put(`/Booking/cancel-booking/${bookingId.bookingId}`);
      // Handle success: e.g., redirect to another page or show success message
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
