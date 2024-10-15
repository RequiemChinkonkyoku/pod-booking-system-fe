import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RootLayout from "../layouts/RootLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Admin/Dashboard";
import Users from "../pages/Admin/Users";
import { Products } from "../pages/Admin/Products";
import VerifyOtpPage from "../pages/VerifyOtpPage";
import { Pods } from "../pages/Admin/PODs";
import CustomerDashboard from "../pages/Customer/Dashboard";
import BookAPod from "../pages/Customer/BookAPod";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    // errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/adminDashboard",
    element: <Dashboard />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/adminUsers",
    element: <Users />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/adminProducts",
    element: <Products />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/verifyOtp",
    element: <VerifyOtpPage />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/adminPods",
    element: <Pods />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/customerDashboard",
    element: <CustomerDashboard />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/customerBookAPod",
    element: <BookAPod />,
    // errorElement: <ErrorPage />,
  },
]);
