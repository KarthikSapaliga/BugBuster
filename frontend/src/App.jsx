import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import Layout from "./components/Layout";
import Modal from "./components/Modal";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes (in modal) */}
        <Route
          path="/signin"
          element={
            <Modal>
              <SignIn signUpUrl="/signup" />
            </Modal>
          }
        />
        <Route
          path="/signup"
          element={
            <Modal>
              <SignUp signInUrl="/signin" />
            </Modal>
          }
        />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to='/dashboard' />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/issues"
          element={
            <ProtectedRoute>
              <div>Issues Page</div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-settings"
          element={
            <ProtectedRoute>
              <div>Settings</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
