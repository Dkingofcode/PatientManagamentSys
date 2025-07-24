import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAppointments } from '../contexts/AppointmentContext';
import { 
  FlaskConical, Upload, CheckCircle, Clock, FileText, AlertCircle, 
  Filter, Search, Calendar, MessageSquare, Bell, BarChart3, 
  Package, Shield, Activity, Play, Pause, Square, Eye, 
  Scan, AlertTriangle, Users, TrendingUp, Download, Settings,
  ChevronDown, ChevronRight, Star, Flag, Camera, Microscope
} from 'lucide-react';

interface TestAssignment {
  id: string;
  testName: string;
  patientName: string;
  priority: 'low' | 'normal' | 'high';
  department: string;
  status: 'assigned' | 'in-progress' | 'completed' | 'pending-qa';
  assignedAt: string;
  startTime?: string;
  completionTime?: string;
  sampleId: string;
  sampleStatus: 'received' | 'pending' | 'rejected';
  sampleCondition?: string;
  technicianNotes?: string;
  results?: any;
  qcStatus?: 'passed' | 'failed' | 'pending';
}

function LabTechnicianDashboard() {
 // const { getApprovedAppointments,  } = useAppointments();
  const [activeTab, setActiveTab] = useState('assignments');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showQCModal, setShowQCModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  // Get doctor-approved appointments that need lab processing
  // const doctorApprovedTests = getApprovedAppointments().filter(apt => 
  //   apt.doctorApproved === true && apt.labAssigned === true && apt.status === 'in-progress'
  // );

  console.log('Doctor Approved Tests:', );
  console.log('All Approved Appointments:', //getApprovedAppointments()
    );

  // Mock enhanced test assignments with all required fields
  const [testAssignments, setTestAssignments] = useState<TestAssignment[]>([
    {
      id: 'T001',
      testName: 'Complete Blood Count',
      patientName: 'John Smith',
      priority: 'high',
      department: 'Hematology',
      status: 'assigned',
      assignedAt: new Date().toISOString(),
      sampleId: 'S001',
      sampleStatus: 'received',
      sampleCondition: 'Good condition'
    },
    {
      id: 'T002',
      testName: 'Liver Function Test',
      patientName: 'Sarah Johnson',
      priority: 'normal',
      department: 'Biochemistry',
      status: 'in-progress',
      assignedAt: new Date(Date.now() - 3600000).toISOString(),
      startTime: new Date(Date.now() - 1800000).toISOString(),
      sampleId: 'S002',
      sampleStatus: 'received',
      technicianNotes: 'Sample processed normally'
    },
    {
      id: 'T003',
      testName: 'Urine Culture',
      patientName: 'Mike Wilson',
      priority: 'normal',
      department: 'Microbiology',
      status: 'completed',
      assignedAt: new Date(Date.now() - 7200000).toISOString(),
      startTime: new Date(Date.now() - 5400000).toISOString(),
      completionTime: new Date(Date.now() - 1800000).toISOString(),
      sampleId: 'S003',
      sampleStatus: 'received',
      qcStatus: 'passed'
    }
  ]);

  const [notifications] = useState([
    { id: 1, message: 'New urgent test assigned: Blood Culture', time: '5 min ago', read: false },
    { id: 2, message: 'QC alert: Control sample deviation detected', time: '15 min ago', read: false },
    { id: 3, message: 'Sample S004 requires immediate attention', time: '30 min ago', read: true }
  ]);

  const [inventory] = useState([
    { item: 'CBC Reagent Kit', stock: 5, minLevel: 10, status: 'low' },
    { item: 'Urine Test Strips', stock: 25, minLevel: 15, status: 'ok' },
    { item: 'Blood Collection Tubes', stock: 8, minLevel: 20, status: 'critical' }
  ]);

  // Get only doctor-approved appointments that have tests assigned and are in-progress
 // const approvedAppointments = getApprovedAppointments();
  // const inProgressAppointments = approvedAppointments.filter(apt => apt.status === 'in-progress');
  
  // Filter test assignments
  const filteredTests = testAssignments.filter(test => {
    const matchesSearch = test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || test.priority === filterPriority;
    const matchesDepartment = filterDepartment === 'all' || test.department === filterDepartment;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDepartment;
  });

  const stats = [
    {
      label: 'Doctor Approved',
      value:  "45",//doctorApprovedTests.length,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      label: 'Assigned Tests',
      value: testAssignments.filter(t => t.status === 'assigned').length,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      label: 'In Progress',
      value: testAssignments.filter(t => t.status === 'in-progress').length,
      icon: Activity,
      color: 'bg-blue-500',
    },
    {
      label: 'Completed',
      value: testAssignments.filter(t => t.status === 'completed').length,
      icon: FlaskConical,
      color: 'bg-purple-500',
    },
    {
      label: 'Pending QA',
      value: testAssignments.filter(t => t.status === 'pending-qa').length,
      icon: Shield,
      color: 'bg-yellow-500',
    },
  ];

  const handleTestAction = (testId: string, action: string) => {
    setTestAssignments(prev => prev.map(test => {
      if (test.id === testId) {
        const now = new Date().toISOString();
        switch (action) {
          case 'start':
            return { ...test, status: 'in-progress', startTime: now };
          case 'pause':
            return { ...test, status: 'assigned' };
          case 'complete':
            return { ...test, status: 'pending-qa', completionTime: now };
          default:
            return test;
        }
      }
      return test;
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending-qa': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout title="">
      <div className="space-y-6">
        {/* Header with Notifications */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#3065B5]">Lab Technician Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage test assignments and laboratory operations</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <button className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {notifications.filter(n => !n.read).length}
              </span>
            </button> */}
            {/* <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Settings size={20} />
            </button> */}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'doctor-approved', label: 'Doctor Approved Tests', icon: CheckCircle, badge: "35"},
                { id: 'assignments', label: 'Test Assignments', icon: FlaskConical },
                { id: 'schedule', label: 'Daily Schedule', icon: Calendar },
                { id: 'samples', label: 'Sample Tracking', icon: Scan },
                { id: 'qc', label: 'Quality Control', icon: Shield },
                { id: 'inventory', label: 'Inventory', icon: Package },
                { id: 'reports', label: 'Reports', icon: BarChart3 }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                    {tab.badge  && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'assignments' && (
              <div className="space-y-6">
                {/* Filters and Search */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tests or patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="assigned">Assigned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="pending-qa">Pending QA</option>
                  </select>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Immunology">Immunology</option>
                  </select>
                </div>

                {/* Test Assignments List */}
                <div className="space-y-4">
                  {filteredTests.map((test) => (
                    <div key={test.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(test.priority)}`}>
                              {test.priority.toUpperCase()}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                              {test.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div>
                              <p><strong>Patient:</strong> {test.patientName}</p>
                              <p><strong>Department:</strong> {test.department}</p>
                              <p><strong>Sample ID:</strong> {test.sampleId}</p>
                            </div>
                            <div>
                              <p><strong>Assigned:</strong> {new Date(test.assignedAt).toLocaleString()}</p>
                              {test.startTime && <p><strong>Started:</strong> {new Date(test.startTime).toLocaleString()}</p>}
                              {test.completionTime && <p><strong>Completed:</strong> {new Date(test.completionTime).toLocaleString()}</p>}
                            </div>
                            <div>
                              <p><strong>Sample Status:</strong> 
                                <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                  test.sampleStatus === 'received' ? 'bg-green-100 text-green-800' :
                                  test.sampleStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {test.sampleStatus}
                                </span>
                              </p>
                              {test.sampleCondition && <p><strong>Condition:</strong> {test.sampleCondition}</p>}
                              {test.qcStatus && <p><strong>QC Status:</strong> 
                                <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                                  test.qcStatus === 'passed' ? 'bg-green-100 text-green-800' :
                                  test.qcStatus === 'failed' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {test.qcStatus}
                                </span>
                              </p>}
                            </div>
                          </div>

                          {test.technicianNotes && (
                            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                              <strong>Notes:</strong> {test.technicianNotes}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          {test.status === 'assigned' && (
                            <button
                              onClick={() => handleTestAction(test.id, 'start')}
                              className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Play size={16} />
                              <span>Start</span>
                            </button>
                          )}
                          
                          {test.status === 'in-progress' && (
                            <>
                              <button
                                onClick={() => handleTestAction(test.id, 'pause')}
                                className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                              >
                                <Pause size={16} />
                                <span>Pause</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedTest(test.id);
                                  setShowResultsModal(true);
                                }}
                                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                <Upload size={16} />
                                <span>Results</span>
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => {
                              setSelectedTest(test.id);
                              setShowSampleModal(true);
                            }}
                            className="flex items-center space-x-1 px-2 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Today's Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Shift Information</h4>
                      <p className="text-sm text-gray-600 mt-1">8:00 AM - 4:00 PM</p>
                      <p className="text-sm text-gray-600">Bench: Hematology Station 2</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Workload</h4>
                      <p className="text-sm text-gray-600 mt-1">{testAssignments.length} tests assigned</p>
                      <p className="text-sm text-gray-600">{testAssignments.filter(t => t.status === 'completed').length} completed</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900">Instruments</h4>
                      <p className="text-sm text-gray-600 mt-1">CBC Analyzer - Online</p>
                      <p className="text-sm text-gray-600">Chemistry Analyzer - Online</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'samples' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Sample Tracking</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {testAssignments.map((test) => (
                        <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">Sample {test.sampleId}</p>
                            <p className="text-sm text-gray-600">{test.testName} - {test.patientName}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              test.sampleStatus === 'received' ? 'bg-green-100 text-green-800' :
                              test.sampleStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {test.sampleStatus}
                            </span>
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <Scan size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'qc' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">QC Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Internal QC</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Passed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">External QC</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Calibration</span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Valid</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowQCModal(true)}
                      className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Log QC Results
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">QC Trends</h3>
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp size={48} className="mx-auto mb-2" />
                      <p>QC trend charts would appear here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Inventory Status</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      {inventory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{item.item}</p>
                            <p className="text-sm text-gray-600">Current: {item.stock} | Min Level: {item.minLevel}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            item.status === 'ok' ? 'bg-green-100 text-green-800' :
                            item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'ok' ? 'OK' : item.status === 'low' ? 'LOW' : 'CRITICAL'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tests Completed</span>
                        <span className="font-medium">{testAssignments.filter(t => t.status === 'completed').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average TAT</span>
                        <span className="font-medium">2.5 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Error Rate</span>
                        <span className="font-medium">0.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Summary</h3>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2">
                      <Download size={16} />
                      <span>Export Report</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
                    <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2">
                      <FileText size={16} />
                      <span>View Activity Log</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showResultsModal && (
          <ResultsEntryModal
            testId={selectedTest}
            onClose={() => {
              setShowResultsModal(false);
              setSelectedTest(null);
            }}
            onSubmit={(results) => {
              handleTestAction(selectedTest!, 'complete');
              setShowResultsModal(false);
              setSelectedTest(null);
            }}
          />
        )}

        {showSampleModal && (
          <SampleDetailsModal
            testId={selectedTest}
            test={testAssignments.find(t => t.id === selectedTest)}
            onClose={() => {
              setShowSampleModal(false);
              setSelectedTest(null);
            }}
          />
        )}

        {showQCModal && (
          <QCLoggingModal
            onClose={() => setShowQCModal(false)}
            onSubmit={() => setShowQCModal(false)}
          />
        )}
      </div>
    </Layout>
  );
}

// Results Entry Modal Component
interface ResultsEntryModalProps {
  testId: string | null;
  onClose: () => void;
  onSubmit: (results: any) => void;
}

function ResultsEntryModal({ testId, onClose, onSubmit }: ResultsEntryModalProps) {
  const [resultType, setResultType] = useState<'manual' | 'upload'>('manual');
  const [results, setResults] = useState('');
  const [abnormalFlag, setAbnormalFlag] = useState(false);
  const [techNotes, setTechNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: resultType,
      data: results,
      abnormal: abnormalFlag,
      notes: techNotes,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Enter Test Results</h3>
          <p className="text-sm text-gray-600 mt-1">Test ID: {testId}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result Entry Method
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setResultType('manual')}
                className={`px-4 py-2 rounded-lg border ${
                  resultType === 'manual'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Manual Entry
              </button>
              <button
                type="button"
                onClick={() => setResultType('upload')}
                className={`px-4 py-2 rounded-lg border ${
                  resultType === 'upload'
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                Upload File
              </button>
            </div>
          </div>

          {resultType === 'manual' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Results
              </label>
              <textarea
                value={results}
                onChange={(e) => setResults(e.target.value)}
                placeholder="Enter test results and values..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Results File
              </label>
              <input
                type="file"
                accept=".pdf,.jpg,.png,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="abnormal"
              checked={abnormalFlag}
              onChange={(e) => setAbnormalFlag(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="abnormal" className="text-sm font-medium text-gray-700">
              Flag as abnormal result
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technician Notes
            </label>
            <textarea
              value={techNotes}
              onChange={(e) => setTechNotes(e.target.value)}
              placeholder="Add any relevant notes or observations..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit Results
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sample Details Modal Component
interface SampleDetailsModalProps {
  testId: string | null;
  test: TestAssignment | undefined;
  onClose: () => void;
}

function SampleDetailsModal({ testId, test, onClose }: SampleDetailsModalProps) {
  if (!test) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Sample Details</h3>
          <p className="text-sm text-gray-600 mt-1">Sample ID: {test.sampleId}</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Test</p>
              <p className="text-gray-900">{test.testName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Patient</p>
              <p className="text-gray-900">{test.patientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                test.sampleStatus === 'received' ? 'bg-green-100 text-green-800' :
                test.sampleStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {test.sampleStatus}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Condition</p>
              <p className="text-gray-900">{test.sampleCondition || 'Not specified'}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Chain of Custody</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Collected: {new Date(test.assignedAt).toLocaleString()}</p>
              <p>• Received in lab: {new Date(test.assignedAt).toLocaleString()}</p>
              <p>• Assigned to technician: {new Date(test.assignedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// QC Logging Modal Component
interface QCLoggingModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

function QCLoggingModal({ onClose, onSubmit }: QCLoggingModalProps) {
  const [qcType, setQcType] = useState('internal');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('passed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Log QC Results</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              QC Type
            </label>
            <select
              value={qcType}
              onChange={(e) => setQcType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="internal">Internal QC</option>
              <option value="external">External QC</option>
              <option value="calibration">Calibration</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result Value
            </label>
            <input
              type="text"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Enter QC result value"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Log QC Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LabTechnicianDashboard;