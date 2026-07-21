import { prisma } from './src/index';
import { Accommodation, Gender, StressLevel, Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

function parseEnum(val: any, enumObj: any, defaultVal: string): any {
  if (!val) return defaultVal;
  const upper = String(val).toUpperCase().replace(' ', '_');
  const values = Object.values(enumObj);
  return values.includes(upper) ? upper : defaultVal;
}

async function seed() {
  const csvPath = path.resolve(__dirname, '../students_dataset.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error('students_dataset.csv not found!');
    process.exit(1);
  }

  const csvData = fs.readFileSync(csvPath, 'utf8');
  const lines = csvData.split('\n').filter(line => line.trim().length > 0);
  
  if (lines.length === 0 || !lines[0]) {
    console.error('CSV is empty!');
    process.exit(1);
  }
  
  const headers = lines[0].split(',').map(h => h.trim());

  console.log('Seeding departments...');
  const deptNames = ['CSE', 'ECE', 'MECH', 'CIVIL', 'IT'];
  const depts: Record<string, string> = {};
  
  for (const name of deptNames) {
    const d = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name, code: name }
    });
    depts[name] = d.id;
  }

  console.log('Seeding students...');
  const batch: Prisma.StudentCreateManyInput[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    if (!currentLine) continue;

    const row = currentLine.split(',');
    if (row.length !== headers.length) continue;
    
    const obj: any = {};
    headers.forEach((h, idx) => {
      const cell = row[idx];
      if (cell === undefined) return;
      let val: any = cell.trim();
      if (val === 'True') val = true;
      else if (val === 'False') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);
      obj[h] = val;
    });

    const departmentId = depts[String(obj.department)];
    if (!departmentId) continue;

    batch.push({
      studentId: String(obj.studentId),
      name: `Student ${obj.studentId}`,
      departmentId,
      semester: Number(obj.semester) || 1,
      attendancePercentage: Number(obj.attendancePercentage) || 0,
      internalMarks: Number(obj.internalMarks) || 0,
      assignmentMarks: Number(obj.assignmentMarks) || 0,
      cgpa: Number(obj.cgpa) || 0,
      backlogs: Number(obj.backlogs) || 0,
      scholarship: Boolean(obj.scholarship),
      feePending: Number(obj.feePending) || 0,
      familyIncome: Number(obj.familyIncome) || 0,
      travelDistance: Number(obj.travelDistance) || 0,
      accommodation: parseEnum(obj.accommodation, Accommodation, Accommodation.DAY_SCHOLAR),
      internetAccess: Boolean(obj.internetAccess),
      studyHours: Number(obj.studyHours) || 0,
      placementTraining: Boolean(obj.placementTraining),
      libraryUsage: Number(obj.libraryUsage) || 0,
      lmsUsage: Number(obj.lmsUsage) || 0,
      extracurricular: Boolean(obj.extracurricular),
      counsellingHistory: Boolean(obj.counsellingHistory),
      medicalIssues: Boolean(obj.medicalIssues),
      mentalWellnessScore: Number(obj.mentalWellnessScore) || 0,
      behaviorScore: Number(obj.behaviorScore) || 0,
      parentInteraction: Number(obj.parentInteraction) || 0,
      facultyFeedbackScore: Number(obj.facultyFeedbackScore) || 0,
      gender: parseEnum(obj.gender, Gender, Gender.OTHER),
      age: Number(obj.age) || 18,
      previousSemesterGpa: Number(obj.previousSemesterGpa) || 0,
      projectsCompleted: Number(obj.projectsCompleted) || 0,
      hackathonParticipation: Boolean(obj.hackathonParticipation),
      internships: Number(obj.internships) || 0,
      codingSkillScore: Number(obj.codingSkillScore) || 0,
      communicationScore: Number(obj.communicationScore) || 0,
      leadershipScore: Number(obj.leadershipScore) || 0,
      stressLevel: parseEnum(obj.stressLevel, StressLevel, StressLevel.MEDIUM),
      sleepHours: Number(obj.sleepHours) || 0,
      partTimeJob: Boolean(obj.partTimeJob),
      dropout: Boolean(obj.dropout)
    });
  }

  // Clear old students and predictions to avoid foreign key constraints and unique constraint issues
  await prisma.prediction.deleteMany({});
  await prisma.student.deleteMany({});
  
  await prisma.student.createMany({
    data: batch,
    skipDuplicates: true
  });

  console.log(`Seeded ${batch.length} students successfully!`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
