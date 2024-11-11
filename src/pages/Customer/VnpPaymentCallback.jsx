import axios from "../../utils/axiosConfig";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

const VnpPaymentCallback = () => {
    const [paymentResponse, setPaymentResponse] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        function PaymentCallback() {
            const queryParams = new URLSearchParams(window.location.search);
            const queryObject = Object.fromEntries(queryParams.entries());

            Object.keys(queryObject).forEach(key => {
                sessionStorage.setItem(key, queryObject[key]);
            });
        }

        PaymentCallback();
    }, []);

    useEffect(() => {
        const executePayment = async () => {
            const queryObject = {};

            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                queryObject[key] = sessionStorage.getItem(key);
            }

            try {
                const response = await axios.post("/VnPay/payment-callback", null, { params: queryObject });
                console.log("Payment execute response", response.data);
                setPaymentResponse(response.data);
            } catch (error) {
                console.error("There has been an error.", error);
            }
        };

        executePayment();
    }, []);

    const navigateToList = () => {
        navigate("/customer/Bookings");
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
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header card-header-icon card-header-rose">
                                            <div class="card-icon">
                                                <i class="material-icons">payment</i>
                                            </div>
                                            <h4 class="card-title ">Payment Info</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">Status</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.success ? "Success" : "Failure"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">Message</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.message || "N/A"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">Booking ID</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.bookingId || "N/A"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">Order ID</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.orderId || "N/A"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <label className="col-sm-2 col-form-label">Amount</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.amount ? `${paymentResponse.amount} VND` : "N/A"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="row">
                                                <label className="col-sm-2 col-form-label">Order Info</label>
                                                <div className="col-sm-10">
                                                    <div className="form-group bmd-form-group disabled readonly">
                                                        <label className="bmd-label-floating text-muted">
                                                            {paymentResponse.orderInfo || "N/A"}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="card-footer">
                                            <button class="btn btn-dribbble" onClick={navigateToList}>Back</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default VnpPaymentCallback;