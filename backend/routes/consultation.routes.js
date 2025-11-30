import express from 'express';
import {
  createConsultation,
  getAllConsultations,
  getConsultationById,
  respondToConsultation,
  getMyConsultations,
  updateConsultation,
  deleteConsultation
} from '../controllers/consultation.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// جميع المسارات تحتاج تسجيل دخول
router.use(protect);

// مسارات المستخدم
router.post('/', createConsultation);
router.get('/my-consultations', getMyConsultations);
router.put('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

// مسارات الأطباء
router.get('/', getAllConsultations);
router.get('/:id', getConsultationById);
router.post('/:id/respond', respondToConsultation);

export default router;

