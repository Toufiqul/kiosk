import React, { useEffect, useState } from "react";
import { supabase } from "../client";
import { useAuthStore } from "../state/auth";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  GraduationCap,
  FileText,
  BellRing,
  BookOpen,
  Users,
  Calendar,
  Building2,
  Plus,
  X,
  ClipboardList,
  School,
  PencilRuler,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  MapPin,
  Bell,
} from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import HolidayModal from "@/components/ui/addHolidayModal";
import { ClassroomModal } from "@/components/ui/addLevelPlan";
import { title } from "process";

// Types
interface Department {
  id: string;
  name: string;
  // Add other department fields as needed
}

interface Notice {
  id: string;
  title: string;
  content: string;
  department_id: string;
  notice_type: string;
  published_by: string;
  published_at: Date;
}

interface Exam {
  id: string;
  exam_name: string;
  course_code: string;
  room_number: string;
  exam_date: string;
  start_time: string;
  end_time: string;
}
interface Holiday {
  id: string;
  start_date: string | null;
  end_date: string | null;
  occasion: string;
}
interface FormData {
  title: string;
  content: string;
  department_id: string;
  notice_type: string;
  published_by: string;
  published_at: Date;
  examDate: string;
  examName: string;
  courseCode: string;
  roomNo: string;
  startTime: string;
  endTime: string;
}

interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  activeExams: number;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departmentData, setDepartmentData] = useState<Department[]>([]);
  const [noticeData, setNoticeData] = useState<Notice[]>([]);
  const [examData, setExamData] = useState<Exam[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [holidayStartDate, setHolidayStartDate] = useState<Date>(new Date());
  const [holidayEndDate, setHolidayEndDate] = useState<Date>(new Date());
  const [holidayOccasion, setHolidayOcasion] = useState<string>("");
  const [holidayData, setHolidayData] = useState<Holiday[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 5300,
    totalFaculty: 120,
    totalDepartments: 13,
    activeExams: 8,
  });

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    department_id: "4f09e2a4-4b73-46fc-a6a4-7c4a1721e2cd",
    notice_type: "",
    published_by: "d352bd61-3242-4e72-ae4d-ccd1c527aa95",
    published_at: new Date(),
    examDate: "",
    examName: "",
    courseCode: "",
    roomNo: "",
    startTime: Date.now().toString(),
    endTime: Date.now().toString(),
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchAllDepartmentData(),
      fetchAllNoticeData(),
      fetchAllExamData(),
      fetchAllHolidayData(),
    ]);
  };

  const fetchAllDepartmentData = async () => {
    const { data, error } = await supabase.from("departments").select("*");
    if (!error && data) setDepartmentData(data);
  };

  const fetchAllNoticeData = async () => {
    const { data, error } = await supabase.from("notices").select();
    if (!error && data) setNoticeData(data);
  };

  const fetchAllExamData = async () => {
    const { data, error } = await supabase.from("exam_schedules").select("*");
    if (!error && data) setExamData(data);
  };
  const fetchAllHolidayData = async () => {
    const { data, error } = await supabase.from("holidays").select("*");
    console.log(data);
    if (!error && data) setHolidayData(data);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const createHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("holidays").insert({
        start_date: holidayStartDate,
        end_date: holidayEndDate,
        occasion: holidayOccasion,
      }); // Add other holiday fields as needed
      if (!error) {
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createExam = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    try {
      const { error } = await supabase.from("exam_schedules").insert({
        id: uuidv4(),
        department_id: formData.department_id,
        exam_name: formData.examName,
        course_code: formData.courseCode,
        room_number: formData.roomNo,
        start_time: formData.startTime,
        end_time: formData.endTime,
        exam_date: date,
        created_by: "d352bd61-3242-4e72-ae4d-ccd1c527aa95",
      });

      if (!error) {
        fetchAllExamData();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("notices").insert({
        id: uuidv4(),
        title: formData.title,
        content: formData.content,
        notice_type: formData.notice_type,
        department_id: formData.department_id,
        published_by: formData.published_by,
        published_at: formData.published_at,
      });

      if (!error) {
        fetchAllNoticeData();
        closeModal();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const closeModal = () => {
    setActiveModal(null);

    setError(null);
    setFormData({
      title: "",
      content: "",
      department_id: "4f09e2a4-4b73-46fc-a6a4-7c4a1721e2cd",
      notice_type: "",
      published_by: "d352bd61-3242-4e72-ae4d-ccd1c527aa95",
      published_at: new Date(),
      examDate: "",
      examName: "",
      courseCode: "",
      roomNo: "",
      startTime: Date.now().toString(),
      endTime: Date.now().toString(),
    });
  };
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  const handleSaveHoliday = (holiday: {
    start_date: string | null;
    end_date: string | null;
    occasion: string;
  }) => {
    console.log("Saved Holiday:", holiday); // Logs the holiday data
    setHolidays([...holidays, holiday]);
  };
  const handleSave = (holiday: {
    start_date: string | null;
    end_date: string | null;
    occasion: string;
  }) => {
    console.log("New Holiday:", holiday);
    // Implement holiday saving logic
  };

  // Component for statistics cards
  const StatCard = ({
    icon: Icon,
    title,
    value,
    color,
  }: {
    icon: any;
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  // Component for quick action buttons
  const QuickActionButton = ({
    icon: Icon,
    label,
    onClick,
  }: {
    icon: any;
    label: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-2 w-full"
    >
      <div className="p-3 rounded-full bg-blue-50">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <img
                  src="https://afd.gov.bd/sites/default/files/inline-images/MIST%20Logo_0.png"
                  alt="MIST Logo"
                  className="h-12 w-auto"
                />
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">MIST COMPASS</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 relative">
                <BellRing className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </button> */}
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Over View
        </h2>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Students"
            value={stats.totalStudents}
            color="bg-blue-500"
          />
          <StatCard
            icon={GraduationCap}
            title="Faculty Members"
            value={stats.totalFaculty}
            color="bg-green-500"
          />
          <StatCard
            icon={Building2}
            title="Departments"
            value={stats.totalDepartments}
            color="bg-purple-500"
          />
          <StatCard
            icon={ClipboardList}
            title="Active Exams"
            value={stats.activeExams}
            color="bg-orange-500"
          />
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={PencilRuler}
              label="Add Exam"
              onClick={() => setActiveModal("exam")}
            />
            <QuickActionButton
              icon={BellRing}
              label="Add Notice"
              onClick={() => setActiveModal("notice")}
            />
            <QuickActionButton
              icon={Calendar}
              label="Add Holiday"
              onClick={() => setActiveModal("holidays")}
            />
            <QuickActionButton
              icon={School}
              label="Add Classroom"
              onClick={() => setActiveModal("levelPlan")}
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Recent Notices
              </h2>
            </header>

            <div className="space-y-6">
              {noticeData.slice(0, 5).map((notice) => (
                <div
                  key={notice.id}
                  className="group border border-gray-100 rounded-md p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {notice.title}
                    </h3>
                    {notice.published_at && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(notice.published_at), "PPP")}
                      </div>
                    )}
                  </div>

                  <div className="text-gray-600 leading-relaxed">
                    {notice.content}
                  </div>

                  {notice.notice_type && (
                    <div className="flex gap-2 mt-3">
                      {notice.notice_type && (
                        <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {notice.notice_type}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-blue-600" />
                Upcoming Exams
              </h2>
            </header>

            <div className="space-y-6">
              {examData.slice(0, 5).map((exam) => (
                <div
                  key={exam.id}
                  className="border border-gray-100 rounded-md p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-lg text-gray-900 mb-2">
                    {exam.exam_name}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="font-medium w-24">Course Code:</div>
                      <div>{exam.course_code}</div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <div className="font-medium">Room:</div>
                      <div>{exam.room_number}</div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <div className="font-medium">Date:</div>
                      <div>{exam.exam_date}</div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <div className="font-medium">Time:</div>
                      <div>
                        {exam.start_time} - {exam.end_time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <header className="border-b border-gray-200 pb-4 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-green-600" />
                Upcoming Holidays
              </h2>
            </header>

            <div className="space-y-6">
              {holidayData.map((holiday) => (
                <div
                  key={holiday.id}
                  className="border border-gray-100 rounded-md p-4 hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-lg text-gray-900 mb-2">
                    {holiday.occasion}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <div className="font-medium">Start Date:</div>
                      <div>{format(holiday.start_date, "PPP")}</div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarDays className="w-4 h-4" />
                      <div className="font-medium">End Date:</div>
                      <div>{format(holiday.end_date, "PPP")}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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

      <ClassroomModal
        isOpen={activeModal === "levelPlan"}
        onClose={() => setActiveModal(null)}
        onSave={handleSave}
      />

      {/* Holiday Modal */}
      {/* <HolidayModal     
        isOpen={activeModal === "holidays"}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveHoliday}          
      /> */}

      {/* Holiday Modal */}
      {activeModal === "holidays" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Holiday
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={createNotice} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Occasion
                  </label>
                  <input
                    type="text"
                    name="occasion"
                    value={holidayOccasion}
                    onChange={(e) => setHolidayOcasion(e.target.value)}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter occasion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !holidayStartDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {holidayStartDate ? (
                          format(holidayStartDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={holidayStartDate}
                        onSelect={setHolidayStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !holidayEndDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {holidayEndDate ? (
                          format(holidayEndDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={holidayEndDate}
                        onSelect={setHolidayEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    onClick={createHoliday}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Holiday
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Exam Modal */}
      {activeModal === "exam" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Create New Exam
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={createExam} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Name
                  </label>
                  <input
                    type="text"
                    name="examName"
                    value={formData.examName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter exam name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    name="courseCode"
                    value={formData.courseCode}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room No
                  </label>
                  <input
                    type="text"
                    name="roomNo"
                    value={formData.roomNo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter section"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter start time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter end time"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exam Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    onClick={createExam}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Create Exam
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {activeModal === "notice" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Notice
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={createNotice} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter notice title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Type
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="notice_type"
                    value={formData.notice_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select notice type</option>
                    <option value="general">General Notice</option>
                    <option value="academic">Academic Notice</option>
                    <option value="exam">Exam Notice</option>
                    <option value="event">Event Notice</option>
                    <option value="holiday">Holiday Notice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="department_id"
                    value={formData.department_id}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select department</option>
                    {departmentData.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Content
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Enter notice content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Publication Date
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
