import React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import NavbarHome from "../components/NavbarHome";
import FooterHome from "../components/FooterHome";
import Head from "../components/Head";

const Layout = () => (
  <>
    <Head />
    <NavbarHome />
    <Outlet />
    <FooterHome />
  </>
);

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
