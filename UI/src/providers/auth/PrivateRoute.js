import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const auth = useAuth();
  if (!auth?.user?.isLoggedin) return <Navigate to="/login?msg=unauthorized" />;
  return <Outlet />;
};

export default PrivateRoute;


