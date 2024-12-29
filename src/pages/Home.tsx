import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const navigate = useNavigate();

  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">MIST COMPASS</h1>
        <img
          src="/path-to-your-logo/mist-logo.png"
          alt="MIST Logo"
          className="w-32 mx-auto"
        />
      </header>
      <main>
        <div className="space-y-4">
          <button
            className="px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600"
            onClick={() => setActiveModal("admin")}
          >
            Admin Login
          </button>
          <button
            className="px-6 py-3 text-white bg-green-500 rounded hover:bg-green-600"
            onClick={() => navigate("/guest-access")}
          >
            Guest Access
          </button>
          <button
            className="px-6 py-3 text-white bg-purple-500 rounded hover:bg-purple-600"
            onClick={() => setActiveModal("student")}
          >
            Student Login
          </button>
          <button
            className="px-6 py-3 text-white bg-yellow-500 rounded hover:bg-yellow-600"
            onClick={() => setActiveModal("guardian")}
          >
            Guardian Login
          </button>
        </div>
      </main>

      {/* Admin Modal */}
      {activeModal === "admin" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
            <input
              type="text"
              placeholder="ID"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="Department"
              placeholder="Department"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="SEC"
              placeholder="SEC"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 mb-2"
              onClick={() => alert("Admin Login!")}
            >
              Login
            </button>
            <button
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Student Modal */}
      {activeModal === "student" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              Student Login
            </h2>
            <input
              type="text"
              placeholder="ID"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Department"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Section"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              className="w-full px-4 py-2 text-white bg-purple-500 rounded hover:bg-purple-600 mb-2"
              onClick={() => alert("Student Login!")}
            >
              Login
            </button>
            <button
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Guardian Modal */}
      {activeModal === "guardian" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-center">
              Guardian Login
            </h2>
            <input
              type="text"
              placeholder="ID"
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="text"
              placeholder="Department"
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              className="w-full px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600 mb-2"
              onClick={() => alert("Guardian Login!")}
            >
              Login
            </button>
            <button
              className="w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
