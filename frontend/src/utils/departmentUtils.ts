// departmentUtils.ts

export const DEPARTMENT_MAPPING: Record<string, string> = {
  'AIML': 'Artificial Intelligence and Machine Learning',
  'AIDS': 'Artificial Intelligence and Data Science',
  'AGRI': 'Agriculture',
  'MTRS': 'Mechatronics',
  'MECH': 'Mechanical Engineering',
  'BT': 'Biotechnology',
  'CT': 'Computer Technology',
  
  // Adding common abbreviations seen in previous dataset contexts
  'CS': 'Computer Science',
  'IT': 'Information Technology',
  'EC': 'Electronics and Communication',
  'EE': 'Electrical and Electronics',
  'MB': 'Master of Business Administration',
  'MZ': 'Mechatronics',
  'AL': 'Artificial Intelligence and Machine Learning',
  'AD': 'Artificial Intelligence and Data Science',
};

// Pre-sort keys by length descending to ensure longer codes (like AIML) match before shorter ones (like AI)
const sortedDepartmentKeys = Object.keys(DEPARTMENT_MAPPING).sort((a, b) => b.length - a.length);

export const getDepartmentFromRegisterNumber = (registerNumber?: string | null): string => {
  if (!registerNumber) return 'Unknown Department';
  
  const upperRegNo = registerNumber.toUpperCase();

  // Find the first matching department code
  for (const code of sortedDepartmentKeys) {
    if (upperRegNo.includes(code)) {
      return `${DEPARTMENT_MAPPING[code]} (${code})`;
    }
  }

  // Fallback if no code matches
  console.warn(`[DepartmentUtils] Unknown department code in Register Number: ${registerNumber}`);
  return 'Unknown Department';
};

export const getDepartmentOnly = (registerNumber?: string | null): string => {
  if (!registerNumber) return 'Unknown Department';
  
  const upperRegNo = registerNumber.toUpperCase();

  for (const code of sortedDepartmentKeys) {
    if (upperRegNo.includes(code)) {
      return DEPARTMENT_MAPPING[code];
    }
  }

  return 'Unknown Department';
};
