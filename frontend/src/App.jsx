import React from "react";
import { Routes, Route } from "react-router-dom";

import SignUpPage from "./pages/SignupPage";
import SignInPage from "./pages/SigninPage";

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
import BugReport from "./pages/BugReport";
import CreateProjectForm from "./pages/CreateProjectForm";
import UpdateProjectForm from "./pages/UpdateProjectForm";
import VersionControl from "./pages/VersionControl";
import Teams from "./pages/Teams";
import ProjectBugs from "./pages/ProjectBugs";

function App() {
  return (
    <Layout>
      <Routes>
        {/* Public Routes (in modal) */}
        <Route
          path="/signin"
          element={
            <Modal>
              <SignInPage />
            </Modal>
          }
        />
        <Route
          path="/signup"
          element={
            <Modal>
              <SignUpPage />
            </Modal>
          }
        />

        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Navigate to="/dashboard" />
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
        <Route
          path="/bugs/:id"
          element={
            <ProtectedRoute>
              <BugReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-project"
          element={
            <ProtectedRoute>
              <CreateProjectForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/bugs/:projectId"
          element={
            <ProtectedRoute>
              <ProjectBugs />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/vcs/:projectId"
          element={
            <ProtectedRoute>
              <VersionControl />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/team/:projectId"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/update-project/:projectId"
          element={
            <ProtectedRoute>
              <UpdateProjectForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

export default App;
