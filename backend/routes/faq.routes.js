import express from 'express';
const router = express.Router();
import FAQController from '../controllers/faq.controller.js';

// 👥 Public route - Anyone can see FAQs
router.get('/', FAQController.getAllFAQs);

// 🔐 Admin routes - Only admin can do these
router.get('/admin', FAQController.getAdminFAQs);
router.post('/admin', FAQController.createFAQ);
router.put('/admin/:id', FAQController.updateFAQ);
router.delete('/admin/:id', FAQController.deleteFAQ);

export default router;