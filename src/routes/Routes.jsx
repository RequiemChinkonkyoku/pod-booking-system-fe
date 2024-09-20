import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";

export const Routes =
  createBrowserRouter[
    [
      {
        path: "/",
        children: [
          {
            path: "login",
            element: Login,
          },
        ],
      },
    ]
  ];

export default function App() {
  return <RouterProvider router={router} />;
}
