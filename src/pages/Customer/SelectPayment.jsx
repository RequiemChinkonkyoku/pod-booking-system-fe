import React, { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import "../../assets/css/material-dashboard.min.css";

import Navbar from "../../components/Customer/Navbar";
import Head from "../../components/Head";
import Sidebar from "../../components/Customer/Sidebar";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig";

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
        const orderType = paymentData.orderType;
        const bookingId = paymentData.bookingId;
        const amount = paymentData.amount;
        const userId = paymentData.userId;

        switch (methodId) {
            case 1: {
                try {
                    const response = await axios.post("/Momo/create-payment", { bookingId: bookingId, amount: amount });
                    const paymentUrl = response.data.momoPaymentResponse.payUrl;
                    console.log(paymentUrl);
                    window.location.href = paymentUrl;
                } catch (error) {
                    console.log("Error creating momo payment", error);
                }

                break;
            }
            case 2:
                {
                    const vnpData = {
                        orderType: orderType,
                        amount: amount,
                        bookingId: bookingId,
                        userId: userId
                    };

                    console.log(vnpData);

                    try {
                        const response = await axios.post("/VnPay", {
                            orderType: orderType,
                            amount: amount,
                            bookingId: bookingId,
                            userId: userId
                        });
                        const paymentUrl = response.data;
                        console.log(paymentUrl);
                        window.location.href = paymentUrl;
                    } catch (error) {
                        console.log("Error creating vnpay payment", error);
                    }

                    break;
                }
            default: {
                const userChoice = confirm("Choosing cash have the chance of getting your booking taken. Do you want to proceed?");

                if (userChoice) {
                    alert("Payment method selected.");
                    navigate("/customer/Bookings");
                }
                else {
                    alert("Payment method not selected");
                }

                break;
            }
        }
    };

    return (
        <>
            <Head />
            <body>
                <div class="wrapper">
                    <Sidebar />
                    <div class="main-panel ps-container ps-theme-default">
                        <Navbar />
                        <div class="content">
                            <div class="container-fluid">
                                <div class="row">

                                    <div className="row">
                                        <h2>Select a Payment Method</h2>
                                    </div>

                                    <div class="row">
                                        {
                                            methods.length === 0 ? (
                                                <p>Loading methods</p>
                                            ) : (
                                                methods.map((method) => (
                                                    <div class="col-lg-4 cards" key={method.id}>
                                                        <div class="card card-pricing card-raised">
                                                            <div class="card-body">
                                                                <h6 class="card-category">{method.name}</h6>
                                                                <div class="card-icon icon-rose">
                                                                    <i class="material-icons">payment</i>
                                                                </div>
                                                                <h3 class="card-title">{method.name}</h3>
                                                                <p class="card-description">
                                                                    This payment uses {method.name} for transaction
                                                                </p>
                                                                <a class="btn btn-rose btn-round"
                                                                    onClick={() => handlePaymentSelect(method.id)}>Choose Method</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
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

export default SelectPayment;