import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ token, isAdmin, children }) => {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" />;
  }

  if (isAdmin === false && location.pathname !== "/landing") {
    return <Navigate to="/landing" />;
  }

  return children;
};

export default ProtectedRoute;
