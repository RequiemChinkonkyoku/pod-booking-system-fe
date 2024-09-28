import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import RootLayout from "../layouts/RootLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Admin/Dashboard";

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
]);
