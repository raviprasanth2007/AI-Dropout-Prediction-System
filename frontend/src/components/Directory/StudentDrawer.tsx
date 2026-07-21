import { type Student } from '../../hooks/useStudentsDirectory';
import { getDepartmentFromRegisterNumber } from '../../utils/departmentUtils';
import { X, BrainCircuit, AlertTriangle, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  student: Student | null;
  onClose: () => void;
  onPredict: (studentId: string) => Promise<void>;
  isPredicting: boolean;
}

export const StudentDrawer = ({ student, onClose, onPredict, isPredicting }: Props) => {
  if (!student) return null;

  const prediction = student.predictions?.[0];

  const getRiskColor = (risk: number) => {
    if (risk > 75) return 'text-red-500 bg-red-500/10';
    if (risk > 40) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-green-500 bg-green-500/10';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-[#121214] h-full border-l border-white/10 shadow-2xl overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-[#121214]/80 backdrop-blur-xl border-b border-white/10 p-6 flex justify-between items-center z-10">
            <h2 className="text-xl font-bold text-white">Student Details</h2>
            <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-8">
            {/* Header Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold">
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{student.name}</h3>
                <p className="text-gray-400 font-medium">{student.studentId} • Sem {student.semester}</p>
                <p className="text-gray-500 text-sm">
                  {getDepartmentFromRegisterNumber(student.studentId)}
                </p>
              </div>
            </div>

            {/* Academic Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-500 font-medium">CGPA</p>
                <p className="text-2xl font-bold text-white mt-1">{student.cgpa}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-500 font-medium">Attendance</p>
                <p className="text-2xl font-bold text-white mt-1">{student.attendancePercentage}%</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-500 font-medium">Backlogs</p>
                <p className="text-2xl font-bold text-white mt-1">{student.backlogs}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <p className="text-sm text-gray-500 font-medium">Fee Pending</p>
                <p className="text-2xl font-bold text-rose-400 mt-1">₹{student.feePending}</p>
              </div>
            </div>

            {/* AI Prediction Section */}
            <div className="border-t border-white/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">AI Risk Assessment</h3>
                {!prediction && (
                  <button
                    onClick={() => onPredict(student.id)}
                    disabled={isPredicting}
                    className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center shadow-[0_0_15px_rgba(var(--primary),0.3)] disabled:opacity-50"
                  >
                    <BrainCircuit className={`w-4 h-4 mr-2 ${isPredicting ? 'animate-spin' : ''}`} />
                    {isPredicting ? 'Analyzing...' : 'Generate Prediction'}
                  </button>
                )}
              </div>

              {prediction ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl flex flex-col items-center justify-center border border-white/10 ${getRiskColor(prediction.riskPercentage)}`}>
                    <span className="text-5xl font-black">{prediction.riskPercentage}%</span>
                    <span className="text-lg font-bold mt-2">{prediction.riskLevel} Risk</span>
                    <span className="text-sm mt-2 opacity-80">Confidence: {prediction.confidenceScore}%</span>
                  </div>

                  {prediction.topRiskFactors.length > 0 && (
                    <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/10">
                      <h4 className="flex items-center text-red-400 font-bold mb-3 text-sm">
                        <AlertTriangle className="w-4 h-4 mr-2" /> Top Risk Factors
                      </h4>
                      <ul className="space-y-2">
                        {prediction.topRiskFactors.map((f, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                            <ChevronRight className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.positiveFactors.length > 0 && (
                    <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/10">
                      <h4 className="flex items-center text-green-400 font-bold mb-3 text-sm">
                        <ShieldCheck className="w-4 h-4 mr-2" /> Mitigating Factors
                      </h4>
                      <ul className="space-y-2">
                        {prediction.positiveFactors.map((f, i) => (
                          <li key={i} className="text-sm text-gray-300 flex items-start">
                            <ChevronRight className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {prediction.recommendations.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-primary font-bold mb-3 text-sm">Recommended Interventions</h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.recommendations.map((r, i) => (
                          <span key={i} className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary/20">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 text-center mt-4 pt-4 border-t border-white/5">
                    Predicted on: {new Date(prediction.predictedAt).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                  <BrainCircuit className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No active prediction for this student.</p>
                  <p className="text-sm text-gray-500 mt-2">Generate a new AI prediction to assess dropout risk based on their latest academic profile.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
