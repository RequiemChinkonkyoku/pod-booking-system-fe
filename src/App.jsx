import { useState } from "react";
import "./assets/css/material-dashboard.min.css";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/Routes";

function App() {
  return <RouterProvider router={routes} />;
}

export default App;