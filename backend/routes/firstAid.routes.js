import express from 'express';
import {
  getAllFirstAid,
  getFirstAidById,
  getFirstAidByCategory,
  createFirstAid,
  updateFirstAid,
  deleteFirstAid
} from '../controllers/firstAid.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllFirstAid);
router.get('/:id', getFirstAidById);
router.get('/category/:category', getFirstAidByCategory);

router.post('/', protect, createFirstAid);
router.put('/:id', protect, updateFirstAid);
router.delete('/:id', protect, deleteFirstAid);

export default router;



