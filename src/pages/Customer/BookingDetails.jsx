import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { useLocation } from "react-router-dom";
import { parseISO, format } from "date-fns";

const CustomerBookingDetails = () => {
  const location = useLocation();
  const bookingId = location.state;

  const [booking, setBooking] = useState([]);

  useEffect(() => {
    const getBooking = async () => {
      try {
        // const response = await axios.get(`/Booking/${bookingId}`);
        const response = await axios.get(`/Booking/${bookingId.bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getBooking();
  }, [bookingId]);

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
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
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
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
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
                                  htmlFor="exampleInput2"
                                  className={`bmd-label-floating ${
                                    booking.bookingStatusId === 1
                                      ? "text-danger" // Cancelled
                                      : booking.bookingStatusId === 2
                                      ? "text-warning" // Pending
                                      : booking.bookingStatusId === 3
                                      ? "text-primary" // Reserved
                                      : booking.bookingStatusId === 4
                                      ? "text-success" // On-going
                                      : booking.bookingStatusId === 5
                                      ? "text-info" // Completed
                                      : "text-muted" // Default
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
