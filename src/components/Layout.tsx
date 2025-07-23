import React from 'react';
//import { useAuth } from '../contexts/AuthContext';
//import { useNotifications } from '../contexts/NotificationContext';
import { LogOut, Bell, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

function Layout({ children, title }: LayoutProps) {
 // const { user, logout } = useAuth();
 // const { unreadCount } = useNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-[#3065B5]">PRISM 2.0</h1>
              </div>
              <div className="ml-8">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
                <Bell size={20} />
                {(
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {"88"}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User size={20} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">dfghjshg</span>
                  <span className="text-xs text-gray-500 capitalize">utgftyui</span>
                </div>
                
                <button
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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