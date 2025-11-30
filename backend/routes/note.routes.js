import express from 'express';
import {
  createNote,
  getUserNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote
} from '../controllers/note.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', createNote);
router.get('/', getUserNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.patch('/:id/archive', archiveNote);

export default router;



