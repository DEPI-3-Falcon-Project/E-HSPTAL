import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
  getNearbyReports
} from '../controllers/report.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', createReport);
router.get('/', protect, getAllReports);
router.get('/nearby', getNearbyReports);
router.get('/:id', protect, getReportById);
router.patch('/:id/status', protect, updateReportStatus);
router.delete('/:id', protect, deleteReport);

export default router;



