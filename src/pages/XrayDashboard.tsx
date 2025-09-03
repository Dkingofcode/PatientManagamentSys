import React, { useState, useRef } from "react";
//import Layout from "./Layout";
import { useAppointments } from "../contexts/AppointmentContext";
import {
  Upload,
  FileImage,
  Search,
  Calendar,
  User,
  Download,
  Eye,
  Trash2,
} from "lucide-react";

interface XRayFile {
  id: string;
  patientId: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  category: string;
  status: 'pending' | 'reviewed' | 'reported';
}

function XRayDashboard() {
  const { patients } = useAppointments();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock X-ray files data
  const [xrayFiles, setXrayFiles] = useState<XRayFile[]>([
    {
      id: '1',
      patientId: '1',
      fileName: 'chest_xray_001.jpg',
      fileSize: '2.4 MB',
      uploadDate: '2024-01-15',
      category: 'Chest',
      status: 'reviewed'
    },
    {
      id: '2',
      patientId: '2',
      fileName: 'knee_lateral_002.jpg',
      fileSize: '1.8 MB',
      uploadDate: '2024-01-15',
      category: 'Orthopedic',
      status: 'pending'
    },
    {
      id: '3',
      patientId: '3',
      fileName: 'spine_ap_003.jpg',
      fileSize: '3.1 MB',
      uploadDate: '2024-01-14',
      category: 'Spine',
      status: 'reported'
    },
    {
      id: '4',
      patientId: '4',
      fileName: 'hand_pa_004.jpg',
      fileSize: '1.5 MB',
      uploadDate: '2024-01-14',
      category: 'Orthopedic',
      status: 'pending'
    }
  ]);

  const categories = ['Chest', 'Orthopedic', 'Spine', 'Abdominal', 'Head & Neck'];

  const filteredFiles = xrayFiles.filter(file => {
    const patient = patients.find(p => p.id === file.patientId);
    const matchesSearch = patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.fileName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const newFile: XRayFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          patientId: '1', // Default to first patient for demo
          fileName: file.name,
          fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploadDate: new Date().toISOString().split('T')[0],
          category: 'Chest', // Default category
          status: 'pending'
        };
        setXrayFiles(prev => [newFile, ...prev]);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'reported': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {};
    categories.forEach(cat => {
      stats[cat] = xrayFiles.filter(file => file.category === cat).length;
    });
    return stats;
  };

  const categoryStats = getCategoryStats();

 return (
  <div className="p-8 bg-gray-50 min-h-screen">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">X-Ray Management</h1>
        <p className="text-gray-600 mt-2 text-lg">Upload and organize X-ray images</p>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload X-ray Images</h2>
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
            dragActive
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload size={56} className="mx-auto text-gray-400 mb-6" />
          <p className="text-lg font-medium text-gray-900 mb-3">
            Drop X-ray images here or click to browse
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Supports JPG, PNG, DICOM files up to 10MB
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.dcm"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {/* Category Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map(category => (
            <div
              key={category}
              className={`p-6 rounded-xl border-2 cursor-pointer transition-colors ${
                selectedCategory === category
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                  {categoryStats[category] || 0}
                </p>
                <p className="text-sm text-gray-600">{category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Files List */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">X-ray Files</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({xrayFiles.length})
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name or filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-4">
            {filteredFiles.length ? (
              filteredFiles.map((file) => {
                const patient = patients.find(p => p.id === file.patientId);
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        <FileImage size={22} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{file.fileName}</h4>
                        <div className="flex items-center space-x-5 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <User size={14} className="mr-1" />
                            {patient?.name || 'Unknown Patient'}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(file.uploadDate).toLocaleDateString()}
                          </span>
                          <span>{file.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {file.category}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(file.status)}`}>
                        {file.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                          <Download size={18} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 text-gray-500">
                <FileImage size={56} className="mx-auto mb-6 text-gray-300" />
                <p className="text-lg font-medium">No X-ray files found</p>
                <p className="text-sm">Upload some files or adjust your search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

}

export default XRayDashboard;