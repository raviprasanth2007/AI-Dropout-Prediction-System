import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

export interface Student {
  id: string;
  studentId: string;
  name: string;
  departmentId: string;
  semester: number;
  attendancePercentage: number;
  cgpa: number;
  backlogs: number;
  feePending: number;
  department?: {
    id: string;
    name: string;
  };
  predictions?: Array<{
    id: string;
    riskPercentage: number;
    riskLevel: string;
    confidenceScore: number;
    predictedAt: string;
    recommendations: string[];
    topRiskFactors: string[];
    positiveFactors: string[];
  }>;
}

export type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

export const useStudentsDirectory = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  
  // Advanced filters
  const [cgpaRange, setCgpaRange] = useState<[number, number]>([0, 10]);
  const [attendanceRange, setAttendanceRange] = useState<[number, number]>([0, 100]);
  
  // UI State
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
  
  // Fetch Initial Data
  useEffect(() => {
    const fetchAllStudents = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        // Fetch up to 5000 students to act as a client-side database
        const res = await axios.get('http://localhost:5000/api/students?limit=5000', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllStudents(res.data.students || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch students data');
      } finally {
        setLoading(false);
      }
    };
    fetchAllStudents();
  }, []);

  // Filter & Sort Logic
  const filteredStudents = useMemo(() => {
    let result = allStudents;

    // 1. Department Filter
    if (selectedDepartment !== 'ALL') {
      result = result.filter(s => s.studentId.toUpperCase().includes(selectedDepartment));
    }

    // 2. Semester Filter
    if (selectedSemester !== 'ALL') {
      result = result.filter(s => s.semester === Number(selectedSemester));
    }

    // 3. Search Term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(lowerSearch) ||
        s.studentId.toLowerCase().includes(lowerSearch)
      );
    }

    // 4. Advanced Filters (CGPA, Attendance)
    result = result.filter(s => 
      s.cgpa >= cgpaRange[0] && s.cgpa <= cgpaRange[1] &&
      s.attendancePercentage >= attendanceRange[0] && s.attendancePercentage <= attendanceRange[1]
    );

    // 5. Risk Filter
    if (selectedRisk !== 'ALL') {
      result = result.filter(s => {
        const latestPrediction = s.predictions?.[0];
        if (!latestPrediction) return selectedRisk === 'NOT_PREDICTED';
        const riskLevel = latestPrediction.riskLevel.toUpperCase();
        return riskLevel.includes(selectedRisk);
      });
    }

    // Sort Logic
    result = [...result].sort((a: any, b: any) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      // Handle nested values
      if (sortConfig.key === 'department') {
        aVal = a.department?.name || '';
        bVal = b.department?.name || '';
      } else if (sortConfig.key === 'risk') {
        aVal = a.predictions?.[0]?.riskPercentage || -1;
        bVal = b.predictions?.[0]?.riskPercentage || -1;
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [allStudents, searchTerm, selectedDepartment, selectedSemester, selectedRisk, cgpaRange, attendanceRange, sortConfig]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const avgCgpa = total > 0 ? filteredStudents.reduce((sum, s) => sum + s.cgpa, 0) / total : 0;
    const avgAtt = total > 0 ? filteredStudents.reduce((sum, s) => sum + s.attendancePercentage, 0) / total : 0;
    
    let highRiskCount = 0;
    let lowRiskCount = 0;
    
    filteredStudents.forEach(s => {
      const pred = s.predictions?.[0];
      if (pred) {
        if (pred.riskPercentage > 60) highRiskCount++;
        else lowRiskCount++;
      }
    });

    return {
      total,
      avgCgpa: avgCgpa.toFixed(2),
      avgAttendance: avgAtt.toFixed(1),
      highRiskCount,
      lowRiskCount
    };
  }, [filteredStudents]);

  return {
    students: filteredStudents,
    loading,
    error,
    stats,
    filters: {
      searchTerm, setSearchTerm,
      selectedDepartment, setSelectedDepartment,
      selectedSemester, setSelectedSemester,
      selectedRisk, setSelectedRisk,
      cgpaRange, setCgpaRange,
      attendanceRange, setAttendanceRange,
    },
    sorting: {
      sortConfig, setSortConfig
    }
  };
};
