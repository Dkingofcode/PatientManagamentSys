// import React from 'react';
// import { 
//   Activity, 
//   Users, 
//   Calendar, 
//   FileText, 
//   Stethoscope, 
//   Pill, 
//   ClipboardList,
//   Settings,
//   Bell,
//   Search,
//   Menu
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// const Dashboard = () => {
//   const { user, logout } = useAuth();
  
//   // Sample data - replace with real data from your API
//   const stats = [
//     { title: "Today's Appointments", value: "24", icon: <Calendar className="w-6 h-6" />, change: "+2 from yesterday" },
//     { title: "Active Patients", value: "143", icon: <Users className="w-6 h-6" />, change: "5 new this week" },
//     { title: "Pending Lab Results", value: "18", icon: <ClipboardList className="w-6 h-6" />, change: "3 awaiting review" },
//     { title: "Prescriptions", value: "42", icon: <Pill className="w-6 h-6" />, change: "12 completed today" }
//   ];

//   const recentActivities = [
//     { time: "10:30 AM", description: "Dr. Smith completed patient consultation", user: "Dr. Jane Smith" },
//     { time: "09:45 AM", description: "New lab test results uploaded", user: "Lab Technician" },
//     { time: "09:15 AM", description: "Patient checked in at front desk", user: "Reception" },
//     { time: "Yesterday", description: "System maintenance completed", user: "IT Admin" }
//   ];

//   const upcomingAppointments = [
//     { time: "11:30 AM", patient: "Robert Johnson", doctor: "Dr. Patel", type: "Follow-up" },
//     { time: "1:45 PM", patient: "Sarah Williams", doctor: "Dr. Lee", type: "New Patient" },
//     { time: "3:00 PM", patient: "Michael Brown", doctor: "Dr. Smith", type: "Consultation" }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
//           <div className="flex items-center">
//             <Stethoscope className="h-8 w-8 text-blue-600 mr-2" />
//             <h1 className="text-xl font-bold text-gray-900">Hospital Management System</h1>
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
//               <Bell className="h-6 w-6" />
//             </button>
//             <div className="relative">
//               <div className="flex items-center space-x-2">
//                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
//                   <span className="text-blue-600 font-medium">
//                     {user?.name?.charAt(0) || 'U'}
//                   </span>
//                 </div>
//                 <span className="text-sm font-medium text-gray-700">{user?.name || 'User'}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Banner */}
//         <div className="bg-blue-50 rounded-lg p-6 mb-8">
//           <div className="flex items-center">
//             <div className="flex-shrink-0">
//               <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
//                 <Activity className="h-6 w-6 text-blue-600" />
//               </div>
//             </div>
//             <div className="ml-4">
//               <h2 className="text-lg font-medium text-gray-900">
//                 Welcome back, {user?.name || 'User'}!
//               </h2>
//               <p className="text-sm text-gray-500">
//   {user ? (
//     user.role === 'doctor' ? 'You have 5 appointments scheduled for today.' :
//     user.role === 'admin' ? 'System is running normally. No critical issues.' :
//     user.role === 'patient' ? 'Your next appointment is tomorrow at 10:00 AM.' :
//     'Here\'s what\'s happening today.'
//   ) : 'Here\'s what\'s happening today.'}
// </p>
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
//           {stats.map((stat, index) => (
//             <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
//               <div className="p-5">
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                       {stat.icon}
//                     </div>
//                   </div>
//                   <div className="ml-5 w-0 flex-1">
//                     <dl>
//                       <dt className="text-sm font-medium text-gray-500 truncate">
//                         {stat.title}
//                       </dt>
//                       <dd>
//                         <div className="text-lg font-medium text-gray-900">
//                           {stat.value}
//                         </div>
//                       </dd>
//                     </dl>
//                   </div>
//                 </div>
//               </div>
//               <div className="bg-gray-50 px-5 py-3">
//                 <div className="text-sm">
//                   <span className="text-gray-500">{stat.change}</span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Two Column Layout */}
//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
//           {/* Recent Activities */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Recent Activities
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 System events and user actions
//               </p>
//             </div>
//             <div className="bg-white overflow-hidden">
//               <ul className="divide-y divide-gray-200">
//                 {recentActivities.map((activity, index) => (
//                   <li key={index} className="px-6 py-4">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
//                         <Activity className="h-5 w-5 text-gray-500" />
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {activity.description}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {activity.time} • {activity.user}
//                         </div>
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Upcoming Appointments */}
//           <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//             <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
//               <h3 className="text-lg leading-6 font-medium text-gray-900">
//                 Upcoming Appointments
//               </h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 Today's schedule
//               </p>
//             </div>
//             <div className="bg-white overflow-hidden">
//               <ul className="divide-y divide-gray-200">
//                 {upcomingAppointments.map((appointment, index) => (
//                   <li key={index} className="px-6 py-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                           <Calendar className="h-5 w-5 text-blue-600" />
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">
//                             {appointment.patient}
//                           </div>
//                           <div className="text-sm text-gray-500">
//                             {appointment.type} with {appointment.doctor}
//                           </div>
//                         </div>
//                       </div>
//                       <div className="text-sm font-medium text-gray-900">
//                         {appointment.time}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//               <div className="px-6 py-4 text-center border-t border-gray-200">
//                 <button
//                   type="button"
//                   className="text-sm font-medium text-blue-600 hover:text-blue-500"
//                 >
//                   View full schedule →
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions - Role Specific */}
//         <div className="mt-8">
//           <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//             {user?.role === 'doctor' && (
//               <>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <FileText className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">New Note</span>
//                 </button>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <Pill className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">Prescribe</span>
//                 </button>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <ClipboardList className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">Order Test</span>
//                 </button>
//               </>
//             )}
//             {user?.role === 'admin' && (
//               <>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <Users className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">Add User</span>
//                 </button>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <Settings className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">Settings</span>
//                 </button>
//               </>
//             )}
//             {user?.role === 'patient' && (
//               <>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <Calendar className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">Book Appointment</span>
//                 </button>
//                 <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//                   <FileText className="h-6 w-6 mx-auto text-blue-600" />
//                   <span className="mt-2 block text-sm font-medium text-gray-900">View Records</span>
//                 </button>
//               </>
//             )}
//             <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//               <Search className="h-6 w-6 mx-auto text-blue-600" />
//               <span className="mt-2 block text-sm font-medium text-gray-900">Find Patient</span>
//             </button>
//             <button className="bg-white p-4 rounded-lg shadow text-center hover:bg-gray-50">
//               <FileText className="h-6 w-6 mx-auto text-blue-600" />
//               <span className="mt-2 block text-sm font-medium text-gray-900">Reports</span>
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;