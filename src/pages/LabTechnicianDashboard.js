import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";
import { useAppointments } from "../contexts/AppointmentContext";
import { FlaskConical, Upload, CheckCircle, Clock, FileText, Search, Calendar, BarChart3, Package, Shield, Activity, Play, Pause, Eye, Scan, TrendingUp, Download, Edit, Plus, } from "lucide-react";
const dummyAssignmentTestsProduct = [
    {
        id: "1",
        patientId: "p1",
        patientName: "John Doe",
        doctorId: "7",
        date: "2025-09-04",
        time: "09:00",
        tests: [
            {
                id: "t1",
                name: "Complete Blood Count",
                price: 50,
                prices: {
                    "walk-in": 50,
                    referral: 45,
                    hmo: 40,
                    hospital: 42,
                    corporate: 48,
                },
                duration: 30,
                department: "Hematology",
            },
            {
                id: "t2",
                name: "Lipid Panel",
                price: 60,
                prices: {
                    "walk-in": 60,
                    referral: 55,
                    hmo: 50,
                    hospital: 52,
                    corporate: 58,
                },
                duration: 45,
                department: "Biochemistry",
            },
        ],
        status: "in-progress",
        priority: "high",
        department: "Hematology",
        sampleId: "SMP001",
        sampleStatus: "received",
        sampleCondition: "Good",
        approvedAt: "2025-09-04T08:00:00Z",
        startTime: "2025-09-04T09:00:00Z",
        completionTime: undefined,
        qcStatus: "pending",
        technicianNotes: "Sample processed on CBC Analyzer. Awaiting lipid panel results.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Urgent processing required.",
        createdAt: "2025-09-04T07:00:00Z",
        updatedAt: "2025-09-04T09:00:00Z",
    },
    {
        id: "2",
        patientId: "p2",
        patientName: "Jane Smith",
        doctorId: "8",
        date: "2025-09-03",
        time: "11:00",
        tests: [
            {
                id: "t3",
                name: "Urinalysis",
                price: 30,
                prices: {
                    "walk-in": 30,
                    referral: 27,
                    hmo: 25,
                    hospital: 26,
                    corporate: 28,
                },
                duration: 20,
                department: "Biochemistry",
            },
        ],
        status: "lab-completed",
        priority: "normal",
        department: "Biochemistry",
        sampleId: "SMP002",
        sampleStatus: "received",
        sampleCondition: "Slightly hemolyzed",
        approvedAt: "2025-09-03T10:00:00Z",
        startTime: "2025-09-03T11:00:00Z",
        completionTime: "2025-09-03T14:00:00Z",
        qcStatus: "passed",
        technicianNotes: "Urinalysis completed. Results within normal range.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Results look stable.",
        createdAt: "2025-09-03T09:00:00Z",
        updatedAt: "2025-09-03T14:00:00Z",
    },
    {
        id: "3",
        patientId: "p3",
        patientName: "Alice Johnson",
        doctorId: "7",
        date: "2025-09-02",
        time: "08:00",
        tests: [
            {
                id: "t4",
                name: "Blood Glucose",
                price: 25,
                prices: {
                    "walk-in": 25,
                    referral: 22,
                    hmo: 20,
                    hospital: 21,
                    corporate: 23,
                },
                duration: 15,
                department: "Biochemistry",
            },
        ],
        status: "completed",
        priority: "low",
        department: "Biochemistry",
        sampleId: "SMP003",
        sampleStatus: "received",
        sampleCondition: "Good",
        approvedAt: "2025-09-02T07:30:00Z",
        startTime: "2025-09-02T08:00:00Z",
        completionTime: "2025-09-02T09:30:00Z",
        qcStatus: "passed",
        technicianNotes: "Blood glucose test completed. Doctor approved.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Approved for patient records.",
        createdAt: "2025-09-02T07:00:00Z",
        updatedAt: "2025-09-02T09:30:00Z",
    },
    {
        id: "4",
        patientId: "p4",
        patientName: "Bob Williams",
        doctorId: "8",
        date: "2025-09-05",
        time: "10:00",
        tests: [
            {
                id: "t5",
                name: "Thyroid Function Test",
                price: 70,
                prices: {
                    "walk-in": 70,
                    referral: 65,
                    hmo: 60,
                    hospital: 62,
                    corporate: 68,
                },
                duration: 60,
                department: "Immunology",
            },
        ],
        status: "in-progress",
        priority: "normal",
        department: "Immunology",
        sampleId: "SMP004",
        sampleStatus: "pending",
        sampleCondition: "Not specified",
        approvedAt: "2025-09-05T06:00:00Z",
        startTime: undefined,
        completionTime: undefined,
        qcStatus: undefined,
        technicianNotes: "Sample collection scheduled for today.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Awaiting sample collection.",
        createdAt: "2025-09-05T05:00:00Z",
        updatedAt: "2025-09-05T06:00:00Z",
    },
    {
        id: "5",
        patientId: "p5",
        patientName: "Emma Brown",
        doctorId: "7",
        date: "2025-09-04",
        time: "13:00",
        tests: [
            {
                id: "t6",
                name: "Microbiology Culture",
                price: 80,
                prices: {
                    "walk-in": 80,
                    referral: 75,
                    hmo: 70,
                    hospital: 72,
                    corporate: 78,
                },
                duration: 120,
                department: "Microbiology",
            },
        ],
        status: "in-progress",
        priority: "high",
        department: "Microbiology",
        sampleId: "SMP005",
        sampleStatus: "received",
        sampleCondition: "Good",
        approvedAt: "2025-09-04T12:00:00Z",
        startTime: "2025-09-04T13:00:00Z",
        completionTime: undefined,
        qcStatus: "pending",
        technicianNotes: "Culture in progress. Preliminary results expected tomorrow.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Monitor culture closely.",
        createdAt: "2025-09-04T11:00:00Z",
        updatedAt: "2025-09-04T13:00:00Z",
    },
    {
        id: "6",
        patientId: "p6",
        patientName: "Michael Davis",
        doctorId: "8",
        date: "2025-09-03",
        time: "10:00",
        tests: [
            {
                id: "t7",
                name: "Electrolyte Panel",
                price: 55,
                prices: {
                    "walk-in": 55,
                    referral: 50,
                    hmo: 45,
                    hospital: 47,
                    corporate: 53,
                },
                duration: 40,
                department: "Biochemistry",
            },
        ],
        status: "lab-completed",
        priority: "normal",
        department: "Biochemistry",
        sampleId: "SMP006",
        sampleStatus: "received",
        sampleCondition: "Good",
        approvedAt: "2025-09-03T09:00:00Z",
        startTime: "2025-09-03T10:00:00Z",
        completionTime: "2025-09-03T12:00:00Z",
        qcStatus: "failed",
        technicianNotes: "Electrolyte panel completed, but QC failed. Retesting required.",
        doctorApproved: true,
        labAssigned: true,
        assignedLabTech: "tech1",
        doctorComments: "Retest due to QC failure.",
        createdAt: "2025-09-03T08:00:00Z",
        updatedAt: "2025-09-03T12:00:00Z",
    },
];
function LabTechnicianDashboard() {
    const { user } = useAuth();
    const { patients, updateAppointment, submitTestResults, getAppointmentsByTechnician, submitReport, } = useAppointments();
    const [activeTab, setActiveTab] = useState("assignments");
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [filterDepartment, setFilterDepartment] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showQCModal, setShowQCModal] = useState(false);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [showUploadReportModal, setShowUploadReportModal] = useState(false);
    const [schedule, setSchedule] = useState(() => {
        const saved = typeof window !== "undefined"
            ? localStorage.getItem("labTechSchedule")
            : null;
        return saved
            ? JSON.parse(saved)
            : {
                shiftStart: "08:00",
                shiftEnd: "16:00",
                workstation: "Hematology Station 2",
                instruments: [
                    { name: "CBC Analyzer", status: "online" },
                    { name: "Chemistry Analyzer", status: "online" },
                ],
            };
    });
    const [qcData, setQcData] = useState(() => {
        const saved = typeof window !== "undefined"
            ? localStorage.getItem("labTechQcData")
            : null;
        return saved
            ? JSON.parse(saved)
            : {
                internal: { status: "pending" },
                external: { status: "pending" },
                calibration: {
                    status: "valid",
                    expiresAt: new Date(Date.now() + 86400000).toISOString(),
                },
            };
    });
    const [inventory, setInventory] = useState(() => {
        const saved = typeof window !== "undefined"
            ? localStorage.getItem("labTechInventory")
            : null;
        return saved
            ? JSON.parse(saved)
            : [
                {
                    id: 1,
                    item: "CBC Reagent Kit",
                    stock: 5,
                    minLevel: 10,
                    status: "low",
                },
                {
                    id: 2,
                    item: "Urine Test Strips",
                    stock: 25,
                    minLevel: 15,
                    status: "ok",
                },
                {
                    id: 3,
                    item: "Blood Collection Tubes",
                    stock: 8,
                    minLevel: 20,
                    status: "critical",
                },
            ];
    });
    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("labTechSchedule", JSON.stringify(schedule));
            localStorage.setItem("labTechQcData", JSON.stringify(qcData));
            localStorage.setItem("labTechInventory", JSON.stringify(inventory));
        }
    }, [schedule, qcData, inventory]);
    const testAssignments = user ? getAppointmentsByTechnician(user.id) : [];
    const filteredTests = dummyAssignmentTestsProduct.filter((test) => {
        const patient = patients.find((p) => p.id === test.patientId);
        const matchesSearch = test.tests.some((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
        const matchesStatus = filterStatus === "all" || test.status === filterStatus;
        const matchesPriority = filterPriority === "all" || test.priority === filterPriority;
        const matchesDepartment = filterDepartment === "all" || test.department === filterDepartment;
        return (matchesSearch && matchesStatus && matchesPriority && matchesDepartment);
    });
    const calculateAverageTAT = () => {
        const completedTests = filteredTests.filter((t) => t.completionTime && t.startTime);
        if (completedTests.length === 0)
            return "N/A";
        const totalMs = completedTests.reduce((sum, test) => sum +
            (new Date(test.completionTime).getTime() -
                new Date(test.startTime).getTime()), 0);
        const avgHours = totalMs / completedTests.length / 3600000;
        return `${avgHours.toFixed(1)} hours`;
    };
    const calculateErrorRate = () => {
        const qcFailed = filteredTests.filter((t) => t.qcStatus === "failed").length;
        const totalCompleted = filteredTests.filter((t) => t.status === "lab-completed" || t.status === "completed").length;
        return totalCompleted > 0
            ? `${((qcFailed / totalCompleted) * 100).toFixed(1)}%`
            : "0%";
    };
    const performanceMetrics = {
        testsCompleted: filteredTests.filter((t) => t.status === "lab-completed" || t.status === "completed").length,
        averageTAT: calculateAverageTAT(),
        errorRate: calculateErrorRate(),
    };
    const stats = [
        {
            label: "Doctor Approved",
            value: filteredTests.filter((t) => t.status === "completed" && t.qcStatus === "passed").length,
            icon: CheckCircle,
            color: "bg-gray-700",
        },
        {
            label: "Assigned Tests",
            value: filteredTests.filter((t) => t.status === "in-progress").length,
            icon: Clock,
            color: "bg-gray-700",
        },
        {
            label: "In Progress",
            value: filteredTests.filter((t) => t.status === "in-progress").length,
            icon: Activity,
            color: "bg-gray-700",
        },
        {
            label: "Lab Completed",
            value: filteredTests.filter((t) => t.status === "lab-completed").length,
            icon: FlaskConical,
            color: "bg-gray-700",
        },
        {
            label: "Pending QA",
            value: filteredTests.filter((t) => t.qcStatus === "pending").length,
            icon: Shield,
            color: "bg-gray-700",
        },
    ];
    const handleTestAction = async (testId, action) => {
        const now = new Date().toISOString();
        const updates = {};
        if (action === "start") {
            updates.startTime = now;
            updates.status = "in-progress";
        }
        if (action === "pause") {
            updates.status = "in-progress";
        }
        if (action === "complete") {
            updates.status = "lab-completed";
            updates.completionTime = now;
            updates.qcStatus = "pending";
        }
        await updateAppointment(testId, updates);
    };
    const handleQCSubmit = (qcDataUpdate) => {
        setQcData((prev) => ({
            ...prev,
            ...qcDataUpdate,
            internal: qcDataUpdate.internal
                ? {
                    ...prev.internal,
                    ...qcDataUpdate.internal,
                    lastRun: new Date().toISOString(),
                }
                : prev.internal,
            external: qcDataUpdate.external
                ? {
                    ...prev.external,
                    ...qcDataUpdate.external,
                    lastRun: new Date().toISOString(),
                }
                : prev.external,
        }));
        if (qcDataUpdate.internal?.status || qcDataUpdate.external?.status) {
            filteredTests.forEach((test) => {
                if (test.qcStatus === "pending") {
                    updateAppointment(test.id, {
                        qcStatus: qcDataUpdate.internal?.status === "passed" ? "passed" : "failed",
                    });
                }
            });
        }
    };
    const handleInventoryRequest = (itemId, quantity) => {
        setInventory((prev) => prev.map((item) => item.id === itemId ? { ...item, stock: item.stock + quantity } : item));
    };
    const handleReportUpload = async (appointmentId, report) => {
        try {
            await submitReport(appointmentId, report);
        }
        catch (error) {
            console.error("Failed to upload report:", error);
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800";
            case "normal":
                return "bg-blue-100 text-blue-800";
            case "low":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "in-progress":
                return "bg-blue-100 text-blue-800";
            case "lab-completed":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    return (<Layout title="">
      <div className="space-y-6 px-2 sm:px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#3065B5]">
            Lab Technician Dashboard
          </h1>
          <div className="flex items-center space-x-4"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (<div key={stat.label} className="bg-white rounded-lg shadow-sm p-3 sm:p-6">
                <div className="flex items-center">
                  <div className={`p-2 sm:p-3 rounded-full ${stat.color}`}>
                    <Icon size={20} className="text-white"/>
                  </div>
                  <div className="ml-2 sm:ml-4">
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>);
        })}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 px-4 sm:px-6 whitespace-nowrap">
              {[
            {
                id: "assignments",
                label: "Test Assignments",
                icon: FlaskConical,
            },
            { id: "schedule", label: "Schedule", icon: Calendar },
            { id: "samples", label: "Samples", icon: Scan },
            { id: "qc", label: "QC", icon: Shield },
            { id: "inventory", label: "Inventory", icon: Package },
            { id: "reports", label: "Reports", icon: BarChart3 },
        ].map((tab) => {
            const Icon = tab.icon;
            return (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-1 sm:space-x-2 py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                    <Icon size={16}/>
                    <span>{tab.label}</span>
                  </button>);
        })}
            </nav>
          </div>

          <div className="p-3 sm:p-6">
            {activeTab === "assignments" && (<div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search tests or patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Status</option>
                    <option value="in-progress">In Progress</option>
                    <option value="lab-completed">Lab Completed</option>
                    <option value="completed">Completed</option>
                  </select>
                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                  <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">All Departments</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Immunology">Immunology</option>
                  </select>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {filteredTests.length > 0 ? (filteredTests.map((test) => (<div key={test.id} className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                {test.tests.map((t) => t.name).join(", ")}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(test.priority)}`}>
                                {(test.priority || "normal").toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                                {test.status.replace("-", " ").toUpperCase()}
                              </span>
                              {test.qcStatus && (<span className={`px-2 py-1 text-xs rounded-full ${test.qcStatus === "passed"
                        ? "bg-green-100 text-green-800"
                        : test.qcStatus === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"}`}>
                                  QC: {test.qcStatus.toUpperCase()}
                                </span>)}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs sm:text-sm text-gray-600">
                              <div>
                                <p>
                                  <strong>Patient:</strong>{" "}
                                  {patients.find((p) => p.id === test.patientId)
                    ?.name || "Unknown"}
                                </p>
                                <p>
                                  <strong>Department:</strong>{" "}
                                  {test.department || "Not specified"}
                                </p>
                                <p>
                                  <strong>Sample ID:</strong>{" "}
                                  {test.sampleId || "Not assigned"}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <strong>Assigned:</strong>{" "}
                                  {test.approvedAt
                    ? new Date(test.approvedAt).toLocaleString("en-NG", {
                        timeZone: "Africa/Lagos",
                    })
                    : "N/A"}
                                </p>
                                {test.startTime && (<p>
                                    <strong>Started:</strong>{" "}
                                    {new Date(test.startTime).toLocaleString("en-NG", {
                        timeZone: "Africa/Lagos",
                    })}
                                  </p>)}
                                {test.completionTime && (<p>
                                    <strong>Completed:</strong>{" "}
                                    {new Date(test.completionTime).toLocaleString("en-NG", {
                        timeZone: "Africa/Lagos",
                    })}
                                  </p>)}
                              </div>
                              <div>
                                <p>
                                  <strong>Sample Status:</strong>
                                  <span className={`ml-1 px-2 py-1 text-xs rounded-full ${test.sampleStatus === "received"
                    ? "bg-green-100 text-green-800"
                    : test.sampleStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"}`}>
                                    {test.sampleStatus || "Not specified"}
                                  </span>
                                </p>
                                {test.sampleCondition && (<p>
                                    <strong>Condition:</strong>{" "}
                                    {test.sampleCondition}
                                  </p>)}
                              </div>
                            </div>

                            {test.technicianNotes && (<div className="mt-2 p-2 bg-blue-50 rounded text-xs sm:text-sm">
                                <strong>Notes:</strong> {test.technicianNotes}
                              </div>)}
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 ml-0 sm:ml-4 w-full sm:w-auto">
                            <div className="relative group">
                              <button onClick={() => {
                    setSelectedAppointment(test);
                    setShowUploadReportModal(true);
                }} className="flex items-center space-x-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-semibold w-full sm:w-auto justify-center shadow-md">
                                <Upload size={18}/>
                                <span>Upload Report</span>
                              </button>
                              <span className="absolute hidden group-hover:block bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg">
                                Upload report to doctor's dashboard
                              </span>
                            </div>

                            {test.status === "in-progress" &&
                    !test.startTime && (<button onClick={() => handleTestAction(test.id, "start")} className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center">
                                  <Play size={16}/>
                                  <span>Start</span>
                                </button>)}

                            {test.status === "in-progress" &&
                    test.startTime && (<>
                                  <button onClick={() => handleTestAction(test.id, "pause")} className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center">
                                    <Pause size={16}/>
                                    <span>Pause</span>
                                  </button>
                                  <button onClick={() => {
                        setSelectedTest(test.id);
                        setShowResultsModal(true);
                    }} className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center">
                                    <Upload size={16}/>
                                    <span>Results</span>
                                  </button>
                                </>)}

                            <button onClick={() => {
                    setSelectedTest(test.id);
                    setShowSampleModal(true);
                }} className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm w-full sm:w-auto justify-center">
                              <Eye size={16}/>
                              <span>Sample Details</span>
                            </button>
                          </div>
                        </div>
                      </div>))) : (<div className="text-center py-8 text-gray-500">
                      No test assignments found
                    </div>)}
                </div>
              </div>)}

            {activeTab === "schedule" && (<div className="space-y-4 sm:space-y-6">
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-blue-900">
                      Today's Schedule
                    </h3>
                    <button onClick={() => setShowScheduleModal(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Edit size={16}/>
                      <span>Edit</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        Shift Information
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {schedule.shiftStart} - {schedule.shiftEnd}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Bench: {schedule.workstation}
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        Workload
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1">
                        {testAssignments.length} tests assigned
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {testAssignments.filter((t) => t.status === "lab-completed" ||
                t.status === "completed").length}{" "}
                        completed
                      </p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                        Instruments
                      </h4>
                      {schedule.instruments.map((inst, i) => (<p key={i} className="text-xs sm:text-sm text-gray-600">
                          {inst.name} -{" "}
                          <span className={inst.status === "online"
                    ? "text-green-600"
                    : "text-red-600"}>
                            {inst.status}
                          </span>
                        </p>))}
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === "samples" && (<div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-3 sm:p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sample Tracking
                    </h3>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                      {testAssignments.length > 0 ? (testAssignments.map((test) => (<div key={test.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                Sample {test.sampleId || "Not assigned"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {test.tests.map((t) => t.name).join(", ")} -{" "}
                                {patients.find((p) => p.id === test.patientId)
                    ?.name || "Unknown"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.sampleStatus === "received"
                    ? "bg-green-100 text-green-800"
                    : test.sampleStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"}`}>
                                {test.sampleStatus || "Not specified"}
                              </span>
                              <button onClick={() => {
                    setSelectedTest(test.id);
                    setShowSampleModal(true);
                }} className="p-1 sm:p-2 text-blue-600 hover:bg-blue-50 rounded">
                                <Scan size={16}/>
                              </button>
                            </div>
                          </div>))) : (<div className="text-center py-8 text-gray-500">
                          No samples found
                        </div>)}
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === "qc" && (<div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      QC Status
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Internal QC
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${qcData.internal.status === "passed"
                ? "bg-green-100 text-green-800"
                : qcData.internal.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"}`}>
                          {qcData.internal.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">
                          External QC
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${qcData.external.status === "passed"
                ? "bg-green-100 text-green-800"
                : qcData.external.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"}`}>
                          {qcData.external.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Calibration
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${qcData.calibration.status === "valid"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"}`}>
                          {qcData.calibration.status}
                          {qcData.calibration.expiresAt && (<span className="ml-1 text-xs">
                              (expires{" "}
                              {new Date(qcData.calibration.expiresAt).toLocaleDateString("en-NG", {
                    timeZone: "Africa/Lagos",
                })}
                              )
                            </span>)}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setShowQCModal(true)} className="w-full mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
                      Log QC Results
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      QC Trends
                    </h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center text-gray-500">
                        <TrendingUp size={36} className="mx-auto mb-2"/>
                        <p>QC trend data will appear here</p>
                        <p className="text-xs mt-2">Last 30 days performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === "inventory" && (<div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-3 sm:p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Inventory Status
                    </h3>
                    <button onClick={() => setShowInventoryModal(true)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      <Plus size={16}/>
                      <span>Request Items</span>
                    </button>
                  </div>
                  <div className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                      {inventory.map((item) => (<div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 text-sm sm:text-base">
                              {item.item}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">
                              Current: {item.stock} | Min Level: {item.minLevel}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${item.status === "ok"
                    ? "bg-green-100 text-green-800"
                    : item.status === "low"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>))}
                    </div>
                  </div>
                </div>
              </div>)}

            {activeTab === "reports" && (<div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Performance Metrics
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Tests Completed
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {performanceMetrics.testsCompleted}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Average TAT
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {performanceMetrics.averageTAT}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">
                          Error Rate
                        </span>
                        <span className="font-medium text-sm sm:text-base">
                          {performanceMetrics.errorRate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Export Reports
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 text-sm sm:text-base">
                        <Download size={16}/>
                        <span>Daily Summary</span>
                      </button>
                      <button className="w-full px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 text-sm sm:text-base">
                        <Download size={16}/>
                        <span>QC Report</span>
                      </button>
                      <button className="w-full px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-2 text-sm sm:text-base">
                        <Download size={16}/>
                        <span>Inventory Report</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Audit Trail
                    </h3>
                    <div className="h-48 overflow-y-auto">
                      {testAssignments
                .filter((t) => t.status === "lab-completed" ||
                t.status === "completed")
                .sort((a, b) => new Date(b.completionTime).getTime() -
                new Date(a.completionTime).getTime())
                .slice(0, 5)
                .map((test, i) => (<div key={i} className="py-2 border-b border-gray-100 last:border-0">
                            <p className="text-xs sm:text-sm font-medium">
                              {test.tests.map((t) => t.name).join(", ")}
                            </p>
                            <p className="text-xs text-gray-600">
                              Completed:{" "}
                              {new Date(test.completionTime).toLocaleString("en-NG", {
                    timeZone: "Africa/Lagos",
                })}
                            </p>
                          </div>))}
                    </div>
                    <button className="w-full mt-3 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 text-sm sm:text-base">
                      <FileText size={16}/>
                      <span>View Full Log</span>
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>

        {showResultsModal && (<ResultsEntryModal testId={selectedTest} onClose={() => {
                setShowResultsModal(false);
                setSelectedTest(null);
            }} onSubmit={(results) => {
                if (selectedTest) {
                    submitTestResults(selectedTest, results);
                }
                setShowResultsModal(false);
                setSelectedTest(null);
            }}/>)}

        {showSampleModal && (<SampleDetailsModal testId={selectedTest} test={testAssignments.find((t) => t.id === selectedTest)} onClose={() => {
                setShowSampleModal(false);
                setSelectedTest(null);
            }}/>)}

        {showQCModal && (<QCLoggingModal currentData={qcData} onClose={() => setShowQCModal(false)} onSubmit={handleQCSubmit}/>)}

        {showScheduleModal && (<ScheduleModal schedule={schedule} onClose={() => setShowScheduleModal(false)} onSubmit={(updatedSchedule) => {
                setSchedule(updatedSchedule);
                setShowScheduleModal(false);
            }}/>)}

        {showInventoryModal && (<InventoryModal inventory={inventory} onClose={() => setShowInventoryModal(false)} onSubmit={handleInventoryRequest}/>)}

        {showUploadReportModal && selectedAppointment && (<UploadReportModal appointment={selectedAppointment} onClose={() => {
                setShowUploadReportModal(false);
                setSelectedAppointment(null);
            }} onUpload={handleReportUpload}/>)}
      </div>
    </Layout>);
}
function ResultsEntryModal({ testId, onClose, onSubmit, }) {
    const [resultType, setResultType] = useState("manual");
    const [results, setResults] = useState("");
    const [abnormalFlag, setAbnormalFlag] = useState(false);
    const [techNotes, setTechNotes] = useState("");
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setUploadStatus("");
            }
            else {
                setUploadStatus("Please upload a PDF, JPG, PNG, DOC, or DOCX file");
                setFile(null);
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (resultType === "upload" && !file) {
            setUploadStatus("Please select a file to upload");
            return;
        }
        try {
            if (resultType === "upload" && file) {
                setIsUploading(true);
                const formData = new FormData();
                formData.append("resultFile", file);
                formData.append("testRequestId", testId || "");
                formData.append("interpretation", techNotes);
                formData.append("comments", techNotes);
                formData.append("qualityControl", abnormalFlag ? "abnormal" : "normal");
                const response = await fetch("/api/labtech/submit-result/upload", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                    body: formData,
                });
                if (!response.ok) {
                    throw new Error("Failed to upload file");
                }
                const result = await response.json();
                onSubmit({
                    data: result.result.resultFilePath,
                    notes: techNotes,
                    fileName: file.name,
                });
            }
            else {
                onSubmit({
                    data: results,
                    notes: techNotes,
                });
            }
        }
        catch (error) {
            setUploadStatus("Error uploading file");
        }
        finally {
            setIsUploading(false);
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Enter Test Results
          </h3>
          <p className="text-sm text-gray-600 mt-1">Test ID: {testId}</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Result Entry Method
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button type="button" onClick={() => setResultType("manual")} className={`px-3 sm:px-4 py-2 rounded-lg border ${resultType === "manual"
            ? "bg-blue-50 border-blue-500 text-blue-700"
            : "border-gray-300 text-gray-700"} text-sm sm:text-base`}>
                Manual Entry
              </button>
              <button type="button" onClick={() => setResultType("upload")} className={`px-3 sm:px-4 py-2 rounded-lg border ${resultType === "upload"
            ? "bg-blue-50 border-blue-500 text-blue-700"
            : "border-gray-300 text-gray-700"} text-sm sm:text-base`}>
                Upload File
              </button>
            </div>
          </div>

          {resultType === "manual" ? (<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Results
              </label>
              <textarea value={results} onChange={(e) => setResults(e.target.value)} placeholder="Enter test results and values..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" rows={6} required/>
            </div>) : (<div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Results File
              </label>
              <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" onChange={handleFileChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"/>
              {uploadStatus && (<p className="text-red-600 text-sm mt-2">{uploadStatus}</p>)}
              {file && (<p className="text-green-600 text-sm mt-2">
                  Selected: {file.name}
                </p>)}
            </div>)}

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="abnormal" checked={abnormalFlag} onChange={(e) => setAbnormalFlag(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"/>
            <label htmlFor="abnormal" className="text-sm font-medium text-gray-700">
              Flag as abnormal result
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technician Notes
            </label>
            <textarea value={techNotes} onChange={(e) => setTechNotes(e.target.value)} placeholder="Add any relevant notes or observations..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" rows={3}/>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} disabled={isUploading} className={`px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isUploading ? "Uploading..." : "Submit Results"}
            </button>
          </div>
        </div>
      </div>
    </div>);
}
function SampleDetailsModal({ test, onClose }) {
    if (!test)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg border-2 border-blue-500">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Sample Details
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Sample ID: {test.sampleId || "Not assigned"}
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Test</p>
              <p className="text-gray-900 text-sm sm:text-base">
                {test.tests.map((t) => t.name).join(", ")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Patient</p>
              <p className="text-gray-900 text-sm sm:text-base">
                {test.patientName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Status</p>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${test.sampleStatus === "received"
            ? "bg-green-100 text-green-800"
            : test.sampleStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"}`}>
                {test.sampleStatus || "Not specified"}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Condition</p>
              <p className="text-gray-900 text-sm sm:text-base">
                {test.sampleCondition || "Not specified"}
              </p>
            </div>
          </div>

          <div className="border-t pt-3 sm:pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Chain of Custody
            </p>
            <div className="space-y-1 text-xs sm:text-sm text-gray-600">
              <p>
                Collected:{" "}
                {test.approvedAt
            ? new Date(test.approvedAt).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
            })
            : "N/A"}
              </p>
              <p>
                Received in lab:{" "}
                {test.approvedAt
            ? new Date(test.approvedAt).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
            })
            : "N/A"}
              </p>
              <p>
                Assigned to technician:{" "}
                {test.approvedAt
            ? new Date(test.approvedAt).toLocaleString("en-NG", {
                timeZone: "Africa/Lagos",
            })
            : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base">
            Close
          </button>
        </div>
      </div>
    </div>);
}
function QCLoggingModal({ currentData, onClose, onSubmit, }) {
    const [internalStatus, setInternalStatus] = useState(currentData.internal.status);
    const [externalStatus, setExternalStatus] = useState(currentData.external.status);
    const [calibrationStatus, setCalibrationStatus] = useState(currentData.calibration.status);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            internal: { status: internalStatus },
            external: { status: externalStatus },
            calibration: { status: calibrationStatus },
        });
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Log QC Results
          </h3>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Internal QC Status
            </label>
            <select value={internalStatus} onChange={(e) => setInternalStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External QC Status
            </label>
            <select value={externalStatus} onChange={(e) => setExternalStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calibration Status
            </label>
            <select value={calibrationStatus} onChange={(e) => setCalibrationStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
              <option value="valid">Valid</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Save QC Results
            </button>
          </div>
        </div>
      </div>
    </div>);
}
function ScheduleModal({ schedule, onClose, onSubmit }) {
    const [shiftStart, setShiftStart] = useState(schedule.shiftStart);
    const [shiftEnd, setShiftEnd] = useState(schedule.shiftEnd);
    const [workstation, setWorkstation] = useState(schedule.workstation);
    const [instruments, setInstruments] = useState([...schedule.instruments]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            shiftStart,
            shiftEnd,
            workstation,
            instruments,
        });
    };
    const updateInstrumentStatus = (index, status) => {
        const updated = [...instruments];
        updated[index].status = status;
        setInstruments(updated);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Edit Schedule</h3>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift Start Time
            </label>
            <input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shift End Time
            </label>
            <input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workstation
            </label>
            <input type="text" value={workstation} onChange={(e) => setWorkstation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required/>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instruments
            </label>
            {instruments.map((inst, index) => (<div key={index} className="flex items-center space-x-2 mb-2">
                <input type="text" value={inst.name} onChange={(e) => {
                const updated = [...instruments];
                updated[index].name = e.target.value;
                setInstruments(updated);
            }} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required/>
                <select value={inst.status} onChange={(e) => updateInstrumentStatus(index, e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Save Schedule
            </button>
          </div>
        </div>
      </div>
    </div>);
}
function InventoryModal({ inventory, onClose, onSubmit }) {
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedItemId !== null) {
            onSubmit(selectedItemId, quantity);
        }
        setSelectedItemId(null);
        setQuantity(1);
        onClose();
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Request Inventory Items
          </h3>
        </div>

        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Item
            </label>
            <select value={selectedItemId ?? ""} onChange={(e) => setSelectedItemId(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required>
              <option value="" disabled>
                Select an item
              </option>
              {inventory.map((item) => (<option key={item.id} value={item.id}>
                  {item.item}
                </option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base" required/>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base">
              Cancel
            </button>
            <button type="submit" onClick={handleSubmit} className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base">
              Request Item
            </button>
          </div>
        </div>
      </div>
    </div>);
}
function UploadReportModal({ appointment, onClose, onUpload, }) {
    const [file, setFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [uploadStatus, setUploadStatus] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const handleFileChange = (e) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const allowedTypes = [
                "application/pdf",
                "image/jpeg",
                "image/png",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (allowedTypes.includes(selectedFile.type)) {
                setFile(selectedFile);
                setUploadStatus("");
            }
            else {
                setUploadStatus("Please upload a PDF, JPG, PNG, DOC, or DOCX file");
                setFile(null);
            }
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadStatus("Please select a file to upload");
            return;
        }
        try {
            setIsUploading(true);
            const report = {
                file,
                notes,
                uploadedAt: new Date().toISOString(),
            };
            await onUpload(appointment.id, report);
            setUploadStatus("Report uploaded successfully");
            setTimeout(() => {
                onClose();
            }, 1000);
        }
        catch (error) {
            setUploadStatus("Failed to upload report");
        }
        finally {
            setIsUploading(false);
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 className="text-lg font-semibold mb-4">
          Upload Report for {appointment.patientName}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Report File
            </label>
            <input type="file" accept=".pdf,.jpg,.png,.doc,.docx" onChange={handleFileChange} className="block w-full border border-gray-300 rounded-lg p-2 text-sm" required/>
            {uploadStatus && (<p className={`text-sm mt-2 ${uploadStatus.includes("success")
                ? "text-green-600"
                : "text-red-600"}`}>
                {uploadStatus}
              </p>)}
            {file && (<p className="text-green-600 text-sm mt-2">
                Selected: {file.name}
              </p>)}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Summary Notes
            </label>
            <textarea placeholder="Add summary notes for the doctor..." value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-sm resize-none" rows={4}/>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isUploading} className={`px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}>
              {isUploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        </form>
      </div>
    </div>);
}
export default LabTechnicianDashboard;
