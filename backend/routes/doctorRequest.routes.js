import express from 'express';
import {
  createDoctorRequest,
  getMyRequest,
  getAllRequests,
  getRequestById,
  approveRequest,
  rejectRequest,
  deleteRequest
} from '../controllers/doctorRequest.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createDoctorRequest);
router.get('/my-request', getMyRequest);
router.get('/', getAllRequests);
router.get('/:id', getRequestById);
router.post('/:id/approve', approveRequest);
router.post('/:id/reject', rejectRequest);
router.delete('/:id', deleteRequest);

export default router;



