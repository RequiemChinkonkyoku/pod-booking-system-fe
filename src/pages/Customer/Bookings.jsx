import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { parse, format } from "date-fns";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await axios.get("/Booking/customer");
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserBookings();
  }, []);

  // handleSubmit now accepts bookingId and transfers it via navigate
  const handleSubmit = (bookingId) => {
    navigate("/customerBookingDetails", { state: { bookingId } });
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
                    <div className="card">
                      <div className="card-header card-header-icon card-header-rose">
                        <div className="card-icon">
                          <i className="material-icons">date_range</i>
                        </div>
                        <h4 className="card-title">Your bookings</h4>
                      </div>
                      <div className="card-body table-full-width table-hover">
                        <div className="table-responsive">
                          <table className="table">
                            {/* Table Head */}
                            <thead>
                              <tr>
                                <th className="text-center">#</th>
                                <th>Arrival Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Status</th>
                                <th>Pod Type</th>
                                <th className="text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bookings.map((booking) => (
                                <tr
                                  className={`${
                                    booking.statusId === 1
                                      ? "table-danger" // Cancelled
                                      : booking.statusId === 2
                                      ? "table-warning" // Pending
                                      : booking.statusId === 3
                                      ? "table-primary" // Reserved
                                      : booking.statusId === 4
                                      ? "table-success" // On-going
                                      : booking.statusId === 5
                                      ? "table-info" // Completed
                                      : "table-dark" // Default
                                  } `}
                                  key={booking.bookingId}
                                >
                                  <td className="text-center">
                                    {booking.bookingId}
                                  </td>
                                  <td>
                                    {format(
                                      new Date(booking.arrivalDate),
                                      "do MMM, yyyy"
                                    )}
                                  </td>
                                  <td>
                                    {format(
                                      parse(
                                        booking.startTime,
                                        "HH:mm:ss",
                                        new Date()
                                      ),
                                      "hh:mm a"
                                    )}
                                  </td>
                                  <td>
                                    {format(
                                      parse(
                                        booking.endTime,
                                        "HH:mm:ss",
                                        new Date()
                                      ),
                                      "hh:mm a"
                                    )}
                                  </td>
                                  <td>
                                    {booking.statusId === 1
                                      ? "Cancelled"
                                      : booking.statusId === 2
                                      ? "Pending"
                                      : booking.statusId === 3
                                      ? "Reserved"
                                      : booking.statusId === 4
                                      ? "Ongoing"
                                      : booking.statusId === 5
                                      ? "Completed"
                                      : "N/A"}
                                  </td>
                                  <td>{booking.podTypeName}</td>
                                  <td className="td-actions text-right">
                                    <button
                                      type="button"
                                      className="btn btn-success"
                                      onClick={() =>
                                        handleSubmit(booking.bookingId)
                                      } // Pass bookingId to handleSubmit
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
      </body>
    </>
  );
};

export default CustomerBookings;
