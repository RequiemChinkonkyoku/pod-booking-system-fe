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
import MomoPaymentCallback from "../pages/Customer/MomoPaymentCallback";
import DashboardChart from "../pages/Admin/DashboardChart";
import { StaffManagement } from "../pages/Admin/StaffManagement";
import { ManagerStaffManagement } from "../pages/Manager/StaffManagement";
import BookingDetails from "../pages/Admin/BookingDetails";
import AreaBookings from "../pages/Staff/AreaBookings";
import StaffBookingDetails from "../pages/Staff/BookingDetails";
import ForgetPassword from "../pages/ForgetPassword";
import VnpPaymentCallback from "../pages/Customer/VnpPaymentCallback";

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
    path: "/forgetPassword",
    element: <ForgetPassword />,
  },
  {
    path: "/verifyOtp",
    element: <VerifyOtpPage />,
  },
  // Admin routes
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
        path: "chart",
        element: <DashboardChart />,
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
      {
        path: "staffManagement",
        element: <StaffManagement />,
      },
      {
        path: "details",
        element: <BookingDetails />,
      },
    ],
  },
  // Customer routes
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
      {
        path: "MomoPaymentCallback",
        element: <MomoPaymentCallback />,
      },
      {
        path: "VnpPaymentCallback",
        element: <VnpPaymentCallback />,
      },
    ],
  },
  // Staff routes
  {
    path: "/staff",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <StaffDashboard />,
      },
      {
        path: "areaBookings",
        element: <AreaBookings />,
      },
      {
        path: "bookingDetails",
        element: <StaffBookingDetails />,
      },
    ],
  },
  // Manager routes
  {
    path: "/manager",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: <ManagerDashboard />,
      },
      {
        path: "staffManagement",
        element: <ManagerStaffManagement />,
      },
    ],
  },
]);
