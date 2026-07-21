import { type Student } from '../../hooks/useStudentsDirectory';
import { getDepartmentFromRegisterNumber } from '../../utils/departmentUtils';
import { User, AlertTriangle, CheckCircle2, ChevronRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  student: Student;
  onClick: (s: Student) => void;
  isSelected?: boolean;
}

export const StudentCard = ({ student, onClick, isSelected }: Props) => {
  const latestPrediction = student.predictions?.[0];

  const getRiskColor = (risk: number) => {
    if (risk > 75) return 'text-red-500 border-red-500/30 bg-red-500/10';
    if (risk > 40) return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
    return 'text-green-500 border-green-500/30 bg-green-500/10';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => onClick(student)}
      className={`relative cursor-pointer transition-all duration-300 rounded-2xl border ${
        isSelected 
          ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]' 
          : 'bg-[#18181b]/80 border-white/10 hover:border-white/20 shadow-lg'
      } backdrop-blur-xl overflow-hidden group p-5 flex flex-col`}
    >
      {latestPrediction && (
        <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl border-l border-b text-xs font-bold ${getRiskColor(latestPrediction.riskPercentage)}`}>
          {latestPrediction.riskLevel} Risk ({latestPrediction.riskPercentage}%)
        </div>
      )}

      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white/80 shrink-0 ${isSelected ? 'bg-primary/40' : 'bg-white/5'}`}>
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors">{student.name}</h3>
          <p className="text-gray-400 text-sm truncate">{student.studentId} • Sem {student.semester}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
        <div className="bg-white/5 rounded-lg p-2.5 col-span-2">
          <p className="text-xs text-gray-500 font-medium">Department</p>
          <p className="text-gray-200 font-semibold text-sm truncate" title={getDepartmentFromRegisterNumber(student.studentId)}>
            {getDepartmentFromRegisterNumber(student.studentId)}
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-gray-500 font-medium">CGPA</p>
          <p className="text-gray-200 font-semibold text-sm">{student.cgpa}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-gray-500 font-medium">Attendance</p>
          <p className="text-gray-200 font-semibold text-sm">{student.attendancePercentage}%</p>
        </div>
        <div className="bg-white/5 rounded-lg p-2.5">
          <p className="text-xs text-gray-500 font-medium">Backlogs</p>
          <p className="text-gray-200 font-semibold text-sm">{student.backlogs}</p>
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-xs font-semibold text-rose-400">
          {student.feePending > 0 ? `₹${student.feePending} Pending` : 'Fees Cleared'}
        </span>
        <div className="flex items-center text-primary text-sm font-bold opacity-80 group-hover:opacity-100 transition-opacity">
          <span>{latestPrediction ? 'View AI Risk' : 'Generate AI Risk'}</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};
