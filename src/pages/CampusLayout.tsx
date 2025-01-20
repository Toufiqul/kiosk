import React, { useState, useEffect } from "react";
// import { Dialog } from '@/components/ui/dialog';
import { GraduationCap, FileText } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "../state/auth";
import { useNavigate } from "react-router-dom";

const CampusLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const deAuthenticate = useAuthStore((state) => state.deAuthenticate);
  const navigate = useNavigate();

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const closeModal = () => setActiveModal(null);
  //   AIzaSyB0ZUk2rbYgLMRYnxuaEjN8gMpmbTrLPj8
  const handleLogOut = () => {
    deAuthenticate();
    navigate("/");
  };
  useEffect(() => {
    // Load the Google Earth API
    console.log(import.meta.env.GOOGLE_API_KEY);
    const loadGoogleEarth = () => {
      const script = document.createElement("script");
      script.src = `https://www.google.com/earth/api/earth-api.js?key=${
        import.meta.env.GOOGLE_API_KEY
      }`;
      script.async = true;
      script.defer = true;

      script.onload = initializeEarth;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    // Initialize Earth view
    const initializeEarth = () => {
      if (window.google && window.google.earth) {
        const ge = new window.google.earth.Engine({
          container: "earth-view",
          zoom: 18, // Close zoom for campus view
          center: { lat: 23.8377, lng: 90.3579 },
          tilt: 45, // Tilt for better 3D perspective
          bearing: 0,
          terrain: true,
          atmosphere: true,
          buildings: true,
        });

        // Set initial viewpoint
        ge.setView({
          position: {
            latitude: 23.8377,
            longitude: 90.3579,
            altitude: 500, // Height in meters
          },
          orientation: {
            heading: 0,
            tilt: 45,
            roll: 0,
          },
        });
      }
    };

    loadGoogleEarth();
  }, []);

  const departments = ["CSE", "NSE", "ME", "EEE", "Civil", "Architecture"];

  const examNotices = [
    {
      id: 1,
      title: "Mid Term Examination Schedule - Spring 2025",
      date: "2025-02-15",
      description:
        "Mid term examinations for all departments will commence from March 1st, 2025",
    },
    {
      id: 2,
      title: "Final Term Examination Notice",
      date: "2025-03-20",
      description:
        "Final examinations schedule will be published by end of March",
    },
  ];
  const navToAdmin = () => {
    navigate("/admin");
  };
  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Google Earth View Section */}
      <div className="border rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-4 bg-white">MIST Campus View</h2>
        <div className="aspect-[16/9] bg-gray-100">
          <img
            src="/campus.jpeg" // Replace this with your actual satellite image
            alt="MIST Campus Satellite View"
            className="w-full h-full object-cover"
          />
          {/* Tower Labels */}
          {/* Left Front (Tower 1) */}
          <div
            className="absolute"
            style={{
              top: "30%",
              left: "40%",
              transform: "translate(-50%, -50%)",
              color: "yellow",
              fontWeight: "bold",
              fontSize: 22,
              textShadow: "0px 0px 5px black",
            }}
          >
            Tower 1
          </div>

          {/* Right Front (Tower 2) */}
          <div
            className="absolute"
            style={{
              top: "30%",
              left: "58%",
              transform: "translate(-50%, -50%)",
              color: "yellow",
              fontWeight: "bold",
              fontSize: 22,
              textShadow: "0px 0px 5px black",
            }}
          >
            Tower 2
          </div>

          {/* Left Back (Tower 3) */}
          <div
            className="absolute"
            style={{
              top: "15%",
              left: "42%",
              transform: "translate(-50%, -50%)",
              color: "yellow",
              fontWeight: "bold",
              fontSize: 22,
              textShadow: "0px 0px 5px black",
            }}
          >
            Tower 3
          </div>

          {/* Right Back (Tower 4) */}
          <div
            className="absolute"
            style={{
              top: "15%",
              left: "56%",
              transform: "translate(-50%, -50%)",
              color: "yellow",
              fontWeight: "bold",
              fontSize: 22,
              textShadow: "0px 0px 5px black",
            }}
          >
            Tower 4
          </div>
        </div>
      </div>

      {/* Interactive sections */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setActiveModal("dept")}
          className="p-6 border rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors"
        >
          <GraduationCap size={24} className="mb-2" />
          <span className="font-medium">Departments</span>
        </button>

        <button
          onClick={() => setActiveModal("exam")}
          className="p-6 border rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors"
        >
          <FileText size={24} className="mb-2" />
          <span className="font-medium">Exam</span>
        </button>

        <button
          onClick={() => setActiveModal("calendar")}
          className="p-6 border rounded-lg hover:bg-gray-50 flex flex-col items-center transition-colors"
        >
          {/* <Calendar size={24} className="mb-2" /> */}
          <span className="font-medium">Calendar</span>
        </button>
      </div>
      <button
        className="w-full px-4 py-2 mt-5 text-white bg-blue-500 rounded hover:bg-red-600"
        onClick={navToAdmin}
      >
        Admin
      </button>
      <button
        className="w-full px-4 py-2 mt-5 text-white bg-red-500 rounded hover:bg-red-600"
        onClick={handleLogOut}
      >
        Logout
      </button>

      {/* Modals */}
      {activeModal === "dept" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Departments</h2>
            <ul className="space-y-2">
              {departments.map((dept) => (
                <li
                  key={dept}
                  className="p-3 border rounded hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {dept}
                </li>
              ))}
            </ul>
            <button
              className="w-full px-4 py-2 mt-5 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === "exam" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Exam Notices</h2>
            <div className="space-y-4">
              {examNotices.map((notice) => (
                <div key={notice.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{notice.title}</h3>
                    <span className="text-sm text-gray-500">{notice.date}</span>
                  </div>
                  <p className="text-gray-600">{notice.description}</p>
                </div>
              ))}
            </div>
            <button
              className="w-full px-4 py-2 mt-5 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {activeModal === "calendar" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Academic Calendar</h2>
            <div className="aspect-video bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
              {/* <img
                src="/calender.jpeg"
                alt="Academic Calendar"
                className="w-full h-full object-contain"
              /> */}
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
            <button
              className="w-full px-4 py-2 mt-5 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusLayout;
