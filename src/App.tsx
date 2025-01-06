import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CampusLayout from "./pages/CampusLayout";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<CampusLayout />} />
      </Routes>
    </>
  );
}
