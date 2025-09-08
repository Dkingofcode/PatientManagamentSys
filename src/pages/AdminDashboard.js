import React from "react";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAppointments } from "../contexts/AppointmentContext";
import { useNotifications } from "../contexts/NotificationContext";
import { Users, Calendar, FlaskConical, TrendingUp, DollarSign, Activity, Menu, Bell, AlertTriangle, Package, CheckCircle, Clock, XCircle, X, Check, CheckCheck, Trash2, Filter, Info, } from "lucide-react";
import SettingsSidebar from "../components/sidebar";
function AdminDashboard() {
    const { appointments, patients } = useAppointments();
    const { getNotificationsByRole, getNotificationsByCategory, triggerPatientRegistration, triggerInventoryAlert, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications, } = useNotifications();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationFilter, setNotificationFilter] = useState("all");
    const [inventoryItems] = useState([
        {
            id: 1,
            item: "Blood Collection Tubes",
            stock: 15,
            minLevel: 20,
            status: "low",
        },
        {
            id: 2,
            item: "Urine Test Strips",
            stock: 8,
            minLevel: 15,
            status: "critical",
        },
        { id: 3, item: "CBC Reagent Kit", stock: 25, minLevel: 10, status: "ok" },
        { id: 4, item: "X-Ray Films", stock: 12, minLevel: 20, status: "low" },
        {
            id: 5,
            item: "Syringes (10ml)",
            stock: 3,
            minLevel: 25,
            status: "critical",
        },
    ]);
    const today = new Date().toISOString().split("T")[0];
    const todayAppointments = appointments.filter((apt) => apt.date === today);
    const totalRevenue = appointments.reduce((sum, apt) => sum +
        (apt.tests?.reduce((testSum, test) => testSum + Object.values(test.prices ?? {}).reduce((a, b) => a + b, 0), 0) ?? 0), 0);
    // Get admin notifications
    const adminNotifications = getNotificationsByRole("admin");
    const unreadNotifications = adminNotifications.filter((n) => !n.read);
    const criticalNotifications = adminNotifications.filter((n) => n.priority === "critical" && !n.read);
    const inventoryNotifications = getNotificationsByCategory("inventory");
    // Filter notifications based on selected filter
    const filteredNotifications = adminNotifications.filter((notification) => {
        switch (notificationFilter) {
            case "unread":
                return !notification.read;
            case "high":
                return notification.priority === "high";
            case "critical":
                return notification.priority === "critical";
            default:
                return true;
        }
    });
    // Trigger inventory alerts on component mount and when inventory changes
    useEffect(() => {
        inventoryItems.forEach((item) => {
            if (item.stock <= item.minLevel) {
                // Check if we already have a recent notification for this item
                const recentNotification = inventoryNotifications.find((n) => n.data?.id === item.id &&
                    new Date(n.timestamp).getTime() > Date.now() - 60 * 60 * 1000 // Within last hour
                );
                if (!recentNotification) {
                    triggerInventoryAlert(item);
                }
            }
        });
    }, [inventoryItems, triggerInventoryAlert, inventoryNotifications]);
    // Simulate new patient registration (for demo purposes)
    const simulatePatientRegistration = () => {
        const newPatient = {
            id: Date.now().toString(),
            name: "Jane Doe",
            email: "jane.doe@email.com",
            phone: "+1-555-0199",
            category: "regular-patient",
        };
        triggerPatientRegistration(newPatient);
    };
    const getNotificationIcon = (category, type) => {
        switch (category) {
            case "patient":
                return <Users size={16} className="text-blue-600"/>;
            case "appointment":
                return <Calendar size={16} className="text-green-600"/>;
            case "lab":
                return <FlaskConical size={16} className="text-purple-600"/>;
            case "inventory":
                return <Package size={16} className="text-red-600"/>;
            default:
                return getTypeIcon(type);
        }
    };
    const getTypeIcon = (type) => {
        switch (type) {
            case "success":
                return <CheckCircle size={16} className="text-green-600"/>;
            case "warning":
                return <AlertTriangle size={16} className="text-yellow-600"/>;
            case "error":
            case "alert":
                return <XCircle size={16} className="text-red-600"/>;
            default:
                return <Info size={16} className="text-blue-600"/>;
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
                return "border-l-red-500 bg-red-50";
            case "high":
                return "border-l-orange-500 bg-orange-50";
            case "medium":
                return "border-l-blue-500 bg-blue-50";
            default:
                return "border-l-gray-500 bg-gray-50";
        }
    };
    const formatTimeAgo = (timestamp) => {
        const now = new Date().getTime();
        const notificationTime = new Date(timestamp).getTime();
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
        if (diffInMinutes < 1)
            return "Just now";
        if (diffInMinutes < 60)
            return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
            return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };
    const stats = [
        {
            label: "Total Patients",
            value: patients.length,
            icon: Users,
            color: "bg-gray-700",
            change: "+12%",
        },
        {
            label: "Today's Appointments",
            value: todayAppointments.length,
            icon: Calendar,
            color: "bg-gray-700",
            change: "+8%",
        },
        {
            label: "Tests Completed",
            value: appointments.filter((apt) => apt.status === "completed").length,
            icon: FlaskConical,
            color: "bg-gray-700",
            change: "+15%",
        },
        {
            label: "Revenue",
            value: `₦${totalRevenue.toLocaleString()}`,
            icon: DollarSign,
            color: "bg-gray-700",
            change: "+23%",
        },
    ];
    const recentActivities = [
        {
            id: 1,
            type: "appointment",
            message: "New appointment scheduled",
            time: "5 minutes ago",
            icon: Calendar,
        },
        {
            id: 2,
            type: "patient",
            message: "New patient registered",
            time: "15 minutes ago",
            icon: Users,
        },
        {
            id: 3,
            type: "test",
            message: "Test results uploaded",
            time: "1 hour ago",
            icon: FlaskConical,
        },
    ];
    const getInventoryStatusColor = (status) => {
        switch (status) {
            case "critical":
                return "bg-red-100 text-red-800 border-red-200";
            case "low":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "ok":
                return "bg-green-100 text-green-800 border-green-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    const getInventoryIcon = (status) => {
        switch (status) {
            case "critical":
                return <XCircle size={16} className="text-red-600"/>;
            case "low":
                return <AlertTriangle size={16} className="text-yellow-600"/>;
            case "ok":
                return <CheckCircle size={16} className="text-green-600"/>;
            default:
                return <Package size={16} className="text-gray-600"/>;
        }
    };
    return (<Layout title="Admin Dashboard">
      <div className="space-y-6 relative">
        {/* Header with Critical Alerts and Notification Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Hamburger Button */}
            <button onClick={() => setShowSidebar(true)} className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 inline-flex items-center">
              <Menu size={20}/>
            </button>

            {/* Critical Alerts Banner */}
            {criticalNotifications.length > 0 && (<div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2 animate-pulse">
                <AlertTriangle size={20} className="text-red-600"/>
                <span className="text-sm font-medium text-red-800">
                  {criticalNotifications.length} Critical Alert
                  {criticalNotifications.length > 1 ? "s" : ""}
                </span>
              </div>)}
          </div>

          <div className="flex items-center space-x-4">
            {/* Demo Button */}
            <button onClick={simulatePatientRegistration} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              Simulate Patient Registration
            </button>

            {/* Admin Notification Button */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-full bg-white shadow-sm border border-gray-200">
                <Bell size={20}/>
                {unreadNotifications.length > 0 && (<span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifications.length > 99
                ? "99+"
                : unreadNotifications.length}
                  </span>)}
              </button>

              {/* Admin Notification Panel */}
              {showNotifications && (<div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Admin Notifications ({unreadNotifications.length}{" "}
                        unread)
                      </h3>
                      <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20}/>
                      </button>
                    </div>

                    {/* Filter and Actions */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-2">
                        <Filter size={16} className="text-gray-400"/>
                        <select value={notificationFilter} onChange={(e) => setNotificationFilter(e.target.value)} className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="all">All</option>
                          <option value="unread">Unread</option>
                          <option value="high">High Priority</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>

                      <div className="flex items-center space-x-2">
                        {unreadNotifications.length > 0 && (<button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                            <CheckCheck size={14}/>
                            <span>Mark all read</span>
                          </button>)}
                        <button onClick={clearAllNotifications} className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1">
                          <Trash2 size={14}/>
                          <span>Clear all</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {filteredNotifications.length > 0 ? (filteredNotifications.map((notification) => (<div key={notification.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors border-l-4 ${getPriorityColor(notification.priority)} ${!notification.read ? "bg-blue-50" : "bg-white"}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.category, notification.type)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </h4>
                                  {notification.actionRequired && (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                      Action Required
                                    </span>)}
                                  {notification.priority === "critical" && (<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white animate-pulse">
                                      CRITICAL
                                    </span>)}
                                </div>

                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                  {notification.message}
                                </p>

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Clock size={12}/>
                                    <span>
                                      {formatTimeAgo(notification.timestamp)}
                                    </span>
                                    <span className="capitalize">
                                      • {notification.category}
                                    </span>
                                  </div>

                                  {!notification.read && (<div className="w-2 h-2 bg-blue-500 rounded-full"></div>)}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.read && (<button onClick={() => markAsRead(notification.id)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Mark as read">
                                  <Check size={14}/>
                                </button>)}
                              <button onClick={() => deleteNotification(notification.id)} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Delete notification">
                                <X size={14}/>
                              </button>
                            </div>
                          </div>
                        </div>))) : (<div className="p-8 text-center text-gray-500">
                        <Bell size={48} className="mx-auto text-gray-300 mb-4"/>
                        <p className="text-sm">No notifications found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {notificationFilter !== "all"
                    ? `Try changing the filter`
                    : "You're all caught up!"}
                        </p>
                      </div>)}
                  </div>

                  {/* Footer */}
                  {filteredNotifications.length > 0 && (<div className="p-3 border-t border-gray-200 bg-gray-50 text-center">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        View All Notifications
                      </button>
                    </div>)}
                </div>)}

              {/* Overlay */}
              {showNotifications && (<div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}/>)}
            </div>
          </div>
        </div>

        {/* Sidebar Overlay */}
        {showSidebar && (<div className="fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/15" onClick={() => setShowSidebar(false)}></div>
            <div className={`
                absolute top-0 left-0 h-full w-64 bg-white shadow-xl p-4
                transform transition-transform duration-300
                ${showSidebar ? "translate-x-0" : "-translate-x-full"}
              `}>
              <button onClick={() => setShowSidebar(false)} className="mb-4 p-2 bg-gray-100 rounded hover:bg-gray-200">
                Close
              </button>
              <SettingsSidebar />
            </div>
          </div>)}

        {/* Notification Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Notifications</p>
                <p className="text-2xl font-bold text-gray-900">
                  {adminNotifications.length}
                </p>
              </div>
              <Bell size={24} className="text-blue-600"/>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">
                  {unreadNotifications.length}
                </p>
              </div>
              <Clock size={24} className="text-yellow-600"/>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {criticalNotifications.length}
                </p>
              </div>
              <AlertTriangle size={24} className="text-red-600"/>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Alerts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {inventoryNotifications.length}
                </p>
              </div>
              <Package size={24} className="text-purple-600"/>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (<div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} className="text-white"/>
                  </div>
                </div>
              </div>);
        })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Bell size={20} className="mr-2"/>
                Recent Notifications
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {adminNotifications.slice(0, 5).map((notification) => (<div key={notification.id} className={`p-3 rounded-lg border ${!notification.read
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${notification.priority === "critical"
                ? "bg-red-100 text-red-800"
                : notification.priority === "high"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-blue-100 text-blue-800"}`}>
                            {notification.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {!notification.read && (<button onClick={() => markAsRead(notification.id)} className="ml-2 p-1 text-blue-600 hover:text-blue-800">
                          <CheckCircle size={16}/>
                        </button>)}
                    </div>
                  </div>))}
                {adminNotifications.length === 0 && (<p className="text-sm text-gray-500 text-center py-4">
                    No notifications yet
                  </p>)}
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Package size={20} className="mr-2"/>
                Inventory Status
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {inventoryItems.map((item) => (<div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                      {getInventoryIcon(item.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.item}
                        </p>
                        <p className="text-xs text-gray-600">
                          Stock: {item.stock} | Min: {item.minLevel}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getInventoryStatusColor(item.status)}`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>))}
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp size={20} className="mr-2"/>
                System Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="text-sm font-medium text-green-600 flex items-center">
                    <CheckCircle size={16} className="mr-1"/>
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    2.3 GB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900">
                    2 hours ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Notifications Sent
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {adminNotifications.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rest of your content unchanged */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity size={20} className="mr-2"/>
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
            const Icon = activity.icon;
            return (<div key={activity.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon size={16} className="text-gray-600"/>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.message}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>);
        })}
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp size={20} className="mr-2"/>
                System Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="text-sm font-medium text-blue-600">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    2.3 GB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900">
                    2 hours ago
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Notifications Sent
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {adminNotifications.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>);
}
export default AdminDashboard;
