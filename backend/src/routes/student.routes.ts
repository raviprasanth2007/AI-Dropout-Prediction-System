import { Router } from 'express';
import { prisma } from '../index';
import { authenticate, authorize } from '../middleware/auth';
import axios from 'axios';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

router.use(authenticate);

// Get all students (with pagination/search)
router.get('/', async (req, res) => {
  try {
    const { search = '', page = '1', limit = '50' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    
    const students = await prisma.student.findMany({
      where: {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { studentId: { contains: String(search), mode: 'insensitive' } }
        ]
      },
      skip,
      take: Number(limit),
      include: {
        department: true
      }
    });
    
    const total = await prisma.student.count({
      where: {
        OR: [
          { name: { contains: String(search), mode: 'insensitive' } },
          { studentId: { contains: String(search), mode: 'insensitive' } }
        ]
      }
    });
    
    res.json({ students, total, page: Number(page), limit: Number(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get student details
router.get('/:id', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: String(req.params.id) },
      include: { department: true, predictions: { orderBy: { predictedAt: 'desc' }, take: 1 } }
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student details' });
  }
});

// Predict dropout risk for a student
router.post('/:id/predict', authorize(['SUPER_ADMIN', 'COLLEGE_ADMIN', 'HOD', 'FACULTY_ADVISOR']), async (req, res) => {
  try {
    const student = await prisma.student.findUnique({ where: { id: String(req.params.id) } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    // Call AI Service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/predict`, {
      student_data: student
    });
    
    const predictionData = aiResponse.data;
    
    // Save prediction in DB
    const prediction = await prisma.prediction.create({
      data: {
        studentId: student.id,
        riskPercentage: predictionData.dropoutProbability,
        confidenceScore: predictionData.confidence,
        riskLevel: predictionData.riskLevel,
        topRiskFactors: predictionData.topNegativeFactors,
        positiveFactors: predictionData.topPositiveFactors,
        recommendations: predictionData.recommendations,
        modelUsed: predictionData.modelUsed,
        modelVersion: predictionData.modelVersion,
        shapValues: predictionData.shapValues
      }
    });
    
    res.json(prediction);
  } catch (error: any) {
    console.error('Prediction error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get prediction from AI Service', details: error.response?.data || error.message });
  }
});

export default router;
