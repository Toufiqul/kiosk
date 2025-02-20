import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../client";
import { useAuthStore } from "../state/auth";

function Home() {
  const navigate = useNavigate();
  const authenticateWith = useAuthStore((state) => state.authenticateWith);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [activeModal, setActiveModal] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    id: "",
    department: "",
    section: "",
    role: "student",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);


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
            password: formData.password,
          },
        ]);

        if (insertError) throw insertError;
        authenticateWith("token");
        closeModal();
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };


  const handleLogin = async () => {
    setError(null);
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", email);
      
      if (data && data?.length === 1) {
        if (data[0].password === password) {
          authenticateWith("token");
          closeModal();
          navigate("/dashboard");
        } else {
          setError("Email or password is incorrect");
        }
      } else {
        setError("Email or password is incorrect");
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    setEmail("");
    setPassword("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 bg-white border-b">
        <div className="flex items-center justify-center">
          <img
            src="https://afd.gov.bd/sites/default/files/inline-images/MIST%20Logo_0.png"
            alt="MIST Logo"
            className="h-12 w-auto"
          />
          <h1 className="text-xl font-bold text-gray-800 ml-3">MIST COMPASS</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto text-center mb-12">
          <img
            src="https://afd.gov.bd/sites/default/files/inline-images/MIST%20Logo_0.png"
            alt="MIST Logo"
            className="w-32 h-32 mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome to MIST COMPASS
          </h2>
          <p className="text-gray-600">
            Your digital guide to Military Institute of Science and Technology
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-3xl mx-auto">
          {/* Student Card */}
          <button
            onClick={() => setActiveModal("student")}
            className="bg-indigo-600 rounded-lg p-6 text-white hover:bg-indigo-700 transition-colors flex flex-col items-center justify-center aspect-square"
          >
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 14l9-5-9-5-9 5 9 5z" />
              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            </svg>
            <span>Student</span>
          </button>

          {/* Admin Card */}
          <button
            onClick={() => setActiveModal("admin")}
            className="bg-purple-600 rounded-lg p-6 text-white hover:bg-purple-700 transition-colors flex flex-col items-center justify-center aspect-square"
          >
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Admin</span>
          </button>

          {/* Guest Card */}
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-emerald-600 rounded-lg p-6 text-white hover:bg-emerald-700 transition-colors flex flex-col items-center justify-center aspect-square"
          >
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Guest</span>
          </button>

          {/* Sign Up Card */}
          <button
            onClick={() => setActiveModal("signup")}
            className="bg-indigo-600 rounded-lg p-6 text-white hover:bg-indigo-700 transition-colors flex flex-col items-center justify-center aspect-square"
          >
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Sign Up</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 bg-gray-900 text-white text-center">
        <p className="text-sm">© {new Date().getFullYear()} Military Institute of Science and Technology</p>
        {/* <p className="text-xs text-gray-400 mt-1">Technology for Advancement</p> */}
      </footer>

      {/* Login Modal */}
      {(activeModal === "admin" || activeModal === "student") && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-center mb-6">
              {activeModal === "admin" ? "Admin Login" : "Student Login"}
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded">
                  {error}
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  onClick={handleLogin}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                >
                  Login
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {activeModal === "signup" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-center mb-6">Create Account</h2>
            <form className="space-y-4">
              
              <input
                type="text"
                placeholder="Student ID"
                className="w-full p-2 border rounded"
                value={formData.id}
                onChange={(e) => setFormData({...formData, id: e.target.value})}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full p-2 border rounded"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <select
                className="w-full p-2 border rounded"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                
              </select>
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded">
                  {error}
                </div>
              )}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  onClick={handleSignup}
                >
                  Sign Up
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;