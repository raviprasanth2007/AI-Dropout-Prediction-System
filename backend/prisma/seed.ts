import 'dotenv/config';
import { PrismaClient, Prisma } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/dropout_db' });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with real data...');

  // 1. Clear existing data safely
  console.log('Clearing old data...');
  await prisma.prediction.deleteMany({});
  await prisma.student.deleteMany({});
  await prisma.department.deleteMany({});
  // Keeping users for login

  // 2. Read students.json
  const dataPath = path.join(__dirname, 'students.json');
  const studentsRaw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  console.log(`Found ${studentsRaw.length} students in dataset.`);

  // 3. Extract unique departments and create them
  const deptCodes = [...new Set(studentsRaw.map((s: any) => s.department))];
  const departmentMap: Record<string, string> = {};

  console.log(`Creating ${deptCodes.length} departments...`);
  for (const code of deptCodes) {
    const dept = await prisma.department.create({
      data: {
        name: code as string,
        code: code as string,
      }
    });
    departmentMap[code as string] = dept.id;
  }

  // 4. Create students
  console.log('Creating students...');
  let count = 0;
  for (const s of studentsRaw) {
    try {
      const student = await prisma.student.create({
        data: {
          studentId: s.studentId,
          name: s.name || s.studentId, // Use studentId as fallback name if missing
          departmentId: departmentMap[s.department as string] as string,
          semester: Number(s.semester) || 1,
          attendancePercentage: Number(s.attendancePercentage) || 0,
          internalMarks: Number(s.internalMarks) || 0,
          assignmentMarks: Number(s.assignmentMarks) || 0,
          cgpa: Number(s.cgpa) || 0,
          backlogs: Number(s.backlogs) || 0,
          scholarship: Boolean(s.scholarship),
          feePending: Number(s.feePending) || 0,
          familyIncome: Number(s.familyIncome) || 0,
          travelDistance: Number(s.travelDistance) || 0,
          accommodation: s.accommodation === 'HOSTELLER' ? 'HOSTELLER' : 'DAY_SCHOLAR',
          internetAccess: Boolean(s.internetAccess),
          studyHours: Number(s.studyHours) || 0,
          placementTraining: Boolean(s.placementTraining),
          libraryUsage: Number(s.libraryUsage) || 0,
          lmsUsage: Number(s.lmsUsage) || 0,
          extracurricular: Boolean(s.extracurricular),
          counsellingHistory: Boolean(s.counsellingHistory),
          medicalIssues: Boolean(s.medicalIssues),
          mentalWellnessScore: Number(s.mentalWellnessScore) || 50,
          behaviorScore: Number(s.behaviorScore) || 50,
          parentInteraction: Number(s.parentInteraction) || 50,
          facultyFeedbackScore: Number(s.facultyFeedbackScore) || 50,
          gender: ['MALE', 'FEMALE', 'OTHER'].includes(s.gender) ? s.gender : 'OTHER',
          age: Number(s.age) || 18,
          previousSemesterGpa: Number(s.previousSemesterGpa) || 0,
          projectsCompleted: Number(s.projectsCompleted) || 0,
          hackathonParticipation: Boolean(s.hackathonParticipation),
          internships: Number(s.internships) || 0,
          codingSkillScore: Number(s.codingSkillScore) || 50,
          communicationScore: Number(s.communicationScore) || 50,
          leadershipScore: Number(s.leadershipScore) || 50,
          stressLevel: ['LOW', 'MEDIUM', 'HIGH'].includes(s.stressLevel) ? s.stressLevel : 'LOW',
          sleepHours: Number(s.sleepHours) || 7,
          partTimeJob: Boolean(s.partTimeJob),
          dropout: Boolean(s.dropout),
        }
      });

      // 5. Create a prediction for each student so the dashboard looks populated
      // We'll generate a dummy risk based on their actual dropout status and backlogs
      const isHighRisk = s.dropout || s.cgpa < 6.0 || s.backlogs > 2;
      const isMediumRisk = !isHighRisk && (s.cgpa < 7.5 || s.backlogs > 0 || s.feePending > 10000);
      
      let riskPct = isHighRisk ? (75 + Math.random() * 20) : isMediumRisk ? (40 + Math.random() * 34) : (5 + Math.random() * 30);
      
      await prisma.prediction.create({
        data: {
          studentId: student.id,
          riskPercentage: riskPct,
          confidenceScore: 80 + Math.random() * 15,
          riskLevel: isHighRisk ? 'High' : isMediumRisk ? 'Medium' : 'Low',
          topRiskFactors: isHighRisk ? JSON.stringify(['Low Attendance', 'High Fee Pending']) : JSON.stringify(['Moderate CGPA']),
          positiveFactors: JSON.stringify(['Good Communication']),
          recommendations: JSON.stringify(['Schedule Mentoring Session']),
          modelUsed: 'Random Forest',
          modelVersion: 'v1.0',
          shapValues: JSON.stringify([])
        }
      });

      count++;
    } catch (err) {
      console.error(`Failed to create student ${s.studentId}:`, err);
    }
  }

  console.log(`Successfully seeded ${count} students and their predictions!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
