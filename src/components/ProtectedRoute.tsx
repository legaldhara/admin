import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Store/Store";

interface ProtectedRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
  allowedRoles?: Array<"ADMIN" | "COADMIN">;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectPath = "/auth", allowedRoles }) => {
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);
  if (!isAuthenticated) return <Navigate to={redirectPath} replace />;
  if (allowedRoles && (!role || !allowedRoles.includes(role as "ADMIN" | "COADMIN"))) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;