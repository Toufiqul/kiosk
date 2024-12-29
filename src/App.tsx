import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnotherTestPage from "./pages/AnotherTestPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/another" element={<AnotherTestPage />} />
      </Routes>
    </>
  );
}
