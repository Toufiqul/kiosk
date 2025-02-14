import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  FileText,
  Calendar as CalendarIcon,
  Menu,
  X,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "../state/auth";
import { useNavigate } from "react-router-dom";
import { departmentOptions } from "@/lib/utils";

const CampusLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const deAuthenticate = useAuthStore((state) => state.deAuthenticate);
  const navigate = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const [activeModal, setActiveModal] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedTower, setSelectedTower] = useState(null);
  const [map, setMap] = useState(null);

  const closeModal = () => setActiveModal(null);

  const handleLogOut = () => {
    deAuthenticate();
    navigate("/");
  };

  const towers = [
    {
      id: 1,
      name: "Tower 1",
      position: { lat: 23.8378, lng: 90.3578 },
      info: "Main Academic Building - Houses CSE and EEE departments",
    },
    {
      id: 2,
      name: "Tower 2",
      position: { lat: 23.8383, lng: 90.3577 },
      info: "Engineering Complex - Contains ME and Civil Engineering facilities",
    },
    {
      id: 3,
      name: "Tower 3",
      position: { lat: 23.83777, lng: 90.3572 },
      info: "Research Wing - Advanced laboratories and research centers",
    },
    {
      id: 4,
      name: "Tower 4",
      position: { lat: 23.83825, lng: 90.3572 },
      info: "Administrative Building - Offices and conference rooms",
    },
  ];

  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${"AIzaSyDtajbjXfvf4khJQI0kQFhwyEC5W-JbVq0"}`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    if (window.google) {
      const mapInstance = new window.google.maps.Map(
        document.getElementById("campus-map"),
        {
          center: { lat: 23.8377, lng: 90.3579 },
          zoom: 18,
          mapTypeId: "satellite",
          tilt: 45,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.TOP_RIGHT,
            mapTypeIds: ["roadmap", "satellite"],
          },
          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          scaleControl: true,
          streetViewControl: true,
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },
          fullscreenControl: true,
        }
      );

      setMap(mapInstance);

      // Add markers for each tower
      towers.forEach((tower) => {
        const marker = new window.google.maps.Marker({
          position: tower.position,
          map: mapInstance,
          title: tower.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: "#FFD700",
            fillOpacity: 0.9,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
          animation: window.google.maps.Animation.BOUNCE,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">${tower.name}</h3>
              <p class="text-gray-600">${tower.info}</p>
            </div>
          `,
        });

        marker.addListener("mouseover", () => {
          infoWindow.open(mapInstance, marker);
        });

        marker.addListener("mouseout", () => {
          infoWindow.close();
        });

        marker.addListener("click", () => {
          setSelectedTower(tower);
        });
      });
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="https://afd.gov.bd/sites/default/files/inline-images/MIST%20Logo_0.png"
                alt="MIST Logo"
                className="h-8 w-auto mr-3"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                Military Institute of Science & Technology
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setActiveModal("dept")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Departments
              </button>
              <button
                onClick={() => setActiveModal("exam")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Examinations
              </button>
              <button
                onClick={() => setActiveModal("calendar")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Calendar
              </button>
              <button
                onClick={handleLogOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveModal("dept");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Departments
              </button>
              <button
                onClick={() => {
                  setActiveModal("exam");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Examinations
              </button>
              <button
                onClick={() => {
                  setActiveModal("calendar");
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Calendar
              </button>
              <button
                onClick={handleLogOut}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Campus View Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              MIST Campus View
            </h2>
          </div>
          <div className="relative">
            <div id="campus-map" className="w-full h-[500px]" />

            {/* Tower Information Panel */}
            {selectedTower && (
              <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-sm">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedTower.name}
                  </h3>
                  <button
                    onClick={() => setSelectedTower(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                <p className="mt-2 text-gray-600">{selectedTower.info}</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveModal("dept")}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Departments</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Browse academic departments and programs
            </p>
          </button>

          <button
            onClick={() => setActiveModal("exam")}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Examinations</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              View exam schedules and notices
            </p>
          </button>

          <button
            onClick={() => setActiveModal("calendar")}
            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Calendar</h3>
            <p className="mt-2 text-sm text-gray-500 text-center">
              Academic calendar and events
            </p>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-900 text-white text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Military Institute of Science and
          Technology
        </p>
        {/* <p className="text-xs text-gray-400 mt-1">Technology for Advancement</p> */}
      </footer>

      {/* Modals */}
      {activeModal === "dept" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 h-1/2 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Academic Departments
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(departmentOptions).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === "exam" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Examination Notices
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              {examNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {notice.title}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {new Date(notice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{notice.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModal === "calendar" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Academic Calendar
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampusLayout;
