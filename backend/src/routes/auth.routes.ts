import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, use bcrypt.compare. For this demo we might use plain text seeding
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch && password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );
    
    res.json({ token, user: { id: user.id, name: user.name, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Setup mock users for demo purposes
router.post('/setup-demo', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const users = [
      { email: 'superadmin@college.edu', name: 'Super Admin', role: 'SUPER_ADMIN', password: hashedPassword },
      { email: 'faculty@college.edu', name: 'Dr. John Faculty', role: 'FACULTY_ADVISOR', password: hashedPassword },
      { email: 'student@college.edu', name: 'Jane Student', role: 'STUDENT', password: hashedPassword }
    ];
    
    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: {
          email: u.email,
          name: u.name,
          role: u.role as any,
          password: u.password
        }
      });
    }
    res.json({ message: 'Demo users created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
