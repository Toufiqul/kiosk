import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  FileText,
  Calendar as CalendarIcon,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useAuthStore } from "../state/auth";
import { useModalStore } from "@/state/modalState";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import DepartmentModal from "@/components/ui/departmentModal";
interface Department {
  id: string;
  name: string;
  code: string;
  created_at: string;
  floor: string | null;
  head_id: string | null;
  location: string | null;
  room_no: string | null;
  tower: string | null;
}
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  interested_count: number;
  created_at: string;
  color_gradient: string;
}
interface Department {
  id: string;
  name: string;
  // Add other department fields as needed
}

declare global {
  interface Window {
    google: any;
  }
}
const CampusLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const deAuthenticate = useAuthStore((state) => state.deAuthenticate);
  const navigate = useNavigate();
  const [date, setDate] = React.useState(new Date());
  const { activeModal, setActiveModal } = useModalStore();

  //   const [activeModal, setActiveModal] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  interface Tower {
    id: number;
    name: string;
    position: { lat: number; lng: number };
    info: string;
  }
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedTower, setSelectedTower] = useState<Tower | null>(null);
  const [map, setMap] = useState(null);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const [combinedData, setCombinedData] = useState<any[]>([]);

  const closeModal = () => setActiveModal(null);

  const handleLogOut = () => {
    deAuthenticate();
    navigate("/");
  };
  const fetchAllDepartmentData = async () => {
    const { data, error } = await supabase.from("departments").select("*");
    console.log(data);
    if (!error && data) setDepartmentData(data);
  };

  // ADD THIS FUNCTION AFTER fetchAllExamAndNoticeData
  const fetchAllEventData = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (!error && data) {
        setEvents(data);
      } else {
        console.error("Error fetching events:", error);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchAllExamAndNoticeData = async () => {
    // Fetch exam schedules and notices
    const { data: examData, error: examError } = await supabase
      .from("exam_schedules")
      .select("*");
    const { data: noticeData, error: noticeError } = await supabase
      .from("notices")
      .select("*");
    if (examError || noticeError) {
      console.error("Error fetching exam and notice data");
      return;
    }
    // combine bothexamData and noticeData add a type field to differentiate between them
    const combinedData = [
      ...(examData ? examData.map((exam) => ({ ...exam, type: "exam" })) : []),
      ...(noticeData
        ? noticeData.map((notice) => ({ ...notice, type: "notice" }))
        : []),
    ];

    setCombinedData(combinedData);
  };
  const towers = [
    {
      id: 1,
      name: "Tower 1",
      position: { lat: 23.8378, lng: 90.3578 },
      info: "Tower 1 : Faculty of Civil Engineering (FCE) with all the dept mentioned above",
    },
    {
      id: 2,
      name: "Tower 2",
      position: { lat: 23.8383, lng: 90.3577 },
      info: "Tower 2 : Faculty of Mechanical Engineering (FME) with all the dept mentioned above",
    },
    {
      id: 3,
      name: "Tower 3",
      position: { lat: 23.83777, lng: 90.3572 },
      info: "Tower 3 : Faculty of Electrical & Computer Engineering (FECE) with all the dept mentioned above",
    },
    {
      id: 4,
      name: "Tower 4",
      position: { lat: 23.83825, lng: 90.3572 },
      info: "Tower 4 : Faculty of Science & Engineering (FSE) with all the dept mentioned above",
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
    fetchAllDepartmentData();
    fetchAllExamAndNoticeData();
    fetchAllEventData();
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
  const [activeEventIndex, setActiveEventIndex] = useState(0);
  const [participatingEvents, setParticipatingEvents] = useState<string[]>([]);
  // Add these functions to the component
  const nextEvent = () => {
    setActiveEventIndex((prevIndex) =>
      prevIndex === events.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevEvent = () => {
    setActiveEventIndex((prevIndex) =>
      prevIndex === 0 ? events.length - 1 : prevIndex - 1
    );
  };

  const toggleParticipation = async (eventId: string) => {
    if (participatingEvents.includes(eventId)) {
      // Remove participation
      setParticipatingEvents(
        participatingEvents.filter((id) => id !== eventId)
      );

      // Update the event's interested count in local state
      setEvents(
        events.map((event) =>
          event.id === eventId
            ? { ...event, interested_count: event.interested_count - 1 }
            : event
        )
      );

      // Optional: Update in Supabase
      try {
        const event = events.find((e) => e.id === eventId);
        if (event) {
          await supabase
            .from("events")
            .update({ interested_count: event.interested_count - 1 })
            .eq("id", eventId);
        }
      } catch (error) {
        console.error("Error updating event participation:", error);
      }
    } else {
      // Add participation
      setParticipatingEvents([...participatingEvents, eventId]);

      // Update the event's interested count in local state
      setEvents(
        events.map((event) =>
          event.id === eventId
            ? { ...event, interested_count: event.interested_count + 1 }
            : event
        )
      );

      // Optional: Update in Supabase
      try {
        const event = events.find((e) => e.id === eventId);
        if (event) {
          await supabase
            .from("events")
            .update({ interested_count: event.interested_count + 1 })
            .eq("id", eventId);
        }
      } catch (error) {
        console.error("Error updating event participation:", error);
      }
    }
  };

  // UPDATE THE AUTO-SCROLL USEEFFECT (around line 190)
  useEffect(() => {
    if (events.length > 0) {
      // ADD THIS CONDITION
      const interval = setInterval(() => {
        nextEvent();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [events]); // ADD events TO DEPENDENCY ARRAY

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
        {/* Event Carousel Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upcoming Events
            </h2>
          </div>
          <div className="relative px-6 py-4">
            <div className="w-full overflow-hidden">
              <div className="relative transition-all duration-500 ease-in-out">
                {/* Event Card */}
                {events.length > 0 ? (
                  <div
                    className={`w-full h-64 rounded-xl ${events[activeEventIndex].color_gradient} p-6 transition-all duration-500 ease-in-out`}
                  >
                    <div className="h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 text-white/80 mb-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            {new Date(
                              events[activeEventIndex].date
                            ).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{events[activeEventIndex].time}</span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">
                          {events[activeEventIndex].title}
                        </h3>
                        <p className="text-white/90 mb-4 max-w-3xl">
                          {events[activeEventIndex].description}
                        </p>
                        <div className="flex items-center text-white/80 mb-4">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{events[activeEventIndex].location}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {events.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setActiveEventIndex(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === activeEventIndex
                                  ? "bg-white"
                                  : "bg-white/40"
                              }`}
                            />
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            toggleParticipation(events[activeEventIndex].id)
                          }
                          className={`flex items-center space-x-2 rounded-full px-4 py-2 transition-all duration-300 ${
                            participatingEvents.includes(
                              events[activeEventIndex].id
                            )
                              ? "bg-white text-gray-800 shadow-lg"
                              : "bg-white/20 text-white hover:bg-white/30"
                          }`}
                        >
                          <span>
                            {participatingEvents.includes(
                              events[activeEventIndex].id
                            )
                              ? "Participating"
                              : "Participate"}
                          </span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4" />
                            <span className="ml-1">
                              {events[activeEventIndex].interested_count}
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // SHOW THIS WHEN NO EVENTS ARE AVAILABLE
                  <div className="w-full h-64 rounded-xl bg-gradient-to-r from-gray-400 to-gray-600 p-6 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-2xl font-bold mb-2">
                        No Events Available
                      </h3>
                      <p className="text-white/80">
                        Check back later for upcoming events
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevEvent}
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextEvent}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

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
              {Object.entries(departmentData).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-between"
                  onClick={() => setSelectedDepartment(value)}
                >
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      {value.name}
                    </span>
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

            {selectedDepartment && (
              <DepartmentModal
                department={selectedDepartment}
                onClose={() => setSelectedDepartment(null)}
              />
            )}
          </div>
        </div>
      )}

      {
        //show exam and notice data check the type first
      }
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
              {combinedData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {item.type === "exam" ? item.exam_name : item.title}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {item.type === "exam"
                        ? new Date(item.exam_date).toLocaleDateString()
                        : new Date(item.published_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                  <span className="text-xs text-gray-500">
                    {item.type === "exam" ? "Exam Schedule" : "Notice"}
                  </span>
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
                onSelect={(day) => day && setDate(day)}
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
