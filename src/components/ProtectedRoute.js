// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // const { loading } = useUser();

  // // if (loading) return null; 
  var user = localStorage.getItem("user");
  user = JSON.parse(user);
  console.log(user);
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />; // or a 403 page
  }

  return children;
};

export default ProtectedRoute;
