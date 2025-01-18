import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client.js";
import { UserPlus } from "lucide-react";
function Home() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    id: "",
    department: "",
    section: "",
    role: "student",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const closeModal = () => {
    setActiveModal(null);
    setError(null);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      id: "",
      department: "",
      section: "",
      role: "student",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

      if (signUpError) throw signUpError;

      if (signUpData && signUpData.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: signUpData.user.id,
            email: formData.email,
            student_id: formData.id,
            // department: formData.department,
            // section: formData.section,
            role: formData.role,
          },
        ]);

        if (insertError) throw insertError;

        closeModal();
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (type: string) => {
    console.log(type);
  };
  const sign = async () => {
    // console.log(supabase);
    navigate("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold  text-gray-800 mb-4">MIST COMPASS</h1>
        <img
          src="https://afd.gov.bd/sites/default/files/inline-images/MIST%20Logo_0.png"
          alt="MIST Logo"
          className="w-64 mx-auto"
        />
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="flex flex-col items-center justify-center p-4 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
            onClick={() => setActiveModal("student")}
          >
            <img
              src="src/assets/icon_student.png" // Replace with your PNG icon path
              alt="Admin Icon"
              className="w-16 h-16 mb-2"
            />
            <p className="text-white font-semibold">Student</p>
          </div>
          <div
            className="flex flex-col items-center justify-center p-4 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
            onClick={() => setActiveModal("admin")}
          >
            <img
              src="src/assets/icon_admin.png" // Replace with your PNG icon path
              alt="Admin Icon"
              className="w-16 h-16 mb-2"
            />
            <p className="text-white font-semibold">Admin</p>
          </div>
          <div
            className="flex flex-col items-center justify-center p-4 bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            <img
              src="src/assets/icon_guest.png" // Replace with your PNG icon path
              alt="Admin Icon"
              className="w-16 h-16 mb-2"
            />
            <p className="text-white font-semibold">Guest</p>
          </div>
          <div
            onClick={() => setActiveModal("signup")}
            className="transform transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="p-8 bg-gradient-to-r from-green-500 to-green-600">
                <UserPlus className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-semibold text-white">Sign Up</h3>
                <p className="text-green-100 mt-2">Create your new account</p>
              </div>
            </div>
          </div>
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
              onClick={() => handleLogin("admin")}
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
              onClick={() => handleLogin("student")}
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
      <button onClick={sign}>signUp</button>
      {/* Sign Up Modal */}
      {activeModal === "signup" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Create Account
              </h2>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      ID Number
                    </label>
                    <input
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Student/Admin ID"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your Department"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Your Section"
                    required
                  />
                </div> */}

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
