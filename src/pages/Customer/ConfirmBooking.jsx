import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { format, differenceInHours, parse } from "date-fns";

const ConfirmBooking = () => {
  const location = useLocation();
  const bookingData = location.state;
  const navigate = useNavigate(); // For navigation after booking

  const [pod, setPod] = useState([]);
  const [podType, setPodType] = useState([]);
  const [time, setTime] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false); // State for checkbox

  useEffect(() => {
    const getPod = async () => {
      try {
        const response = await axios.get(`/Pods/${bookingData.podId}`);
        const podData = response.data;
        setPod(podData);

        const podTypeResponse = await axios.get(
          `/PodType/${podData.podTypeId}`
        );
        setPodType(podTypeResponse.data);

        const getTime = await axios.post(
          "/Schedules/Ids",
          bookingData.scheduleId
        );
        setTime(getTime.data);
      } catch (error) {
        console.error("Error fetching pod or pod type:", error);
      }
    };

    getPod();
  }, [bookingData.podId]);

  // Function to handle booking submission
  const handleBooking = async () => {
    try {
      // Construct the request body
      const bookingPayload = {
        arrivalDate: bookingData.arrivalDate,
        podId: bookingData.podId,
        scheduleIds: bookingData.scheduleId,
      };

      // Send POST request to /Booking/create-booking
      const response = await axios.post(
        "/Booking/create-booking",
        bookingPayload
      );

      // Handle the success response (e.g., navigate to confirmation page)
      if (response.status === 200) {
        alert("Booking successful!"); // You can replace this with better UX
        navigate("/booking-confirmation"); // Navigate to a confirmation page (adjust path as needed)
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("There was an error while creating the booking.");
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
                  <div className="col-md-7">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">
                            Confirm booking details
                          </h4>
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
                              POD
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
                                  {pod.name}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              POD TYPE
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
                                  {podType.name}
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
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
                                  {format(
                                    bookingData.arrivalDate,
                                    "EEEE, MMMM do, yyyy"
                                  )}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              START TIME
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label
                                  htmlFor="exampleInput2"
                                  className="bmd-label-floating text-muted"
                                >
                                  {time.startTime
                                    ? format(
                                        parse(
                                          time.startTime,
                                          "HH:mm:ss",
                                          new Date()
                                        ),
                                        "hh:mm a"
                                      )
                                    : "Loading..."}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              END TIME
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {time.startTime
                                    ? format(
                                        parse(
                                          time.endTime,
                                          "HH:mm:ss",
                                          new Date()
                                        ),
                                        "hh:mm a"
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
                  <div className="col-md-5">
                    <div className="card">
                      <div className="card-header card-header-rose card-header-text">
                        <div className="card-text">
                          <h4 className="card-title">Confirm payment</h4>
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
                              POD PRICE
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {podType.price} VND per HOUR
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
                                  {differenceInHours(
                                    new Date(`1970-01-01T${time.endTime}`),
                                    new Date(`1970-01-01T${time.startTime}`)
                                  )}{" "}
                                  HOUR(S)
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <label className="col-sm-2 col-form-label">
                              TOTAL
                            </label>
                            <div className="col-sm-10">
                              <div className="form-group bmd-form-group disabled readonly">
                                <label className="bmd-label-floating text-muted">
                                  {podType.price *
                                    differenceInHours(
                                      new Date(`1970-01-01T${time.endTime}`),
                                      new Date(`1970-01-01T${time.startTime}`)
                                    )}{" "}
                                  VND
                                </label>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div class="row">
                          <br />
                        </div>
                        <div className="col-md-3 ml-auto">
                          <div className="form-check">
                            <label className="form-check-label">
                              CONFIRM
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onChange={(e) =>
                                  setIsConfirmed(e.target.checked)
                                } // Store checkbox value
                              />
                              <span className="form-check-sign">
                                <span className="check"></span>
                              </span>
                            </label>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-rose"
                          disabled={!isConfirmed} // Disable button if not confirmed
                          onClick={handleBooking} // Call handleBooking when clicked
                        >
                          BOOK
                        </button>
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

export default ConfirmBooking;
