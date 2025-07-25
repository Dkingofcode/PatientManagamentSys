//import React from 'react';
import Layout from '../components/Layout';
import { useAppointments } from '../contexts/AppointmentContext';
//import { useAuth } from '../contexts/AuthContext';
import { Users, Calendar, FlaskConical, TrendingUp, DollarSign, Activity } from 'lucide-react';

function AdminDashboard() {
  const { appointments, patients } = useAppointments();

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(apt => apt.date === today);
  
  const totalRevenue = appointments.reduce((sum, apt) => 
  sum + apt.tests.reduce((testSum, test) => 
    testSum + Object.values(test.prices).reduce((a, b) => a + b, 0), 
  0), 
0);

  const stats = [
    {
      label: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'bg-gray-700',
      change: '+12%',
    },
    {
      label: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-gray-700',
      change: '+8%',
    },
    {
      label: 'Tests Completed',
      value: appointments.filter(apt => apt.status === 'completed').length,
      icon: FlaskConical,
      color: 'bg-gray-700',
      change: '+15%',
    },
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-gray-700',
      change: '+23%',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'appointment',
      message: 'New appointment scheduled',
      time: '5 minutes ago',
      icon: Calendar,
    },
    {
      id: 2,
      type: 'patient',
      message: 'New patient registered',
      time: '15 minutes ago',
      icon: Users,
    },
    {
      id: 3,
      type: 'test',
      message: 'Test results uploaded',
      time: '1 hour ago',
      icon: FlaskConical,
    },
  ];

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity size={20} className="mr-2" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon size={16} className="text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp size={20} className="mr-2" />
                System Overview
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">System Status</span>
                  <span className="text-sm font-medium text-blue-600">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="text-sm font-medium text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Size</span>
                  <span className="text-sm font-medium text-gray-900">2.3 GB</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.slice(0, 5).map((appointment) => {
                  const patient = patients.find(p => p.id === appointment.patientId);
                  return (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {patient?.name || 'Unknown Patient'}
                        </div>
                        <div className="text-sm text-gray-500">{patient?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {appointment.tests.map(test => test.name).join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          appointment.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AdminDashboard;