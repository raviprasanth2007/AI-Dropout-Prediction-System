import { useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Download, Loader2 } from 'lucide-react';
import { useStudentsDirectory, type Student } from '../hooks/useStudentsDirectory';
import { DEPARTMENT_MAPPING, getDepartmentFromRegisterNumber } from '../utils/departmentUtils';
import { DirectoryFilters } from '../components/Directory/Filters';
import { StudentCard } from '../components/Directory/StudentCard';
import { StudentTableRow } from '../components/Directory/StudentTableRow';
import { StudentDrawer } from '../components/Directory/StudentDrawer';

const Prediction = () => {
  const { students, loading, error, stats, filters, sorting } = useStudentsDirectory();
  
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Selected Student for Drawer
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  
  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Derive unique departments from mapping keys
  const departments = useMemo(() => {
    return Object.keys(DEPARTMENT_MAPPING).filter(dept => dept !== 'AIDS' && dept !== 'AIML');
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(students.length / itemsPerPage);
  const currentStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return students.slice(start, start + itemsPerPage);
  }, [students, currentPage]);

  // Handle Predict Action
  const handlePredict = async (studentId: string) => {
    setIsPredicting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:5000/api/students/${studentId}/predict`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state to show prediction instantly
      if (selectedStudent && selectedStudent.id === studentId) {
        setSelectedStudent({
          ...selectedStudent,
          predictions: [res.data]
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to predict.");
    } finally {
      setIsPredicting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Name', 'Department', 'Semester', 'CGPA', 'Attendance', 'Risk'];
    const rows = students.map(s => [
      s.studentId,
      s.name,
      getDepartmentFromRegisterNumber(s.studentId),
      s.semester,
      s.cgpa,
      s.attendancePercentage,
      s.predictions?.[0]?.riskLevel || 'N/A'
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students_directory_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 z-10 relative pb-10 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
            Student Directory
          </h1>
          <p className="text-gray-400 mt-2 font-medium text-lg">Browse, analyze, and manage student AI risk profiles</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Top Statistics Section */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Students', value: stats.total, color: 'text-white' },
          { label: 'Average CGPA', value: stats.avgCgpa, color: 'text-primary' },
          { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, color: 'text-blue-400' },
          { label: 'High Risk (Predicted)', value: stats.highRiskCount, color: 'text-red-400' },
          { label: 'Low Risk (Predicted)', value: stats.lowRiskCount, color: 'text-green-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#18181b]/80 border border-white/5 rounded-2xl p-5 backdrop-blur-xl">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#18181b]/60 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
        <DirectoryFilters 
          filters={filters} 
          sorting={sorting} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
          departments={departments}
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Loading enterprise directory database...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold bg-red-500/10 rounded-2xl border border-red-500/20">
          {error}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentStudents.map(student => (
                <StudentCard 
                  key={student.id} 
                  student={student} 
                  onClick={setSelectedStudent}
                  isSelected={selectedStudent?.id === student.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#18181b]/80 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl overflow-x-auto shadow-2xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 border-b border-white/10 text-gray-400 font-medium">
                  <tr>
                    <th className="py-4 px-6">Student</th>
                    <th className="py-4 px-6">Department</th>
                    <th className="py-4 px-6">Sem</th>
                    <th className="py-4 px-6">Attendance</th>
                    <th className="py-4 px-6">CGPA</th>
                    <th className="py-4 px-6">Backlogs</th>
                    <th className="py-4 px-6">AI Risk Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map(student => (
                    <StudentTableRow 
                      key={student.id} 
                      student={student} 
                      onClick={setSelectedStudent}
                      isSelected={selectedStudent?.id === student.id}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-8">
              <p className="text-gray-500 text-sm font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, students.length)} of {students.length} students
              </p>
              <div className="flex space-x-2">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium transition-colors border border-white/10"
                >
                  Previous
                </button>
                <div className="flex items-center px-4 font-bold text-primary">
                  {currentPage} / {totalPages}
                </div>
                <button 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium transition-colors border border-white/10"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Side Drawer */}
      <StudentDrawer 
        student={selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        onPredict={handlePredict}
        isPredicting={isPredicting}
      />
    </div>
  );
};

export default Prediction;
