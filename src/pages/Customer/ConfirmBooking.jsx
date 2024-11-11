import axios from "../../utils/axiosConfig";
import React, { useState, useEffect, useInsertionEffect } from "react";
// import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../../css/ConfirmBooking.css";

// import Navbar from "../../components/Customer/Navbar";
// import Head from "../../components/Head";
// import Sidebar from "../../components/Customer/Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import { format, differenceInHours, parse } from "date-fns";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmBooking = () => {
  const location = useLocation();
  const bookingData = location.state;
  const navigate = useNavigate();

  const [pod, setPod] = useState([]);
  const [podType, setPodType] = useState([]);
  const [time, setTime] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [discount, setDiscount] = useState(null);
  const [actualPrice, setActualPrice] = useState(null);

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

  useEffect(() => {
    const getMember = async () => {
      try {
        const response = await axios.get('/Membership/customer');
        const discount = response.data.discount;
        setDiscount(discount);
      } catch (error) {
        console.log("Error getting membership");
      }
    }

    getMember();
  }, []);

  useEffect(() => {
    const getActualPrice = () => {
      const totalTime = differenceInHours(
        new Date(`1970-01-01T${time.endTime}`),
        new Date(`1970-01-01T${time.startTime}`));
      const totalPrice = podType.price * totalTime;

      const discountedPrice = discount === 0 ? totalPrice : totalPrice * (1 - discount / 100);
      setActualPrice(discountedPrice);
    };

    getActualPrice();
  }, [time, podType, actualPrice]);

  const handleBooking = async () => {
    try {
      const bookingPayload = {
        arrivalDate: bookingData.arrivalDate,
        podId: bookingData.podId,
        scheduleIds: bookingData.scheduleId,
      };

      const response = await axios.post(
        "/Booking/create-booking",
        bookingPayload
      );

      if (response.status === 200) {
        toast.success("Booking successful!");

        const paymentData = {
          orderType: 'Payment',
          bookingId: response.data.id,
          amount: actualPrice,
          userId: response.data.userId
        };

        navigate("/customer/SelectPayment", { state: paymentData });
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  return (
    <div className="app">
      <main className="main-content">
        <div className="content">
          <div className="booking-details-container">
            {/* Left Column: Booking Details */}
            <div className="booking-info-column">
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Booking Details</h4>
                </div>
                <div className="details-card-body">
                  <div className="info-row">
                    <span className="info-label">Pod</span>
                    <span className="info-value">
                      <strong>{pod.name}</strong>
                      <div className="text-muted small">{pod.description}</div>
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Pod Type</span>
                    <span className="info-value">
                      <span className="pod-type-badge">
                        {podType.name} - {podType.price?.toLocaleString()} VND/hour
                      </span>
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Date</span>
                    <span className="info-value">
                      {format(bookingData.arrivalDate, "EEEE, MMMM do, yyyy")}
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Time</span>
                    <span className="info-value">
                      {time.startTime ? (
                        <>
                          {format(parse(time.startTime, "HH:mm:ss", new Date()), "hh:mm a")} - 
                          {format(parse(time.endTime, "HH:mm:ss", new Date()), "hh:mm a")}
                        </>
                      ) : (
                        "Loading..."
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Payment Summary */}
            <div className="product-menu-column">
              <div className="details-card">
                <div className="details-card-header">
                  <h4>Payment Summary</h4>
                </div>
                <div className="details-card-body">
                  <div className="info-row">
                    <span className="info-label">Price per Hour</span>
                    <span className="info-value">
                      {podType.price?.toLocaleString()} VND
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Duration</span>
                    <span className="info-value">
                      {differenceInHours(
                        new Date(`1970-01-01T${time.endTime}`),
                        new Date(`1970-01-01T${time.startTime}`)
                      )} hour(s)
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Total</span>
                    <span className="info-value">
                      {(podType.price * 
                        differenceInHours(
                          new Date(`1970-01-01T${time.endTime}`),
                          new Date(`1970-01-01T${time.startTime}`)
                        ))?.toLocaleString()} VND
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Discount</span>
                    <span className="info-value status-badge">
                      {discount}%
                    </span>
                  </div>

                  <div className="info-row">
                    <span className="info-label">Final Price</span>
                    <span className="info-value price-display text-primary fw-bold">
                      {actualPrice !== null ? `${actualPrice?.toLocaleString()} VND` : "Calculating..."}
                    </span>
                  </div>

                  <div className="confirmation-section">
                    <div className="confirm-checkbox">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          onChange={(e) => setIsConfirmed(e.target.checked)}
                        />
                        <span>I confirm the booking details</span>
                      </label>
                    </div>

                    <button
                      className="btn btn-primary w-100 mt-4"
                      disabled={!isConfirmed}
                      onClick={handleBooking}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
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

export default ConfirmBooking;
