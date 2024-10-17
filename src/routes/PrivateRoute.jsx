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
  
  if (!user || user.role !== '4') {
    console.log(
      "PrivateRoute - User not authenticated or not admin, redirecting to login"
    );
    return <Navigate to="/login" replace />;
  }

  console.log("PrivateRoute - Admin authenticated, rendering outlet");
  return <Outlet />;
};

export default PrivateRoute;
