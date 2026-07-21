import { type Student } from '../../hooks/useStudentsDirectory';
import { getDepartmentFromRegisterNumber } from '../../utils/departmentUtils';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  student: Student;
  onClick: (s: Student) => void;
  isSelected?: boolean;
}

export const StudentTableRow = ({ student, onClick, isSelected }: Props) => {
  const latestPrediction = student.predictions?.[0];

  const getRiskColor = (risk: number) => {
    if (risk > 75) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (risk > 40) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <motion.tr
      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
      onClick={() => onClick(student)}
      className={`cursor-pointer border-b border-white/5 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
    >
      <td className="py-4 px-6 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80">
            <User className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-semibold">{student.name}</p>
            <p className="text-xs text-gray-500">{student.studentId}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 whitespace-nowrap text-gray-300">
        {getDepartmentFromRegisterNumber(student.studentId)}
      </td>
      <td className="py-4 px-6 whitespace-nowrap text-gray-300">Sem {student.semester}</td>
      <td className="py-4 px-6 whitespace-nowrap text-gray-300">{student.attendancePercentage}%</td>
      <td className="py-4 px-6 whitespace-nowrap text-gray-300">{student.cgpa}</td>
      <td className="py-4 px-6 whitespace-nowrap text-gray-300">{student.backlogs}</td>
      <td className="py-4 px-6 whitespace-nowrap">
        {latestPrediction ? (
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getRiskColor(latestPrediction.riskPercentage)}`}>
            {latestPrediction.riskLevel}
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-md text-xs font-medium text-gray-500 bg-white/5 border border-white/10">
            Unpredicted
          </span>
        )}
      </td>
    </motion.tr>
  );
};
