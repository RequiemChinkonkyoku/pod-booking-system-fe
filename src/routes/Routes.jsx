import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CustomerLayout from "../layouts/CustomerLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import { Products } from "../pages/Admin/Products";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import { Pods } from "../pages/Admin/PODs";
import PrivateRoute from "../routes/PrivateRoute";
import { AuthProvider } from "../contexts/AuthContext";
import CustomerDashboard from "../pages/Customer/Dashboard";
import BookAPod from "../pages/Customer/BookAPod";
import ConfirmBooking from "../pages/Customer/ConfirmBooking";
import CustomerBookings from "../pages/Customer/Bookings";
import CustomerBookingDetails from "../pages/Customer/BookingDetails";
import AdminBookings from "../pages/Admin/Bookings";
import SelectPayment from "../pages/Customer/SelectPayment";
import ManagerDashboard from "../pages/Manager/Dashboard";
import StaffDashboard from "../pages/Staff/Dashboard";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CustomerLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/admin",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "pods",
        element: <Pods />,
      },
      {
        path: "bookings",
        element: <AdminBookings />,
      },
    ],
  },
  {
    path: "/verifyOtp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/customer",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <CustomerDashboard />,
      },
      {
        path: "BookAPod",
        element: <BookAPod />,
      },
      {
        path: "ConfirmBooking",
        element: <ConfirmBooking />,
      },
      {
        path: "Bookings",
        element: <CustomerBookings />,
      },
      {
        path: "SelectPayment",
        element: <SelectPayment />,
      },
      {
        path: "BookingDetails",
        element: <CustomerBookingDetails />,
      },
    ],
  },
  {
    path: "/managerDashboard",
    element: <ManagerDashboard />,
  },
  {
    path: "/staffDashboard",
    element: <StaffDashboard />,
  },
  // {
  //   path: "/customerDashboard",
  //   element: <CustomerDashboard />,
  //   // errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/customerBookAPod",
  //   element: <BookAPod />,
  //   // errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/customerConfirmBooking",
  //   element: <ConfirmBooking />,
  //   // errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/customerBookings",
  //   element: <CustomerBookings />,
  //   // errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/customerSelectPayment",
  //   element: <SelectPayment />,
  //   // errorElement: <ErrorPage />,
  // },
  // {
  //   path: "/customerBookingDetails",
  //   element: <CustomerBookingDetails />,
  //   // errorElement: <ErrorPage />,
  // },
]);
