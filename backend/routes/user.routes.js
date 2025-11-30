import express from 'express';
import {
  getAllUsers,
  getUserById,
  deleteUser
} from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.js';
import { requireAdmin } from '../middlewares/admin.js';

const router = express.Router();

// جميع المسارات تحتاج تسجيل دخول وصلاحيات أدمن
router.use(protect);
router.use(requireAdmin);

// جلب جميع المستخدمين (للأدمن فقط)
router.get('/', getAllUsers);

// جلب مستخدم واحد
router.get('/:id', getUserById);

// حذف مستخدم (للأدمن فقط)
router.delete('/:id', deleteUser);

export default router;

