import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CampusLayout from "./pages/CampusLayout";
import AdminDashBoard from "./pages/AdminDashBoard";
import NoticeList from "./pages/NoticeList";
import TestPage from "./pages/test";
import VoiceAssistant from "./components/ui/VoiceAssistant";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<CampusLayout />} />
        <Route path="/admin" element={<AdminDashBoard />} />
        <Route path="/notice" element={<NoticeList />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
      <VoiceAssistant />
    </>
  );
}
