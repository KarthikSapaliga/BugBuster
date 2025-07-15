import React from "react";
import { Routes, Route } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import Layout from "./components/Layout";
import Modal from "./components/Modal";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import AllIsues from "./pages/AllIsues";
import InProgress from "./pages/InProgress";
import HighPriority from "./pages/HighPriority";
import AssignedMe from "./pages/AssignedMe";
import BugReportingForm from "./pages/BugReportingForm";

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
          path="/analytics-reports"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-issues"
          element={
            <ProtectedRoute>
              <AllIsues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/in-progress"
          element={
            <ProtectedRoute>
              <InProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/high-priority"
          element={
            <ProtectedRoute>
              <HighPriority />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assigned-me"
          element={
            <ProtectedRoute>
              <AssignedMe />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-bug"
          element={
            <ProtectedRoute>
              <BugReportingForm />
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
