import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  console.log("PrivateRoute - User:", user);
  console.log("PrivateRoute - Loading:", loading);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role !== "4" && user.role !== "1")) {
    console.log(
      "PrivateRoute - User not authenticated or invalid role, redirecting to login"
    );
    return <Navigate to="/login" replace />;
  }

  console.log("PrivateRoute - User authenticated, rendering outlet");
  return <Outlet />;
};

export default PrivateRoute;
