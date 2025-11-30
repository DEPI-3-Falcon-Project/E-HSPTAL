import express from 'express';
import {
  sendMessage,
  getMyMessages,
  getMessageById,
  markAsRead
} from '../controllers/adminMessage.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', sendMessage);
router.get('/my-messages', getMyMessages);
router.get('/:id', getMessageById);
router.patch('/:id/read', markAsRead);

export default router;


