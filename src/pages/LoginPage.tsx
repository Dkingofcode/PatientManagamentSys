import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/prisms.png";

const USERS = [
  {
    email: "Inventoryprisms@gmail.com",
    password: "Inventoryprismspassword",
    role: "inventory",
  },
  { email: "fd1prisms@gmail.com", password: "prisms911", role: "front-desk" },
  {
    email: "fd2prisms@gmail.com",
    password: "prismspassword",
    role: "front-desk",
  },
  { email: "droduprisms@gmail.com", password: "prisms444", role: "doctor" },
  {
    email: "labprisms@gmail.com",
    password: "0987654321",
    role: "lab-technician",
  },
  { email: "sonoprisms@gmail.com", password: "red9908890", role: "sonography" },
  {
    email: "Patientprisms@gmail.com",
    password: "patientprismspassword",
    role: "patient",
    id: "265edf4f-9266-4e6c-a256-be8275d27e3b",
    userId: "7311113c-66b2-44e5-a538-a2ddb180c2c4",
  },
  {
    email: "drkuti@yahoo.com",
    password: "drkutipassword",
    role: "doctor",
    id: "598d7775-89b2-4512-ac1e-6ae2ee64afb9",
    userId: "9d5e55fe-741c-4aac-886d-a1efdc7a479b",
  },
  {
    email: "radprism@yahoo.com",
    password: "radprismspassword",
    role: "radiology",
  },

  {
    Test: "Blood",
    TestId: "d8404f05-f3ee-4716-93c0-84ccf1483775",
  },
  {
    Test: "Chest X-ray",
    TestId: "77c2bec0-4904-4204-9b98-ff7886f1c4f1",
  },
  {
    Test: "Liver Funcion Test",
    TestId: "6ba7fba1-6990-4a49-8503-d1b5ef9cac56",
  },
  {
    Test: "Urine Test",
    TestId: "4eafcd65-33c7-49b7-8c48-bb0f02518c00",
  },
];

function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleRoutes = {
        "front-desk": "/front-desk",
        doctor: "/doctor",
        "lab-technician": "/lab-technician",
        admin: "/admin",
        inventory: "/manager",
        patient: "/patient",
      };
      navigate(roleRoutes[user.role as keyof typeof roleRoutes]);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(identifier, password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 bg-white">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8 flex items-center gap-4">
            <img
              src={Logo}
              alt="PRISMS Healthcare Logo"
              className="h-16 w-auto"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username, Email, or User ID
              </label>
              <input
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="username, email, or ID"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can use your username, email address, or unique user ID
              </p>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-16 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-purple-600 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <div className="mt-2 text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-purple-700 hover:text-blue-800"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ backgroundColor: "rgb(128, 0, 163)", color: "#fff" }}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Need help? Contact IT Support at{" "}
              <a
                href="mailto:support@hospital.com"
                className="text-blue-600 hover:text-blue-800"
              >
                support@prismhealthcare.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
