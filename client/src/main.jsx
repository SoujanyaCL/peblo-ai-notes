import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App.jsx";
import History from "./History.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import SharedNote from "./SharedNote.jsx";
import Archived from "./Archived.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/history" element={<History />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shared/:shareId" element={<SharedNote />} />
        <Route path="/archived" element={<Archived />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);