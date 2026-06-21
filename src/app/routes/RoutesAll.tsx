import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Layout from "../layout/Layout";
import type { RootState } from "../services/redux/store";
import Tasks from "../pages/Tasks";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

const RoutesAll = () => {
  const accessToken = useSelector(
    (state: RootState) => state.authData.accessToken,
  );

  const isAuthenticated = Boolean(accessToken);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <Signup />
          )
        }
      />

      <Route
        path="/forgot-password"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <ForgotPassword />
          )
        }
      />

      <Route
        path="/reset-password"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <ResetPassword />
          )
        }
      />

      {isAuthenticated && (
        <Route element={<Layout />}>
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/tasks" element={<Tasks />} />
        </Route>
      )}

      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to="/app/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

export default RoutesAll;
