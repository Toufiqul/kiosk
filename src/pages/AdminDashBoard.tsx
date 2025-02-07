import React from "react";
import { supabase } from "../client";
import { useEffect, useState } from "react";
import { useAuthStore } from "../state/auth";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { HolidayModal } from "@/components/ui/addHolidayModal";
import { ClassroomModal } from "@/components/ui/addLevelPlan";

function AdminDashBoard() {
  // uuidv4(); //to generate uuid
  const navigate = useNavigate();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [noticeData, setNoticeData] = useState<any[]>([]);
  const [examData, setExamData] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    department_id: "4f09e2a4-4b73-46fc-a6a4-7c4a1721e2cd",
    notice_type: "",
    published_by: "d352bd61-3242-4e72-ae4d-ccd1c527aa95",
    published_at: new Date(),
    examDate: "",
    examName: "",
    subject: "",
    sec: "",
  });
  const closeModal = () => {
    setActiveModal(null);
    setError(null);
    setFormData({
      title: "",
      content: "",
      department_id: "",
      notice_type: "",
      published_by: "",
      published_at: new Date(),
      examName: "",
      subject: "",
      sec: "",
      examDate: "",
    });
  };
  const [date, setDate] = React.useState<Date>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const createExam = () => {
    console.log(formData);
    console.log(date);
  };
  const createNotice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("notices")
        .insert({ id: uuidv4(), ...formData });
      if (error) {
        console.error(error);
      }
      console.log(formData);
      //   closeModal();
    } catch (error) {
      console.error(error);
    }
  };
  async function fetchAllDepartmentData() {
    const { data: departmentData, error } = await supabase
      .from("departments")
      .select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    setDepartmentData(departmentData);
  }
  async function fetchAllNoticeData() {
    const { data, error } = await supabase.from("notices").select();
    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    setNoticeData(data);
  }
  async function fetchAllExamData() {
    const { data, error } = await supabase.from("exam_schedules").select("*");

    if (error) {
      console.error("Error fetching data:", error.message);
      return;
    }
    setExamData(data);
  }
  useEffect(() => {
    fetchAllDepartmentData();
    fetchAllNoticeData();
    fetchAllExamData();
  }, []);
  const navToNotices = () => {
    navigate("/notice");
    console.log("navToNotices");
  };

  const handleSave = (holiday: {
    start_date: string | null;
    end_date: string | null;
    occasion: string;
  }) => {
    console.log("New Holiday:", holiday);
    // Send to backend via API
  };
  return (
    <div className="p-6 font-sans">
      <h1 className="text-center text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-6 justify-center mb-6">
        <div className="w-56 p-4 border border-gray-300 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold">Exams</h2>
          <p className="text-gray-600 mt-2">
            View and manage all exams here.{examData.length}
          </p>
        </div>

        <div
          className="w-56 p-4 border border-gray-300 rounded-lg shadow-lg text-center"
          onClick={navToNotices}
        >
          <h2 className="text-xl font-semibold">Notices</h2>
          <p className="text-gray-600 mt-2">
            There are {noticeData.length} notices
          </p>
        </div>
      </div>

      <div className="flex gap-6 justify-center">
        <Button onClick={() => setActiveModal("exam")}>Add Exam</Button>
        <Button onClick={() => setActiveModal("notice")}>Add Notice</Button>
        <Button onClick={() => setActiveModal("holidays")}>Add Holiday</Button>
        <Button onClick={() => setActiveModal("levelPlan")}>
          Add Classroom
        </Button>
      </div>
      <HolidayModal
        isOpen={activeModal === "holidays"}
        onClose={() => setActiveModal("")}
        onSave={handleSave}
      />
      <ClassroomModal
        isOpen={activeModal === "levelPlan"}
        onClose={() => setActiveModal("")}
        onSave={handleSave}
      />
      {activeModal === "exam" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Create Exam</h2>
            <form onSubmit={createExam}>
              <input
                type="text"
                name="examName"
                value={formData.examName}
                placeholder="Department ID"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />

              <input
                type="text"
                name="subject"
                placeholder="Subject"
                className="w-full p-2 mb-4 border rounded"
                value={formData.subject}
                onChange={handleChange}
              />

              <input
                type="text"
                name="department_id"
                value={formData.department_id}
                placeholder="Department ID"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="SEC"
                name="sec"
                className="w-full p-2 mb-4 border rounded"
                value={formData.sec}
                onChange={handleChange}
              />
              <div className="mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-2"
              >
                Create Exam
              </button>
              <button
                className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
      {activeModal === "notice" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              Create Notice
            </h2>
            <form onSubmit={createNotice}>
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="Title"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                name="content"
                value={formData.content}
                placeholder="Content"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                name="department_id"
                value={formData.department_id}
                placeholder="Department ID"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />
              <input
                type="text"
                name="notice_type"
                value={formData.notice_type}
                placeholder="Notice Type"
                className="w-full p-2 mb-4 border rounded"
                onChange={handleChange}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-2"
              >
                Create Notice
              </button>
              <button
                className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                onClick={closeModal}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashBoard;
