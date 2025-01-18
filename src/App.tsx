import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CampusLayout from "./pages/CampusLayout";
import AdminDashBoard from "./pages/AdminDashBoard";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<CampusLayout />} />
        <Route path="/admin" element={<AdminDashBoard />} />
      </Routes>
    </>
  );
}
