import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "/LoginPage";
import UsersDashboard from "/UsersDashboard";
import BooksDashboard from "/BooksDashboard";
import UserProfile from "/UserProfile";

function App() {
  return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/users" element={<UsersDashboard />} />
        <Route path="/books" element={<BooksDashboard />} />
        <Route path="/profile/:id" element={<UserProfile />} />
      </Routes>
  );
}

export default App;
