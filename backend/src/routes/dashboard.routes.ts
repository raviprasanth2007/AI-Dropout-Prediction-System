import { Router } from 'express';
import { prisma } from '../index';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalDepartments = await prisma.department.count();
    const totalPredictions = await prisma.prediction.count();
    
    // Calculate risk distributions (high > 75%, medium 40-75%, low < 40%)
    // This is a simplified calculation, normally we'd do a complex group by or raw query
    // To avoid complex Prisma raw queries for the MVP, we fetch the latest predictions
    // Assuming each prediction is independent in the MVP context
    
    const predictions = await prisma.prediction.findMany({
      select: { riskPercentage: true, student: { select: { department: { select: { name: true } } } } }
    });
    
    let high = 0, medium = 0, low = 0;
    const deptRiskMap: Record<string, number> = {};
    const deptCountMap: Record<string, number> = {};
    
    predictions.forEach(p => {
      if (p.riskPercentage > 75) high++;
      else if (p.riskPercentage >= 40) medium++;
      else low++;
      
      const dept = p.student.department?.name || 'Unknown';
      const currentRisk = deptRiskMap[dept] || 0;
      const currentCount = deptCountMap[dept] || 0;
      deptRiskMap[dept] = currentRisk + p.riskPercentage;
      deptCountMap[dept] = currentCount + 1;
    });
    
    const departmentRisk = Object.keys(deptRiskMap).map(k => ({
      department: k,
      avgRisk: ((deptRiskMap[k] || 0) / (deptCountMap[k] || 1)).toFixed(2)
    }));
    
    // Add real data stats (e.g. fees)
    const studentsWithFee = await prisma.student.aggregate({
      _sum: { feePending: true },
      _avg: { feePending: true }
    });
    
    res.json({
      totalStudents,
      totalDepartments,
      totalPredictions,
      riskDistribution: { high, medium, low },
      departmentRisk,
      financialStats: {
        totalPending: studentsWithFee._sum.feePending || 0,
        averagePending: studentsWithFee._avg.feePending || 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

export default router;
