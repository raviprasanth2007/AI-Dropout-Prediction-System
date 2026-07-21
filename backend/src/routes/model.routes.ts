import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';

const router = Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN', 'COLLEGE_ADMIN']));

// Mode 1: Generate synthetic dataset and train
router.post('/generate-train', async (req, res) => {
  try {
    const { numRecords = 1000 } = req.body;
    
    // Call AI Service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/generate-and-train?num_records=${numRecords}`);
    
    res.json(aiResponse.data);
  } catch (error: any) {
    console.error('Train error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate and train model via AI Service' });
  }
});

// Mode 2: Upload CSV dataset and train
router.post('/upload-dataset', upload.single('dataset'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No dataset file provided' });
    }
    
    const formData = new FormData();
    formData.append('file', req.file.buffer, { filename: req.file.originalname });
    
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/upload-dataset`, formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    res.json(aiResponse.data);
  } catch (error: any) {
    console.error('Upload error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload dataset and train model' });
  }
});

export default router;
