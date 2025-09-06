import React from "react";
import { LogOut, Bell, User, Home } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-auto py-2 gap-y-4 sm:gap-y-0">
            {/* Left section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
              <h1 className="text-xl sm:text-2xl font-bold text-[#3065B5] text-center sm:text-left">
                PRISM 2.0
              </h1>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 text-center sm:text-left">
                {title}
              </h2>
            </div>

            {/* Right section */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-[#3065B5] transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  88
                </span>
              </button>

              {/* If user is Admin, show "Back to Admin Dashboard" */}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  title="Go to Admin Dashboard"
                >
                  <Home size={16} />
                  <span className="text-sm font-medium">Admin Dashboard</span>
                </Link>
              )}

              {/* User info and logout */}
              <div className="flex items-center space-x-3">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-2 text-center sm:text-left">
                  <User size={20} className="text-gray-400 mb-1 sm:mb-0" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </span>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-[#3065B5] transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
