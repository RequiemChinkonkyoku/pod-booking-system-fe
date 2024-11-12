import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

const SelectPayment = () => {
  const location = useLocation();
  const paymentData = location.state;
  const navigate = useNavigate();

  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const getMethods = async () => {
      try {
        const response = await axios.get("/Method");
        console.log(response.data);
        setMethods(response.data);
      } catch (error) {
        console.log("Error getting methods:", error);
      }
    };
    getMethods();
  }, []);

  const handlePaymentSelect = async (methodId) => {
    const { orderType, bookingId, amount, userId } = paymentData;

    switch (methodId) {
      case 1: {
        // MoMo Payment
        try {
          const response = await axios.post("/Momo/create-payment", {
            bookingId,
            amount,
          });
          const paymentUrl = response.data.momoPaymentResponse.payUrl;
          console.log(paymentUrl);
          window.location.href = paymentUrl;
        } catch (error) {
          console.log("Error creating MoMo payment", error);
        }
        break;
      }
      case 2: {
        // VnPay Payment
        try {
          const response = await axios.post("/VnPay", {
            orderType,
            amount,
            bookingId,
            userId,
          });
          const paymentUrl = response.data;
          console.log(paymentUrl);
          window.location.href = paymentUrl;
        } catch (error) {
          console.log("Error creating VnPay payment", error);
        }
        break;
      }
      default: {
        // Cash Payment
        const userChoice = window.confirm(
          "Choosing cash has a chance of getting your booking taken. Do you want to proceed?"
        );
        if (userChoice) {
          alert("Payment method selected.");
          navigate("/customer/Bookings");
        } else {
          alert("Payment method not selected");
        }
        break;
      }
    }
  };

  return (
    <>
      <Head />
      <body class="off-canvas-sidebar">
        <div class="wrapper wrapper-full-page">
          <div
            class="page-header pricing-page header-filter"
            style={{
              backgroundImage:
                "url(https://framery.com/wp-content/uploads/2024/03/framery-four-smart-meeting-pod-mobile-hero-1.jpg)",
              backgroundSize: "cover", // Optional: covers the entire div
              backgroundPosition: "center", // Optional: positions the image centrally
              height: "100vh", // Optional: makes the div fill the viewport height
            }}
          >
            <div
              style={{
                position: "absolute", // Position it over the background image
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay with opacity
                zIndex: 1, // Ensures it's behind the text and other content
              }}
            ></div>
            <div className="container">
              <div className="row">
                <div className="col-md-8 ml-auto mr-auto text-center">
                  <h2 className="title">Pick your preferred payment method</h2>
                  <h5 className="description">
                    You can choose to pay a deposit online or pay with cash with
                    a pending state.
                  </h5>
                </div>
              </div>
              <div className="row justify-content-center">
                {methods.length === 0 ? (
                  <p>Loading methods...</p>
                ) : (
                  methods.map((method) => (
                    <div className="col-lg-3 cards" key={method.id}>
                      <div className="card card-pricing card-raised card-plain">
                        <div className="card-body">
                          <h6 className="card-category">{method.name}</h6>
                          <div className="card-icon icon-rose">
                            <i className="material-icons">payment</i>
                          </div>
                          <h3 className="card-title justify-content-center">
                            {method.name}
                          </h3>
                          <p className="card-description">
                            This payment uses {method.name} for transactions.
                          </p>
                          <button
                            className="btn btn-rose btn-round"
                            onClick={() => handlePaymentSelect(method.id)}
                          >
                            Choose Method
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default SelectPayment;
