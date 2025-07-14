import React, { useEffect } from "react";

import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import Layout from "./components/Layout";


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/issues" element={<div>Issues Page</div>} />
        <Route path="/project-settings" element={<div>Settings</div>} />
      </Routes>
    </Layout>
  );
}

export default App;
