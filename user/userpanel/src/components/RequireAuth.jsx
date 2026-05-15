import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getRole } from "../auth/session";

export function RequireCustomer() {
  const location = useLocation();
  const role = getRole();
  if (
    role === null ||
    (role !== "user" && role !== "admin")
  ) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}

export function RequireStaff() {
  const location = useLocation();
  const role = getRole();
  if (role === null || role !== "admin") {
    if (role === "user") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
