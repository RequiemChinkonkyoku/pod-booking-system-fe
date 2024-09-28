import React from "react";
import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage"
import RootLayout from "../layouts/RootLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

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
]);
